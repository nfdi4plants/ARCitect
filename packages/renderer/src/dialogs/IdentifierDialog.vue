<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch, ref } from 'vue';

import ArcControlService from '../ArcControlService';
import {checkValidCharacters} from '@nfdi4plants/arctrl/Core/Helper/Identifier.js'

export interface Props {
  label: string,
  existing_identifiers: string []
};
const props = defineProps<Props>();

const iProps : {
  identifier: string,
} = reactive({
  identifier: '',
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  if(!hasValidCharacters(iProps.identifier) || identifierExists(iProps.identifier)) return;
  onDialogOK(iProps.identifier);
};

const init = async ()=>{
  iProps.identifier = '';
};

onMounted(init);

function hasValidCharacters(identifier: string) {
  try {
    if(identifier.length<1) return false;
    if(identifier.startsWith(' ') || identifier.endsWith(' ')) return false;
    checkValidCharacters(identifier);
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

function identifierExists(identifier:string) {
  return props.existing_identifiers.includes(identifier) ? true : false;
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">{{props.label}}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            style="margin-bottom: 1rem;"
            v-model="iProps.identifier"
            :label="props.label"
            :rules="[
              val => hasValidCharacters(val) || `Invalid Identifier '${iProps.identifier}': Identifier can consist of letters, digits, underscore (_), dash (-) and whitespace ( ), but can not start and end with space.`,
              val => !identifierExists(val) || `Identifier: '${val}' is already set for this ARC.`
            ]"
            lazy-rules
          />
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="secondary" icon='add_box' :label="props.label" type='submit' class='text-weight-bold' />
          <q-btn color="secondary" label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>
