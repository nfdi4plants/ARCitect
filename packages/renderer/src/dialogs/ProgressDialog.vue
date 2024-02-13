<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';

import a_btn from '../components/a_btn.vue';

export interface Props {
  items: Array,
  title: String,
  ok_title: String,
  cancel_title: String,
  error: String,
  succ: String
};
const props = defineProps<Props>();

const iProps = reactive({
  value: ''
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:45em;">
      <q-card-section>
        <div class="text-h6">{{props.title}}</div>
      </q-card-section>

      <q-card-section>
        <q-list dense>
          <q-item v-for='item in props.items' class='progress_item'>
            <q-item-section avatar style="min-width:2em;">
              <q-circular-progress
                :indeterminate='item[1]<1'
                rounded
                size="1.5em"
                :thickness="0.7"
                track-color="grey-3"
                :color="item[1]===2 ? 'red-8' : item[1]===1 ? 'green' : 'primary'"
                class="q-ma-md"
                :value='100'
                style='margin:0 0 0 0.5em;'
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{item[0]}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <a_btn v-if='props.error' color="red-10" icon='warning' :label="iProps.error" no-caps style="margin-right:auto"/>
        <a_btn v-if='props.succ' icon='check_circle' :label="props.succ" no-caps style="margin-right:auto"/>
        <a_btn :label="props.ok_title" :loading='props.items[props.items.length-1][1]!==1' @click="onDialogOK" type='submit' :disabled='!props.error && props.items[props.items.length-1][1]!==1'/>
        <a_btn v-if='props.cancel_title' :label="props.cancel_title" @click="onDialogCancel" :disabled='props.items[props.items.length-1][1]<1'/>
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
