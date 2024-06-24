<script lang="ts" setup>
import { reactive, ref, nextTick, watch, onMounted, onUnmounted, h } from 'vue';
import ContextMenu from '@imengyu/vue3-context-menu'
import AppProperties from '../AppProperties';
import ArcControlService from '../ArcControlService';
import SwateControlService from '../SwateControlService';
import {Investigation, Assays, Studies, Workflows, Runs, Dataset, Protocols} from '../ArcControlService';
import StringDialog from '../dialogs/StringDialog.vue';
import AddProtocolDialog from '../dialogs/AddProtocolDialog.vue';
import NewAssayDialog from '../dialogs/NewAssayDialog.vue';
import GitDialog from '../dialogs/GitDialog.vue';
import ErrorDialog from '../dialogs/ErrorDialog.vue';
import { NewAssayInformation } from '../dialogs/NewAssayDialog.vue';
import { useQuasar } from 'quasar'
import {ArcStudy, ArcAssay} from '@nfdi4plants/arctrl';
import NewStudyDialog from '../dialogs/NewStudyDialog.vue';

const Image = 'image';
const Markdown = 'markdown';
const NodeAdd_PreFix = "node_add_"
const NodeEdit_PreFix = "node_edit_"

const $q = useQuasar();

interface ArcTreeViewNode {
    header: string;
    type: string;
    id: string;
    label: string | undefined;
    lazy: boolean;
    icon: string;
    selectable: boolean;
    isDirectory: boolean;
}

let init: {
  nodes: ArcTreeViewNode [];
  root: string
} = {
  nodes: [],
  root: ''
}

const emit = defineEmits(['openArc']);

const props = reactive(init);
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
    type: `node_edit_${Investigation}`,
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
  selected._value = `${ArcControlService.props.arc_root}/${Studies}/${newValue}`;
  onSelectionChanged(selected.value);
});

