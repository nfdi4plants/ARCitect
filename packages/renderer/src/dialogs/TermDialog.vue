<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';

import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';
import {OntologyAnnotation} from '../../../../dist/ARCC/ISA/ISA/JsonTypes/OntologyAnnotation.js';
import {CompositeCell} from '/home/jones/external/projects/arc-commander-ui/arcade2/dist/ARCC/ISA/ISA/ArcTypes/CompositeCell.js';

export interface Props {
  cell: Object,
  header: Object,
};
const props = defineProps<Props>();

const iProps = reactive({
  parentTerm: null,
  term: null,
  form: [[]]
});

const init = async ()=>{
  const parentTerm = props.header.fields[0];
  iProps.parentTerm = OntologyAnnotation.fromString(parentTerm.NameText,parentTerm.TermSourceREF,parentTerm.TermAccessionNumber);

  const term = props.cell.AsTerm;
  iProps.term = OntologyAnnotation.fromString(term.NameText,term.TermSourceREF,term.TermAccessionNumber);

  iProps.form = [
    [
      Property( iProps, 'parentTerm', {
        label: 'Search Under Parent Term',
        type: 'ontology',
        hint: 'Search the ontology database by given parent term name (delete to perform free search)',
        optionsFn: make_optionsFn(false)
      })
    ],
    [
      Property( iProps, 'term', {
        type: 'ontology',
        hint: 'Search the ontology database for given term name',
        optionsFn: make_optionsFn(true)
      })
    ]
  ];
};

onMounted( init );

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

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  const newCell = CompositeCell.createTerm(iProps.term);
  onDialogOK(newCell);
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">Edit Cell</div>
        </q-card-section>

        <q-card-section>
          <div class='row' v-for="(row,i) in iProps.form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property='property'></FormInput>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="secondary" icon='check_circle' label="" type='submit' class='text-weight-bold' />
          <q-btn color="secondary" icon='cancel' label="" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>
