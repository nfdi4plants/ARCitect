<script lang="ts" setup>

import { reactive, watch, onMounted } from 'vue';

import AppProperties from '../AppProperties.ts';
import ViewItem from '../components/ViewItem.vue';

const iProps = reactive({
  image: '',
  metadata: {},
  metadataDirectories: [] as { key: string, value: string }[],
  splitterModel: 60
});

const init = async () => {
  if (!AppProperties.active_image) return;

  const result = await window.ipc.invoke(
    'LocalFileSystemService.readImage',
    AppProperties.active_image
  );

  if (!result) return;

  iProps.image = result.dataUrl;
  iProps.metadata = result.metadata || {};

  // Holds one entry per metadata directory in the image
  const dirs: Record<string, any[]> = {};

  for (const [dirName, tags] of Object.entries(iProps.metadata)) {
    if (!tags || typeof tags !== 'object') continue;

    // Convert directory entries into table rows
    dirs[dirName] = Object.entries(tags).map(([tagName, tagValue]: any) => ({
      key: tagName,
      value:
        typeof tagValue?.description !== 'undefined'
          ? String(tagValue.description)
          : JSON.stringify(tagValue)
    }));
  }

  iProps.metadataDirectories = dirs;
};


onMounted(init);
watch( ()=>AppProperties.active_image, init );

</script>

<template>
  <!-- Horizontal splitter: top = before (image), bottom = after (metadata) -->
  <q-splitter
    horizontal
    v-model=iProps.splitterModel
    style="height:100%;"
    :limits="[20, 80]"
  >
    <!-- TOP: image preview (before slot) -->
    <template #before>
      <div style="display:flex; flex-direction:column; height:100%;">
        <ViewItem
          icon="photo_library"
          label="Image Preview"
          :caption="AppProperties.active_image"
          style="flex:1 1 auto;"
        >
          <img
            v-if="AppProperties.active_image"
            :src="iProps.image"
            style="width:100%; height:100%; object-fit:contain;"
          />
        </ViewItem>
      </div>
    </template>

    <!-- BOTTOM: metadata (after slot) -->
    <template #after>
      <div style="overflow:auto; padding:8px;">
        <ViewItem
          v-if="iProps.metadataDirectories && Object.keys(iProps.metadataDirectories).length"
          icon="dataset"
          label="Image Metadata"
          caption="EXIF / XMP Metadata"
          class="text-subtitle1"
        >
          <q-expansion-item
            v-for="(rows, dirName) in iProps.metadataDirectories"
            icon="image_search"
            :key="dirName"
            :label="dirName"
            header-class="text-subtitle2 text-uppercase"
            dense
            expand-separator
            :default-opened="dirName.toLowerCase().includes('exif')" 
            
          >
            <div style="overflow-x:auto;">
              <q-table
                :rows="rows"
                :columns="[
                  { name: 'key', label: 'Key', field: 'key', align: 'left', style: 'width:200px;' },
                  { name: 'value', label: 'Value', field: 'value', align: 'left' }
                ]"
                row-key="key"
                bordered
                dense
              />
            </div>
          </q-expansion-item>
        </ViewItem>

        <!-- optional: show a message when no metadata -->
        <div v-else style="padding: 12px; color:var(--q-color-grey-6);">
          No metadata available.
        </div>
      </div>
    </template>
  </q-splitter>
</template>