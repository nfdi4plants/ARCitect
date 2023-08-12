<script lang="ts" setup>

import { onMounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';

import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

import {OntologyAnnotation} from '../../../../dist/ARCC/ISA/ISA/JsonTypes/OntologyAnnotation.js';

export interface Props {
  group: String
};
const props = defineProps<Props>();

const iProps = reactive({
  form: [[]],
  assay: null
});

const make_optionsFn = (name,termAccession)=>{
  return async val => {
    if(val.length<1)
      return [];

    const res = await window.ipc.invoke('InternetService.callSwateAPI', {
      method: 'getTermSuggestionsByParentTerm',
      payload: [{
        'n': 5,
        'query': val,
        'parent_term': {
          'Name': name,
          'TermAccession': termAccession
        }
      }]
    });

    if(!Array.isArray(res) || res.length<1)
      return [];

    return res.map(i=>OntologyAnnotation.fromString(i.Name,i.FK_Ontology,i.Accession));
  };
};

const init = async ()=>{

  iProps.assay = ArcControlService.props.arc.ISA.TryFindAssay(AppProperties.active_assay);
  if(!iProps.assay)
    return;

  iProps.form = [
    [
      Property( iProps.assay, 'Identifier', {readonly:true} ),
    ],
    [
      Property( iProps.assay, 'MeasurementType', {
        label:'Measurement Type',
        type: 'ontology',
        hint: 'A term to qualify the endpoint, or what is being measured, e.g., gene expression profiling or protein identification.',
        optionsFn: make_optionsFn('Research Technique','NCIT:C20368')
      }),
    ],
    [
      Property( iProps.assay, 'TechnologyType', {
        label:'Technology Type',
        type: 'ontology',
        hint: 'Term to identify the technology used to perform the measurement, e.g., DNA microarray, mass spectrometry.',
        optionsFn: make_optionsFn('Research Technique','NCIT:C20368')
      }),
    ],
    [
      Property( iProps.assay, 'TechnologyPlatform', {
        label:'Technology Platform',
        type: 'ontology',
        hint: 'Manufacturer and platform name, e.g., Bruker AVANCE.',
        optionsFn: make_optionsFn('instrument model','MS:1000031')
      }),
    ],
  ];
};
onMounted( init );
watch( ()=>AppProperties.active_assay, init );

const onReset = async ()=>{
  await ArcControlService.readARC();
  init();
};

const onSubmit = async ()=>{
  await ArcControlService.writeARC(ArcControlService.props.arc_root,['ISA_Assay']);
  await ArcControlService.readARC();
  init();
};

</script>

<template>

  <ViewItem
    icon="biotech"
    label="Assay"
    caption="General Meta Data of the Assay"
    :group="props.group"
  >
    <q-card flat>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-card-section>
          <div class='row' v-for="(row,i) in iProps.form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property='property'></FormInput>
            </div>
          </div>

          <div style="margin:1em 1em -2em 1em;" v-if='iProps.error'>
            <q-banner rounded inline-actions class="bg-red-10 text-white" dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <b>{{iProps.error}}.</b>
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align='right' style="padding:2.1em;">
          <q-btn label="Update" type="submit" icon='check_circle' color="secondary"/>
          <q-btn label="Reset" type="reset" icon='change_circle' color="secondary" class="q-ml-sm"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </ViewItem>
</template>
