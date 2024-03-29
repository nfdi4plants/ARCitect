<script lang="ts" setup>

import {reactive} from 'vue';

import ArcCommanderService from '../ArcCommanderService.ts';
import AppProperties from '../AppProperties.ts';
import SelectionDialog from '../dialogs/SelectionDialog.vue';
import UserDialog from '../dialogs/UserDialog.vue';
import ErrorDialog from '../dialogs/ErrorDialog.vue';

import { useQuasar } from 'quasar'
const $q = useQuasar();

const authenticate = async host=>{
  const res = await window.ipc.invoke('DataHubService.authenticate', host);
  if(res) return;

  $q.dialog({
    component: ErrorDialog,
    componentProps: {
      error: `Unable to authenticate at host "${host}"`,
    }
  });
};

window.ipc.on('DataHubService.authentificationData', async user=>{
  if(AppProperties.user)
    clearTimeout(AppProperties.user.refresh_func)
  AppProperties.user = user;
  AppProperties.user.refresh_func = setTimeout(
    ()=>authenticate(AppProperties.user.host),
    AppProperties.user.token.expires_in*1000 // refresh after token expires
  );
});

const login = ()=>{
  $q.dialog({
    component: SelectionDialog,
    componentProps: {
      title: 'Please Select a DataHub',
      value: AppProperties.datahub_hosts[0],
      options: AppProperties.datahub_hosts,
      label: 'Host',
      ok_label: 'Login',
      cancel_label: 'Cancel'
    }
  }).onOk( authenticate );
}

const showUserData = ()=>{
  $q.dialog({
    component: UserDialog,
  }).onOk( async ()=>{
    clearTimeout(AppProperties.user.refresh_func)
    AppProperties.user = null;
    AppProperties.state = AppProperties.STATES.HOME;
  });
}

</script>

<template>

  <q-item v-if='!AppProperties.user' clickable v-ripple @click='login'>
    <q-item-section avatar>
      <q-icon color='grey-7' name="exit_to_app"></q-icon>
    </q-item-section>
    <q-item-section style="margin-left:-1.2em;">Login</q-item-section>
  </q-item>
  <q-item v-else clickable v-ripple @click='showUserData'>
    <q-item-section avatar>
      <q-icon color='grey-7' name="account_circle"></q-icon>
    </q-item-section>
    <q-item-section style="margin-left:-1.2em;">
      <q-item-label style="">{{AppProperties.user.name}}</q-item-label>
      <q-item-label caption style="font-size:0.8em;">{{AppProperties.user.host}}</q-item-label>
    </q-item-section>
  </q-item>

</template>

<style>

</style>
