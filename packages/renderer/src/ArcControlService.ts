import { reactive } from 'vue'

import {Loading} from 'quasar'

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
    Loading.show({
      spinnerThickness: 40,
      spinnerSize: 200,
      spinnerColor: 'primary',
      delay: 200,
      message: 'Reading ARC'
    });

    ArcControlService.props.arc_root = arc_root;
    const xlsx_files = await window.ipc.invoke('LocalFileSystemService.getAllXLSX', arc_root);
    const arc = ARC.fromFilePaths(xlsx_files);
    const contracts = arc.GetReadContracts();

    for(const contract of contracts){
      const buffer = await window.ipc.invoke('LocalFileSystemService.readFile', [arc_root+'/'+contract.Path,{}]);
      contract.DTO = await Xlsx.fromBytes(buffer);
    }

    arc.SetISAFromContracts(contracts);

    ArcControlService.props.arc = arc;
    Loading.hide();
    ArcControlService.props.busy = false;
  },

  writeARC: async (arc_root,filter)=>{
    if(!ArcControlService.props.arc)
      return;
    if(!arc_root)
      arc_root = ArcControlService.props.arc_root;
    if(!arc_root)
      return;

    ArcControlService.props.busy = true;
    Loading.show({
      spinnerThickness: 40,
      spinnerSize: 200,
      spinnerColor: 'primary',
      delay: 0,
      message: 'Writing ARC'
    });

    console.log(ArcControlService.props.arc)

    let contracts = ArcControlService.props.arc.GetWriteContracts();
    if(filter)
      contracts = contracts.filter( x=>filter.includes(x.DTOType) );

    for(const contract of contracts){
      console.log(contract)
      if(contract.DTO && contract.DTO.constructor && contract.DTO.constructor.name === 'FsWorkbook'){
        const buffer = await Xlsx.toBytes(contract.DTO);
        await window.ipc.invoke('LocalFileSystemService.writeFile', [ArcControlService.props.arc_root+'/'+contract.Path,buffer,{}]);
      } else {
        console.log('unable to resolve write contract', contract);
      }
    }

    Loading.hide();
    ArcControlService.props.busy = false;
  }
};

ArcControlService.props = reactive({
  arc_root: null,
  busy: false,
  arc: null
});

export default ArcControlService;
