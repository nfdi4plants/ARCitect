<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import List from '../components/List.vue';

import PublicationDialog from '../dialogs/PublicationDialog.vue';
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
  const args = [props.target,`publication`,'register'];
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
      title: 'Registering Publication',
      silent: true
    },
    true
  );
};

const remove = async (publication,skipUpdate) => {
  if(!publication.doi)
    return console.error('arc commander can only delete publications by doi');

  const args = [props.target,'publication','unregister','--doi',publication.doi];
  if(props.target==='s'){
    args.push(`--studyidentifier`);
    args.push(appProperties.active_study);
  }
  await ArcCommanderService.run({
      args: args,
      title: 'Unregistering Publication',
      silent: true
    },
    !skipUpdate
  );
};

const showDialog = async o => {
  $q.dialog({
    component: PublicationDialog,
    componentProps: o ? {config: o} : {}
  }).onOk( async n => {
    if(o)
      await remove(o,true);
    await add(n);
  });
}

</script>

<template>
  <ViewItem
    icon='menu_book'
    label='Publications'
    caption='Papers, Books and Other Media'
    :group='props.group'
  >
    <List
        :items='props.items'
        name= 'Publication'
        :label='item => item.title ? item.title : item.doi ? "DOI: "+item.doi : "PubMed ID: "+item.pubMedID'
        :caption="item => !item.title ? '' : item.doi ? 'DOI: '+item.doi : item.pubMedID ? 'PubMed ID: '+item.pubMedID : 'Missing DOI and PubMed ID'"
        :avatar= 'item => item.title ? item.title[0].toUpperCase() : ""'
        icon_add= 'bookmark_add'
        icon_remove= 'bookmark_remove'

        @add='showDialog'
        @edit='showDialog'
        @remove='remove'
    ></List>
  </ViewItem>
</template>
