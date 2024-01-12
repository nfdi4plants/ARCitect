<script lang="ts" setup>
import ViewItem from '../components/ViewItem.vue';
import a_input from './a_input.vue';
import a_date from './a_date.vue';

export interface Props {
  group: String,
  investigation: Object
};
const props = defineProps<Props>();

</script>

<template>
  <ViewItem
    icon="biotech"
    label="Investigation"
    caption="General Meta Data of the Investigation"
    :group="props.group"
  >
    <q-card flat>
      <q-card-section>
        <div class='row'>
          <div class='col'>
            <a_input v-model='props.investigation.Identifier' label='Identifier' readonly/>
          </div>
          <div class='col'>
            <a_input v-model='props.investigation.Titel' label='Title'/>
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <a_input v-model='props.investigation.Description' label='Description' type='textarea' autogrow/>
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <a_date v-model='props.investigation.SubmissionDate' label='Submission Date'/>
          </div>
          <div class='col'>
            <a_date v-model='props.investigation.PublicReleaseDate' label='Public Release Date'/>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </ViewItem>
</template>
