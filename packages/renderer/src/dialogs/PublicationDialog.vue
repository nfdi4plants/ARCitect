<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';

import a_input from '../components/a_input.vue';
import a_term from '../components/a_term.vue';
import a_btn from '../components/a_btn.vue';

import {Publication} from '@nfdi4plants/arctrl/ISA/ISA/JsonTypes/Publication.js';
import {OntologyAnnotation} from '@nfdi4plants/arctrl/ISA/ISA/JsonTypes/OntologyAnnotation.js';

const props = defineProps<{config?:Object}>();
const iProps = reactive({
  error: '',
  mode: 'Add',
  publication: null,
  loading: false
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  iProps.error = '';
  if(!iProps.publication.DOI && !iProps.publication.PubMedID && !iProps.publication.Title)
    return iProps.error = 'DOI, PubMed ID, or Title Required.';

  onDialogOK(iProps.publication);
};

const init = async ()=>{
  iProps.error = '';
  iProps.mode = props.config ? 'Edit' : 'Add';

  if(props.config)
    iProps.publication = props.config.Copy();
  else
    iProps.publication = new Publication();
};
onMounted( init );

const autoComplete = async ()=>{
  iProps.error = '';

  if(iProps.publication.DOI){
    iProps.loading = true;
    const pub = await window.ipc.invoke('DataHubService.getPublicationByDOI', iProps.publication.DOI);
    iProps.loading = false;
    if(!pub) return iProps.error = 'Unable to find Publication.';

    iProps.publication.Title = pub.message.title.join(', ');
    iProps.publication.Authors = pub.message.author.map(a=>a.given+' '+a.family).join(', ');
  } else if(iProps.publication.PubMedID) {
    iProps.loading = true;
    const pub = await window.ipc.invoke('DataHubService.getPublicationByPubMedID', iProps.publication.PubMedID);
    iProps.loading = false;
    console.log(pub)
    if(!pub || pub==[]) return iProps.error = 'Unable to find Publication.';

    iProps.publication.Title = pub.title;
    iProps.publication.Authors = pub.author.map(a=>a.given+' '+a.family).join(', ');
    iProps.publication.DOI = pub.DOI || '';
  } else {
    return iProps.error = 'Auto complete requires DOI or PubMedID.';
  }

  iProps.publication.Status = OntologyAnnotation.fromString('published','EFO','EFO:0001796');
}

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:40em;">
        <q-card-section>
          <div class="text-h6">{{iProps.mode}} Publication</div>
        </q-card-section>

        <q-card-section>
          <div class='row'>
            <div class='col'><a_input label='DOI' v-model='iProps.publication.DOI' /></div>
            <div class='col'><a_input label='PubMedID' v-model='iProps.publication.PubMedID' /></div>
          </div>
          <div class='row'>
            <div class='col'><a_input label='Title' v-model='iProps.publication.Title' type='textarea' autogrow /></div>
          </div>
          <div class='row'>
            <div class='col'><a_input label='Authors' v-model='iProps.publication.Authors'  type='textarea' autogrow /></div>
          </div>
          <div class='row'>
            <div class='col'><a_term label='Status' v-model='iProps.publication.Status' term_name='publication status' term_accession='EFO:0001742' /></div>
          </div>

          <div style="min-height:3.5em;margin:1em 1em -1em 1em;">
            <q-banner rounded inline-actions class="bg-red-10 text-white" v-if='iProps.error' dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <b>{{iProps.error}}</b>
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <a_btn icon='bookmark_add' :label="`${iProps.mode==='Edit'?'Update':'Add'} Publication`" type='submit'/>
          <a_btn icon='find_replace' label="Auto Complete" @click="autoComplete" :loading='iProps.loading'/>
          <a_btn label="Cancel" @click="onDialogCancel" />
        </q-card-actions>

      </q-card>

    </q-dialog>
  </q-form>
</template>
