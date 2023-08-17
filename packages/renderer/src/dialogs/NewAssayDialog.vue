<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch } from 'vue';

import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';
import ArcControlService from '../ArcControlService.ts';

const iProps = reactive({
  valid: true,
  assay_identifier: '',
  study_identifier: '',
  studies: [],
  form: []
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  iProps.valid = iProps.assay_identifier && iProps.study_identifier;
  if(!iProps.valid)
    return;

  onDialogOK([iProps.assay_identifier,iProps.study_identifier]);
};

const init = async ()=>{
  iProps.studies = ArcControlService.props.arc.ISA.Studies.map(s => s.Identifier).sort();
  iProps.studies.push('Create New Study')
  iProps.assay_identifier = '';
  iProps.study_identifier = 'Create New Study';

  iProps.form = [
    [Property( iProps, 'assay_identifier', {label:'Assay Identifier'})],
    [Property( iProps, 'study_identifier', {label:'Study Identifier',type:'select', options:iProps.studies})]
  ];
};

onMounted(init);

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
