
import { reactive } from 'vue'

import AppProperties from './AppProperties.ts';
import SwateControlService from './SwateControlService.ts';

import { ARC, ArcInvestigation, ArcStudy, ArcAssay} from '@nfdi4plants/arctrl';
import { gitignoreContract } from "@nfdi4plants/arctrl/Contract/Git";
import { Xlsx } from '@fslab/fsspreadsheet/Xlsx.js';
import {Contract} from '@nfdi4plants/arctrl/Contract/Contract'

import pDebounce from 'p-debounce';
import { checkValidCharacters, tryCheckValidCharacters } from '@nfdi4plants/arctrl/Core/Helper/Identifier';

export const Investigation = "investigation";
export const Studies = "studies";
export const Assays = "assays";
export const Protocols = 'protocols';
export const Dataset = 'dataset';
export const Runs = 'runs';
export const Workflows = 'workflows';
export const Datamap = 'datamap';

let init: {
    arc_root: undefined | string ,
    busy: boolean, // ui interactive
    super_busy: boolean, // ui is blocking
    arc: null | ARC,
    git_initialized: boolean,
    skip_fs_updates: boolean
} = {
    arc_root: undefined ,
    busy: false,
    super_busy: false,
    arc: null,
    git_initialized: false,
    skip_fs_updates: false
}

function relative_to_absolute_path(relativePath: string) {
  return ArcControlService.props.arc_root + '/' + relativePath
}

