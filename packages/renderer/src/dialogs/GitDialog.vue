<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { ref, reactive, onMounted, onUnmounted } from 'vue';

export interface Props {
  title: String,
  ok_title: String,
  ok_icon?: String,
  cancel_title: String,
  cancel_icon?: String,
  state: Number
};
const props = defineProps<Props>();

const iProps = reactive({
  height: 0,
  rows: [''],
  git_listener: null,
  text: ''
});

const scrollarea = ref(null);

defineEmits([
  ...useDialogPluginComponent.emits
]);

const processGitStream = async data=>{
  const rows = data.split('\n').filter(row=>row!=='');

  for(let row of rows){
    if(row==='') continue;
    const last_row = iProps.rows[iProps.rows.length-1];
    let replace = false;
    for(let p of [
      'POST ',
      'Filtering content:',
      'Receiving objects:',
      'Resolving deltas:',
      'Enumerating objects:',
      'Counting objects:',
      'Compressing objects:',
      'Writing objects:',
      'Uploading LFS objects:',
      'Downloading LFS objects:',
    ])
      if(last_row.includes(p) && row.includes(p))
        replace = true;

    if(replace)
      iProps.rows[iProps.rows.length-1] = row;
    else
      iProps.rows.push(row);
  }
  iProps.text = iProps.rows.join('<br>');
};

const copyGitOutput = () => {
  window.navigator.clipboard.writeText(iProps.rows.join('\n'));
}

onMounted( ()=>{
  iProps.rows = [''];
  iProps.git_listener = window.ipc.on('GitService.MSG', processGitStream);
});
onUnmounted( ()=>iProps.git_listener() );

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:55em;">
      <q-card-section>
        <div class="text-h6">{{props.title}}</div>
      </q-card-section>

      <q-card-section>
        <div class='bg-grey-3 rounded-borders q-pa-md text-body1 scroll_bottom' v-html='iProps.text'>
        </div>
      </q-card-section>

      <q-linear-progress :value='100' :indeterminate='props.state===0' color="secondary" class="q-mt-sm" track-color="grey-3" />

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <q-btn color="grey-6" label="Copy Git Output" @click="copyGitOutput" class='text-weight-bold' icon='content_paste'/>
        <q-btn color="secondary" :loading='props.state===0' :disabled='props.state===0 || (props.state===2 && props.cancel_title)' :label="props.ok_title" @click="onDialogOK" type='submit' class='text-weight-bold' :icon='props.ok_icon || "check_circle"'/>
        <q-btn v-if='props.cancel_title' color="secondary" :disabled='props.state===0' :label="props.cancel_title" @click="onDialogCancel" type='submit' class='text-weight-bold' :icon='props.cancel_icon || "cancel"'/>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>

<style>
  .progress_item {
    margin: 0 !important;
    padding: 0 !important;
  }

  .scroll_bottom {
    display:flex;
    flex-direction:column-reverse;
    overflow-y:scroll;
    height:250px;
  }
</style>
