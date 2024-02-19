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
    args: [`log`,`--pretty=format:%H_$$_%aN_$$_%aE_$$_%cI_$$_%s_$$$_`],
    cwd: ArcControlService.props.arc_root
  });
  if(response[1].startsWith('fatal'))
    return iProps.git_log = [];

  const log = [];
  const lines = response[1].split('_$$$_');
  const format = x => ('00' + x).slice(-2);
  for(let line of lines){
    const temp = line.split('_$$_');
    const d = new Date(Date.parse(temp[3]));
    log.push({
      ref: temp[0],
      authorName: temp[1],
      authorEmail: temp[2],
      ts: `${format(d.getDate())}.${format(d.getMonth()+1)}.${d.getFullYear()} ${format(d.getHours())}:${format(d.getMinutes())}`,
      title: temp[4],
    });
  }
  iProps.git_log = log;
}

onMounted( getHistory );

</script>

<template>
  <q-list bordered class="rounded-borders">
    <ViewItem
      icon="history"
      label="History"
      caption="Inspect ARC history"
      group="git"
      defaultOpened
      hide-expand-icon
      expand-icon-toggle
    >
      <q-card flat style="padding: 1em 5em;">
        <q-timeline color="secondary">
          <q-timeline-entry
            v-for="(item,i) in iProps.git_log"
            :title="item.title"
            :subtitle="item.ts + '&nbsp;-&nbsp;' + item.authorName + ' ('+item.authorEmail+')'"
            side="left"
          >
          </q-timeline-entry>
        </q-timeline>

        <div v-if='!iProps.git_log.length' class='text-h6' style="text-align:center;color:#aaa;">No Commits</div>

      </q-card>
    </ViewItem>
  </q-list>
</template>

