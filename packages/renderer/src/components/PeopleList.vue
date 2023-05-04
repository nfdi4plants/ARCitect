<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import List from '../components/List.vue';

import PersonDialog from '../dialogs/PersonDialog.vue';
import ArcCommanderService from '../ArcCommanderService.ts';
import appProperties from '../AppProperties.ts';
import { useQuasar } from 'quasar'
const $q = useQuasar();

export interface Props {
  items: Object[],
  group: String,
  target: String
};
const props = withDefaults(defineProps<Props>(), {
  items: ()=>[],
  group: '',
  target: 'i'
});

const add = async item => {
  const args = [props.target,`person`,'register'];
  for(const p in item.model){
    if(!item.model[p])
      continue;
    args.push(`--${p.toLowerCase()}`);
    args.push(item.model[p].value);
  }

  if(props.target==='s'){
    args.push(`--studyidentifier`);
    args.push(appProperties.active_study);
  }

  await ArcCommanderService.run({
      args: args,
      title: 'Registering Person',
      silent: true
    },
    true
  );
};

const remove = async (person,skipUpdate) => {
  const args = [props.target,'person','unregister','-f',person.firstName,'-l',person.lastName];
  if(props.target==='s'){
    args.push(`--studyidentifier`);
    args.push(appProperties.active_study);
  }
  await ArcCommanderService.run({
      args: args,
      title: 'Unregistering Person',
      silent: true
    },
    !skipUpdate
  );
};

const showDialog = async person_o => {
  $q.dialog({
    component: PersonDialog,
    componentProps: person_o ? {config: person_o} : {}
  }).onOk( async person_n => {
    if(person_o)
      await remove(person_o,true);
    await add(person_n);
  });
}

</script>

<template>
  <ViewItem
    icon='groups'
    label='People'
    caption='Authors and Collaborators'
    :group='props.group'
  >
    <List
      :items='props.items'
      name= 'Person'
      :label='item => `${item.firstName} ${item.lastName}`'
      :caption='item => item.comments && item.comments.length>0 && item.comments[0].hasOwnProperty("value") ? "ORCID: "+item.comments[0].value : "Missing ORCID"'
      :avatar= 'item => item.lastName[0].toUpperCase()'
      icon_add= 'person_add_alt_1'
      icon_remove= 'person_remove'

      @add='showDialog'
      @edit='showDialog'
      @remove='remove'
    ></List>
  </ViewItem>
</template>
