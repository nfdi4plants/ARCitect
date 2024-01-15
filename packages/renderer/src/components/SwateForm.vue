<script lang="ts" setup>

import { onMounted, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';

import SwateTable from './SwateTable.vue';

export interface Props {
  group: String,
  owner: Object
};
const props = defineProps<Props>();

const iProps = reactive({
  sheets: [],
  active_sheet: null
});


const init = async ()=>{
  iProps.sheets = [];
  iProps.active_sheet = null;

  if(!props.owner)
    return;

  if(!props.owner.Tables) return;

  iProps.sheets = props.owner.Tables.map(t=>t.Name);
  iProps.active_sheet = props.owner.Tables.length ? props.owner.Tables[0].Name : null;
};

onMounted( init );
watch( ()=>props.owner, init );

</script>

<template>
  <ViewItem
    icon="table_view"
    label="Processes"
    caption="Edit Processes as Tables"
    :group="props.group"
    :fullWidth="true"
  >
    <q-card flat>
      <q-tabs
        v-if='iProps.sheets.length>0'
        v-model="iProps.active_sheet"
        class="text-secondary text-bold"
        dense
        outside-arrows
        mobile-arrows
      >
        <q-tab v-for='s of iProps.sheets' :name="s" :label='s' ripple/>
      </q-tabs>

      <q-card-section v-else style="text-align: center;font-size:1.2em;color:#999;">
        <q-icon name="warning" size="2em" style="padding:0 0.25em"/>
        No Recorded Processes
      </q-card-section>

      <SwateTable v-if='iProps.active_sheet && iProps.sheets.length>0' :table="Object.keys(props.owner).length ? props.owner.GetTable(iProps.active_sheet) : {}"></SwateTable>

      <q-card-actions v-if='iProps.active_sheet && iProps.sheets.length>0' align='right' style="padding:2.1em;">

      </q-card-actions>
    </q-card>

  </ViewItem>
</template>
