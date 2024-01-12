<script lang="ts" setup>

import { onMounted, reactive, watch} from 'vue';

import ViewItem from '../components/ViewItem.vue';

import a_input from './a_input.vue';
import a_select from './a_select.vue';
import a_term from './a_term.vue';

import SwateControlService from '../SwateControlService.ts';
import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

export interface Props {
  group: String,
  assay: Object
};
const props = defineProps<Props>();

const iProps = reactive({
  studies_assay: [],
  studies_all: []
});

const init = async ()=>{
  iProps.studies_all = ArcControlService.props.arc.ISA.Studies.map(s=>s.Identifier);
  iProps.studies_assay = ArcControlService.props.arc.ISA.Studies.filter( s=>study_contains_assay(s,props.assay.Identifier)).map(s=>s.Identifier);
};
onMounted( init );
watch( ()=>AppProperties.active_assay, init );

const deleteAssay = async ()=>{
  $q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      msg: `Are you sure you want to delete assay <b>'${props.assay.Identifier}'</b>?`,
      ok_text: 'Delete',
      ok_icon: 'delete',
      ok_color: 'red-9',
      cancel_text: 'Cancel',
      cancel_icon: 'cancel',
      cancel_color: 'secondary'
    }
  }).onOk( async () => {
    ArcControlService.deleteAssay(props.assay.Identifier);
  });
};

const editTable = ()=>{
  SwateControlService.LoadSwateState(AppProperties.STATES.EDIT_ASSAY)
};

const study_contains_assay = (s,assay_identifier) => {
  try {
    s.GetRegisteredAssay(assay_identifier);
    return true;
  } catch {
    return false;
  }
};

const updateAssignemnt = ()=>{
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
      <q-card-section>
        <div class='row'>
          <div class='col'>
            <a_input label='Identifier' v-model='props.assay.Identifier' readonly />
          </div>
          <div class='col'>
            <a_select label='Studies' v-model='iProps.studies_assay' :options='iProps.studies_all' multiple @update:model-value='updateAssignemnt'/>
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <a_term
              label='Measurment Type'
              v-model='props.assay.MeasurementType'
              term_name='Research Technique'
              term_accession='NCIT:C20368'
              hint='A term to qualify the endpoint, or what is being measured, e.g., gene expression profiling or protein identification.'
            />
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <a_term
              label='Technology Type'
              v-model='props.assay.TechnologyType'
              term_name='Research Technique'
              term_accession='NCIT:C20368'
              hint='Term to identify the technology used to perform the measurement, e.g., DNA microarray, mass spectrometry.'
            />
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <a_term
              label='Technology Type'
              v-model='props.assay.TechnologyPlatform'
              term_name='instrument model'
              term_accession='MS:1000031'
              hint='Manufacturer and platform name, e.g., Bruker AVANCE.'
            />
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
        <q-btn label="Delete" icon='delete' color="red-9" @click='deleteAssay'/>
        <!-- <q-btn label="Edit Table" icon='edit' @click='editTable' color="secondary"/> -->
      </q-card-actions>
    </q-card>
  </ViewItem>
</template>
