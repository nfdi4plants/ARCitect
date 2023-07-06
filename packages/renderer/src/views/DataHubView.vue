<script lang="ts" setup>
import {onMounted,onUnmounted,reactive,ref,nextTick} from 'vue';

import appProperties from '../AppProperties.ts';
import ViewItem from '../components/ViewItem.vue';

const log = ref(null);
const props = reactive({
  list: [],
  showDialog: false,
  state: 0,
  msgs: [],
  localUrl: ''
});

const open = ()=>{
  appProperties.arc_root = props.localUrl+"";
  appProperties.state = appProperties.STATES.EDIT_ARC;
};

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
  const destination = await window.ipc.invoke('DataHubService.selectImportDestination');
  if(!destination)
    return;

  props.msgs = [];
  props.state = 0;
  props.showDialog = true;
  const status = await window.ipc.invoke('ArcCommanderService.run', {
    args: [`get`,`-r`,url],
    cwd: destination
  });
  props.localUrl = destination + '/' + url.split('/').pop().split('.git')[0];
  props.state = status[0] ? 1 : 2;

};

onMounted(async () => {
  appProperties.title = 'Import ARC from DataHUB';
  window.ipc.on('ArcCommanderService.MSG', processMsg);
  const list = await window.ipc.invoke('DataHubService.getArcs', appProperties.user && appProperties.user.token ? appProperties.user.token.access_token : null);

  if(appProperties.user){
    for(let i of list)
      i.isOwner = i.hasOwnProperty('owner') && i.owner.hasOwnProperty('username') && i.owner.username===appProperties.user.username;

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

  <q-dialog v-model="props.showDialog" persistent>
    <q-card class='q-pd-md' style="width:30em;">
      <q-card-section class="row items-center">
          <q-circular-progress
            :indeterminate='props.state<1'
            rounded
            size="2em"
            :thickness="0.7"
            track-color="grey-3"
            :color="props.state===2 ? 'red-8' : props.state===1 ? 'green' : 'primary'"
            class="q-ma-md"
            :value='100'
          />
          <div class="text-h6">Downloading ARC</div>
      </q-card-section>

      <q-separator />

      <q-scroll-area class='bg-grey-3' style="height: 12em; padding:1.5em;" ref='log' visible>
        <q-banner rounded v-for="(item,i) in props.msgs" style="margin:0.5em 0;padding:0.5em 1em;min-height:2em;" :class="item.toLowerCase().includes('error') ? 'bg-red-9 text-white' : 'bg-grey-4'">
          {{item}}
        </q-banner>
      </q-scroll-area>

      <q-separator />

      <q-card-actions align="right">
        <q-btn class='text-weight-bold' color='secondary' :disable='props.state!==1' v-close-popup v-on:click="open">Open</q-btn>
        <q-btn class='text-weight-bold' color='secondary' :disable='props.state===0' v-close-popup>Cancel</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

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
            rounded
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

