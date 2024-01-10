<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import List from '../components/List.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

import ArcControlService from '../ArcControlService.ts';
import PublicationDialog from '../dialogs/PublicationDialog.vue';

export interface Props {
  items: Object[],
  group: String
};
const props = withDefaults(defineProps<Props>(), {
  items: ()=>[],
  group: ''
});

const add = async item => {
  props.items.push(item);
  await ArcControlService.writeARC(ArcControlService.props.arc_root,['ISA_Investigation','ISA_Study']);
  await ArcControlService.readARC();
};

const remove = async (item,skipUpdate) => {
  props.items.splice(props.items.indexOf(item),1);
  if(skipUpdate) return;

  await ArcControlService.writeARC(ArcControlService.props.arc_root,['ISA_Investigation','ISA_Study']);
  await ArcControlService.readARC();
};

const showDialog = async item_o => {
  $q.dialog({
    component: PublicationDialog,
    componentProps: item_o ? {config: item_o} : {}
  }).onOk( async item_n => {
    if(item_o)
      remove(item_o,true);
    add(item_n);
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
        :label='item => item.Title ? item.Title : item.DOI ? "DOI: "+item.DOI : "PubMed ID: "+item.PubMedID'
        :caption="item => !item.Title ? '' : item.DOI ? 'DOI: '+item.DOI : item.PubMedID ? 'PubMed ID: '+item.PubMedID : 'Missing DOI and PubMed ID'"
        :avatar= 'item => item.Title ? item.Title[0].toUpperCase() : item.DOI ? "D" : "P"'
        icon_add= 'bookmark_add'
        icon_remove= 'bookmark_remove'
        empty_text= 'No Publications Registered'
        empty_icon= 'import_contacts'

        @add='showDialog'
        @edit='showDialog'
        @remove='remove'
    ></List>
  </ViewItem>
</template>