watch(()=>AppProperties.active_assay, async (newValue, oldValue) => {
  await nextTick();
  selected._value = `${ArcControlService.props.arc_root}/${Assays}/${newValue}`;
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

function formatNodeEditString(contentType: string) {
  return NodeEdit_PreFix + contentType;
}

function formatNodeAddString(label: string) {
  return NodeAdd_PreFix + label.replace(" ","");
}

let uniqueLabelCounter = 0;

const addStudy_ = async (identifier: string, skip_io: boolean | void)=>{
  const study = new ArcStudy(identifier,identifier);
  ArcControlService.props.arc.ISA.AddRegisteredStudy(study)
  if(!skip_io){
    await ArcControlService.writeARC();
    await ArcControlService.readARC();
    AppProperties.active_study = identifier;
  }
};

const addStudy = async ()=>{
  $q.dialog({
    component: NewStudyDialog
  }).onOk( async data => await addStudy_(data));
};

const addAssay = async ()=>{
  $q.dialog({
    component: NewAssayDialog
  }).onOk( async (data: NewAssayInformation) => {
    const assay = new ArcAssay(data.assayIdentifier);
    ArcControlService.props.arc.ISA.AddAssay(assay);

    if (data.studyIdentifier !== null) {
      for(let studyIdentifier of data.studyIdentifier)
        try {
          ArcControlService.props.arc.ISA.RegisterAssay(studyIdentifier,data.assayIdentifier);
        } catch {
          console.log("Unfound study identifier: '", studyIdentifier, "'. Created new Study for identifier.")
          const study = new ArcStudy(studyIdentifier);
          ArcControlService.props.arc.ISA.AddRegisteredStudy(study);
          ArcControlService.props.arc.ISA.RegisterAssay(studyIdentifier,data.assayIdentifier);
        }
    };

    await ArcControlService.writeARC(ArcControlService.props.arc_root, undefined, undefined);
    await ArcControlService.readARC();
    AppProperties.active_assay = data.assayIdentifier;
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

const importFiles = async n=>{
  const path = n.id.split('/').slice(0,-1).join('/');
  const paths = await window.ipc.invoke('LocalFileSystemService.selectAnyFiles');
  for(const path_ of paths){
    await window.ipc.invoke('LocalFileSystemService.copy', [path_,path]);
  }
};

const importFolders = async n => {
  const path = n.id.split('/').slice(0,-1).join('/');
  const paths = await window.ipc.invoke('LocalFileSystemService.selectAnyFolders');
  for(const path_ of paths){
    await window.ipc.invoke('LocalFileSystemService.copy', [path_,path]);
  }
};

const readDir_ = async (path: string) => {
  const nodes = await window.ipc.invoke('LocalFileSystemService.readDir', path);

  const parent = path.split('/').pop().toLowerCase();

  const needsAddElement = (l: string) => {
    return [Studies,Assays,Protocols, Dataset, Runs, Workflows].includes( l.toLowerCase() );
  };

  const isMarkdown = l => {
    return ['md','txt','py','xml','cwl','fsx','json','yml','html','csv','css','js','log','gitignore'].some( i=>new RegExp(`\\.${i}$`,'g').test(l.toLowerCase()))
  }

  const isImage = l => {
    return ['png','jpeg','jpg'].some( i=>new RegExp(`\\.${i}$`,'g').test(l.toLowerCase()))
  }

  const isEditable = (n,p)=>{
    return n.isDirectory && [Studies, Assays].includes(p);
  };

  function createAddNode (label: string, handler: ((n:any) => Promise<void>) ) {
    const node = {
      type: formatNodeAddString(label),
      label: label,
      isDirectory: false,
      lazy: false,
      icon: 'add_box',
      id: path+'/'+'add$'+(uniqueLabelCounter++),
      selectable: true,
      tickable: false,
      handler: handler
    }
    return node;
  };

  for(const n of nodes){
    n.label = n.id.split('/').pop();
    n.lazy = n.isDirectory;
    n.selectable = true;
    if(isEditable(n,parent)){
      n.type = formatNodeEditString(parent);
      n.icon = 'edit_square';
    } else if(isMarkdown(n.label)){
      n.type = formatNodeEditString(Markdown);
      n.icon = 'edit_square';
    } else if(isImage(n.label)){
      n.type = formatNodeEditString(Image);
      n.icon = 'image';
    } else {
      n.type = 'node';
    }
  };

  // Here check loose assays/studies ~ WIP, Kevin
  // function checkVacantStudies() {
  //   const arc : ARC = ArcControlService.props.arc
  //   console.log("HIT")
  //   if (!arc) return;
  //   console.log(arc.ISA.RegisteredStudyIdentifiers)
  // }

  if(needsAddElement(parent)) {
    switch (parent) {
      case Studies:
        let addStudyNode = createAddNode("Add Study", addStudy);
        // checkVacantStudies()
        nodes.push(addStudyNode);
        break;
      case Assays:
        let addAssayNode = createAddNode("Add Assay", addAssay);
        nodes.push(addAssayNode);
        break;
      case Protocols:
        let addProcotolNode = createAddNode("Add Protocol", addProtocol)
        nodes.push(addProcotolNode);
        break;
      case Dataset:
        let importDatasetFilesNode = createAddNode("Import Dataset Files", importFiles)
        let importDatasetFoldersNode = createAddNode("Import Dataset Folders", importFolders)
        nodes.push(importDatasetFilesNode);
        nodes.push(importDatasetFoldersNode);
        break;
      case Runs:
        let importRunsFilesNode = createAddNode("Import Runs Files", importFiles)
        let importRunsFoldersNode = createAddNode("Import Runs Folders", importFolders)
        nodes.push(importRunsFilesNode);
        nodes.push(importRunsFoldersNode);
        break;
      case Workflows:
        let importWorkflowsFilesNode = createAddNode("Import Workflows Files", importFiles)
        let importWorkflowsFoldersNode = createAddNode("Import Workflows Folders", importFolders)
        nodes.push(importWorkflowsFilesNode);
        nodes.push(importWorkflowsFoldersNode);
        break;
    }
  };

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

    if(a.type.startsWith(NodeAdd_PreFix) && !b.type.startsWith(NodeAdd_PreFix)){
      return 1;
    } else if (!a.type.startsWith(NodeAdd_PreFix) && b.type.startsWith(NodeAdd_PreFix)){
      return -1;
    }
    return a.label.localeCompare(b.label);
  });

  return nodes;
};

const readDir = async ({ node, key, done, fail }) => {
  done( await readDir_(key) );
};

const onSelectionChanged = id =>{
  if (!arcTree._value) return;
  const n = arcTree._value.getNodeByKey(id);
  const type = n ? n.type : null;

  switch (type) {
    case formatNodeEditString(Investigation):
      return SwateControlService.LoadSwateState(0);
    case formatNodeEditString(Studies):
      return SwateControlService.LoadSwateState(1,n.label);
    case formatNodeEditString(Assays):
      return SwateControlService.LoadSwateState(2,n.label);
    case formatNodeEditString(Markdown):
      AppProperties.active_markdown = n.id;
      return AppProperties.state=AppProperties.STATES.EDIT_MARKDOWN;
    case formatNodeEditString(Image):
      AppProperties.active_image = n.id;
      return AppProperties.state=AppProperties.STATES.EDIT_IMAGE;
    // default:
    //   return AppProperties.state=AppProperties.STATES.HOME;
  }
};

const updatePath = async ([path,type]) => {
  if (!arcTree.value || type==='file_ch')
    return;

  const parentPath = path.split('/').slice(0,-1).join('/');
  const n = arcTree.value.getNodeByKey(parentPath);
  if(!n)
    return;
  const isExpanded = arcTree.value.isExpanded(parentPath);
  delete n.children;
  if(isExpanded)
    arcTree.value.setExpanded(parentPath,true);
};

const formatSize = size => {
  // const log = Math.min(Math.floor(Math.log10(size));
  let log = Math.floor(Math.log(size) / Math.log(1024));
  log = Math.max(0,Math.min(4,log));
  const suffix = ['B','KB','MB','GB','TB'][log];

  return (size / Math.pow(1024,log)).toFixed(2) + ' ' + suffix;
};

const createFile = async node=>{
  $q.dialog({
    component: StringDialog,
    componentProps: {
      title: 'Add File',
      property: 'Filename',
      icon: 'note_add'
    }
  }).onOk( async name => {
    const path = node.id + '/' + name;
    await window.ipc.invoke('LocalFileSystemService.writeFile', [path,'']);
  });
};

const patchRemote = url => {
  return AppProperties.user && url.includes(AppProperties.user.host)
    ? `https://oauth2:${AppProperties.user.token.access_token}@${AppProperties.user.host}` + url.split(AppProperties.user.host)[1]
    : null;
};

const onCellContextMenu = async (e,node) => {
  if(node.type==='empty') return;
  e.preventDefault();

  const items = [];

  if(node.isDirectory){
    items.push(
      {
        label: "New Text File",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['note_add']
        ),
        onClick: ()=>createFile(node)
      }
    );
  } else {
    items.push({
      label: "Delete File",
      icon: h(
        'i',
        {
          class: 'q-icon on-left notranslate material-icons',
          role:'img',
          style:{fontSize: '1.5em',color:'#333'}
        },
        ['delete']
      ),
      onClick: ()=>window.ipc.invoke('LocalFileSystemService.remove', node.id)
    });

    const rel_file_path = node.id.replaceAll(ArcControlService.props.arc_root+'/','');
    const lfs_files = await window.ipc.invoke('GitService.run', {
      args: ['lfs','ls-files','-n'],
      cwd: ArcControlService.props.arc_root
    });
    if(lfs_files[0] && lfs_files[1].includes(rel_file_path)){
      items.push({
        label: "Download LFS File",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['cloud_download']
        ),
        onClick: async ()=>{
          let response = null;

          // get remote name and url
          response = await window.ipc.invoke('GitService.run', {
            args: [`remote`],
            cwd: ArcControlService.props.arc_root
          });
          if(!response[0]) return $q.dialog({
            component: ErrorDialog,
            componentProps: {
              error: 'Unable to determine remote name'
            }
          });
          const remote_name = response[1].split('\n')[0];
          response = await window.ipc.invoke('GitService.run', {
            args: [`remote`,`get-url`,remote_name],
            cwd: ArcControlService.props.arc_root
          });
          if(!response[0]) return $q.dialog({
            component: ErrorDialog,
            componentProps: {
              error: 'Unable to determine remote url'
            }
          });
          const remote_url = response[1].split('\n')[0];

          // patch remote
          const patched_remote_url = patchRemote(remote_url);
          if(!patched_remote_url){
            return $q.dialog({
              component: ErrorDialog,
              componentProps: {
                error: 'LFS download requires login'
              }
            });
          }
          response = await window.ipc.invoke('GitService.run', {
            args: [`remote`,`set-url`,remote_name,patched_remote_url],
            cwd: ArcControlService.props.arc_root
          });
          console.log(response);
          if(!response[0]) return;

          const dialogProps = reactive({
            title: 'Pulling Individual LFS File',
            ok_title: 'Ok',
            cancel_title: null,
            state: 0,
          });

          $q.dialog({
            component: GitDialog,
            componentProps: dialogProps
          });

          await window.ipc.invoke('GitService.run', {
            args: ['lfs','pull','--include',rel_file_path],
            cwd: ArcControlService.props.arc_root
          });

          // unpatch
          response = await window.ipc.invoke('GitService.run', {
            args: [`remote`,`set-url`,remote_name,remote_url],
            cwd: ArcControlService.props.arc_root
          });

          dialogProps.state=1;
        }
      });
    }
  }

  if(node.type===formatNodeEditString(Assays)){
    items.push(
      {
        label: "Delete",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['delete']
        ),
        onClick: () =>{ArcControlService.deleteAssay(node.label)}
      }
    );
  } else if (node.type===formatNodeEditString(Studies)){
    items.push(
      {
        label: "Delete",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['delete']
        ),
        onClick: () =>{ArcControlService.deleteStudy(node.label)}
      }
    );
  }

  console.log(items);

  if(items.length){
    console.log(node.id);
    e.preventDefault();
    ContextMenu.showContextMenu({
      x: e.x,
      y: e.y,
      theme: 'flat',
      items: items
    });
  }

  // work in progress for adding files to gitignore
  // else if (
  //   !node.type.startsWith('empty') && !node.type.startsWith(NodeAdd_PreFix)
  // ){
  //   e.preventDefault();
  //   ContextMenu.showContextMenu({
  //     x: e.x,
  //     y: e.y,
  //     theme: 'flat',
  //     items: [
  //       {
  //         label: "Toggle Git Tracking",
  //         icon: h(
  //           'i',
  //           {
  //             class: 'q-icon on-left notranslate material-icons',
  //             role:'img',
  //             style:{fontSize: '1.5em',color:'#333'}
  //           },
  //           ['sync_disabled']
  //         ),
  //         onClick: () =>{ArcControlService.updateGitIgnore(node.id)}
  //       },
  //     ]
  //   });
  // }
};

