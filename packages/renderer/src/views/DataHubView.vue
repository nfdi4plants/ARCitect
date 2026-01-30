<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, nextTick, watch } from 'vue';

import AppProperties from '../AppProperties.ts';
import ViewItem from '../components/ViewItem.vue';
import a_btn from '../components/a_btn.vue';
import a_tooltip from '../components/a_tooltip.vue';

import GitDialog from '../dialogs/GitDialog.vue';

import ArcControlService from '../ArcControlService.ts';

import { useQuasar } from 'quasar';
const $q = useQuasar();

const props = reactive({
  list: [],
  page: 1,
  total_pages: 0,
  showDialog: false,
  state: 0,
  msgs: [],
  localUrl: '',
  search_text: '',
  download_lfs: false,
  host: 'git.nfdi4plants.org',
  show_public_arcs: true,
  error: '',
});

const inspectArc = url => {
  window.ipc.invoke('InternetService.openExternalURL', url);
};

const importArc = async url => {
  props.localUrl = '';
  const destination = await window.ipc.invoke('LocalFileSystemService.selectDir', [
    'Select Destination of ARC Import',
    'Select Destination of ARC Import',
  ]);
  if (!destination) return;

  let url_with_credentials = url;
  if (AppProperties.user && AppProperties.user.host === props.host)
    url_with_credentials = url_with_credentials.replace(
      'https://',
      `https://oauth2:${AppProperties.user.token.access_token}@`
    );

  const dialogProps = reactive({
    title: 'Downloading ARC',
    ok_title: 'Open',
    cancel_title: 'Close',
    state: 0,
    allowMinimize: false,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps,
  }).onOk(async () => {
    if (!props.localUrl) return;
    await ArcControlService.readARC(props.localUrl);
    AppProperties.state = AppProperties.STATES.HOME;
  });

  const response = await window.ipc.invoke('GitService.run', {
    args: [`clone`, url_with_credentials, '--progress', '--verbose'],
    cwd: destination,
    env: { GIT_LFS_SKIP_SMUDGE: props.download_lfs ? 0 : 1 },
  });
  if (response[1].includes('fatal:')) {
    dialogProps.state = 2;
    AppProperties.updateGitDialogState(2);
    return;
  }

  props.localUrl = destination + '/' + url.split('/').pop().split('.git')[0];
  await window.ipc.invoke('GitService.run', {
    args: [`remote`, `remove`, `origin`],
    cwd: props.localUrl,
  });
  await window.ipc.invoke('GitService.run', {
    args: [`remote`, `add`, `origin`, url],
    cwd: props.localUrl,
  });
  dialogProps.state = 1;
  AppProperties.updateGitDialogState(1);
};

const getArcs = async reset => {
  props.list = null;
  console.log(reset);
  if (reset) props.page = 1;

  console.log(props.page);

  const [list, header] = await window.ipc.invoke('DataHubService.getArcs', [
    props.host,
    AppProperties.user && AppProperties.user.host === props.host ? AppProperties.user.token.access_token : null,
    props.page,
    10,
    props.search_text || '',
    props.show_public_arcs,
  ]);
  if (!list) {
    props.error = 'Unable to authenticate current user at host `' + props.host + '`';
    return;
  }
  props.error = '';
  props.total_pages = parseInt(header['x-total-pages'][0]);
  props.list = list;
};

const init = async () => {
  if (AppProperties.user) {
    props.host = AppProperties.user.host;
    props.show_public_arcs = false;
  } else {
    props.show_public_arcs = true;
  }

  await getArcs(true);
};

onMounted(init);
watch(() => AppProperties.user, init);

watch(
  () => [props.host, props.show_public_arcs],
  () => getArcs(true)
);
watch(
  () => props.page,
  () => getArcs(false)
);
watch(
  () => props.search_text,
  AppProperties.debounce(() => getArcs(true), 500)
);

const timeDifference = utcDateStr => {
  const utcDate = new Date(utcDateStr);
  const now = new Date();
  const diff = now - utcDate;
  const years = now.getUTCFullYear() - utcDate.getUTCFullYear();
  const months = now.getUTCMonth() - utcDate.getUTCMonth() + years * 12;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  return years
    ? `${years} year${years > 1 ? 's' : ''} ago`
    : months
      ? `${months} month${months > 1 ? 's' : ''} ago`
      : weeks
        ? `${weeks} week${weeks > 1 ? 's' : ''} ago`
        : days
          ? `${days} day${days > 1 ? 's' : ''} ago`
          : 'today';
};

const format_date = utcDateStr => {
  const utcDate = new Date(utcDateStr);
  const to2Digits = i => ('0' + i).slice(-2);
  return `${to2Digits(utcDate.getDate())}.${to2Digits(utcDate.getMonth() + 1)}.${utcDate.getFullYear()} (${to2Digits(utcDate.getHours())}:${to2Digits(utcDate.getMinutes())})`;
};

const filter_ = (list, pattern) => {
  return list.filter(
    x =>
      x.name.toLowerCase().includes(pattern.toLowerCase()) ||
      x.name_with_namespace.toLowerCase().includes(pattern.toLowerCase())
  );
};
</script>

