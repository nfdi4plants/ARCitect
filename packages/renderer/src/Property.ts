import { reactive, watch, ref } from 'vue';

import {OntologyAnnotation} from '@nfdi4plants/arctrl';

const autoLabel = property => {
  let words = property
    .split(/(?=[A-Z])/)
    .map(w=>w[0].toUpperCase()+w.slice(1));
  let label = words[0];
  for(let w=1;w<words.length; w++){
    label += (words[w].length===1?'':' ') + words[w];
  }
  return label;
};

const autoType = property => {
  const lp = property.toLowerCase();
  return lp==='email'?'email'
    :['phone','fax'].includes(lp)?'tel'
    :['address','affiliation','authorList','description'].includes(lp)?'textarea'
    :lp.includes('date')?'date'
    :'text';
};

const Property = (model: any,property: string, config?: any)=>{
  // console.log(property, model[property]);
  config = config || {};
  if(config.type==='ontology' && !model[property])
    model[property] = new OntologyAnnotation('');

  const p = reactive({
    model: model,
    property: property,
    org_value: model[property],
    hint: config.hint || '',
    tooltip: config.tooltip || '',
    type: config.type || autoType(property),
    dense: config.dense || false,
    options_dense: config.options_dense || false,
    multi: config.multi || false,
    label: config.label || autoLabel(property),
    placeholder: config.placeholder || '',
    readonly: config.readonly,
    disabled: config.disabled || false,
    useInput: config.useInput || false,
    loading: config.loading || false,
    options: Array.isArray(config.options) ? config.options : [],
    limit_to_options: config.limit_to_options || false,
    dirty: null,
  });
  p.dirty = ()=>p.org_value!=p.model[p.property] && !(!p.org_value && !p.model[p.property]);

  if(config.optionsFn){
    p.filter = async (val, update, abort) => {
      const options = await config.optionsFn(val);
      update( ()=>p.options=options );
    };
  }

  p.updateOriginalValue = () => {
    p.org_value = p.model[p.property];
  };

  p.setValue = v => {
    p.model[p.property] = v;
    p.org_value = v;
  };

  return p;
};

export default Property;
