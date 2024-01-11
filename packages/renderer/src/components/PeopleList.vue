<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import List from '../components/List.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

import PersonDialog from '../dialogs/PersonDialog.vue';

export interface Props {
  items: Object[],
  group: String
};
const props = withDefaults(defineProps<Props>(), {
  items: ()=>[],
  group: ''
});

const add = async items => {
  for(let i of items)
    props.items.push(i);
};

const remove = async (item,skipUpdate) => {
  props.items.splice(props.items.indexOf(item),1);
};

const showDialog = async item_o => {
  $q.dialog({
    component: PersonDialog,
    componentProps: item_o ? {config: item_o} : {}
  }).onOk( async items_n => {
    if(item_o)
      remove(item_o,true);
    add(items_n);
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
      :label='item => `${item.FirstName} ${item.LastName}`'
      :caption='item => "ORCID: " + (item.ORCID ? item.ORCID : `Missing`)'
      :avatar= 'item => item.LastName[0].toUpperCase()'
      icon_add= 'person_add_alt_1'
      icon_remove= 'person_remove'
      empty_text= 'No Persons Registered'
      empty_icon= 'person_off'

      @add='showDialog'
      @edit='showDialog'
      @remove='remove'
    ></List>
  </ViewItem>
</template>
