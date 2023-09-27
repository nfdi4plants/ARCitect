<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch } from 'vue';

import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';
import {OntologyAnnotation} from '@nfdi4plants/arctrl/ISA/ISA/JsonTypes/OntologyAnnotation.js';
import {CompositeCell} from '@nfdi4plants/arctrl/ISA/ISA/ArcTypes/CompositeCell.js';
import {CompositeHeader,IOType} from '@nfdi4plants/arctrl/ISA/ISA/ArcTypes/CompositeHeader.js';

export interface Props {
  header: Object,
  insertHeader: Boolean
};
const props = defineProps<Props>();

const make_optionsFn = tryParentTerm=>{
  return async val => {
    if(val.length<1)
      return [];

    let res = null;
    if(tryParentTerm && iProps.parentTerm.TermAccessionNumber){
      res = await window.ipc.invoke('InternetService.callSwateAPI', {
        method: 'getTermSuggestionsByParentTerm',
        payload: [{
          'n': 5,
          'query': val,
          'parent_term': {
            'Name': iProps.parentTerm.NameText,
            'TermAccession': iProps.parentTerm.TermAccessionNumber
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

    if(!Array.isArray(res) || res.length<1)
      return [];

    return res.map(i=>OntologyAnnotation.fromString(i.Name,i.FK_Ontology,i.Accession));
  };
};

const iProps = reactive({
  column_types: CompositeHeader.Cases.map(x=>x[1]).slice(0,-1),
  column_type: null,
  column_type_p: null,

  io_types: IOType.Cases.map(x=>x[1]).slice(0,-1),
  io_type: IOType.Cases.map(x=>x[1])[0],
  io_type_p: null,

  term: null,
  term_p: null,
});

iProps.column_type_p = Property(iProps, 'column_type', {label:'Type',useInput:true, type:'select',optionsFn:()=>iProps.column_types});
iProps.io_type_p = Property(iProps, 'io_type', {label:'IO Type',useInput:true, type:'select',optionsFn:()=>iProps.io_types});
iProps.term_p = Property(iProps, 'term', {label:'Term',type:'ontology',optionsFn: make_optionsFn(false)});

const init = async ()=>{
  const headerAsTerm = props.header.ToTerm();
  iProps.column_type_p.setValue(
    props.header.tag===13 ? headerAsTerm.NameText : iProps.column_types[ props.header.tag ]
  );
  iProps.term_p.setValue(
    headerAsTerm
  );
  if([11,12].includes(props.header.tag)){
    iProps.io_type_p.setValue(props.header.fields[0].name === 'FreeText' ? props.header.fields[0] : props.header.fields[0].name);
  } else {
    iProps.io_type_p.setValue('Source');
  }
};

// watch( ()=>iProps.has_unit, async()=>{iProps.unit_prop.disabled=!iProps.has_unit;} );

onMounted( init );

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  onDialogOK(iProps);
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">Edit Column</div>
        </q-card-section>

        <q-card-section>
          <div class='row'>
            <div class='col'>
              <FormInput :property='iProps.column_type_p'></FormInput>
            </div>
            <div class='col' v-show='[0,1,2,3].includes(iProps.column_types.indexOf(iProps.column_type))'>
              <FormInput :property='iProps.term_p'></FormInput>
            </div>
            <div class='col' v-show='[11,12].includes(iProps.column_types.indexOf(iProps.column_type))'>
              <FormInput :property='iProps.io_type_p'></FormInput>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="red-8" icon='delete' label="Delete" @click="onDialogOK({delete:true})" class='text-weight-bold' v-if='!props.insertHeader'/>
          <q-btn color="secondary" icon='edit' label="Update" type='submit' class='text-weight-bold' />
          <q-btn color="secondary" icon='cancel' label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>
