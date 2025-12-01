<script lang="ts" setup>
import { ref } from 'vue';
import ViewItem from '../components/ViewItem.vue';

const props = defineProps<{
  filePath: string
}>();

const isOpening = ref(false);
const errorMsg = ref('');

const openFile = async () => {
  isOpening.value = true;
  errorMsg.value = '';
  try {
    const result = await window.ipc.invoke('open-file', props.filePath);
    if (result) {
      errorMsg.value = result;
    }
  } catch (err: any) {
    errorMsg.value = err?.message || 'Failed to open file.';
  } finally {
    isOpening.value = false;
  }
};
</script>

<style>
.fallback-header {
  font-weight: bold;
  color: #2d3e50;
  padding-top: 2em;
  padding-left: 2em;
}
</style>

<template>
  <q-list>
    <ViewItem
      icon="block"
      label="File Preview"
      :caption="props.filePath"
    >
    <div class="fallback-header text-h6" style="margin-bottom: 1em;">
    ARCitect cannot display this file.
    </div>
    <q-btn
    label="Open in default system viewer"
    color="secondary"
    class="q-mb-md"
    :loading="isOpening"
    @click="openFile"
    style="margin-left: 2.5em"
    />
    <div v-if="errorMsg" style="color: red; margin-top: 1em; margin-left: 2.5em; font-weight: bold;">
      {{ errorMsg }}
    </div>
    </ViewItem>
  </q-list>
</template>
