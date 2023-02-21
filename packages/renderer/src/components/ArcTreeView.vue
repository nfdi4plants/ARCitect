<script lang="ts" setup>
import { reactive, ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import appProperties from '../AppProperties.ts';
import ArcCommanderService from '../ArcCommanderService.ts';

const props = reactive({
  nodes: [],
  root: ''
});
const arcTree = ref(null);
const selected = ref(null);

watch(()=>ArcCommanderService.props.arc_root, async (newValue, oldValue) => {
  window.ipc.invoke('LocalFileSystemService.unregisterChangeListener', oldValue);
  window.ipc.invoke('LocalFileSystemService.registerChangeListener', newValue);

  props.root = newValue;

  props.nodes = [{
    header: 'root',
    type: 'node_edit_investigation',
    id: props.root,
    label: props.root.split('/').pop(),
    lazy: true,
    icon: 'edit_square',
    selectable: true
  }];
  await nextTick();
  arcTree._value.setExpanded(props.root);
});

const readDir_ = async key => {
  return await window.ipc.invoke('LocalFileSystemService.readDir', key);
};
const readDir = async ({ node, key, done, fail }) => {
  done( await readDir_(key) );
};

const onSelectionChanged = id=>{
  const n = arcTree._value.getNodeByKey(id);
  const type = n ? n.type : null;

  switch (type) {
    case 'node_edit_investigation':
      return appProperties.state=appProperties.STATES.EDIT_INVESTIGATION;

    case 'node_add_Study':
      appProperties.active_study = null;
      return appProperties.state=appProperties.STATES.EDIT_STUDY;
    case 'node_edit_Study':
      appProperties.active_study = n.label;
      return appProperties.state=appProperties.STATES.EDIT_STUDY;

    case 'node_add_Assay':
      appProperties.active_assay = null;
      return appProperties.state=appProperties.STATES.EDIT_ASSAY;
    case 'node_edit_Assay':
      appProperties.active_assay = n.label;
      return appProperties.state=appProperties.STATES.EDIT_ASSAY;

    default:
      return appProperties.state=appProperties.STATES.HOME;
  }
}

const updatePath = async path => {
  const n = arcTree._value.getNodeByKey(path);
  if(!n)
    return;
  const isExpanded = arcTree._value.isExpanded(path);
  delete n.children;
  if(isExpanded)
    arcTree._value.setExpanded(path,true);
};

window.ipc.on('LocalFileSystemService.updatePath', updatePath);
// const test = async ()=>{
//   const path = '/home/jones/external/projects/TEMP/samplearc_rnaseq/studies';
//   const n = arcTree._value.getNodeByKey(path);
//   // arcTree._value.setExpanded(path,false);
//   // n.children = await readDir_(path);
//   delete n.children;
//   arcTree._value.setExpanded(path,true);

//   // arcTree._value.setExpanded(path,true);
//   // console.log(arcTree._value);
//   // console.log(n);
// }

// const registerChangeListener = async expanded =>{
//   console.log('expanded');
// }

</script>

<template>
  <div class='q-pa-md'>
    <div class='text-h6' style="border-bottom:0.1em solid #ccc;line-height:1em;padding:0 0 0.7em 0;">{{(props.root || 'No Arc Selected').split('/').join(' /&nbsp;')}}</div>

    <q-tree
      ref='arcTree'
      :nodes="props.nodes"
      node-key="id"
      dense
      v-model:selected="selected"
      @lazy-load="readDir"
      @update:selected="onSelectionChanged"
      style="padding:1em;"
      no-nodes-label=' '
      selected-color='white'
    >
      <!--<template v-slot:header-root="prop">-->
      <!--  <div class='text-weight-bold'>{{ prop.node.label }}</div>-->
      <!--</template>-->
    </q-tree>

    <div style="text-align:center;" v-if='props.nodes.length<1'>
      <q-icon name="account_tree" size="15em" style='color:#ccc' />
    </div>

  </div>
</template>

<style>
.q-tree__node--selected {
  background-color: #26a69a;
}
.q-tree__node .q-icon {
  color:#777;
}
.q-tree__node--selected .q-icon {
  color:#fff;
}
</style>
