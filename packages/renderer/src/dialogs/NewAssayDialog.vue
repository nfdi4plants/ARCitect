<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch } from 'vue';

import FormInput from '../components/FormInput.vue';
import Assay from '../interfaces/Assay.ts';
const item = new Assay();
item.model.assayIdentifier.readonly = false;
const newStudyString = 'Create New Study';

const form = [
  [item.model.assayIdentifier],
  [item.model.studies],
];

const iProps = reactive({
  valid: true
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  iProps.valid = item.model.assayIdentifier.value && item.model.studies.value;
  if(!iProps.valid)
    return;

  onDialogOK(item);
};

onMounted(async ()=>{
  item.init({
    assayIdentifier: '',
    studies: [newStudyString]
  });
});

watch( ()=>item.model.studies.value, ()=>{
  if(item.model.studies.value.length<1)
    item.model.studies.value = [newStudyString];
  else if(item.model.studies.value.length>1 && item.model.studies.value.includes(newStudyString))
    item.model.studies.value = item.model.studies.value.filter(i=>i!=newStudyString);
});

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
          <div class='row' v-for="(row,i) in form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property='property'></FormInput>
            </div>
          </div>

          <div style="min-height:3.5em;margin:1em 1em -1em 1em;">
            <q-banner rounded inline-actions class="bg-red-10 text-white" v-if='!iProps.valid' dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <b>Identifier and Study are Required.</b>
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
