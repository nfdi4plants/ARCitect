<script lang="ts" setup>

import { reactive, onMounted } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import ArcControlService from '../ArcControlService.ts';

const iProps = reactive({
  git_log: []
});

const getHistory = async ()=>{
  // get log
  const response = await window.ipc.invoke('GitService.run', {
    args: [`log`,`--all`,`--pretty=format:%H_**_%aN_**_%aE_**_%cI_**_%s_**_%D_***_`],
    cwd: ArcControlService.props.arc_root
  });
  if(response[1].startsWith('fatal'))
    return iProps.git_log = [];

  const log = [];

  const lines = (response[1]+'\n').split('_***_\n').slice(0,-1);
  const format = x => ('00' + x).slice(-2);
  for(let line of lines){
    const temp = line.split('_**_');
    const d = new Date(Date.parse(temp[3]));
    log.push({
      ref: temp[0],
      authorName: temp[1],
      authorEmail: temp[2],
      ts: `${format(d.getDate())}.${format(d.getMonth()+1)}.${d.getFullYear()} ${format(d.getHours())}:${format(d.getMinutes())}`,
      title: temp[4],
      pointer: temp[5],
    });
  }
  iProps.git_log = log;
};

const checkout = async ref => {
  await window.ipc.invoke('GitService.run', {
    args: [`checkout`,ref],
    cwd: ArcControlService.props.arc_root
  });
  getHistory();
};

onMounted( getHistory );

</script>

<template>
  <q-list bordered class="rounded-borders">
    <ViewItem
      icon="history"
      label="History"
      caption="Inspect ARC history"
    >
      <q-card flat style="padding: 1em 5em;">
        <q-timeline color="secondary">
          <q-timeline-entry
            v-for="(item,i) in iProps.git_log"
            :title="item.title"
            side="left"
            :icon='item.pointer.includes("HEAD")?"circle":"none"'
          >
            <template v-slot:subtitle>
              <div class='log_btn' @click='()=>checkout(item.ref)'>{{item.ref}}</div>
              <div>{{item.ts + '&nbsp;-&nbsp;' + item.authorName + ' ('+item.authorEmail+')'}}</div>
            </template>
          </q-timeline-entry>
        </q-timeline>

        <div v-if='!iProps.git_log.length' class='text-h6' style="text-align:center;color:#aaa;">No Commits</div>

      </q-card>
    </ViewItem>
  </q-list>
</template>

<style lang='scss'>
  .q-timeline__entry .q-icon{
    padding-top:1.5px;
  }

  .log_btn:hover {
    cursor:pointer;
    color:$secondary;
  }
</style>
