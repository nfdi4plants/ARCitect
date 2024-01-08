<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';

export interface Props {
  msg: String,
  ok_text: String,
  ok_icon: String,
  ok_color: String,
  cancel_text: String,
  cancel_icon: String,
  cancel_color: String
};
const props = withDefaults(defineProps<Props>(), {
  msg: '',
  ok_text: 'OK',
  ok_icon: 'check_circle',
  ok_color: 'secondary',
  cancel_text: 'Cancel',
  cancel_icon: 'cancel',
  cancel_color: 'secondary'
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

</script>

<template>

  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Confirm</div>
      </q-card-section>

      <q-card-section class="row no-wrap items-center" style="padding:0 0.2em;">
        <q-icon class='col-grow' name="warning" color="grey-7" size="2em" style="padding:0 0.25em"/>
        <div class="col" v-html='props.msg'></div>
      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <q-btn :color='props.ok_color' :icon='props.ok_icon' :label='props.ok_text' @click='onDialogOK' class='text-weight-bold'/>
        <q-btn :color='props.cancel_color' :icon='props.cancel_icon' :label='props.cancel_text' @click='onDialogCancel' class='text-weight-bold'/>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>
