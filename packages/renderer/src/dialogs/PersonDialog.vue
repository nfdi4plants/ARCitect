<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
import Property from '../Property.ts';

import ArcControlService from '../ArcControlService.ts';

import {Person} from '@nfdi4plants/arctrl/ISA/ISA/JsonTypes/Person.js';
import { ipcMain } from 'electron';

const props = defineProps<{config?:Object}>();
const iProps = reactive({
  error: '',
  mode: 'Add',
  tab: 'new',
  person: new Person(),
  persons: [],
  loading: false
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  if(iProps.tab==='new'){
    cleanORCID();
    if(!iProps.person.FirstName || !iProps.person.LastName)
      return iProps.error='First and last name required';
    onDialogOK([iProps.person]);
  } else {
    onDialogOK(iProps.persons.filter(p=>p.selected));
  }
};

const init = async ()=>{
  iProps.error = '';
  iProps.mode = props.config ? 'Edit' : 'Add';

  if(props.config)
    iProps.person = props.config.Copy();
  cleanORCID();

  iProps.persons = await ArcControlService.props.arc.ISA.GetAllPersons();
  for(let person of iProps.persons)
    person.selected = false;
};
onMounted( init );

const cleanORCID = ()=>{
  if(iProps.person.ORCID)
    for(let x of ['https:','http:','/','www.','orcid','.org'])
      iProps.person.ORCID = iProps.person.ORCID.replaceAll(x,'');
}

const autoComplete = async ()=>{
  iProps.error = '';

  cleanORCID();

  if(!iProps.person.ORCID) return;

  iProps.loading = true;
  const record = await window.ipc.invoke('DataHubService.getPersonByORCID', iProps.person.ORCID);
  iProps.loading = false;
  if(!record) return;

  iProps.person.FirstName = record.person.name['given-names'].value;
  iProps.person.LastName = record.person.name['family-name'].value;

  try{
    iProps.person.EMail = record['person']['emails']['email'][0].email;
  } catch(e){}
  try{
    const organization = record['activities-summary']['employments']['affiliation-group'][0]['summaries'][0]['employment-summary'].organization;
    iProps.person.Address = [organization.address.city,organization.address.region,organization.address.country].join(', ');
    iProps.person.Affiliation = organization.name;
  } catch(e){}
}

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;height:34em;">
        <q-card-section>
          <q-tabs
            v-if='iProps.mode==="Add"'
            v-model="iProps.tab"
            dense
            align="justify"
            indicator-color="secondary"
            inline-label
            class=""
          >
            <q-tab name="new" icon="person_add_alt_1" label='Add New Person' />
            <q-tab name="add" icon="person_search" label='Add Existing Persons'  />
          </q-tabs>
          <div v-else class="text-h6">{{iProps.mode}} Person</div>
        </q-card-section>

        <q-card-section v-if='iProps.tab==="new"'>
          <div class='row'>
            <div class='col'>
              <a_input v-model='iProps.person.ORCID' label="ORCID" mask="####-####-####-####" placeholder='####-####-####-####'></a_input>
            </div>
          </div>
          <div class='row'>
            <div class='col'>
              <a_input v-model='iProps.person.FirstName' label="First Name"></a_input>
            </div>
            <div class='col'>
              <a_input v-model='iProps.person.LastName' label="Last Name"></a_input>
            </div>
          </div>
          <div class='row'>
            <div class='col'>
              <a_input v-model='iProps.person.EMail' label="eMail"></a_input>
            </div>
          </div>
          <div class='row'>
            <div class='col'>
              <a_input v-model='iProps.person.Phone' label="Phone"></a_input>
            </div>
            <div class='col'>
              <a_input v-model='iProps.person.Fax' label="Fax"></a_input>
            </div>
          </div>
          <div class='row'>
            <div class='col'>
              <a_input v-model='iProps.person.Address' label="Address" type='textarea' autogrow></a_input>
            </div>
          </div>
          <div class='row'>
            <div class='col'>
              <a_input v-model='iProps.person.Affiliation' label="Affiliation" type='textarea' autogrow></a_input>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else>
          <q-scroll-area style="height:22em">
          <q-list>

            <q-item tag="label" v-if='!iProps.persons.length'>
              <q-item-section>
                <q-item-label class='text-grey-8' style="margin:0 auto;"><q-avatar text-color="grey-8" icon='person_off' />No existing persons found</q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple v-for='person of iProps.persons'>
              <q-item-section side top>
                <q-checkbox v-model="person.selected" color='secondary'/>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{person.FirstName}} {{person.LastName}}</q-item-label>
                <q-item-label caption>ORCID: {{person.ORCID || `Missing`}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          </q-scroll-area>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <a_btn v-if='iProps.error' color="red-10" icon='warning' :label="iProps.error" no-caps style="margin-right:auto"/>
          <a_btn
            :icon='iProps.mode==="Edit" ? "edit" : "person_add_alt_1"'
            :label="`${iProps.mode==='Edit'?'Update':'Add'} Person${iProps.tab==='add' && iProps.persons.filter(p=>p.selected).length>1?'s':''}`"
            type='submit'
            :disabled='iProps.tab==="add" && iProps.persons.filter(p=>p.selected).length<1'
          />
          <a_btn icon='find_replace' label="Auto Complete" @click="autoComplete" :loading='iProps.loading' :disabled='!iProps.person.ORCID'/>
          <a_btn label="Cancel" @click="onDialogCancel"/>
        </q-card-actions>

      </q-card>

    </q-dialog>
  </q-form>
</template>
