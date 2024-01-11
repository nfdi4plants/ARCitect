<script lang="ts" setup>

import {OntologyAnnotation} from '@nfdi4plants/arctrl/ISA/ISA/JsonTypes/OntologyAnnotation.js';
import { reactive } from 'vue';

const model = defineModel();

export interface Props {
  term_name: String,
  term_accession: String,
};
const props = defineProps<Props>();

const iProps = reactive({
  options: []
})

const isValidTerm = ()=>{
  const tan = model.value.TermAccessionNumber;
  return tan!=='user-specific' && tan;
}

const filter_ =  async (val:string) => {
  let res;
  if(val.length<1){
    res = await window.ipc.invoke('InternetService.callSwateAPI', {
      method: 'getAllTermsByParentTerm',
      payload: [{
        'Name': props.term_name,
        'TermAccession': props.term_accession
      }]
    });
  } else {
    res = await window.ipc.invoke('InternetService.callSwateAPI', {
      method: 'getTermSuggestionsByParentTerm',
      payload: [{
        'n': 5,
        'query': val,
        'parent_term': {
          'Name': props.term_name,
          'TermAccession': props.term_accession
        }
      }]
    });
  }

  if(!Array.isArray(res) || res.length<1)
    return [];

  res = res.map(i=>OntologyAnnotation.fromString(i.Name,i.FK_Ontology,i.Accession));
  res.sort((a,b)=>a.NameText.localeCompare(b.NameText));
  return res;
};

const filter = async (val, update, abort) => {
  const options = await filter_(val);
  update( ()=>iProps.options=options );
};

</script>

<template>

    <q-select
      v-bind="$attrs"
      v-model='model'

      filled
      dense
      style="padding:0.4em 0.4em 1em 0.4em;"
      hide-bottom-space

      use-input
      hide-selected
      fill-input
      input-debounce="500"
      :options="iProps.options"
      :option-id="'TermAccessionNumber'"
      :option-label="a=> a ? a.NameText : ''"
      @input-value="v=>{if(!model || model.NameText!==v){model = OntologyAnnotation.fromString(v)}}"
      @filter="filter"
      options-dense
    >
      <template v-slot:append>
        <div v-if='model'>
          <div v-if='isValidTerm()'>
            <span class='text-body2' style="padding-right:0.5em;">
              {{model.TermAccessionShort}}
            </span>
            <q-icon name="check_circle"/>
            <q-tooltip class='text-body2'>
              Verified Ontology Term
            </q-tooltip>
          </div>
          <div v-else-if='model.NameText'>
            <q-icon name="help">
              <q-tooltip class='text-body2'>
                Unverified Ontology Term
              </q-tooltip>
            </q-icon>
          </div>
        </div>
      </template>
    </q-select>

</template>
