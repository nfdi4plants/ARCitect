import { reactive } from 'vue'

import AppProperties from './AppProperties.ts';

import { ARC } from "@nfdi4plants/arctrl/ARC.js";
import { ArcInvestigation } from "@nfdi4plants/arctrl/ISA/ISA/ArcTypes/ArcTypes.js";
import { gitignoreContract } from "@nfdi4plants/arctrl/Contracts/Contracts.Git.js";
import { Xlsx } from '@fslab/fsspreadsheet/Xlsx.js';
import {FileSystemTree} from '@nfdi4plants/arctrl/FileSystem/FileSystemTree.js'
import {Contract} from '@nfdi4plants/arctrl/Contract/Contract.js'

export const Investigation = "investigation";
export const Studies = "studies";
export const Assays = "assays";
export const Protocols = 'protocols';
export const Dataset = 'dataset';
export const Runs = 'runs';
export const Workflows = 'workflows';

let init: {
    arc_root: null | string ,
    busy: boolean,
    arc: null | ARC
} = {
    arc_root: null ,
    busy: false,
    arc: null
}

function relativePath_to_absolute(relativePath: string) {
  return ArcControlService.props.arc_root + '/' + relativePath
}

const ArcControlService = {

  props: reactive(init),

  closeARC: async() => {
    ArcControlService.props.arc_root = null;
    ArcControlService.props.busy = false;
    ArcControlService.props.arc = null;
    AppProperties.active_assay = null;
    AppProperties.active_study = null;
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
    for (const contract of contracts) {
      switch (contract.Operation) {
        case 'DELETE':
          await window.ipc.invoke('LocalFileSystemService.remove', relativePath_to_absolute(contract.Path));
          break;
        case 'UPDATE': case 'WRITE':
          const buffer = await Xlsx.toBytes(contract.DTO);
          await window.ipc.invoke('LocalFileSystemService.writeFile', [relativePath_to_absolute(contract.Path),buffer,{}]);
          break;
        default:
          console.log(`Warning. 'handleARCContracts' hit unknown expression for contract type: ${contract.Operation} in ${contract}.`)
          break;
      }
    }
  },

  writeARC: async (arc_root: string | null, filter, arc: ARC | void)=>{
    arc = arc || ArcControlService.props.arc;
    if(!arc)
      return;
    if(!arc_root)
      arc_root = ArcControlService.props.arc_root;
    if(!arc_root)
      return;

    ArcControlService.props.busy = true;

    arc.UpdateFileSystem();
    let contracts = arc.GetWriteContracts();
    /// Add default .gitignore
    contracts.push(gitignoreContract)
    if(filter)
      contracts = contracts.filter( x=>filter.includes(x.DTOType) );

    for(const contract of contracts){
      if(['ISA_Investigation','ISA_Study','ISA_Assay'].includes(contract.DTOType)){
        const buffer = await Xlsx.toBytes(contract.DTO);
        await window.ipc.invoke('LocalFileSystemService.writeFile', [arc_root+'/'+contract.Path,buffer,{}]);
      } else if(contract.DTOType==='PlainText'){
        await window.ipc.invoke('LocalFileSystemService.writeFile', [
          arc_root+'/'+contract.Path,
          contract.DTO || '',
          {encoding:'UTF-8', flag: 'wx'}
        ]);
      } else {
        console.log('unable to resolve write contract', contract);
      }
    }

    ArcControlService.props.busy = false;
  },

  deleteAssay: async (assay_identifier: string) => {
    // possibly remove assay from edit view
    if (AppProperties.active_assay === assay_identifier) {
      AppProperties.active_assay = null;
      AppProperties.state = AppProperties.STATES.HOME;
    };
    let contracts = ArcControlService.props.arc.RemoveAssay(assay_identifier)
    await ArcControlService.handleARCContracts(contracts);
    await ArcControlService.readARC();
  },

  deleteStudy: async (study_identifier: string) => {
    if (AppProperties.active_study === study_identifier) {
      AppProperties.active_study = null;
      AppProperties.state = AppProperties.STATES.HOME;
    };
    let contracts = ArcControlService.props.arc.RemoveStudy(study_identifier)
    await ArcControlService.handleARCContracts(contracts);
    await ArcControlService.readARC();
  },

  new_arc: async (path: string) =>{
    const arc = new ARC(
      ArcInvestigation.init(path.split('/').pop())
    );
    await ArcControlService.writeARC(path,null,arc);
    await ArcControlService.readARC(path);

    await window.ipc.invoke('GitService.run', {
      args: ['init'],
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

    await ArcControlService.readARC();
  }
};

window.ipc.on('LocalFileSystemService.updatePath', ArcControlService.updateARCfromFS);

export default ArcControlService;