const ArcControlService = {

  props: reactive(init),

  closeARC: async() => {
    ArcControlService.props.arc_root = undefined;
    ArcControlService.props.arc = null;
    AppProperties.state = 0;
    return;
  },

  readARC: async (arc_root: string | void | null) =>{
    arc_root = arc_root || ArcControlService.props.arc_root;
    if(!arc_root)
      return false;

    const isARC = await window.ipc.invoke('LocalFileSystemService.exists', arc_root+'/isa.investigation.xlsx');

    if (!isARC) {
      ArcControlService.closeARC();
      return false;
    }

    ArcControlService.props.super_busy = true;

    let files = await window.ipc.invoke('LocalFileSystemService.getAllFiles', arc_root);
    // prefilter files for arctrl
    // files = files.filter(f=>f.endsWith('.xlsx')||f.endsWith('.cwl'));

    const arc = ARC.fromFilePaths(files);
    const contracts = arc.GetReadContracts();
    for(const contract of contracts){
      switch (contract.DTOType) {
        case 'ISA_Investigation':
        case 'ISA_Study':
        case 'ISA_Assay':
        case 'ISA_Datamap':
        case 'ISA_Run':
        case 'ISA_Workflow':
          const buffer = await window.ipc.invoke('LocalFileSystemService.readFile', [arc_root+'/'+contract.Path,{}]);
          contract.DTO = await Xlsx.fromBytes(buffer);
          break;
        case 'PlainText':
          contract.DTO = await window.ipc.invoke('LocalFileSystemService.readFile', [arc_root+'/'+contract.Path, {encoding: 'UTF-8'}]);
          break;
        default:
          console.log('unable to resolve read contract', contract);
          break;
      }
    }
    arc.SetISAFromContracts(contracts);
    ArcControlService.props.arc = arc;
    ArcControlService.props.arc_root = arc_root;
    await window.ipc.invoke('LocalFileSystemService.setArcRoot', arc_root);

    const git_initialized = await window.ipc.invoke('GitService.run',{
      args: [`remote`],
      cwd: arc_root
    });
    ArcControlService.props.git_initialized = git_initialized[0];
    console.log(arc);

    ArcControlService.props.super_busy = false;

    return true;
  },

  processContract: async (contract: Contract, arc_?: ARC, arc_root_?: string) => {
    const arc = arc_ || ArcControlService.props.arc;
    const arc_root = arc_root_ || ArcControlService.props.arc_root;
    if(!arc || !arc_root)
      return;
    arc.UpdateFileSystem();
    switch (contract.Operation) {
      case 'DELETE':
        await window.ipc.invoke(
          'LocalFileSystemService.remove',
          arc_root + '/' +contract.Path
        );
        break;
      case 'UPDATE': case 'CREATE':
        if(['ISA_Investigation','ISA_Study','ISA_Assay', 'ISA_Datamap', 'ISA_Run', 'ISA_Workflow', 'ISA_Datamap'].includes(contract.DTOType)){
          const buffer = await Xlsx.toBytes(contract.DTO);
          const absolutePath = arc_root + '/' +contract.Path;
          await window.ipc.invoke(
            'LocalFileSystemService.writeFile',
            [
              absolutePath,
              buffer,
              {}
            ]
          );
          break;
        } else if(contract.DTOType==='PlainText'){
          await window.ipc.invoke('LocalFileSystemService.writeFile', [
            arc_root+'/'+contract.Path,
            contract.DTO || '',
            {encoding:'UTF-8', flag: 'wx'}
          ]);
        } else {
          return console.log('unable to resolve write contract', contract);
        }
        break;
      case 'RENAME':
        await window.ipc.invoke(
          'LocalFileSystemService.rename',
          [
            arc_root + '/' + contract.Path,
            arc_root + '/' + contract.DTO
          ]
        );
        break;
      default:
        console.log(`Warning. 'processContract' hit unknown expression for contract type: ${contract.Operation} in ${contract}.`)
        break;
    }
  },

  saveARC: async (options:{
      arc_root?: string,
      arc?: ARC,
      force?:boolean
  })=>{
    options = options || {};
    const arc = options.arc || ArcControlService.props.arc;
    if(!arc)
      return;
    const arc_root = options.arc_root || ArcControlService.props.arc_root;
    if(!arc_root)
      return;

    ArcControlService.props.skip_fs_updates = true;

    arc.UpdateFileSystem();
    let contracts = options.force ? arc.GetWriteContracts() : arc.GetUpdateContracts();

    /// Add default .gitignore if it does not exist
    const ignore_exists = await window.ipc.invoke(
      'LocalFileSystemService.exists',
      arc_root + '/.gitignore'
    );
    if(!ignore_exists)
      contracts.push( gitignoreContract );

    const attributes_exists = await window.ipc.invoke(
      'LocalFileSystemService.exists',
      arc_root + '/.gitattributes'
    );
    if(!attributes_exists)
      await window.ipc.invoke(
        'LocalFileSystemService.writeFile',
        [arc_root + '/.gitattributes','**/dataset/** filter=lfs diff=lfs merge=lfs -text\n']
      );

    for(let c of contracts)
      await ArcControlService.processContract(c,arc,arc_root);

    ArcControlService.props.skip_fs_updates = false;
  },

  delete: async (method:string, identifier:string) => {
    for(let c of ArcControlService.props.arc[method](identifier))
      await ArcControlService.processContract(c);
  },

  rename: async (method:string, old_identifier:string, new_identifier:string) => {
    for(let c of ArcControlService.props.arc[method](old_identifier,new_identifier))
      await ArcControlService.processContract(c);
  },

  newARC: async (path: string) => {
    const arcName = path.split('/').pop();
    if (!arcName)
      throw new Error('Invalid ARC path provided');
    try {
      checkValidCharacters(arcName);
    } catch (error) {
      throw error;hit
    }
    const arc = new ARC(arcName);
    await ArcControlService.saveARC({
      arc_root:path,
      arc:arc,
      force: true
    });
    await ArcControlService.readARC(path);
    await window.ipc.invoke('GitService.run', {
      args: ['init','-b','main'],
      cwd: path
    });
    await window.ipc.invoke('GitService.run', {
      args: ['add','isa.investigation.xlsx','assays/','studies/','runs/','workflows/'],
      cwd: path
    });
    await window.ipc.invoke('GitService.run', {
      args: ['commit','-m','init','--author','"ARCitect <info@nfdi4plants.org>"'],
      cwd: path
    });
  },

  openArcInExplorer: async (arc_root: string | null | void) => {
    if(!arc_root)
      arc_root = ArcControlService.props.arc_root;
    if(!arc_root)
      return;
    await window.ipc.invoke('LocalFileSystemService.openPath', arc_root);
  },

  updateARCfromFS: async ([path,type]) => {
    if(ArcControlService.props.skip_fs_updates) return;
    // track add/rm assays/studies through file explorer
    const requires_update = path.includes('isa.assay.xlsx') || path.includes('isa.study.xlsx') || path.includes('isa.investigation.xlsx') || path.includes('isa.run.xlsx') || path.includes('isa.workflow.xlsx') || path.includes('isa.datamap.xlsx');
    if(!requires_update) return;
    debouncedReadARC();
  },

  updateGitIgnore: async (path:string) => {
    const entry = path.replace(ArcControlService.props.arc_root,'');
    const ignore_exists = await window.ipc.invoke('LocalFileSystemService.exists', ArcControlService.props.arc_root+'/.gitignore');
    if(!ignore_exists)
      await ArcControlService.saveARC({});

    const ignore_string = await window.ipc.invoke('LocalFileSystemService.readFile', ArcControlService.props.arc_root+'/.gitignore');
    const line_delimiter = ignore_string.indexOf('\r\n')<0 ? '\n' : '\r\n';
    const ignore_entries = ignore_string.split(line_delimiter);

    const entry_index = ignore_entries.indexOf(entry);
    if(entry_index<0){
      ignore_entries.push(entry);
      await window.ipc.invoke('GitService.run', {
        args: ['reset', '.'+entry],
        cwd: ArcControlService.props.arc_root
      });
      await window.ipc.invoke('GitService.run', {
        args: ['rm', '--cached', '.'+entry],
        cwd: ArcControlService.props.arc_root
      });
    } else {
      ignore_entries.splice(entry_index,1);
      await window.ipc.invoke('GitService.run', {
        args: [`add`,'.'+entry],
        cwd: ArcControlService.props.arc_root
      });
    }
    await window.ipc.invoke('LocalFileSystemService.writeFile', [ArcControlService.props.arc_root+'/.gitignore', ignore_entries.join(line_delimiter)]);
    AppProperties.force_commit_update++;
  },

  test: async ()=>{
    const testArcPath = '/tmp/testARC';
    if (!ArcControlService.props.arc) 
        throw new Error('No ARC loaded for testing.');
    try {
      await window.ipc.invoke('LocalFileSystemService.remove', testArcPath);
      await ArcControlService.newARC(testArcPath);

      for(let i=0; i<3; i++)
        ArcControlService.props.arc.AddAssay(
          new ArcAssay(`Assay${i}`)
        );
      for(let i=0; i<3; i++)
        ArcControlService.props.arc.AddStudy(
          new ArcStudy(`Study${i}`)
        );

      await ArcControlService.delete('GetAssayRemoveContracts','Assay1');
      await ArcControlService.rename('GetAssayRenameContracts','Assay2','AssayX');
      await ArcControlService.delete('GetStudyRemoveContracts','Study1');
      await ArcControlService.rename('GetStudyRenameContracts','Study2','StudyX');

      await ArcControlService.saveARC({});
      await ArcControlService.readARC();

      ArcControlService.props.arc.GetStudy('Study0');
      ArcControlService.props.arc.GetStudy('StudyX');
      ArcControlService.props.arc.GetAssay('Assay0');
      ArcControlService.props.arc.GetAssay('AssayX');

      await window.ipc.invoke('CORE.log', '==========TESTS SUCCESSFUL==========');
      await window.ipc.invoke('CORE.exit',0);
    } catch(e){
      await window.ipc.invoke('CORE.log', e);
      await window.ipc.invoke('CORE.exit',1);
    }
  }
};

const debouncedReadARC = pDebounce(ArcControlService.readARC, 300);

// https://github.com/nfdi4plants/ARCitect/issues/439
window.ipc.on('LocalFileSystemService.updatePath', ArcControlService.updateARCfromFS);
window.ipc.on('CORE.getArcRoot', callback=>window.ipc.invoke(callback, ArcControlService.props.arc_root));
window.ipc.on('CORE.runTests', ()=>ArcControlService.test());

export default ArcControlService;
