<script lang="ts" setup>
import {onMounted,onUnmounted,reactive,ref,nextTick} from 'vue';

import AppProperties from '../AppProperties.ts';
import ViewItem from '../components/ViewItem.vue';

import ProgressDialog from '../dialogs/ProgressDialog.vue';

import ArcControlService from '../ArcControlService.ts';

import { useQuasar } from 'quasar'
const $q = useQuasar();

const log = ref(null);
const props = reactive({
  list: [],
  showDialog: false,
  state: 0,
  msgs: [],
  localUrl: ''
});

const inspectArc = url =>{
  window.ipc.invoke('InternetService.openExternalURL', url);
};

const processMsg = async msgs=>{
  for(let msg of msgs.split('\n')){
    msg = msg.trim();
    if(msg)
      props.msgs.push(msg);
  }
  await nextTick();
  if(log && log._value)
    log._value.setScrollPosition('vertical',90000,0);
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
  if(AppProperties.user)
    url_with_credentials = url_with_credentials.replace('https://', `https://oauth2:${AppProperties.user.token.access_token}@`);

  const dialogProps = reactive({
    title: 'Downloading ARC',
    ok_title: 'Open',
    cancel_title: 'Close',
    error: '',
    items: [
      ['Downloading ARC',0]
    ]
  });

  $q.dialog({
    component: ProgressDialog,
    componentProps: dialogProps
  }).onOk( async () => {
    if(!props.localUrl) return;
    await ArcControlService.readARC(props.localUrl);
    AppProperties.state=AppProperties.STATES.HOME;
  });

  const response = await window.ipc.invoke('GitService.run', {
    args: [`clone`,url_with_credentials],
    cwd: destination
  });
  if(response[1].includes('fatal:')){
    dialogProps.items[0][1] = 2;
    dialogProps.error = response[1];
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
  dialogProps.items[0][1] = 1;
};

onMounted(async () => {
  AppProperties.title = 'Import ARC from DataHUB';
  window.ipc.on('ArcCommanderService.MSG', processMsg);
  const list = await window.ipc.invoke('DataHubService.getArcs', AppProperties.user && AppProperties.user.token ? AppProperties.user.token.access_token : null);

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

});
onUnmounted(async () => {
  window.ipc.off('ArcCommanderService.MSG', processMsg);
});

</script>

<template>
  <q-list bordered class="rounded-borders">
    <ViewItem
      icon="cloud_download"
      label="Download ARC"
      caption="Download ARCs from the nfdi4plants DataHUB"
      group="datahub"
      defaultOpened
    >
      <q-separator />
      <div style="display:block;text-align:center;" v-if="props.list.length<1">
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
          v-for="(item,i) in props.list"
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
            <q-btn unelevated color="secondary" v-on:click="inspectArc(item.http_url_to_repo)" icon='search'></q-btn>
          </q-item-section>
          <q-item-section avatar>
            <q-btn unelevated color="secondary" v-on:click="importArc(item.http_url_to_repo)" icon='file_download'></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </ViewItem>
  </q-list>
</template>

