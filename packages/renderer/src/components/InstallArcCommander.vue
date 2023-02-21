<script lang="ts" setup>
import {onMounted,reactive} from 'vue';

import appProperties from '../AppProperties.ts';

const checkStatus = async ()=>{
  const status = await window.ipc.invoke('ArcCommanderService.run', '--version');
  appProperties.ac_ready = status[0];
  appProperties.state = appProperties.ac_ready ? appProperties.STATES.OPEN_ARC : appProperties.STATES.INSTALL_AC;
};

onMounted(() => {
  appProperties.title = 'Install ARC Commander';
});

</script>

<template>
  <q-banner rounded inline-actions class="bg-grey-3">
    <template v-slot:avatar>
      <q-icon name="warning" color="primary" />
    </template>
    Unable to detect ArcCommander.

    <template v-slot:action>
      <q-btn color="secondary" label="Install" style="margin-right:0.5em;" v-on:click='navigateToArcCommanderWebpage()' />
      <q-btn color="secondary" label="Retry" v-on:click='checkStatus()' />
    </template>
  </q-banner>
</template>