onMounted( ()=>{window.ipc.on('LocalFileSystemService.updatePath', updatePath);} );
onUnmounted( ()=>{window.ipc.off('LocalFileSystemService.updatePath', updatePath);} );

</script>

<template>
  <div class='q-pa-md'>
    <div v-if="ArcControlService.props.arc" class='text-h6 text-grey-7' style="font-size:0.9em;border-bottom:0.1em solid #ccc;line-height:1em;padding:0 0 0.7em 0;">{{(props.root.replace(' ', '&nbsp;') || '').split('/').join(' /&nbsp;')}}</div>
    <q-tree
    v-if="ArcControlService.props.arc"
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
        <div style="flex:100;white-space: nowrap;" @contextmenu="e=>onCellContextMenu(e,prop.node)">{{ prop.node.label }}</div>
        <div v-if='!prop.node.isDirectory && !["add_box","block"].includes(prop.node.icon)' style="flex:1;white-space: nowrap;margin-left:1em;">{{ formatSize(prop.node.size) }}</div>
      </template>
    </q-tree>

    <div class="column" style="text-align: center; color:#ccc; cursor: pointer;" v-if="props.nodes.length < 1" @click='emit("openArc")'>
      <!-- <q-icon name="account_tree" size="15em" style='color:#ccc' /> -->
      <q-icon name="find_in_page" size="15em" style="width: 100%"/>
      <h6>Open ARC</h6>
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
