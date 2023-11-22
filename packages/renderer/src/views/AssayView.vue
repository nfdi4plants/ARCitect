<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import AssayForm from '../components/AssayForm.vue';
import SwateForm from '../components/SwateForm.vue';

import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';

const iProps = reactive({
  assay: {}
});

const init = async ()=>{
  if(!ArcControlService.props.arc || !AppProperties.active_assay) return;

  const assay = ArcControlService.props.arc.ISA.TryGetAssay(AppProperties.active_assay);
  if (!assay) return; 
  iProps.assay = assay
};

onMounted( init );
watch( ()=>ArcControlService.props.arc, init );
watch( ()=>AppProperties.active_assay, init );

</script>

<template>
  <q-list>
    <AssayForm :assay='iProps.assay' group="agroup" defaultOpened></AssayForm>
    <q-separator />
    <SwateForm :owner='iProps.assay' group="agroup"></SwateForm>
  </q-list>
</template>
