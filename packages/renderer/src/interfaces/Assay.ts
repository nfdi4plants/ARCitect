import {Property,PropertyTree} from './Property.ts';

import arcProperties from '../ArcProperties.ts';

class Assay extends PropertyTree {
  constructor(){
    super([
      new Property('assayIdentifier', {readonly:true}),
      new Property('studies', {type:'select',multi:true,limit_to_options:true,optionsFn:()=>{
        return [...new Set(arcProperties.studies.map(s=>s.identifier))];
      }})
    ]);
  }

  static getIdentifier(assay){
    if(assay.model && assay.model.assayIdentifier)
      return assay.model.assayIdentifier.value;
    if(assay.filename)
      return assay.filename.split('/isa.assay.xlsx')[0];
    return null;
  }

  static getAssay(identifier){
    for(let s of arcProperties.studies)
      if(s.hasOwnProperty('assays'))
        for(let a of s.assays){
          if(Assay.getIdentifier(a)===identifier)
            return a;
        }
    return null;
  }

  static getStudies(assay){
    let studies = [];
    for(let s of arcProperties.studies)
      if(s.hasOwnProperty('assays'))
        for(let a of s.assays)
          if(Assay.getIdentifier(assay)===Assay.getIdentifier(a))
            studies.push(s);

    return [...new Set(studies.map(s=>s.identifier))];
  }
}

export default Assay;
