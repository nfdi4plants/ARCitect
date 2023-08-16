<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import StudyForm from '../components/StudyForm.vue';
import PeopleList from '../components/PeopleList.vue';
import PublicationsList from '../components/PublicationsList.vue';

import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

const iProps = reactive({
  study: {},
  people: [],
  publications: [],
});

const init = async ()=>{
  if(!ArcControlService.props.arc) return;

  iProps.study = ArcControlService.props.arc.ISA.GetStudy(AppProperties.active_study);
  iProps.people = iProps.study.Contacts;
  iProps.publications = iProps.study.Publications;
};

onMounted( init );
watch( ()=>ArcControlService.props.arc, init );
watch( ()=>AppProperties.active_study, init );

</script>

<template>
  <q-list>
    <StudyForm :study='iProps.study' group='sgroup' defaultOpened></StudyForm>
    <q-separator />
    <PeopleList :items='iProps.people' group='sgroup'></PeopleList>
    <q-separator />
    <PublicationsList :items='iProps.publications' group='sgroup'></PublicationsList>
  </q-list>
</template>
