<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch, ref } from 'vue';
import ArcControlService from '../ArcControlService.ts';
import {ArcStudy} from "@nfdi4plants/arctrl"
import {checkValidCharacters} from '@nfdi4plants/arctrl/ISA/ISA/Identifier.js'
import * as internal from 'stream';

export type NewAssayInformation = {
  assayIdentifier: string
  studyIdentifier: string [] | null
}

const iProps : {
  valid: boolean,
  temp_studyInput: string,
  assay_identifier: string
  study_identifier: string [],
  studies: string [],
  existingAssays: string [],
  existingStudies: string [],
} = reactive({
  valid: true,
  // Study multiple select with useChips requires "ENTER" to accept new values. This lead to confusion. Here we try to store any input given by the user.
  // 👀 The logic is: If temp_studyInput !== '' && temp_studyInput passes validation then add temp_studyInput as identifer.
  temp_studyInput: '',
  assay_identifier: '',
  // This value contains the selected study identifiers, for which the new assay will be registered
  study_identifier: [],
  // This value contains the currently available select options 
  // (this can differ from existingStudies if new options are added)
  studies: [],
  // This is used to disallow adding same assay again
  existingAssays: [],
  // This value always contains only the existing study identifiers from ARC model
  existingStudies: [],
});

// This binds to q-select quasar component
const studySelect = ref(null)

let filterOptions = ref(iProps.studies)

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  const newAssayInformation : NewAssayInformation = {assayIdentifier: iProps.assay_identifier, studyIdentifier: iProps.study_identifier} 
  onDialogOK(newAssayInformation);
};

const init = async ()=>{
  let arcStudies = ArcControlService.props.arc.ISA.StudyIdentifiers.sort()
  let arcAssays = ArcControlService.props.arc.ISA.AssayIdentifiers
  iProps.studies = [...arcStudies];
  iProps.existingStudies = [...arcStudies];
  iProps.existingAssays = arcAssays
  iProps.assay_identifier = '';
  iProps.study_identifier = [];
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

function hasValidCharactersStudies (identifiers: string []) {
  if (identifiers.length === 0) return true;
  try {
    for (const identifier of identifiers) {
      checkValidCharacters(identifier) 
    }
    return true;
  } catch (err) {
    return false;
  }
} 

function assayIsNew(newAssayIdentifer:string) {
  return iProps.existingAssays.includes(newAssayIdentifer) ? false : true
}

function filterStudyIdentifiers (val: string, update) {
  update(() => {
    if (val === '') {
      filterOptions.value = iProps.studies
    }
    else {
      const needle = val.toLowerCase()
      filterOptions.value = iProps.studies.filter(
        v => v.toLowerCase().indexOf(needle) > -1
      )
    }
  })
}

function createNewStudyIdentifier (val, done) {
  if (val.length > 0) {
    if (!iProps.studies.includes(val)) {
      iProps.studies.push(val)
    }
    done(val, 'toggle')
  }
}

function clearStudyIdentifier (val: {index: number, value: string}) {
  let contains = !iProps.existingStudies.includes(val.value)
  if (contains) {
    let index = iProps.studies.indexOf(val.value);
    // console.log("cleared non existing study at index: ", index);
    iProps.studies.splice(index, 1)
  }
  return;
}

function onBlurAddTemp_StudyInput() {
  let v = iProps.temp_studyInput
  if (v === '') return;
  if (!hasValidCharacters(v)) return;
  iProps.study_identifier.push(iProps.temp_studyInput);
  // only add to studies if it did not exist beforehand
  if (!iProps.studies.includes(v)) {
    iProps.studies.push(iProps.temp_studyInput);
  }
}

function onChangeSetTemp_StudyInput(val: string) {
  iProps.temp_studyInput = val;
  if (!studySelect.value) return;
  // quasar q-select method
  studySelect.value.validate(val);
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
          <div class='row'>
            <div class='col' >
              <q-select
                ref="studySelect"
                filled
                label="Study Identifiers"
                v-model="iProps.study_identifier"
                bg-color="grey-3"
                use-input
                use-chips
                multiple
                input-debounce="0"
                new-value-mode="add-unique"
                :options="filterOptions"
                hint="Add or create studies. Verify with <Enter>."
                :rules="[
                  val => hasValidCharactersStudies(val) || `New identifier contains forbidden characters! Allowed characters are: letters, digits, underscore (_), dash (-) and whitespace ( ).`,
                ]"
                @new-value="createNewStudyIdentifier"
                @filter="filterStudyIdentifiers"
                @remove="clearStudyIdentifier"
                @input-value="onChangeSetTemp_StudyInput"
                @blur="onBlurAddTemp_StudyInput"
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