<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { ref, reactive, onMounted, onUnmounted } from 'vue';

export interface Props {
  title: String,
  ok_title: String,
  cancel_title: String,
  state: Number,
};
const props = defineProps<Props>();

const iProps = reactive({
  height: 0,
  rows: ['']
});

const scrollarea = ref(null);
const test = info => {
  if(iProps.height===info.verticalSize) return;
  iProps.height=info.verticalSize;
  scrollarea.value.setScrollPercentage("vertical",100);
};

defineEmits([
  ...useDialogPluginComponent.emits
]);

const processGitStream = async row=>{
  if(props.state===1) return;
  const last_row = iProps.rows[iProps.rows.length-1];
  let replace = false;
  for(let p of [
    'Receiving objects:',
    'Resolving deltas:',
    'Enumerating objects:',
    'Counting objects:',
    'Compressing objects:',
    'Writing objects:',
  ])
    if(last_row.includes(p) && row.includes(p))
      replace = true;

  if(replace)
    iProps.rows[iProps.rows.length-1] = row;
  else
    iProps.rows.push(row);
};

onMounted(   ()=>{
  iProps.rows = [''];
  window.ipc.on('GitService.MSG', processGitStream);
});
onUnmounted( ()=>window.ipc.off('GitService.MSG', processGitStream) );

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:55em;">
      <q-card-section>
        <div class="text-h6">{{props.title}}</div>
      </q-card-section>

      <q-card-section>
        <q-scroll-area ref='scrollarea' style="height: 200px;" @scroll='test' class='bg-grey-3 rounded-borders q-pa-md text-body1'>
          <div v-for="row in iProps.rows" style="white-space: nowrap;">
            <div v-if='row.split(": ").length>=2'><b>{{row.split(': ').slice(0,-1).join(': ')}}: </b>{{row.split(': ').pop()}}</div>
            <div v-else>{{row}}</div>
          </div>
        </q-scroll-area>
      </q-card-section>

      <q-linear-progress :value='100' :indeterminate='props.state===0' color="secondary" class="q-mt-sm" track-color="grey-3" />

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <q-btn color="secondary" :loading='props.state===0' :disabled='props.state===0 || (props.state===2 && props.cancel_title)' :label="props.ok_title" @click="onDialogOK" type='submit' class='text-weight-bold'/>
        <q-btn v-if='props.cancel_title' color="secondary" :disabled='props.state===0' :label="props.cancel_title" @click="onDialogCancel" type='submit' class='text-weight-bold'/>
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
