<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';

import AppProperties from '../AppProperties.ts';

export interface Props {
  title: String,
  value: String,
  options: Array<String>,
  label: String,
  ok_label: String,
  cancel_label: String
};
const props = withDefaults(defineProps<Props>(), {
  title: 'TODO',
  value: '',
  options: [],
  label: '',
  ok_label: 'OK',
  cancel_label: 'Cancel'
});

const iProps = reactive({
  value: ''
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

onMounted(()=>iProps.value=props.value);

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:45em;">
      <q-card-section>
        <div class="text-h6">{{props.title}}</div>
      </q-card-section>

      <q-card-section>
        <q-select class='' v-model="iProps.value" :options="props.options" :label="props.label" dense/>
      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <q-btn color="secondary" :label="props.ok_label" @click='onDialogOK(iProps.value)' class='text-weight-bold' />
        <q-btn color="secondary" :label="props.cancel_label" @click='onDialogCancel' class='text-weight-bold'/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
