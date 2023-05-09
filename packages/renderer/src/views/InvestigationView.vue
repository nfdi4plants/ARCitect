<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import InvestigationForm from '../components/InvestigationForm.vue';
import PeopleList from '../components/PeopleList.vue';
import PublicationsList from '../components/PublicationsList.vue';

import arcProperties from '../ArcProperties.ts';

const props = reactive({
  people: [],
  publications: [],
});

const investigationForm = ref(null);

const init = async ()=>{
  investigationForm.value.init(arcProperties);
  props.people = arcProperties.people.filter(i=>i.lastName && i.firstName);
  props.publications = arcProperties.publications || [];
};

onMounted( init );
watch( arcProperties, init );

</script>

<template>
  <q-list>
    <InvestigationForm ref='investigationForm' group="igroup" defaultOpened></InvestigationForm>
    <q-separator />
    <PeopleList :items='props.people' target='i' group="igroup"></PeopleList>
    <q-separator />
    <PublicationsList :items='props.publications' target='i' group="igroup"></PublicationsList>
  </q-list>
</template>
