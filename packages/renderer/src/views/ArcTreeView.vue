<script lang="ts" setup>
import { reactive, ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import appProperties from '../AppProperties.ts';
import ArcCommanderService from '../ArcCommanderService.ts';
import StringDialog from '../dialogs/StringDialog.vue';
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

let uniqueLabelCounter = 0;

const addStudy = async ()=>{
  $q.dialog({
    component: StringDialog,
    componentProps: {
      title: 'Add Study',
      property: 'Identifier',
      icon: 'add_box'
    }
  }).onOk( async s => {
    const r = await ArcCommanderService.run({
        args: ['study','add','--identifier',s],
        title: `Adding Study`,
        silent: false
      },
      true
    );
    appProperties.active_study = s;
  });
};
const addAssay = async ()=>{
  $q.dialog({
    component: StringDialog,
    componentProps: {
      title: 'Add Assay',
      property: 'Identifier',
      icon: 'add_box'
    }
  }).onOk( async s => {
    const r = await ArcCommanderService.run({
        args: ['assay','add','--identifier',s],
        title: `Adding Assay`,
        silent: true
      },
      true
    );
    console.log(r);
  });
};

const readDir_ = async path => {
  const nodes = await window.ipc.invoke('LocalFileSystemService.readDir', path);

  const parent = path.split('/').pop().toLowerCase();
  const isSARW = l=>{
    return ['studies','assays'].includes(l)
  };
  const sarwMap = {
    'studies': 'Study',
    'assays': 'Assay'
  };

  for(const n of nodes){
    n.label = n.id.split('/').pop();
    n.lazy = n.isDirectory;
    if(isSARW(parent)){
      n.type = 'node_edit_'+sarwMap[parent];
      n.icon = 'edit_square';
      n.selectable = true;
    } else if(n.label.includes('.md')) {
      n.type = 'node_edit_Markdown';
      n.icon = 'edit_square';
      n.selectable = true;
    } else {
      n.selectable = false;
      n.type = 'node';
    }
  }

  if(isSARW(parent)){
    nodes.push({
      type: 'node_add_'+sarwMap[parent],
      label: 'Add '+sarwMap[parent],
      isDirectory: false,
      lazy: false,
      icon: 'add_box',
      id: path+'/'+'add$'+(uniqueLabelCounter++),
      selectable: true,
      tickable: false,
      handler: parent==='studies' ? addStudy : addAssay
    });
    // nodes.push({
    //   type: 'node_add_'+sarwMap[parent],
    //   label: 'Add '+sarwMap[parent],
    //   isDirectory: false,
    //   lazy: false,
    //   icon: 'add_box',
    //   id: path+'/'+'add$'+(uniqueLabelCounter++),
    //   selectable: true
    // });
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
    <div class='text-h6' style="border-bottom:0.1em solid #ccc;line-height:1em;padding:0 0 0.7em 0;">{{(props.root || '&nbsp;').split('/').join(' /&nbsp;')}}</div>
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
