<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, nextTick, watch } from 'vue';

import AppProperties from '../AppProperties.ts';
import ViewItem from '../components/ViewItem.vue';
import a_btn from '../components/a_btn.vue';
import a_tooltip from '../components/a_tooltip.vue';

import ArcControlService from '../ArcControlService.ts';
import GitService from '../GitService.ts';

const _ = reactive({
  list: [],
  missing: [],
});

const untrack = path => {
  const idx = AppProperties.config.localARCs.indexOf(path);
  if (idx >= 0) AppProperties.config.localARCs.splice(idx, 1);
};

const fetchARCs = async () => {
  _.list = [];
  _.missing = [];

  for (let path of AppProperties.config.localARCs) {
    const exists = await window.ipc.invoke('LocalFileSystemService.exists', path);
    const arc = {
      identifier: path.split('/').pop(),
      local_url: path,
      remotes: {},
      checking: false,
      missing: true,
    };

    if (exists) {
      arc.missing = false;
      arc.remotes = await GitService.get_remotes(path);
    }

    _.list.push(arc);
  }

  await nextTick();
  await check();
};

const check = async () => {
  if (!AppProperties.user) return;
  for (let arc of _.list) arc.checking = true;
  for (let arc of _.list) {
    await GitService.check_remotes(arc.local_url, arc.remotes);
    arc.checking = false;
  }
};

const init = async () => {
  watch(() => AppProperties.user, check);
  watch(() => AppProperties.config.localARCs, fetchARCs, { deep: true });
  await fetchARCs();
};

onMounted(init);

const readArc = async path => {
  await ArcControlService.readARC(path);
  AppProperties.state = AppProperties.STATES.HOME;
};

const getVerified = remotes =>
  Object.entries(remotes).filter(([id, data]) => !data.dirty && data.url.includes(AppProperties.user?.host));
const getUnverifyable = (remotes, concat) =>
  Object.entries(remotes).filter(([id, data]) => !data.url.includes(AppProperties.user?.host));
const getUnverified = remotes =>
  Object.entries(remotes).filter(([id, data]) => data.dirty && data.url.includes(AppProperties.user?.host));
const concat = remotes => remotes.map(([id, data]) => id).join('<br>');

const inspectArc = remotes => {
  const remote = remotes.origin || Object.values(remotes)[0];
  window.ipc.invoke('InternetService.openExternalURL', remote.url);
};
</script>

<template>
  <q-list>
    <ViewItem icon="sym_o_hard_drive" label="Local ARCs" caption="Manage ARCs on the local file system">
      <q-banner v-if="!AppProperties.user" style="margin: 1em auto; max-width: 30em" class="bg-grey-3" rounded>
        <template v-slot:avatar>
          <q-icon name="warning" color="grey-6" />
        </template>
        Please log in to check synchronization
      </q-banner>

      <q-banner
        v-if="!AppProperties.config.localARCs"
        style="margin: 1em auto; max-width: 30em"
        class="bg-grey-3"
        rounded
      >
        <template v-slot:avatar>
          <q-icon name="warning" color="grey-6" />
        </template>
        You can add local ARCs to this overview by opening them as usual.
      </q-banner>

      <q-list style="padding: 1em" separator>
        <q-item v-for="arc in _.list">
          <q-item-section avatar>
            <q-icon v-if="arc.missing" color="red-7" name="warning" size="3em">
              <a_tooltip :force="true">ARC can no longer be found on local file system</a_tooltip>
            </q-icon>
            <q-icon v-else-if="arc.checking" color="grey-7" name="sync" size="3em" class="rotating">
              <a_tooltip :force="true">Checking Remotes</a_tooltip>
            </q-icon>
            <q-icon
              v-else-if="
                getVerified(arc.remotes).length > 0 &&
                getUnverifyable(arc.remotes).length < 1 &&
                getUnverified(arc.remotes).length < 1
              "
              color="green-7"
              name="sym_o_verified"
              size="3em"
            >
              <a_tooltip :force="true"> All remotes are synced </a_tooltip>
            </q-icon>
            <q-icon
              v-else-if="getUnverified(arc.remotes).length > 0"
              color="red-7"
              name="sym_o_verified_off"
              size="3em"
            >
              <a_tooltip
                :force="true"
                v-html="'The following remotes are out of sync:<br>' + concat(getUnverified(arc.remotes))"
              />
            </q-icon>
            <q-icon v-else color="grey-7" name="sym_o_cloud_off" size="3em">
              <a_tooltip
                :force="true"
                v-html="
                  Object.keys(arc.remotes).length < 1
                    ? 'No remotes found to verify'
                    : 'The following remotes can not be verified:<br>' + concat(getUnverifyable(arc.remotes))
                "
              />
            </q-icon>
          </q-item-section>

          <q-item-section>
            <q-item-label
              ><b>{{ arc.identifier }}</b> <span class="text-grey-8">[{{ arc.local_url }}]</span></q-item-label
            >
            <q-item-label v-if="!Object.keys(arc.remotes).length" caption class="text-red text-weight-bold"
              >No Remote URL</q-item-label
            >
            <q-item-label v-for="[id, data] in Object.entries(arc.remotes)" caption
              ><b v-if="Object.keys(arc.remotes).length > 1">{{ id }}:</b> {{ data.url }}</q-item-label
            >
          </q-item-section>

          <q-item-section avatar v-if="Object.values(arc.remotes).length > 0">
            <a_btn color="secondary" @click="inspectArc(arc.remotes)" icon="sym_r_captive_portal">
              <a_tooltip> Open the DataHUB repository in the browser </a_tooltip>
            </a_btn>
          </q-item-section>
          <q-item-section avatar>
            <a_btn color="secondary" @click="() => untrack(arc.local_url)" icon="visibility_off">
              <a_tooltip :force="true" v-html="'Remove from this overview<br>(performs no deletion)'" />
            </a_btn>
          </q-item-section>
          <q-item-section avatar>
            <a_btn color="secondary" @click="() => readArc(arc.local_url)" icon="file_open">
              <a_tooltip> Download (clone) selected ARC from the DataHUB </a_tooltip>
            </a_btn>
          </q-item-section>
        </q-item>
      </q-list>
    </ViewItem>
  </q-list>
</template>

<style>
.arc_info th {
  text-align: right;
  font-weight: normal;
  font-style: italic;
}

.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>
