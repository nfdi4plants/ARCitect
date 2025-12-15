<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import AppProperties from '../AppProperties.ts';

export interface Props {
  title: String,
  ok_title: String,
  ok_icon?: String,
  cancel_title: String,
  cancel_icon?: String,
  state: Number,
  allowMinimize?: Boolean
};
const props = defineProps<Props>();

const iProps = reactive({
  height: 0,
  rows: [''],
  text: '',
  syncInterval: null
});

const msg_container = ref(null);

defineEmits([
  ...useDialogPluginComponent.emits
]);



const copyGitOutput = () => {
  window.navigator.clipboard.writeText(iProps.rows.join('\n'));
}

const minimizeDialog = () => {
  AppProperties.git_dialog_state.visible = true;
  AppProperties.git_dialog_state.minimized = true;
  AppProperties.git_dialog_state.title = props.title as string;
  AppProperties.git_dialog_state.ok_title = props.ok_title as string;
  AppProperties.git_dialog_state.cancel_title = props.cancel_title as string;
  onDialogCancel();
};

onMounted( ()=>{
  iProps.rows = AppProperties.git_dialog_state.minimized ? AppProperties.git_dialog_state.rows : [''];
  iProps.text = iProps.rows.join('<br>');
  AppProperties.git_dialog_state.visible = true;
  AppProperties.git_dialog_state.minimized = false;
  AppProperties.git_dialog_state.state = props.state as number;

  // Watch props.state changes from parent and sync to global state
  watch(() => props.state, (newState) => {
    AppProperties.git_dialog_state.state = newState as number;
  });

  // Sync with global listener updates (messages and state)
  const syncInterval = setInterval(() => {
    if (AppProperties.git_dialog_state.rows.length > iProps.rows.length) {
      iProps.rows = [...AppProperties.git_dialog_state.rows];
      iProps.text = iProps.rows.join('<br>');
      setTimeout(() => {
        if (msg_container.value)
          msg_container.value.scrollTop = msg_container.value.scrollHeight;
      }, 100);
    }
  }, 100);

  iProps.syncInterval = syncInterval;
});

onUnmounted( ()=>{
  if (iProps.syncInterval) {
    clearInterval(iProps.syncInterval);
  }
  if(!AppProperties.git_dialog_state.minimized) {
    AppProperties.git_dialog_state.visible = false;
    AppProperties.git_dialog_state.rows = [''];
  }
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:55em;">
      <q-card-section>
        <div class="text-h6">{{props.title}}</div>
      </q-card-section>

      <q-card-section>
        <div ref='msg_container' class='bg-grey-3 rounded-borders q-pa-md text-body1 msg_container' v-html='iProps.text'>
        </div>
      </q-card-section>

      <q-linear-progress :value='100' :indeterminate='AppProperties.git_dialog_state.state===0' color="secondary" class="q-mt-sm" track-color="grey-3" />

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <q-btn color="grey-6" label="Copy Git Output" @click="copyGitOutput" class='text-weight-bold' icon='content_paste'/>
        <q-btn v-if='props.allowMinimize !== false' color="grey-6" label="Minimize" @click="minimizeDialog" class='text-weight-bold' icon='minimize' :disabled='AppProperties.git_dialog_state.state!==0'/>
        <q-btn color="secondary" :loading='AppProperties.git_dialog_state.state===0' :disabled='AppProperties.git_dialog_state.state===0 || (AppProperties.git_dialog_state.state===2 && props.cancel_title)' :label="props.ok_title" @click="onDialogOK" type='submit' class='text-weight-bold' :icon='props.ok_icon || "check_circle"'/>
        <q-btn v-if='props.cancel_title' color="secondary" :disabled='AppProperties.git_dialog_state.state===0' :label="props.cancel_title" @click="onDialogCancel" type='submit' class='text-weight-bold' :icon='props.cancel_icon || "cancel"'/>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<style>
  .progress_item {
    margin: 0 !important;
    padding: 0 !important;
  }

  .msg_container {
    overflow-y:scroll;
    height:250px;
  }
</style>
