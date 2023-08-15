<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import List from '../components/List.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

import ArcControlService from '../ArcControlService.ts';
import PersonDialog from '../dialogs/PersonDialog.vue';

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
    component: PersonDialog,
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
    icon='groups'
    label='People'
    caption='Authors and Collaborators'
    :group='props.group'
  >
    <List
      :items='props.items'
      name= 'Person'
      :label='item => `${item.FirstName} ${item.LastName}`'
      :caption='item => item.ORCID ? item.ORCID : `Missing ORCID`'
      :avatar= 'item => item.LastName[0].toUpperCase()'
      icon_add= 'person_add_alt_1'
      icon_remove= 'person_remove'

      @add='showDialog'
      @edit='showDialog'
      @remove='remove'
    ></List>
  </ViewItem>
</template>
