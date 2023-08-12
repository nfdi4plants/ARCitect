<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import InvestigationForm from '../components/InvestigationForm.vue';
import PeopleList from '../components/PeopleList.vue';
import PublicationsList from '../components/PublicationsList.vue';

import ArcControlService from '../ArcControlService.ts';

const props = reactive({
  people: [],
  publications: [],
});

const init = async()=>{
  props.people = ArcControlService.props.arc.ISA.Contacts;
  props.publications = ArcControlService.props.arc.ISA.Publications;
};

onMounted(init)

</script>

<template>
  <q-list>
    <InvestigationForm group="igroup" defaultOpened></InvestigationForm>
    <q-separator />
    <PeopleList :items='props.people' group="igroup"></PeopleList>
    <q-separator />
    <PublicationsList :items='props.publications' group="igroup"></PublicationsList>
  </q-list>
</template>
