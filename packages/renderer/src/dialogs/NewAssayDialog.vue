<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch, ref } from 'vue';

import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';
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
  errorMsgs: string [],
  assay_identifier: string
  study_identifier: string [],
  studies: string []
  existingStudies: string [],
  form: any []
} = reactive({
  valid: true,
  errorMsgs: [],
  assay_identifier: '',
  // This value contains the selected study identifiers, for which the new assay will be registered
  study_identifier: [],
  // This value contains the currently available select options 
  // (this can differ from existingStudies if new options are added)
  studies: [],
  // This value always contains only the existing study identifiers from ARC model
  existingStudies: [],
  form: []
});

let filterOptions = ref(iProps.studies)

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  if (iProps.assay_identifier === ``) {
    iProps.valid = false;
    iProps.errorMsgs.push('Assay Identifier cannot be empty!')
  }
  if (!iProps.valid) return;
  const newAssayInformation : NewAssayInformation = {assayIdentifier: iProps.assay_identifier, studyIdentifier: iProps.study_identifier} 
  onDialogOK(newAssayInformation);
};

const init = async ()=>{
  let arcStudies = ArcControlService.props.arc.ISA.Studies.map((s: ArcStudy) => s.Identifier).sort();
  iProps.studies = [...arcStudies];
  iProps.existingStudies = [...arcStudies];
  iProps.assay_identifier = '';
  iProps.study_identifier = [];
  iProps.form = [
    [Property( iProps, 'assay_identifier', {label:'Assay Identifier'})],
  ];
};

onMounted(init);

function resetErrors() {
  iProps.valid = true;
  iProps.errorMsgs = [];
}

watch( () => [iProps.study_identifier, iProps.assay_identifier], () =>{
  resetErrors();
  for (let study of iProps.study_identifier) 
    try {
      if (study !== '') checkValidCharacters(study)
    } catch (error) {
      iProps.valid = false;
      iProps.errorMsgs.push(`Invalid Identifier for: "${study}": ${error}`)
    }
  try {
    if (iProps.assay_identifier !== '') checkValidCharacters(iProps.assay_identifier)
  } catch (error) {
    iProps.valid = false;
    iProps.errorMsgs.push(`Invalid Identifier for: "${iProps.assay_identifier}": ${error}`)
  }
});

function filterStudyIdentifiers (val, update) {
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
          <div class='row' v-for="(row,i) in iProps.form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property='property'></FormInput>
            </div>
          </div>
          <div class='row'>
            <div class='col' >
              <q-select
                filled
                label="Study Identifiers"
                v-model="iProps.study_identifier"
                style="margin:0 0.5em -0.5em 0.5em"
                bg-color="grey-3"
                use-input
                use-chips
                multiple
                input-debounce="0"
                new-value-mode="add-unique"
                :options="filterOptions"
                hint="You can add new studies from here."
                @new-value="createNewStudyIdentifier"
                @filter="filterStudyIdentifiers"
                @remove="clearStudyIdentifier"
              />
            </div>
          </div>
          <div style="min-height:3.5em;margin:1em 1em -1em 1em;">
            <q-banner rounded inline-actions class="bg-red-10 text-white" v-if='!iProps.valid' dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <ul>
                <li v-for="error in iProps.errorMsgs">{{error}}</li>
              </ul>
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