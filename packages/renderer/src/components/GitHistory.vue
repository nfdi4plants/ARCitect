<script lang="ts" setup>

import { reactive } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import ArcCommanderService from '../ArcCommanderService.ts';

const iProps = reactive({
  git_log: []
});

const getHistory = async ()=>{
  // get log
  const response = await window.ipc.invoke('GitService.run', {
    args: [`log`,`--pretty=format:{"ref":"%H", "authorName":"%aN", "authorEmail":"%aE", "ts": "%cI", "title":"%s"},`],
    cwd: ArcCommanderService.props.arc_root
  });
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
    label="History"
    caption="Inspect ARC history"
    group="git"
    @before-show='getHistory'
  >
    <q-card flat style="padding: 0 5em;">
      <q-timeline color="secondary">
        <q-timeline-entry
          v-for="(item,i) in iProps.git_log"
          :title="item.title"
          :subtitle="item.ts + '&nbsp;-&nbsp;' + item.authorName + '('+item.authorEmail+')'"
          side="left"
        >
        </q-timeline-entry>
      </q-timeline>
    </q-card>
  </ViewItem>
</template>
