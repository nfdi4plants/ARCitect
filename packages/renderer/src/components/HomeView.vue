<script lang="ts" setup>

import ArcCommanderService from '../ArcCommanderService.ts';
import logoURL from '../../assets/nfdi-hero.svg';

const openArcCommanderWebpage = async ()=>{
  window.ipc.invoke('InternetService.openExternalURL', 'https://github.com/nfdi4plants/arcCommander/releases');
}

</script>

<template>

  <div style="text-align:center;">
    <img :src="logoURL" style="box-sizing:border-box;width:100%;padding:4em;"/>
    <div class='text-h4'><span style="border-bottom:0.1em solid #000;">Welcome to <b>ARC</b>itect!</span></div>
    <div class='text-h6' style="line-height:1em;padding-top:0.5em;">Democratization of plant research<br>made easy.</div>
  </div>

  <div v-if='ArcCommanderService.props.ac_state===0' style="margin-top:3em;">
    <q-banner inline-actions class="bg-grey-3">
      <template v-slot:avatar>
        <q-icon name="warning" color="primary" />
      </template>
      Unable to detect ArcCommander.

      <template v-slot:action>
        <q-btn color="secondary" label="Install" style="margin-right:0.5em;" v-on:click='openArcCommanderWebpage()' />
        <q-btn color="secondary" label="Retry" v-on:click='ArcCommanderService.init()' />
      </template>
    </q-banner>
  </div>

</template>

