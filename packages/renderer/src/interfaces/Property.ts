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
  return property==='email'?'email'
    :['phone','fax'].includes(property)?'tel'
    :['address','affiliation','authorList','description'].includes(property)?'textarea'
    :property.includes('Date')?'date'
    :'text';
};

class Property {
  constructor(property,config){
    config = config || {};
    this.property = property;
    this.value = config.value || '';
    this.org_value = this.value;
    this.hint = config.hint || '';
    this.type = config.type || autoType(property);
    this.multi = config.multi || false;
    this.label = config.label || autoLabel(property);
    this.dirty = false;
    this.readonly = config.readonly;
    this.loading = config.loading || false;
    this.options = Array.isArray(config.options) ? config.options : [];
    this.optionsFn = config.optionsFn || null;
    this.limit_to_options = config.limit_to_options || false;

    // if(config.options){
    //   if()

    // }
    // this.options = Array.isArray(config.options) ? config.options : [];
    // this.optionsFilter = config.optionsFilter || ();
  }

  setOriginalValue(value){
    this.org_value = value;
    this.value = value;
  }
}

class PropertyTree {

  constructor(properties){
    const model = reactive({});
    for(const p of properties){
      model[p.property] = p;
      p.model = model;
      if(p.type==='select'){
        model[p.property].setModel = v => {
          model[p.property].value = v;
        }
        model[p.property].filterFn = p.optionsFn
          ? (val, update, abort)=>{model[p.property].options=p.optionsFn();update();}
          : (val, update, abort)=>update();
      }
    }
    this.model = reactive(model);

    const w = p => {
      watch(
        this.model[p],
        value=>{
          this.model[p].dirty = this.model[p].value!==this.model[p].org_value;
        }
      );
    };
    for(const p in this.model){
      w(p);
    }
  }

  init(config){
    for(const k in this.model){
      this.model[k].setOriginalValue('');

      if(config.hasOwnProperty(k))
        this.model[k].setOriginalValue(config[k]);
      if(k==='ORCID' && config.comments && config.comments.length && config.comments[0].name.includes('ORCID'))
        this.model.ORCID.setOriginalValue( config.comments[0].value );
      if(k==='status' && config.hasOwnProperty('status') && config.status.hasOwnProperty('annotationValue')){
        this.model.status.setOriginalValue( config.status.annotationValue );
      }
    }
  }
}

export {Property,PropertyTree}
