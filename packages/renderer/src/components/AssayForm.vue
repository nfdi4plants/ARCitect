<script lang="ts" setup>

import { onMounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';

import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

import {OntologyAnnotation} from '../../../../lib/ARCC/ISA/ISA/JsonTypes/OntologyAnnotation.js';

export interface Props {
  group: String,
  assay: Object
};
const props = defineProps<Props>();

const iProps = reactive({
  form: [[]],
  studies_assay: [],
  studies_all: []
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

const study_contains_assay = (s,assay_identifier) => {
  try {
    s.GetRegisteredAssay(assay_identifier);
    return true;
  } catch {
    return false;
  }
}

const init = async ()=>{
  if(!props.assay || !ArcControlService.props.arc) return;
  const assay_identifier = props.assay.Identifier;
  if(!assay_identifier) return;

  iProps.studies_all = ArcControlService.props.arc.ISA.Studies.map(s=>s.Identifier);
  iProps.studies_assay = ArcControlService.props.arc.ISA.Studies.filter( s=>study_contains_assay(s,assay_identifier)).map(s=>s.Identifier);

  iProps.form = [
    [
      Property( props.assay, 'Identifier', {readonly:true} ),
      Property( iProps, 'studies_assay', {type:'select', multi:true, options: iProps.studies_all})
    ],
    [
      Property( props.assay, 'MeasurementType', {
        label:'Measurement Type',
        type: 'ontology',
        hint: 'A term to qualify the endpoint, or what is being measured, e.g., gene expression profiling or protein identification.',
        optionsFn: make_optionsFn('Research Technique','NCIT:C20368')
      }),
    ],
    [
      Property( props.assay, 'TechnologyType', {
        label:'Technology Type',
        type: 'ontology',
        hint: 'Term to identify the technology used to perform the measurement, e.g., DNA microarray, mass spectrometry.',
        optionsFn: make_optionsFn('Research Technique','NCIT:C20368')
      }),
    ],
    [
      Property( props.assay, 'TechnologyPlatform', {
        label:'Technology Platform',
        type: 'ontology',
        hint: 'Manufacturer and platform name, e.g., Bruker AVANCE.',
        optionsFn: make_optionsFn('instrument model','MS:1000031')
      }),
    ],
  ];
};
onMounted( init );
watch( ()=>props.assay, init );

const onReset = async ()=>{
  await ArcControlService.readARC();
};

const onSubmit = async ()=>{
  if(iProps.studies_assay.length<1)
    return iProps.error = 'Assay must be assigned to at least one study.';

  const assay_identifier = props.assay.Identifier;

  for(const s of ArcControlService.props.arc.ISA.Studies){
    if(study_contains_assay(s,assay_identifier)){
      if(!iProps.studies_assay.includes(s.Identifier)){
        ArcControlService.props.arc.ISA.DeregisterAssay( s.Identifier, assay_identifier );
      }
    } else {
      if(iProps.studies_assay.includes(s.Identifier)){
        ArcControlService.props.arc.ISA.RegisterAssay( s.Identifier, assay_identifier );
      }
    }
  }

  await ArcControlService.writeARC(ArcControlService.props.arc_root,['ISA_Investigation','ISA_Study','ISA_Assay']);
  await ArcControlService.readARC();
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
