<script lang="ts" setup>

import {
  reactive,
  onMounted,
  watch
} from 'vue';
import {
  OntologyAnnotation
} from '@nfdi4plants/arctrl/ISA/ISA/JsonTypes/OntologyAnnotation.js';
import {
  CompositeCell
} from '@nfdi4plants/arctrl/ISA/ISA/ArcTypes/CompositeCell.js';

import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';

export interface Props {
  table: Object,
  cell: Object,
  cIdx: Number,
  rIdx: Number,
  search_by_parent_term: Boolean
};
const props = defineProps < Props > ();

const iProps = reactive({
  free_text: '',
  free_text_p: null,

  term: OntologyAnnotation.fromString(''),
  term_p: null,

  unit_text: OntologyAnnotation.fromString(''),
  unit_text_p: null,
  unit: OntologyAnnotation.fromString(''),
  unit_p: null,
});

const make_optionsFn = () => {
  return async val => {
    let res = null;
    const header = props.table.Headers[props.cIdx];
    const can_search_by_parent = header.IsTermColumn && header.fields[0].TermAccessionNumber;

    if (val.length < 1){
      if(can_search_by_parent){
        res = await window.ipc.invoke('InternetService.callSwateAPI', {
          method: 'getAllTermsByParentTerm',
          payload: [{
            'Name': header.fields[0].NameText,
            'TermAccession': header.fields[0].TermAccessionNumber
          }]
        });
      } else {
        return [];
      }
    } else if(props.search_by_parent_term && can_search_by_parent) {
      res = await window.ipc.invoke('InternetService.callSwateAPI', {
        method: 'getTermSuggestionsByParentTerm',
        payload: [{
          'n': 5,
          'query': val,
          'parent_term': {
            'Name': header.fields[0].NameText,
            'TermAccession': header.fields[0].TermAccessionNumber
          }
        }]
      });
    } else {
      res = await window.ipc.invoke('InternetService.callSwateAPI', {
        method: 'getTermSuggestions',
        payload: [{
          'n': 5,
          'query': val
        }]
      });
    }

    if (!Array.isArray(res) || res.length < 1)
      return [];

    res = res.map(i=>OntologyAnnotation.fromString(i.Name,i.FK_Ontology,i.Accession));
    res.sort((a,b)=>a.NameText.localeCompare(b.NameText));
    return res;
  };
};

iProps.free_text_p = Property(iProps, 'free_text', {type: 'text-dense'});
iProps.term_p = Property(iProps, 'term', {type: 'ontology-dense', optionsFn: make_optionsFn()});
iProps.unit_p = Property(iProps, 'unit', {type: 'ontology-dense', optionsFn: make_optionsFn()});
iProps.unit_text_p = Property(iProps, 'unit_text', {type: 'text-dense'});

const init = async ()=> {
  if(props.cell.isTerm){
    iProps.term_p.setValue(props.cell.fields[0]);
  } else if(props.cell.isUnitized){
    iProps.unit_text = props.cell.fields[0];
    iProps.unit_p.setValue(props.cell.fields[1]);
  } else {
    iProps.free_text = props.cell.fields[0];
  }
};

const updateTermCell = ()=> {
  if(!props.cell.isTerm) return;
  props.table.UpdateCellAt(
    props.cIdx,
    props.rIdx,
    CompositeCell.createTerm(iProps.term)
  );
};
const updateUnitCell = ()=> {
  if(!props.cell.isUnitized) return;
  props.table.UpdateCellAt(
    props.cIdx,
    props.rIdx,
    CompositeCell.createUnitized(iProps.unit_text,iProps.unit)
  );
};
const updateFreeTextCell = ()=> {
  if(!props.cell.isFreeText) return;
  props.table.UpdateCellAt(
    props.cIdx,
    props.rIdx,
    CompositeCell.createFreeText(iProps.free_text)
  );
};

onMounted(init);
watch(()=>props.cell, init);
watch(()=>iProps.term, updateTermCell);
watch(()=>iProps.unit, updateUnitCell);
watch(()=>iProps.unit_text, updateUnitCell);
watch(()=>iProps.free_text, updateFreeTextCell);

</script>

<template>
  <FormInput
    v-if='props.cell.isTerm'
    :property='iProps.term_p'
  />
  <div v-else-if='props.cell.isUnitized' class='row'>
    <FormInput
      :property='iProps.unit_text_p'
      class='col'
    />
    <FormInput
      :property='iProps.unit_p'
      class='col'
    />
  </div>
  <FormInput
    v-else-if='props.cell.isFreeText'
    :property='iProps.free_text_p'
  />
</template>
