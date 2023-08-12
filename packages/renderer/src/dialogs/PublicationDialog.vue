<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';
import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';

import {Publication} from '../../../../dist/ARCC/ISA/ISA/JsonTypes/Publication.js';

const props = defineProps<{config?:Object}>();
const iProps = reactive({
  form: [[]],
  valid: true,
  mode: 'Add',
  publication: new Publication()
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  iProps.valid = iProps.publication.DOI || iProps.publication.PubMedID || iProps.publication.Title;
  if(!iProps.valid)
    return;

  onDialogOK(iProps.publication);
};

const init = async ()=>{
  iProps.valid = true;
  iProps.mode = props.config ? 'Edit' : 'Add';

  if(props.config){
    iProps.publication.PubMedID = props.config.PubMedID;
    iProps.publication.DOI = props.config.DOI;
    iProps.publication.Authors = props.config.Authors;
    iProps.publication.Title = props.config.Title;
    iProps.publication.Status = props.config.Status;
  }

  iProps.form = [
    [
      Property( iProps.publication, 'DOI'),
      Property( iProps.publication, 'PubMedID' ),
    ],
    [ Property( iProps.publication, 'Title' ) ],
    [ Property(iProps.publication, 'Authors' ) ],
    [ Property(iProps.publication, 'Status', {type:'select',options:['Published', 'Submitted', 'In Preparation']} ) ],
  ];
};
onMounted( init );

const autoComplete = async ()=>{
  console.log('xxx');
}

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:35em;">
        <q-card-section>
          <div class="text-h6">{{iProps.mode}} Publication</div>
        </q-card-section>

        <q-card-section>
          <div class='row' v-for="(row,i) in iProps.form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property="property"></FormInput>
            </div>
          </div>

          <div style="min-height:3.5em;margin:1em 1em -1em 1em;">
            <q-banner rounded inline-actions class="bg-red-10 text-white" v-if='!iProps.valid' dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <b>DOI, PubMed ID, or Title Required.</b>
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="teal" icon='bookmark_add' :label="`${iProps.mode==='Edit'?'Update':'Add'} Publication`" type='submit' class='text-weight-bold' />
          <q-btn color="teal" icon='find_replace' label="Find" @click="autoComplete" class='text-weight-bold' />
          <q-btn color="teal" label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>

      </q-card>

    </q-dialog>
  </q-form>
</template>
