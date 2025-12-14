<script lang="ts" setup>
import { ref } from 'vue';
import ViewItem from '../components/ViewItem.vue';
import { useQuasar } from 'quasar';
import { useDownloadLFSFiles } from '../composables/useDownloadLFSFiles';
import AppProperties from '../AppProperties';

const props = defineProps<{
  filePath: string
}>();

const isDownloading = ref(false);
const errorMsg = ref('');

const $q = useQuasar();

const downloadFile = async () => {
  isDownloading.value = true;
  errorMsg.value = '';
  try {
    await useDownloadLFSFiles($q, [AppProperties.active_node.id_rel]);
    if (AppProperties.active_node) {
      AppProperties.active_node.isLFSPointer = false;
      AppProperties.active_node.downloaded = true;
      AppProperties.node_needs_refresh = true;
    }
  } catch (err: any) {
    errorMsg.value = err?.message || 'Failed to download file.';
  } finally {
    isDownloading.value = false;
  }
};
</script>

<style>
.lfs-header {
  font-weight: bold;
  color: #2d3e50;
  padding-top: 2em;
  padding-left: 2em;
  padding-right: 2em;
}
</style>

<template>
  <q-list>
    <ViewItem
      icon="cloud_download"
      label="LFS File"
      :caption="props.filePath"
    >
      <div class="lfs-header text-h6" style="margin-bottom: 1em;">
        This file is stored via git LFS, you have to download it before it can be displayed.
      </div>
      <q-btn
        label="Download file"
        color="primary"
        class="q-mb-md"
        :loading="isDownloading"
        :disabled="AppProperties.git_dialog_state.visible"
        @click="downloadFile"
        style="margin-left: 2.5em"
      />
      <div v-if="errorMsg" style="color: red; margin-top: 1em; margin-left: 2.5em; font-weight: bold;">
        {{ errorMsg }}
      </div>
    </ViewItem>
  </q-list>
</template>
