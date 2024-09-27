<script lang="ts" setup>
import {onMounted,onUnmounted,reactive,ref,nextTick,watch} from 'vue';

import AppProperties from '../AppProperties.ts';
import ViewItem from '../components/ViewItem.vue';
import a_btn from '../components/a_btn.vue';
import a_tooltip from '../components/a_tooltip.vue';

import GitDialog from '../dialogs/GitDialog.vue';

import ArcControlService from '../ArcControlService.ts';

import { useQuasar } from 'quasar'
const $q = useQuasar();

const props = reactive({
  list: [],
  showDialog: false,
  state: 0,
  msgs: [],
  localUrl: '',
  search_text: '',
  download_lfs: false,
  host: 'git.nfdi4plants.org',
  host_manually_set: false,
  error: ''
});

const inspectArc = url =>{
  window.ipc.invoke('InternetService.openExternalURL', url);
};

const importArc = async url =>{
  props.localUrl = '';
  const destination = await window.ipc.invoke('LocalFileSystemService.selectDir',[
    'Select Destination of ARC Import',
    'Select Destination of ARC Import'
  ]);
  if(!destination)
    return;

  let url_with_credentials = url;
  if(AppProperties.user && AppProperties.user.host===props.host)
    url_with_credentials = url_with_credentials.replace('https://', `https://oauth2:${AppProperties.user.token.access_token}@`);

  const dialogProps = reactive({
    title: 'Downloading ARC',
    ok_title: 'Open',
    cancel_title: 'Close',
    state: 0
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk( async () => {
    if(!props.localUrl) return;
    await ArcControlService.readARC(props.localUrl);
    AppProperties.state=AppProperties.STATES.HOME;
  });

  const response = await window.ipc.invoke('GitService.run', {
    args: [`clone`,url_with_credentials,'--progress','--verbose'],
    cwd: destination,
    env: {GIT_LFS_SKIP_SMUDGE: (props.download_lfs?0:1)}
  });
  if(response[1].includes('fatal:')){
    dialogProps.state = 2;
    return;
  }

  props.localUrl = destination + '/' + url.split('/').pop().split('.git')[0];
  await window.ipc.invoke('GitService.run', {
    args: [`remote`,`remove`,`origin`],
    cwd: props.localUrl
  });
  await window.ipc.invoke('GitService.run', {
    args: [`remote`,`add`,`origin`,url],
    cwd: props.localUrl
  });
  dialogProps.state = 1;
};

const init = async () => {

  props.error = '';
  props.list = null;

  if(!props.host_manually_set && AppProperties.user)
    props.host = AppProperties.user.host;

  const list = await window.ipc.invoke(
    'DataHubService.getArcs',
    [
      props.host,
      AppProperties.user && AppProperties.user.host===props.host
        ? AppProperties.user.token.access_token
        : null
    ]
  );
  if(!list){
    props.error = 'Unable to authenticate current user at host `'+props.host+'`';
    return;
  }

  if(AppProperties.user){
    for(let i of list)
      i.isOwner = i.hasOwnProperty('owner') && i.owner.hasOwnProperty('username') && i.owner.username===AppProperties.user.username;

    props.list = list.sort( (a,b)=>{
      if(a.isOwner && !b.isOwner)
        return -1;
      else if(!a.isOwner && b.isOwner)
        return 1;
      else
        return a.name.localeCompare(b.name);
    });
  } else {
    props.list = list.sort( (a,b)=>a.name.localeCompare(b.name) );
  }
};

onMounted(init);
watch(()=>AppProperties.user, init);
watch(()=>props.host, init);

const host_manually_set = ()=>{
  props.host_manually_set=true;
};
</script>

<template>
  <q-list bordered class="rounded-borders">
    <ViewItem
      icon="cloud_download"
      label="Download ARC"
      caption="Download ARCs from the nfdi4plants DataHUB"
      :fullWidth="false"
    >
      <br>
      <div class="q-gutter-md row q-px-md">
        <q-input class='col-grow' v-model="props.search_text" label="ARC Identifier" dense outlined :disable='!props.list || props.list.length<1'>
          <template v-slot:append>
            <q-icon v-if="props.search_text!==''" name="close" @click="props.search_text=''" class="cursor-pointer" />
            <q-icon name="search" />
          </template>
          <a_tooltip>
            Use the search field to find an ARC by the name of the ARC or its creator
          </a_tooltip>
        </q-input>

        <q-checkbox v-model="props.download_lfs" label="LFS" dense color='secondary' style="min-width:50px;">
          <a_tooltip>
            (Un)check the LFS box to (not) download large file storage (LFS) objects
          </a_tooltip>
        </q-checkbox>

        <q-select v-model="props.host" :options="AppProperties.datahub_hosts" label="Host" dense @update:model-value='host_manually_set'>
          <a_tooltip>Select a DataHUB host from the dropdown menu</a_tooltip>
        </q-select>
        <a_btn label="" icon='refresh' @click='init' no-wrap>
          <a_tooltip>Refresh the list of available ARCs</a_tooltip>
        </a_btn>
      </div>
      <br>
      <q-separator/>

      <q-banner v-if='props.error' dense>
        <template v-slot:avatar>
          <q-icon name="warning" color="grey-7" />
        </template>
        <div v-html='props.error'></div>
      </q-banner>

      <div style="display:block;text-align:center;" v-else-if="props.list===null">
          <q-circular-progress
            indeterminate
            size="20em"
            color="primary"
            class="q-ma-md"
            :thickness="0.7"
          />
          <div>Fetching Remote ARCs</div>
      </div>

      <q-list style="padding:1em;" separator v-else>
        <q-item
          v-if="props.list && props.list.length<1"
        >
          <q-item-section avatar>
            <q-avatar icon='sym_r_orders' text-color='white' color='secondary' />
          </q-item-section>
          <q-item-section>
            <q-item-label>No ARCs Found</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="(item,i) in props.list.filter(x=> x.name.toLowerCase().includes(props.search_text.toLowerCase()) || x.namespace.name.toLowerCase().includes(props.search_text.toLowerCase()))"
          :style="i%2===1?'background-color:#fafafa;' : ''"
        >
          <q-item-section avatar>
            <q-avatar v-if="item.avatar_url!=null">
              <img :src="item.avatar_url">
            </q-avatar>
            <q-avatar :color="item.isOwner ? 'primary' : 'secondary'" text-color="white" v-else>{{item.namespace.name[0]}}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label style="font-weight:bold;">{{item.name}}</q-item-label>
            <q-item-label style="color:#666">[{{item.created_at}}]</q-item-label>
            <q-item-label :style="'color:#666;' + (item.isOwner ? 'font-weight:bold;' :'')">{{item.namespace.name}}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <a_btn color="secondary" v-on:click="inspectArc(item.http_url_to_repo)" icon='sym_r_captive_portal'>
              <a_tooltip>
                Open the DataHUB repository in the browser
              </a_tooltip>
            </a_btn>
          </q-item-section>
          <q-item-section avatar>
            <a_btn color="secondary" v-on:click="importArc(item.http_url_to_repo)" icon='file_download'>
              <a_tooltip>
                Download (clone) selected ARC from the DataHUB
              </a_tooltip>
            </a_btn>
          </q-item-section>
        </q-item>
      </q-list>


    </ViewItem>
  </q-list>
</template>

