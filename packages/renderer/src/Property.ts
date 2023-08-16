import { reactive, watch, ref } from 'vue';

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

const Property = (model,property,config)=>{
  config = config || {};
  // console.log(property, model[property]);

  const p = reactive({
    model: model,
    property: property,
    org_value: model[property],
    hint: config.hint || '',
    type: config.type || autoType(property),
    multi: config.multi || false,
    label: config.label || autoLabel(property),
    readonly: config.readonly,
    disabled: config.disabled || false,
    useInput: config.useInput || false,
    loading: config.loading || false,
    options: Array.isArray(config.options) ? config.options : [],
    limit_to_options: config.limit_to_options || false,
    filter: null
  });
  if(config.optionsFn){
    p.filter = async (val, update, abort) => {
      const options = await config.optionsFn(val);
      update( ()=>p.options=options );
    };
  }

  p.updateOriginalValue = () => {
    p.org_value = p.model[p.property];
  };

  return p;
};

export default Property;
