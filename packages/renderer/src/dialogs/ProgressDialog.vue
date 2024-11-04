<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive } from 'vue';

import a_btn from '../components/a_btn.vue';

export interface Props {
  title: String,
  progress: Number,
  progress_text: Number,
  error: String,
};
const props = defineProps<Props>();

const iProps = reactive({
  value: '',
  watcher: null,
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

// onMounted(()=>{
//   iProps.watcher = watch(()=>props.progress, ()=>onDialogOK());
// });

// onUnmounted(()=>{
//   iProps.watcher();
// });
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:45em;">
      <q-card-section>
        <div class="text-h6">{{props.title}}</div>
      </q-card-section>

      <q-card-section>
        <q-linear-progress stripe rounded size="20px" :value="props.progress" color="secondary" track-color="grey-9" class="q-mt-sm" animation-speed='200' :indeterminate='props.progress===0'>
          <div class="absolute-full flex flex-center">
            <q-badge class='text-bold' text-color="white" color='transparent' :label="props.progress_text" />
          </div>
        </q-linear-progress>
      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <a_btn icon='check_circle' label="Ok" @click="onDialogOK" :disabled='props.progress<1 || props.error!==""'/>
        <a_btn icon='cancel' label="Cancel" @click="onDialogCancel" :disabled='props.progress===1' />
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<style>
  .progress_item {
    margin: 0 !important;
    padding: 0 !important;
  }
</style>
