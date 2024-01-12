<script lang="ts" setup>

import { reactive, watch, onMounted } from 'vue';

import AppProperties from '../AppProperties.ts';
import ViewItem from '../components/ViewItem.vue';

const iProps = reactive({
  image: '',
});

const init = async ()=>{
  if(!AppProperties.active_image) return;
  iProps.image = await window.ipc.invoke('LocalFileSystemService.readImage', AppProperties.active_image);
};

onMounted(init);
watch( ()=>AppProperties.active_image, init );

</script>

<template>
  <q-list>
    <ViewItem
      icon="photo_library"
      label="Image Preview"
      :caption="AppProperties.active_image"
      group='mgroup'
      defaultOpened
    >
      <img v-if='AppProperties.active_image' :src='iProps.image' style="width:100%;"/>
    </ViewItem>
  </q-list>
</template>
