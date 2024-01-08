<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';

export interface Props {
  error: String
};
const props = defineProps<Props>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

</script>

<template>

  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Error</div>
      </q-card-section>

      <q-card-section class="row no-wrap items-center" style="padding:0 0.2em;">
        <q-icon class='col-grow' name="warning" color="grey-7" size="2em" style="padding:0 0.25em"/>
        <div class="col">{{props.error}}</div>
      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <q-btn color="secondary" label="Ok" @click='onDialogOK' class='text-weight-bold'/>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>
