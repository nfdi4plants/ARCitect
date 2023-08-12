// import {Property,PropertyTree} from './Property.ts';

// import arcProperties from '../ArcProperties.ts';
// import appProperties from '../AppProperties.ts';

// const make_optionsFn = (name,termAccession)=>{
//   return async v=>{
//     if(v.length<1)
//       return [];

//     const res = await window.ipc.invoke('InternetService.callSwateAPI', {
//       method: 'getTermSuggestionsByParentTerm',
//       payload: [{
//         'n': 5,
//         'query': v,
//         'parent_term': {
//           'Name': name,
//           'TermAccession': termAccession
//         }
//       }]
//     });
//     return Array.isArray(res) ? res.map(i=>i.Name) : [];
//   }
// }

// class Assay extends PropertyTree {
//   constructor(){
//     super([
//       new Property('assayIdentifier', {readonly:true}),
//       new Property('studies', {type:'select',multi:true,limit_to_options:true,optionsFn:()=>{
//         return [...new Set(arcProperties.studies && arcProperties.studies.length>0 ? arcProperties.studies.map(s=>s.identifier) : [])];
//       }}),
//       new Property('measurementtype', {
//         label:'Measurement Type',
//         type: 'select',
//         hint: 'A term to qualify the endpoint, or what is being measured, e.g., gene expression profiling or protein identification.',
//         useInput: true,
//         optionsFn: make_optionsFn('Research Technique','NCIT:C20368')
//       }),
//       new Property('technologytype', {
//         label:'Technology Type',
//         type: 'select',
//         hint: 'Term to identify the technology used to perform the measurement, e.g., DNA microarray, mass spectrometry.',
//         useInput: true,
//         optionsFn: make_optionsFn('Research Technique','NCIT:C20368')
//       }),
//       new Property('technologyplatform', {
//         label:'Technology Platform',
//         type: 'select',
//         hint: 'Manufacturer and platform name, e.g., Bruker AVANCE.',
//         useInput: true,
//         optionsFn: make_optionsFn('instrument model','MS:1000031')
//       })
//     ]);
//   }

//   static getIdentifier(assay){
//     if(assay.model && assay.model.assayIdentifier)
//       return assay.model.assayIdentifier.value;
//     if(assay.filename)
//       return assay.filename.split(appProperties.path_sep)[0];
//     return null;
//   }

//   static getAssay(identifier){
//     for(let s of arcProperties.studies)
//       if(s.hasOwnProperty('assays'))
//         for(let a of s.assays){
//           if(Assay.getIdentifier(a)===identifier)
//             return a;
//         }
//     return null;
//   }

//   static getStudies(assay){
//     let studies = [];
//     for(let s of arcProperties.studies)
//       if(s.hasOwnProperty('assays'))
//         for(let a of s.assays)
//           if(Assay.getIdentifier(assay)===Assay.getIdentifier(a))
//             studies.push(s);

//     return [...new Set(studies.map(s=>s.identifier))];
//   }
// }

// export default Assay;
