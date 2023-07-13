<script lang="ts" setup>
import { reactive, ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import appProperties from '../AppProperties.ts';
import ArcCommanderService from '../ArcCommanderService.ts';
import StringDialog from '../dialogs/StringDialog.vue';
import AddProtocolDialog from '../dialogs/AddProtocolDialog.vue';
import NewAssayDialog from '../dialogs/NewAssayDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

const emit = defineEmits(['openArc']);

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

watch(()=>appProperties.active_study, async (newValue, oldValue) => {
  await nextTick();
  selected.value = `${ArcCommanderService.props.arc_root}/studies/${newValue}`;
  onSelectionChanged(selected.value);
});

watch(()=>appProperties.state, async (newValue, oldValue) => {
  if([
    appProperties.STATES.HOME,
    appProperties.STATES.OPEN_DATAHUB,
    appProperties.STATES.GIT,
  ].includes(newValue)){
    selected.value = null
  }
});

let uniqueLabelCounter = 0;

const addStudy = async ()=>{
  $q.dialog({
    component: StringDialog,
    componentProps: {
      title: 'Add Study',
      property: 'Identifier',
      icon: 'add_box'
    }
  }).onOk( async data => {
    const r = await ArcCommanderService.run({
        args: ['study','add','--identifier',data],
        title: `Adding Study`,
        silent: false
      },
      true
    );
    appProperties.active_study = data;
  });
};
const addAssay = async ()=>{
  $q.dialog({
    component: NewAssayDialog
  }).onOk( async data => {
    const cmds = [];
    if(data.model.studies.value.length===1 && data.model.studies.value[0]==='Create New Study'){
      cmds.push({
        args: ['assay','add','--assayidentifier',data.model.assayIdentifier.value],
        title: `Adding Assay`,
        silent: true
      });
    } else {
      cmds.push({
        args: ['assay','init','--assayidentifier',data.model.assayIdentifier.value],
        title: `Adding Assay`,
        silent: false
      });
      for(const s of data.model.studies.value)
        cmds.push({
          args: ['assay','register','--assayidentifier',data.model.assayIdentifier.value,'--studyidentifier',s],
          title: `Registering Assay`,
          silent: false
        });
    }
    const r = await ArcCommanderService.run(cmds,true);
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
  const files = await window.ipc.invoke('LocalFileSystemService.selectAny');
  for(const fpath of files){
    await window.ipc.invoke('LocalFileSystemService.copy', [fpath,path]);
  }
};

const readDir_ = async path => {
  const nodes = await window.ipc.invoke('LocalFileSystemService.readDir', path);

  const parent = path.split('/').pop().toLowerCase();
  const needsAddElement = l=>{
    return ['studies','assays','protocols','dataset'].includes( l.toLowerCase() );
  };

  const isMarkdown = l => {
    return ['md','txt'].some( i=>new RegExp(`\\.${i}$`,'g').test(l.toLowerCase()))
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
      return appProperties.state=appProperties.STATES.EDIT_INVESTIGATION;
    case 'node_edit_Study':
      appProperties.active_study = n.label;
      return appProperties.state=appProperties.STATES.EDIT_STUDY;
    case 'node_edit_Assay':
      appProperties.active_assay = n.label;
      return appProperties.state=appProperties.STATES.EDIT_ASSAY;
    case 'node_edit_Markdown':
      appProperties.active_markdown = n.id;
      return appProperties.state=appProperties.STATES.EDIT_MARKDOWN;

    // default:
    //   return appProperties.state=appProperties.STATES.HOME;
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
      <!--<template v-slot:header-root="prop">-->
      <!--  <div class='text-weight-bold'>{{ prop.node.label }}</div>-->
      <!--</template>-->
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
