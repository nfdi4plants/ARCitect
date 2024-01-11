<script lang="ts" setup>
import { reactive, watch, onBeforeMount } from 'vue';

import AssayForm from '../components/AssayForm.vue';
import PeopleList from '../components/PeopleList.vue';

import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';

const iProps = reactive({
  assay: {},
  people: []
});

const init = async ()=>{
  if(!ArcControlService.props.arc || !AppProperties.active_assay) return;

  const assay = ArcControlService.props.arc.ISA.TryGetAssay(AppProperties.active_assay);
  if (!assay) return;
  iProps.assay = assay
  iProps.people = assay.Performers;
};

onBeforeMount( init );
watch( ()=>ArcControlService.props.arc, init );
watch( ()=>AppProperties.active_assay, init );

</script>

<template>
  <q-list class='fit'>
    <AssayForm :assay='iProps.assay' group="agroup" :defaultOpened='true'></AssayForm>
    <q-separator />
    <PeopleList :items='iProps.people' group='agroup'></PeopleList>
  </q-list>
</template>
