import {
  ipcMain,
  BrowserWindow
} from 'electron';

import { ARC } from "../../../lib/ARCC/ARCtrl.js";
import { Xlsx } from '../../../lib/fsspreadsheet/Xlsx.js';
import FS from 'fs';

const PATH = require('path');

const getAllXLSX = (files,directory) => {
  const filesInDirectory = FS.readdirSync(directory);
  for(const file of filesInDirectory) {
    const absolute = PATH.join(directory, file);
    if (FS.statSync(absolute).isDirectory()) {
        getAllXLSX(files,absolute);
    } else if(file.endsWith('.xlsx')) {
        files.push(absolute);
    }
  }
};

export const ArcControlService = {

  run: (e,options) => {

  },

  readARC: async (e,arc_root) => {
    // to system path
    arc_root = arc_root.split('/').join(PATH.sep);

    // get xlsx files
    let xlsx_files = []
    getAllXLSX(xlsx_files,arc_root);
    xlsx_files = xlsx_files.map( p=>p.replace(arc_root+PATH.sep,''))
    console.log(xlsx_files)

    // get read contracts
    const arc = ARC.fromFilePaths(xlsx_files);

    const contracts = arc.getReadContracts();

    // read workbooks
    for(const c of contracts){
      const fpath = PATH.join(arc_root,c.Path);
      const buffer = FS.readFileSync(fpath);
      c.DTO = await Xlsx.fromBytes(buffer)
    }

    // get new arc
    const arc2 = arc.addISAFromContracts(contracts);

    return arc2;

    // // console.log(contracts)
    // // console.log(arc2.getWriteContracts())
    // // console.log(arc2.ISA)
    // arc2.ISA.Description = 345345345345
    // const s = arc2.ISA.InitStudy('77777777')
    // for(let c of arc2.ISA.Contacts)
    //   console.log(arc2.ISA.Contacts)
    //   // arc2.ISA.Contacts.append

    // console.log(arc2.ISA)
  },

  init: async () => {
    ipcMain.handle('ArcControlService.readARC', ArcControlService.readARC );
  }
};

// FsWorkbook {
//   _worksheets: [
//     FsWorksheet {
//       name: 'isa_investigation',
//       _name: 'isa_investigation',
//       _rows: [FSharpList],
//       _tables: [FSharpList],
//       _cells: [FsCellsCollection]
//     }
//   ]
// }


// [
//   Contract {
//     Operation: 'READ',
//     Path: 'isa.investigation.xlsx',
//     DTOType: 'ISA_Investigation',
//     DTO: undefined
//   },
//   Contract {
//     Operation: 'READ',
//     Path: 'studies/Assay1/isa.study.xlsx',
//     DTOType: 'ISA_Study',
//     DTO: undefined
//   },
//   Contract {
//     Operation: 'READ',
//     Path: 'assays/Assay1/isa.assay.xlsx',
//     DTOType: 'ISA_Assay',
//     DTO: undefined
//   }
// ]


