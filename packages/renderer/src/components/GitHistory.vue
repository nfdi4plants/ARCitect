<script lang="ts" setup>

import { reactive } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import ArcControlService from '../ArcControlService.ts';

const iProps = reactive({
  git_log: []
});

const getHistory = async ()=>{
  // get log
  const response = await window.ipc.invoke('GitService.run', {
    args: [`log`,`--pretty=format:{"ref":"%H", "authorName":"%aN", "authorEmail":"%aE", "ts": "%cI", "title":"%s"},`],
    cwd: ArcControlService.props.arc_root
  });
  if(response[1].startsWith('fatal'))
    return iProps.git_log = [];

  const format = x => ('00' + x).slice(-2);
  const log = JSON.parse('['+response[1].slice(0,-1)+']');
  for(let l of log){
    const d = new Date(Date.parse(l.ts))
    l.ts = `${format(d.getDate())}.${format(d.getMonth()+1)}.${d.getFullYear()} ${format(d.getHours())}:${format(d.getMinutes())}`
  }
  iProps.git_log = log
}

</script>

<template>
  <ViewItem
    icon="history"
    label="Log"
    caption="Inspect ARC history"
    group="git"
    @before-show='getHistory'
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
</template>
