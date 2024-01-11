<script lang="ts" setup>
import ViewItem from '../components/ViewItem.vue';
import a_input from './a_input.vue';
import a_date from './a_date.vue';

import ArcControlService from '../ArcControlService.ts';
import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

export interface Props {
  group: String,
  study: Object
};
const props = defineProps<Props>();

const deleteStudy = async ()=>{
  $q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      msg: `Are you sure you want to delete study <b>'${props.study.Identifier}'</b>?`,
      ok_text: 'Delete',
      ok_icon: 'delete',
      ok_color: 'red-9',
      cancel_text: 'Cancel',
      cancel_icon: 'cancel',
      cancel_color: 'secondary'
    }
  }).onOk( async () => {
    ArcControlService.deleteStudy(props.study.Identifier);
  });
};

</script>

<template>
  <ViewItem
    icon="biotech"
    label="Study"
    caption="General Meta Data of the Study"
    :group="props.group"
  >
    <q-card flat>
      <q-card-section>
        <div class='row'>
          <div class='col'>
            <a_input v-model='props.study.Identifier' label='Identifier' readonly/>
          </div>
          <div class='col'>
            <a_input v-model='props.study.Titel' label='Title'/>
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <a_input v-model='props.study.Description' label='Description' type='textarea' autogrow/>
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <a_date v-model='props.study.SubmissionDate' label='Submission Date'/>
          </div>
          <div class='col'>
            <a_date v-model='props.study.PublicReleaseDate' label='Public Release Date'/>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align='right' style="padding:2.1em;">
        <q-btn label="Delete" icon='delete' color="red-9" @click='deleteStudy'/>
      </q-card-actions>
    </q-card>
  </ViewItem>
</template>
