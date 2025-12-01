<script lang="ts" setup>
import ViewItem from '../components/ViewItem.vue';

const props = defineProps<{
  filePath: string
}>();


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

    </ViewItem>
  </q-list>
</template>
