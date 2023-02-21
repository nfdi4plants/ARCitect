<script lang="ts" setup>
import {onMounted,reactive} from 'vue';

import appProperties from '../AppProperties.ts';

const props = reactive({
  list: []
});

onMounted(() => {
  appProperties.title = 'ARC History';
  window.ipc.invoke('getGitHistory', appProperties.arc_root).then( data=>{
    props.list = data;
  });
});
</script>

<template>
  <q-timeline layout="dense" color="secondary">
    <q-timeline-entry
      v-for="(item,i) in props.list"
      :title="item.title"
      :subtitle="item.ts + ' --- ' + item.authorName + '('+item.authorEmail+')'"
      side="left"
    ></q-timeline-entry>
  </q-timeline>
</template>
