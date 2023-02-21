<script lang="ts" setup>

import { reactive, watch, onMounted } from 'vue';
import appProperties from '../AppProperties.ts';
import arcProperties from '../ArcProperties.ts';

import ArcCommanderService from '../ArcCommanderService.ts';

const props = reactive({
  studyidentifier: '',
  assayidentifier: '',
  measurementtype: '',
  technologytype: '',
  technologyplatform: ''
});

// --studyidentifier, -s <string>
//                       Name of the study in which the assay is situated
// --assayidentifier, -a <string>
//                       Name of the assay of interest
// --measurementtype <measurement type>
//                       A term to qualify the endpoint, or what is being measured (e.g. gene expression profiling or protein identification). The term can be free text or from, for example, a controlled vocabulary or an ontology. If the latter
//                       source is used, the Term Accession Number (TAN) and Term Source REF fields below are required.
// --measurementtypetermaccessionnumber <measurement type accession>
//                       The accession number from the Term Source associated with the selected term
// --measurementtypetermsourceref <measurement type term source>
//                       The Source REF has to match one of the Term Source Names declared in the Ontology Source Reference section
// --technologytype <technology type>
//                       Term to identify the technology used to perform the measurement, e.g. DNA microarray, mass spectrometry. The term can be free text or from, for example, a controlled vocabulary or an ontology. If the latter source is used the
//                       Term Accession Number (TAN) and Term Source REF fields below are required.
// --technologytypetermaccessionnumber <technology type accession>
//                       The accession number from the Term Source associated with the selected term.
// --technologytypetermsourceref <technology type term source>
//                       Identifies the controlled vocabulary or ontology that this term comes from. The Source REF has to match one of the Term Source Names declared in the Ontology Source Reference section.
// --technologyplatform <technology platform>
//                       Manufacturer and platform name, e.g. Bruker AVANCE

const getLabel = ()=>{
  return `${appProperties.active_assay ? 'Edit' : 'Add'} Assay`;
}

const init = async () => {
  for(let p of Object.keys(props))
    props[p] = '';

  // TODO get assay from ARC JSON
  const c = (()=>{
    for(let s of arcProperties.studies){
      if(!s.hasOwnProperty('assays'))
        continue;
      for(let a of s.assays){

      }
    }
      // if(i.identifier===appProperties.active_assay)
      //   return i;
    return null;
  })();

  if(c){
    for(let p of Object.keys(c)){
      console.log(p);
      if(props.hasOwnProperty(p))
        props[p] = c[p];
    }
  }
};
watch( ()=>appProperties.active_assay, init );
onMounted( init );

const onSubmit = async ()=>{
  const args = ['assay'];

  args.push( appProperties.active_assay ? 'update' : 'add');

  for(let p in props){
    if(props[p]){
      args.push('--'+p.toLowerCase());
      args.push(props[p]);
    }
  }

  await ArcCommanderService.run({
      args: args,
      title: `${appProperties.active_assay ? 'Updating' : 'Adding'} Assay`,
      silent: true
    },
    true
  );
};

const onReset = async ()=>{
  await ArcCommanderService.getArcProperties();
  init();
};

</script>

<template>

  <q-list>
      <q-expansion-item
        expand-separator
        icon="help"
        label="Add Assay"
        default-opened
      >
        <q-card>
          <q-form
            @submit="onSubmit"
          >
            <q-card-section>
              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.assayidentifier"
                    label="Assay Identifier"
                    hint="Name of the assay"
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>

                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.studyidentifier"
                    label="Study Identifier"
                    hint="Study that contains assay"
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>
              </div>

              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.measurementtype"
                    label="Measurement Type"
                    hint="TODO tiny hint"
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>
              </div>

              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.technologytype"
                    label="Technology Type"
                    hint="TODO tiny hint"
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>
              </div>

              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.technologyplatform"
                    label="Technology Platform"
                    hint="TODO tiny hint"
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align='right' style="margin:0 1.5em 1.5em;">
              <q-btn label="Add Assay" type="submit" icon='add_circle' color="teal" :disabled='ArcCommanderService.props.busy'/>
            </q-card-actions>

          </q-form>
        </q-card>
      </q-expansion-item>
    </q-list>
</template>

<style>
</style>
