<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import StudyForm from '../components/StudyForm.vue';
import PeopleList from '../components/PeopleList.vue';
import PublicationsList from '../components/PublicationsList.vue';
import SwateForm from '../components/SwateForm.vue';

import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

const iProps = reactive({
  study: {},
  people: [],
  publications: [],
});

const init = async ()=>{
  if(!ArcControlService.props.arc || !AppProperties.active_study) return;

  const study = ArcControlService.props.arc.ISA.TryGetStudy(AppProperties.active_study);
  if (!study) return;
  iProps.study = study
  iProps.people = study.Contacts;
  iProps.publications = study.Publications;
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
    <q-separator />
    <SwateForm :owner='iProps.study' group='sgroup'></SwateForm>
  </q-list>
</template>
