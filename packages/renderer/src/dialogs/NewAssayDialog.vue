<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch, ref } from 'vue';
import ArcControlService from '../ArcControlService.ts';
import {ArcStudy} from "@nfdi4plants/arctrl"
import {checkValidCharacters} from '@nfdi4plants/arctrl/Core/Helper/Identifier.js'
import * as internal from 'stream';

export type NewAssayInformation = {
  assayIdentifier: string
}

const iProps : {
  valid: boolean,
  assay_identifier: string
  existingAssays: string [],
} = reactive({
  valid: true,
  assay_identifier: '',
  // This is used to disallow adding same assay again
  existingAssays: [],
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  const newAssayInformation : NewAssayInformation = {assayIdentifier: iProps.assay_identifier} 
  onDialogOK(newAssayInformation);
};

const init = async ()=>{
  let arcAssays = ArcControlService.props.arc.ISA.AssayIdentifiers
  iProps.existingAssays = arcAssays
  iProps.assay_identifier = '';
};

onMounted(init);

function hasValidCharacters (identifier: string) {
  try {
    checkValidCharacters(identifier) 
    return true;
  } catch (err) {
    return false;
  }
} 

function assayIsNew(newAssayIdentifer:string) {
  return iProps.existingAssays.includes(newAssayIdentifer) ? false : true
}
</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">Add Assay</div>
        </q-card-section>

        <q-card-section>
          <div class='row' >
            <div class='col' >
              <q-input
                filled
                style="margin-bottom: 1rem;"
                v-model="iProps.assay_identifier"
                label="Add Assay"
                :rules="[
                  val => val !== '' || `Assay identifier must not be empty`,
                  val => hasValidCharacters(val) || `Invalid Identifier for: '${iProps.assay_identifier}': New identifier contains forbidden characters! Allowed characters are: letters, digits, underscore (_), dash (-) and whitespace ( ).`,
                  val => assayIsNew(val) || `Assay identifier: '${val}' is already set for this ARC.`
                ]"
              />
            </div>
          </div>
          <div style="min-height:3.5em;margin:1em 1em -1em 1em;">
            <q-banner rounded inline-actions class="bg-red-10 text-white" v-if='!iProps.valid' dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="secondary" icon='add_box' label="Add Assay" type='submit' class='text-weight-bold' />
          <q-btn color="secondary" label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>

<style>
.q-item.q-router-link--active, .q-item--active {
  color: var(--q-secondary) !important
}
</style>