<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch, ref } from 'vue';

import ArcControlService from '../ArcControlService';
import {checkValidCharacters} from '@nfdi4plants/arctrl/Core/Helper/Identifier.js'


const iProps : {
  valid: boolean,
  study_identifier: string,
  existingStudies: string [],
} = reactive({
  valid: true,
  study_identifier: '',
  existingStudies: [],
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  if (iProps.study_identifier === ``) {
    iProps.valid = false;
  }
  if (!iProps.valid) return;
  onDialogOK(iProps.study_identifier);
};

const init = async ()=>{
  let arcStudies = ArcControlService.props.arc.ISA.StudyIdentifiers.sort()
  iProps.existingStudies = arcStudies
  iProps.study_identifier = '';
};

onMounted(init);

function hasValidCharacters (identifier: string) {
  try {
    checkValidCharacters(identifier)
    return true;
  } catch (err) {
    console.error(err)
    return false;
  }
}

function studyIsNew(newStudyIdentifer:string) {
  return iProps.existingStudies.includes(newStudyIdentifer) ? false : true
}


</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">Add Study</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            style="margin-bottom: 1rem;"
            v-model="iProps.study_identifier"
            label="Add Study"
            :rules="[
              val => val !== '' || `Study identifier must not be empty`,
              val => hasValidCharacters(val) || `Invalid Identifier for: '${iProps.study_identifier}': New identifier contains forbidden characters! Allowed characters are: letters, digits, underscore (_), dash (-) and whitespace ( ).`,
              val => studyIsNew(val) || `Study identifier: '${val}' is already set for this ARC.`
            ]"
            lazy-rules
          />
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="secondary" icon='add_box' label="Add Study" type='submit' class='text-weight-bold' />
          <q-btn color="secondary" label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>