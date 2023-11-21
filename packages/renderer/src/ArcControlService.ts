import { reactive } from 'vue'

import AppProperties from './AppProperties.ts';

import { ARC } from "@nfdi4plants/arctrl/ARC.js";
import { ArcInvestigation } from "@nfdi4plants/arctrl/ISA/ISA/ArcTypes/ArcTypes.js";
import { gitignoreContract } from "@nfdi4plants/arctrl/Contracts/Contracts.Git.js";
import { Xlsx } from '@fslab/fsspreadsheet/Xlsx.js';
import {FileSystemTree} from '@nfdi4plants/arctrl/FileSystem/FileSystemTree.js'
import {ARCAux_getArcInvestigationFromContracts} from '@nfdi4plants/arctrl/ARC.js'
import {ARCtrl_ISA_ArcInvestigation__ArcInvestigation_tryFromReadContract_Static_7570923F} from '@nfdi4plants/arctrl/Contracts/Contracts.ArcTypes.js'
import { FsWorkbook } from "@nfdi4plants/arctrl/fable_modules/FsSpreadsheet.5.0.1/FsWorkbook.fs.js";

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

function debugLog(c) {
  let matchResult, fsworkbook;
  console.log("INNER HIT");
  console.log(c);
  if (c.Operation === "READ") {
      console.log(1);
      if (c.DTOType != null) {
          console.log(2);
          if (c.DTOType === "ISA_Investigation") {
              console.log(3);
              if (c.DTO != null) {
                  console.log(4);
                  if (c.DTO instanceof FsWorkbook) {
                      console.log(5);
                      matchResult = 0;
                      fsworkbook = c.DTO;
                  }
                  else {
                      matchResult = 1;
                  }
              }
              else {
                  matchResult = 1;
              }
          }
          else {
              matchResult = 1;
          }
      }
      else {
          matchResult = 1;
      }
  }
  else {
      matchResult = 1;
  }
  switch (matchResult) {
      case 0:
          return fromFsWorkbook(fsworkbook);
      default:
          return void 0;
  }
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
    if(!arc_root)
      arc_root = ArcControlService.props.arc_root;
    if(!arc_root)
      return;

    const isARC = await window.ipc.invoke('LocalFileSystemService.exists', arc_root+'/isa.investigation.xlsx');
    console.log("isARC", isARC)
    if (!isARC) {
        ArcControlService.closeARC();
        return false;
    }

    ArcControlService.props.busy = true;

    const xlsx_files = await window.ipc.invoke('LocalFileSystemService.getAllXLSX', arc_root);
    const arc = ARC.fromFilePaths(xlsx_files);
    const contracts = arc.GetReadContracts();
    console.log("CONTRACTS:", contracts)

    for(const contract of contracts){
      const buffer = await window.ipc.invoke('LocalFileSystemService.readFile', [arc_root+'/'+contract.Path,{}]);
      contract.DTO = await Xlsx.fromBytes(buffer);
    }
    console.log("HIT");
    console.log("CONTRACT 0:", contracts[0])
    let ai = debugLog(contracts[0]);
    console.log(ai)
    console.log("BETWEEN")
    arc.SetISAFromContracts(contracts);
    console.log("HIT 2")
    ArcControlService.props.arc = arc;
    ArcControlService.props.arc_root = arc_root;
    ArcControlService.props.busy = false;
    console.log(arc);
    return true;
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
    const relativePath = `${Assays}/${assay_identifier}`;
    const path = `${ArcControlService.props.arc_root}/${relativePath}`;
    const filePaths : string [] = ArcControlService.props.arc.FileSystem.Tree.ToFilePaths();
    const filteredPaths : string [] = filePaths.filter(path => !path.startsWith(relativePath));
    const newFsTree = FileSystemTree.fromFilePaths(filteredPaths);
    // possibly remove assay from edit view
    if (AppProperties.active_assay === assay_identifier) {
      AppProperties.active_assay = null;
      AppProperties.state = AppProperties.STATES.HOME;
    };
    await ArcControlService.props.arc.ISA.RemoveAssay(assay_identifier);
    ArcControlService.props.arc._fs.Tree = newFsTree;
    await window.ipc.invoke('LocalFileSystemService.remove', path);
    await ArcControlService.writeARC();
    await ArcControlService.readARC();
  },

  deleteStudy: async (study_identifier: string) => {

    const relativePath = `${Studies}/${study_identifier}`;
    const path = `${ArcControlService.props.arc_root}/${relativePath}`;
    const filePaths : string [] = ArcControlService.props.arc.FileSystem.Tree.ToFilePaths();
    const filteredPaths : string [] = filePaths.filter(path => !path.startsWith(relativePath));
    const newFsTree = FileSystemTree.fromFilePaths(filteredPaths);
    // possibly remove study from edit view
    if (AppProperties.active_study === study_identifier) {
      AppProperties.active_study = null;
      AppProperties.state = AppProperties.STATES.HOME;
    };
    // remove study
    await ArcControlService.props.arc.ISA.RemoveStudy(study_identifier);
    // remove study from registered study identifiers
    ArcControlService.props.arc.ISA.RegisteredStudyIdentifiers = ArcControlService.props.arc.ISA.RegisteredStudyIdentifiers.filter((i: string) => i !== study_identifier)
    // remove study folder from file system
    ArcControlService.props.arc._fs.Tree = newFsTree;
    // remove study folder from disc
    await window.ipc.invoke('LocalFileSystemService.remove', path);
    await ArcControlService.writeARC();
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
  }
};

export default ArcControlService;
