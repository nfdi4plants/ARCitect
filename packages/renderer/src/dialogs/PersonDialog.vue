<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';
import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';

import {Person} from '../../../../lib/ARCC/ISA/ISA/JsonTypes/Person.js';

const props = defineProps<{config?:Object}>();
const iProps = reactive({
  form: [[]],
  valid: true,
  mode: 'Add',
  person: new Person()
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  iProps.valid = iProps.person.FirstName && iProps.person.LastName;
  if(!iProps.valid)
    return;

  onDialogOK(iProps.person);
};

const init = async ()=>{
  iProps.valid = true;
  iProps.mode = props.config ? 'Edit' : 'Add';

  if(props.config)
    iProps.person = props.config.Copy();

  iProps.form = [
    [
      Property( iProps.person, 'ORCID' ),
    ],
    [
      Property( iProps.person, 'FirstName'),
      Property( iProps.person, 'LastName' ),
    ],
    [
      Property( iProps.person, 'EMail' ),
    ],
    [
      Property(iProps.person, 'Phone' ),
      Property(iProps.person, 'Fax' ),
    ],
    [
      Property(iProps.person, 'Address' ),
    ],
    [
      Property(iProps.person, 'Affiliation' ),
    ],
  ];
};
onMounted( init );

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">{{iProps.mode}} Person</div>
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
              <b>Full Name Required.</b>
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="teal" :icon='iProps.mode==="Edit" ? "edit" : "person_add_alt_1"' :label="`${iProps.mode==='Edit'?'Update':'Add'} Person`" type='submit' class='text-weight-bold' />
          <q-btn color="teal" label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>

      </q-card>

    </q-dialog>
  </q-form>
</template>
