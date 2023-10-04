<script lang="ts" setup>

import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';

import ArcControlService from '../ArcControlService.ts';
import Property from '../Property.ts';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';

import SwateTable from './SwateTable.vue';
import StringDialog from '../dialogs/StringDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

import {Templates_fromJsonString} from "@nfdi4plants/arctrl/Templates/Template.Json.js";

export interface Props {
  group: String,
  owner: Object
};
const props = defineProps<Props>();

const iProps = reactive({
  sheets: [],
  active_sheet: '',
  templates: null,
  search_by_parent_term: false
});


const init = async ()=>{
  iProps.sheets = [];
  iProps.active_sheet = null;

  if(!props.owner)
    return;

  if(!props.owner.Tables) return;

  iProps.sheets = props.owner.Tables.map(t=>t.Name);
  iProps.active_sheet = props.owner.Tables.length ? props.owner.Tables[0].Name : null;

  if(!iProps.templates){
    const templates_json = await window.ipc.invoke('InternetService.getTemplates');
    iProps.templates = await Templates_fromJsonString(JSON.stringify(templates_json));
    console.log(iProps.templates);
    // for(let x of iProps.templates)
    //   console.log(x);
  }
};

onMounted( init );
watch( ()=>props.owner, init );

const updateTable = async old_active_sheet =>{
  if(iProps.active_sheet === '@AddTable@'){
    $q.dialog({
      component: StringDialog,
      componentProps: {
        title: 'Add Process',
        property: 'Process Name',
        icon: 'add_box'
      }
    }).onOk( async data => {
      const table = props.owner.InitTable(data,props.owner.Tables.length);
      for(const title of ['Input','Output'])
        table.AddColumn(new CompositeHeader(13,[title]));
      table.AddRow();
      iProps.sheets = props.owner.Tables.map(t=>t.Name);
      iProps.active_sheet = props.owner.Tables.length ? props.owner.Tables[0].Name : null;
    });
    return;
  }

  if(iProps.active_sheet === '@RemoveTable@'){
    if(!old_active_sheet) return;
    props.owner.RemoveTable(old_active_sheet);
    iProps.sheets = props.owner.Tables.map(t=>t.Name);
    iProps.active_sheet = props.owner.Tables.length ? props.owner.Tables[0].Name : null;
    return;
  }
};

watch( ()=>iProps.active_sheet, (new_value,old_value)=>updateTable(old_value) );

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
    icon="newspaper"
    label="Data"
    caption="Process Information"
    :group="props.group"
    :fullWidth="true"
  >
    <q-card flat>
      <q-tabs
        v-model="iProps.active_sheet"
        class="text-secondary text-bold"
        dense
        outside-arrows
        mobile-arrows
      >
        <q-tab name="@RemoveTable@" label='' icon='remove_circle' ripple/>
        <q-tab v-for='s of iProps.sheets' :name="s" :label='s' ripple/>
        <q-tab name="@AddTable@" label='' icon='add_circle' ripple/>
      </q-tabs>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <SwateTable :table="(Object.keys(props.owner).length && !iProps.active_sheet.startsWith('@')) ? props.owner.GetTable(iProps.active_sheet) : {}" :search_by_parent_term='iProps.search_by_parent_term'></SwateTable>
        <q-card-actions align='right' style="padding:2.1em;">
          <FormInput :property="Property( iProps, 'search_by_parent_term', {type:'checkbox',label:'Parent Search',dense:true,tooltip:'Limit search to child terms of the column term.'})"/>
          <q-btn label="Apply Template" icon='table_chart' color="secondary" style="margin-left:1em;"/>
          <q-btn label="Update" type="submit" icon='check_circle' color="secondary"/>
          <q-btn label="Reset" type="reset" icon='change_circle' color="secondary" class="q-ml-sm"/>
        </q-card-actions>
      </q-form>
    </q-card>

  </ViewItem>
</template>
