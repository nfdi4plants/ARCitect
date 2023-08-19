import { reactive } from 'vue'

import AppProperties from './AppProperties.ts';

import { ARC } from "../../../lib/ARCC/ARCtrl.js";
import { Xlsx } from '../../../lib/fsspreadsheet/Xlsx.js';

const ArcControlService = {

  readARC: async arc_root=>{
    if(!arc_root)
      arc_root = ArcControlService.props.arc_root;
    if(!arc_root)
      return;

    ArcControlService.props.busy = true;

    const xlsx_files = await window.ipc.invoke('LocalFileSystemService.getAllXLSX', arc_root);
    const arc = ARC.fromFilePaths(xlsx_files);
    const contracts = arc.GetReadContracts();

    for(const contract of contracts){
      const buffer = await window.ipc.invoke('LocalFileSystemService.readFile', [arc_root+'/'+contract.Path,{}]);
      contract.DTO = await Xlsx.fromBytes(buffer);
    }

    await arc.SetISAFromContracts(contracts);

    ArcControlService.props.arc = arc;
    ArcControlService.props.arc_root = arc_root;
    ArcControlService.props.busy = false;
    console.log(arc);
  },

  writeARC: async (arc_root,filter,arc)=>{
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
          null
        ]);
      } else {
        console.log('unable to resolve write contract', contract);
      }
    }

    ArcControlService.props.busy = false;
  },

  new_arc: async path=>{
    // TODO Optimize
    const arc = ARC.fromFilePaths([]);
    await ArcControlService.writeARC(path,null,arc);
    await ArcControlService.readARC(path);

    ArcControlService.props.arc.ISA.Identifier = path.split('/').pop();
    await ArcControlService.writeARC();
    await ArcControlService.readARC(path);

    await window.ipc.invoke('GitService.run', {
      args: ['init'],
      cwd: path
    });
  }
};

ArcControlService.props = reactive({
  arc_root: null,
  busy: false,
  arc: null
});

export default ArcControlService;
