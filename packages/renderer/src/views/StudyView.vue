<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import StudyForm from '../components/StudyForm.vue';
import PeopleList from '../components/PeopleList.vue';
import PublicationsList from '../components/PublicationsList.vue';

import arcProperties from '../ArcProperties.ts';
import appProperties from '../AppProperties.ts';

const props = reactive({
  people: [],
  publications: [],
});

const studyForm = ref(null);

const init = async ()=>{

  let study = null;
  for(let s of arcProperties.studies)
    if(s.identifier===appProperties.active_study)
      study = s;

  if(!study)
    return console.error('Unable to find study:',[appProperties.active_study,arcProperties.studies]);

  studyForm.value.init(study);
  props.people = study.people ? study.people.filter(i=>i.lastName && i.firstName) : [];
  props.publications = study.publications || [];
};

onMounted( init );
watch( arcProperties, init );
watch( ()=>appProperties.active_study, init );

</script>

<template>
  <q-list>
    <StudyForm ref='studyForm' group="igroup" defaultOpened></StudyForm>
    <q-separator />
    <PeopleList :items='props.people' target='s' group="igroup"></PeopleList>
    <q-separator />
    <PublicationsList :items='props.publications' target='s' group="igroup"></PublicationsList>
  </q-list>
</template>
