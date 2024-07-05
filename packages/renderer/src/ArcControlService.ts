
import { reactive } from 'vue'

import AppProperties from './AppProperties.ts';
import SwateControlService from './SwateControlService.ts';

import { ARC, ArcInvestigation } from "@nfdi4plants/arctrl";
import { gitignoreContract } from "@nfdi4plants/arctrl/Contract/Git";
import { Xlsx } from '@fslab/fsspreadsheet/Xlsx.js';
import {Contract} from '@nfdi4plants/arctrl/Contract/Contract.js'

import pDebounce from 'p-debounce';

export const Investigation = "investigation";
export const Studies = "studies";
export const Assays = "assays";
export const Protocols = 'protocols';
export const Dataset = 'dataset';
export const Runs = 'runs';
export const Workflows = 'workflows';

let init: {
    arc_root: undefined | string ,
    busy: boolean,
    arc: null | ARC
} = {
    arc_root: undefined ,
    busy: false,
    arc: null
}

function relative_to_absolute_path(relativePath: string) {
  return ArcControlService.props.arc_root + '/' + relativePath
}

const ArcControlService = {

  props: reactive(init),

  closeARC: async() => {
    ArcControlService.props.arc_root = undefined;
    ArcControlService.props.busy = false;
    ArcControlService.props.arc = null;
    AppProperties.state = 0;
    return;
  },

  readARC: async (arc_root: string | void | null) =>{
    arc_root = arc_root || ArcControlService.props.arc_root;
    if(!arc_root)
      return;

    const isARC = await window.ipc.invoke('LocalFileSystemService.exists', arc_root+'/isa.investigation.xlsx');

    if (!isARC) {
      ArcControlService.closeARC();
      return false;
    }

    ArcControlService.props.busy = true;

    const xlsx_files = await window.ipc.invoke('LocalFileSystemService.getAllXLSX', arc_root);
    const arc = ARC.fromFilePaths(xlsx_files);
    const contracts = arc.GetReadContracts();
    for(const contract of contracts){
      const buffer = await window.ipc.invoke('LocalFileSystemService.readFile', [arc_root+'/'+contract.Path,{}]);
      contract.DTO = await Xlsx.fromBytes(buffer);
    }
    arc.SetISAFromContracts(contracts);
    ArcControlService.props.arc = arc;
    ArcControlService.props.arc_root = arc_root;
    ArcControlService.props.busy = false;
    console.log(arc);
    return true;
  },

  handleARCContracts: async (contracts: Contract []) => {
    let arc = ArcControlService.props.arc;
    let arc_root = ArcControlService.props.arc_root;
    if(!arc || !arc_root)
      return;
    ArcControlService.props.busy = true;
    arc.UpdateFileSystem();
    for(const contract of contracts) {
      // console.log(contract);
      switch (contract.Operation) {
        case 'DELETE':
          await window.ipc.invoke(
            'LocalFileSystemService.remove',
            relative_to_absolute_path(contract.Path)
          );
          break;
        case 'UPDATE': case 'CREATE':
          if(['ISA_Investigation','ISA_Study','ISA_Assay'].includes(contract.DTOType)){
            const buffer = await Xlsx.toBytes(contract.DTO);
            const absolutePath = relative_to_absolute_path(contract.Path)
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
              relative_to_absolute_path(contract.Path),
              relative_to_absolute_path(contract.DTO)
            ]
          );
          break;
        default:
          console.log(`Warning. 'handleARCContracts' hit unknown expression for contract type: ${contract.Operation} in ${contract}.`)
          break;
      }
    }
  },

  saveARC: async (options:{
      arc_root?: string,
      arc?: ARC,
      force?:boolean
  })=>{
    const arc = options.arc || ArcControlService.props.arc;
    if(!ArcControlService.props.arc)
      ArcControlService.props.arc = arc;
    if(!arc)
      return;
    const arc_root = options.arc_root || ArcControlService.props.arc_root;
    if(!ArcControlService.props.arc_root)
      ArcControlService.props.arc_root = options.arc_root;
    if(!arc_root)
      return;

    ArcControlService.props.busy = true;

    arc.UpdateFileSystem();
    let contracts = options.force ? arc.GetWriteContracts() : arc.GetUpdateContracts();

    /// Add default .gitignore if it does not exist
    const ignore_exists = await window.ipc.invoke(
      'LocalFileSystemService.exists',
      relative_to_absolute_path('/.gitignore')
    );
    if(!ignore_exists)
      contracts.push(gitignoreContract);

    await ArcControlService.handleARCContracts(contracts);

    ArcControlService.props.busy = false;
  },

  deleteAssay: async (assay_identifier: string) => {
    let contracts = ArcControlService.props.arc.RemoveAssay(assay_identifier)
    await ArcControlService.handleARCContracts(contracts);
  },

  rename: async (method:string, old_identifier:string, new_identifier:string) => {
    const contracts = ArcControlService.props.arc[method](
      old_identifier,
      new_identifier
    );
    ArcControlService.handleARCContracts(contracts);
  },

  deleteStudy: async (study_identifier: string) => {
    let contracts = ArcControlService.props.arc.RemoveStudy(study_identifier)
    await ArcControlService.handleARCContracts(contracts);
  },

  new_arc: async (path: string) =>{
    const arc = new ARC(
      ArcInvestigation.init(path.split('/').pop())
    );
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
  },

  openArcInExplorer: async (arc_root: string | null | void) => {
    if(!arc_root)
      arc_root = ArcControlService.props.arc_root;
    if(!arc_root)
      return;
    await window.ipc.invoke('LocalFileSystemService.openPath', arc_root);
  },

  updateARCfromFS: async ([path,type]) => {
    // track add/rm assays/studies through file explorer
    const requires_update = path.includes('isa.assay.xlsx') || path.includes('isa.study.xlsx');
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
  }
};

const debouncedReadARC = pDebounce(ArcControlService.readARC, 300);

window.ipc.on('LocalFileSystemService.updatePath', ArcControlService.updateARCfromFS);

export default ArcControlService;
