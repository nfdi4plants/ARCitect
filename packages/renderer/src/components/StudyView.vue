<script lang="ts" setup>

import { reactive, watch, onMounted } from 'vue';
import appProperties from '../AppProperties.ts';
import arcProperties from '../ArcProperties.ts';
import { date } from 'quasar'

import ArcCommanderService from '../ArcCommanderService.ts';

const props = reactive({
  identifier: '',
  title: '',
  description: '',
  submissionDate: '',
  publicReleaseDate: ''
});

const checkDate = val => {
  return val==='' ? true : date.isValid(val) || 'Invalid date.';
};

const getLabel = ()=>{
  return `${appProperties.active_study ? 'Edit' : 'Add'} Study`;
}

const init = async () => {
  for(let p of Object.keys(props))
    props[p] = '';

  const c = (()=>{
    for(let i of arcProperties.studies)
      if(i.identifier===appProperties.active_study)
        return i;
    return null;
  })();

  if(c){
    for(let p of Object.keys(c)){
      if(props.hasOwnProperty(p))
        props[p] = c[p];
    }
  }
};

watch( ()=>appProperties.active_study, init );
onMounted( init );

const onSubmit = async ()=>{
  const args = ['study'];

  args.push( appProperties.active_study ? 'update' : 'add');

  for(let p in props){
    if(props[p]){
      args.push('--'+p.toLowerCase());
      args.push(props[p]);
    }
  }

  await ArcCommanderService.run({
      args: args,
      title: `${appProperties.active_study ? 'Updating' : 'Adding'} Study`,
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
        icon="add_circle"
        :label="getLabel()"
        default-opened
      >

        <q-card>
          <q-form
            @submit="onSubmit"
            @reset="onReset"
          >
            <q-card-section>
              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.identifier"
                    label="Identifier"
                    hint="Locally unique study identifier"
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>

                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.title"
                    label="Title"
                    hint="A concise title of the study"
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>
              </div>

              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.description"
                    label="Description"
                    hint="A textual description of the investigation"
                    type='textarea'
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>
              </div>

              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.submissionDate"
                    mask="##/##/####"
                    :rules="[checkDate]"
                    label='Submission Date'
                    hint="The date the investigation was reported to the repository"
                    :readonly='ArcCommanderService.props.busy'
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="sdRef">
                          <q-date v-model="props.submissionDate" @update:model-value="$refs.sdRef.hide()"  mask="MM/DD/YYYY"></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col myP">
                  <q-input
                    filled
                    v-model="props.publicReleaseDate"
                    mask="##/##/####"
                    :rules="[checkDate]"
                    label='Public Release Date'
                    hint="The date the investigation was was released publicly"
                    :readonly='ArcCommanderService.props.busy'
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="pdRef">
                          <q-date v-model="props.publicReleaseDate" @update:model-value="$refs.pdRef.hide()"  mask="MM/DD/YYYY"></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align='right' style="padding:2.2em;">
              <q-btn :label="getLabel()" type="submit" :icon='appProperties.active_study ? "check_circle" : "add_circle"' color="teal" :disabled='ArcCommanderService.props.busy'/>
              <q-btn v-if='appProperties.active_study' label="Reset" type="reset" icon='change_circle' color="teal" class="q-ml-sm" :disabled='ArcCommanderService.props.busy'/>
            </q-card-actions>

          </q-form>
        </q-card>

      </q-expansion-item>
    </q-list>
</template>

<style>
</style>
