<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import a_btn from '../components/a_btn.vue';

export interface Props {
  title: String,
  content: String
};
const props = defineProps<Props>();

const iProps = reactive({
  conflicts: [['','']],
  conflict_idx: 0,
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const parseMergeConflicts = content => {
  const conflictPairs = [];  // This will store the pairs of conflicts
  const lines = content.split('\n');  // Split document into lines

  let myVersion = [];
  let otherVersion = [];
  let inConflict = false;
  let readingMyVersion = false;
  let readingOtherVersion = false;

  lines.forEach(line => {
    if (line.startsWith('<<<<<<<')) {
      // Start of my version
      inConflict = true;
      readingMyVersion = true;
      myVersion = [];  // Reset my version
    } else if (line.startsWith('=======')) {
      // Switch to the other version
      readingMyVersion = false;
      readingOtherVersion = true;
      otherVersion = [];  // Reset other version
    } else if (line.startsWith('>>>>>>>')) {
      // End of conflict block
      readingOtherVersion = false;
      inConflict = false;
      // Add the conflict pair to the list
      conflictPairs.push([myVersion.join('<br>').replaceAll(' ','&nbsp;'), otherVersion.join('<br>').replaceAll(' ','&nbsp;')]);
    } else if (inConflict && readingMyVersion) {
      // Add lines to my version while in conflict
      myVersion.push(line);
    } else if (inConflict && readingOtherVersion) {
      // Add lines to the other version while in conflict
      otherVersion.push(line);
    }
  });

  return conflictPairs;
};

const finalize = keep_local => {
  const line_indices = [];
  const lines = props.content.split('\n');
  for(let i=0; i<lines.length; i++)
    if(lines[i].startsWith('<<<<<<<') || lines[i].startsWith('=======') || lines[i].startsWith('>>>>>>>')) line_indices.push(i);

  for(let i=line_indices.length-3; i>=0; i-=3)
    lines.splice(
      line_indices[i],
      line_indices[i+2]-line_indices[i]+1,
      (
        keep_local
          ? lines.slice(line_indices[i]+1,line_indices[i+1])
          : lines.slice(line_indices[i+1]+1,line_indices[i+2])
      ).join('\n')
    );

  onDialogOK(lines.join('\n'));
};

onMounted( ()=>{
  iProps.conflicts = parseMergeConflicts(props.content);
});
// onUnmounted();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:55em;">
      <q-card-section>
        <div class="text-h6">{{props.title}}</div>
      </q-card-section>

      <q-card-section>
        <q-banner class="bg-grey-3 text-black" rounded>
          Automatic merge is not possible bacause both versions changed the same values.
          Do you want to keep the local changes or remote changes?
          <template v-slot:avatar>
            <q-icon name="warning" color="grey-7" />
          </template>
        </q-banner>
      </q-card-section>

      <q-card-section>
        <table style="width:100%; text-align:center">
          <tbody>
            <tr>
              <td><b>Local</b></td>
              <td><b>Remote</b></td>
            </tr>
          </tbody>
        </table>

        <q-scroll-area style="height: 300px;" class='rounded-borders text-body1'>
          <div v-for="c in iProps.conflicts">
            <q-banner class="bg-grey-3 text-black q-ma-xs q-pa-none" rounded>
              <q-card-section horizontal style="width:100%">
                <q-card-section style="width:100%" class='q-pa-xs'>
                  <div v-html='c[0]'></div>
                </q-card-section>

                <q-separator vertical />

                <q-card-section style="width:100%" class='q-pa-xs'>
                  <div v-html='c[1]'></div>
                </q-card-section>
              </q-card-section>
            </q-banner>
          </div>
        </q-scroll-area>
      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <a_btn label='Keep Local' @click='()=>finalize(true)'/>
        <a_btn label='Keep Remote' @click='()=>finalize(false)'/>
        <a_btn label='Cancel' @click='onDialogCancel' icon='cancel'/>
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