<template>
  <q-list bordered class="rounded-borders">
    <ViewItem icon="cloud_download" label="Download ARC" caption="Download ARCs from the nfdi4plants DataHUB">
      <br />
      <div class="q-gutter-md row q-px-md" style="padding: 0 1em 1em 1em">
        <q-input class="col-grow" v-model="props.search_text" label="ARC Identifier" dense outlined>
          <template v-slot:append>
            <q-icon
              v-if="props.search_text !== ''"
              name="close"
              @click="props.search_text = ''"
              class="cursor-pointer"
            />
            <q-icon name="search" />
          </template>
          <a_tooltip> Use the search field to find an ARC by the name of the ARC or its creator </a_tooltip>
        </q-input>

        <q-select v-model="props.host" :options="AppProperties.datahub_hosts" label="Host" dense>
          <a_tooltip>Select a DataHUB host from the dropdown menu</a_tooltip>
        </q-select>
        <a_btn label="" icon="refresh" @click="getArcs" no-wrap>
          <a_tooltip>Refresh the list of available ARCs</a_tooltip>
        </a_btn>
      </div>

      <div class="q-gutter-md row q-px-md">
        <q-checkbox
          v-model="props.show_public_arcs"
          label="Public ARCs"
          dense
          color="secondary"
          style="min-width: 50px"
        >
          <a_tooltip :force="true">Show public ARCs</a_tooltip>
        </q-checkbox>

        <q-checkbox
          v-model="props.download_lfs"
          label="Download LFS Objects"
          dense
          color="secondary"
          style="min-width: 50px"
        >
          <a_tooltip :force="true">
            (Un)check the LFS box to (not) download large file storage (LFS) objects
          </a_tooltip>
        </q-checkbox>
      </div>
      <br />
      <q-separator />

      <div
        v-if="!props.error"
        class="row justify-center q-gutter-md"
        style="max-width: 25em; margin: 1em auto -1em auto"
      >
        <q-btn
          label="Previous"
          icon="arrow_back_ios"
          class="col"
          flat
          :color="!props.list || props.page < 2 ? 'grey' : 'black'"
          :disabled="!props.list || props.page < 2"
          @click="() => props.page--"
        />
        <q-btn
          label="Next"
          icon-right="arrow_forward_ios"
          class="col"
          flat
          :color="!props.list || props.page >= props.total_pages ? 'grey' : 'black'"
          :disabled="!props.list || props.page >= props.total_pages"
          @click="() => (props.page = props.page + 1)"
        />
      </div>

      <q-banner v-if="props.error" dense>
        <template v-slot:avatar>
          <q-icon name="warning" color="grey-7" />
        </template>
        <div v-html="props.error"></div>
      </q-banner>

      <div style="display: block; text-align: center" v-else-if="props.list === null">
        <q-circular-progress indeterminate size="20em" color="primary" class="q-ma-md" :thickness="0.7" />
        <div>Fetching Remote ARCs</div>
      </div>

      <q-list style="padding: 1em" separator v-else>
        <q-item v-if="props.list && props.list.length < 1">
          <q-item-section avatar>
            <q-avatar icon="sym_r_orders" text-color="white" color="secondary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>No ARCs Found</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-for="(item, i) in props.list" :style="i % 2 === 1 ? 'background-color:#fafafa;' : ''">
          <q-item-section avatar>
            <q-avatar v-if="item.avatar_url != null">
              <img :src="item.avatar_url" />
            </q-avatar>
            <q-avatar :color="item.isOwner ? 'primary' : 'secondary'" text-color="white" v-else>{{
              item.namespace.name[0]
            }}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label style="font-weight: bold">
              {{ item.name }}
            </q-item-label>
            <q-item-label style="color: #666">
              <q-icon style="margin-right: 0.2em" name="update" />{{ timeDifference(item.last_activity_at) }}
              <a_tooltip anchor="top left" self="top left" :offset="[0, -20]" :force="true">
                <table class="arc_info">
                  <tbody>
                    <tr>
                      <th>Created:</th>
                      <td>{{ format_date(item.created_at) }}</td>
                    </tr>
                    <tr>
                      <th>Updated:</th>
                      <td>{{ format_date(item.last_activity_at) }}</td>
                    </tr>
                  </tbody>
                </table>
              </a_tooltip>
            </q-item-label>
            <q-item-label :style="'color:#666;' + (item.isOwner ? 'font-weight:bold;' : '')">{{
              item.name_with_namespace.split('/').slice(0, -1).join('/')
            }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <a_btn color="secondary" v-on:click="inspectArc(item.http_url_to_repo)" icon="sym_r_captive_portal">
              <a_tooltip> Open the DataHUB repository in the browser </a_tooltip>
            </a_btn>
          </q-item-section>
          <q-item-section avatar>
            <a_btn color="secondary" v-on:click="importArc(item.http_url_to_repo)" icon="file_download">
              <a_tooltip> Download (clone) selected ARC from the DataHUB </a_tooltip>
            </a_btn>
          </q-item-section>
        </q-item>
      </q-list>
    </ViewItem>
  </q-list>
</template>

<style>
.same-size-btn {
  width: 500px;
}

.arc_info th {
  text-align: right;
  font-weight: normal;
  font-style: italic;
}
</style>
