<script lang="ts" setup>
import { reactive, ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';
import StringDialog from '../dialogs/StringDialog.vue';
import AddProtocolDialog from '../dialogs/AddProtocolDialog.vue';
import NewAssayDialog from '../dialogs/NewAssayDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

import {ArcStudy, ArcAssay} from '@nfdi4plants/arctrl/ISA/ISA/ArcTypes/ArcTypes.js';

const emit = defineEmits(['openArc']);

const props = reactive({
  nodes: [],
  root: ''
});
const arcTree = ref(null);
const selected = ref(null);

watch(()=>ArcControlService.props.arc_root, async (newValue, oldValue) => {
  if(oldValue)
    window.ipc.invoke('LocalFileSystemService.unregisterChangeListener', oldValue);
  if(!newValue) return

  window.ipc.invoke('LocalFileSystemService.registerChangeListener', newValue);

  props.root = newValue;
  props.nodes = [{
    header: 'root',
    type: 'node_edit_investigation',
    id: props.root,
    label: props.root.split('/').pop(),
    lazy: true,
    icon: 'edit_square',
    selectable: true,
    isDirectory: true
  }];
  await nextTick();
  arcTree._value.setExpanded(props.root);
});

watch(()=>AppProperties.active_study, async (newValue, oldValue) => {
  await nextTick();
  selected.value = `${ArcControlService.props.arc_root}/studies/${newValue}`;
  onSelectionChanged(selected.value);
});
watch(()=>AppProperties.active_assay, async (newValue, oldValue) => {
  await nextTick();
  selected.value = `${ArcControlService.props.arc_root}/assays/${newValue}`;
  onSelectionChanged(selected.value);
});

watch(()=>AppProperties.state, async (newValue, oldValue) => {
  if([
    AppProperties.STATES.HOME,
    AppProperties.STATES.OPEN_DATAHUB,
    AppProperties.STATES.GIT,
  ].includes(newValue)){
    selected.value = null
  }
});

let uniqueLabelCounter = 0;

const addStudy_ = async (identifier,skip_io)=>{
  const study = new ArcStudy(identifier,identifier);
  ArcControlService.props.arc.ISA.AddStudy(study);
  ArcControlService.props.arc.ISA.RegisterStudy(identifier);
  if(!skip_io){
    await ArcControlService.writeARC(ArcControlService.props.arc_root);
    await ArcControlService.readARC();
    AppProperties.active_study = identifier;
  }
};
const addStudy = async ()=>{
  $q.dialog({
    component: StringDialog,
    componentProps: {
      title: 'Add Study',
      property: 'Identifier',
      icon: 'add_box'
    }
  }).onOk( async data => await addStudy_(data));
};

const addAssay = async ()=>{
  $q.dialog({
    component: NewAssayDialog
  }).onOk( async data => {
    if(data[1].length<1){
      await addStudy_(data[0],true);
      data[1].push(data[0]);
    }

    const assay = new ArcAssay(data[0]);
    ArcControlService.props.arc.ISA.AddAssay(assay);

    for(let study of data[1])
      ArcControlService.props.arc.ISA.RegisterAssay(study,data[0]);

    await ArcControlService.writeARC(ArcControlService.props.arc_root);
    await ArcControlService.readARC();
    AppProperties.active_assay = data[0];
  });
};

const addProtocol = async n=>{
  const path = n.id.split('/').slice(0,-1).join('/');
  $q.dialog({
    component: AddProtocolDialog
  }).onOk( async data => {
    if(data[0]){
      await window.ipc.invoke('LocalFileSystemService.createEmptyFile', path+'/'+data[1]);
    } else {
      for(const fpath of data[1]){
        await window.ipc.invoke('LocalFileSystemService.copy', [fpath,path]);
      }
    }
  });
};

const addDataset = async n=>{
  const path = n.id.split('/').slice(0,-1).join('/');
  const paths = await window.ipc.invoke('LocalFileSystemService.selectAny');
  for(const path_ of paths){
    await window.ipc.invoke('LocalFileSystemService.copy', [path_,path]);
  }
};

const readDir_ = async path => {
  const nodes = await window.ipc.invoke('LocalFileSystemService.readDir', path);

  const parent = path.split('/').pop().toLowerCase();
  const needsAddElement = l=>{
    return ['studies','assays','protocols','dataset'].includes( l.toLowerCase() );
  };

  const isMarkdown = l => {
    return ['md','txt','py','xml','cwl','json'].some( i=>new RegExp(`\\.${i}$`,'g').test(l.toLowerCase()))
  }

  const isEditable = (n,p)=>{
    return n.isDirectory && ['studies','assays'].includes(p);
  };

  const elementMap = {
    'studies': ['Study', addStudy],
    'assays': ['Assay', addAssay],
    'protocols': ['Protocol', addProtocol],
    'dataset': ['Dataset', addDataset]
  };

  for(const n of nodes){
    n.label = n.id.split('/').pop();
    n.lazy = n.isDirectory;
    if(isEditable(n,parent)){
      n.type = 'node_edit_'+elementMap[parent][0];
      n.icon = 'edit_square';
      n.selectable = true;
    } else if(isMarkdown(n.label)){
      n.type = 'node_edit_Markdown';
      n.icon = 'edit_square';
      n.selectable = true;
    } else {
      n.selectable = false;
      n.type = 'node';
    }
  }

  if(needsAddElement(parent)){
    nodes.push({
      type: 'node_add_'+elementMap[parent][0],
      label: 'Add '+elementMap[parent][0],
      isDirectory: false,
      lazy: false,
      icon: 'add_box',
      id: path+'/'+'add$'+(uniqueLabelCounter++),
      selectable: true,
      tickable: false,
      handler: elementMap[parent][1]
    });
  }

  if(nodes.length<1){
    nodes.push({
      type: 'empty',
      label: 'empty',
      isDirectory: false,
      lazy: false,
      icon: 'block',
      id: path+'/'+'empty$'+(uniqueLabelCounter++),
      selectable: false
    });
  }

  nodes.sort((a,b)=>{
    if(a.isDirectory && !b.isDirectory){
      return -1;
    } else if (!a.isDirectory && b.isDirectory){
      return 1;
    }

    if(a.type.startsWith('node_add_') && !b.type.startsWith('node_add_')){
      return 1;
    } else if (!a.type.startsWith('node_add_') && b.type.startsWith('node_add_')){
      return -1;
    }
    return a.label.localeCompare(b.label);
  });

  return nodes;
};
const readDir = async ({ node, key, done, fail }) => {
  done( await readDir_(key) );
};

const onSelectionChanged = id=>{
  const n = arcTree._value.getNodeByKey(id);
  const type = n ? n.type : null;

  switch (type) {
    case 'node_edit_investigation':
      return AppProperties.state=AppProperties.STATES.EDIT_INVESTIGATION;
    case 'node_edit_Study':
      AppProperties.active_study = n.label;
      return AppProperties.state=AppProperties.STATES.EDIT_STUDY;
    case 'node_edit_Assay':
      AppProperties.active_assay = n.label;
      return AppProperties.state=AppProperties.STATES.EDIT_ASSAY;
    case 'node_edit_Markdown':
      AppProperties.active_markdown = n.id;
      return AppProperties.state=AppProperties.STATES.EDIT_MARKDOWN;

    // default:
    //   return AppProperties.state=AppProperties.STATES.HOME;
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

const formatSize = size => {
  // const log = Math.min(Math.floor(Math.log10(size));
  let log = Math.floor(Math.log(size) / Math.log(1024));
  log = Math.max(0,Math.min(4,log));
  const suffix = ['B','KB','MB','GB','TB'][log];

  return (size / Math.pow(1024,log)).toFixed(2) + ' ' + suffix;
};

onMounted( ()=>{window.ipc.on('LocalFileSystemService.updatePath', updatePath);} );
onUnmounted( ()=>{window.ipc.off('LocalFileSystemService.updatePath', updatePath);} );

</script>

<template>
  <div class='q-pa-md'>
    <div class='text-h6 text-grey-7' style="font-size:0.9em;border-bottom:0.1em solid #ccc;line-height:1em;padding:0 0 0.7em 0;">{{(props.root.replace(' ', '&nbsp;') || '').split('/').join(' /&nbsp;')}}</div>
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
      no-selection-unset
    >
      <template v-slot:default-header="prop">
        <q-icon v-if='prop.node.icon' :name='prop.node.icon' style="padding:0 0.2em 0 0;"></q-icon>
        <div style="flex:100">{{ prop.node.label }}</div>
        <div v-if='!prop.node.isDirectory && !["add_box","block"].includes(prop.node.icon)' style="flex:1;white-space: nowrap;">{{ formatSize(prop.node.size) }}</div>
      </template>
    </q-tree>

    <div style="text-align:center;" v-if='props.nodes.length<1'>
      <!--<q-icon name="account_tree" size="15em" style='color:#ccc' />-->
      <q-icon name="find_in_page" size="15em" style='color:#ccc' v-on:click='emit("openArc")' />
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
