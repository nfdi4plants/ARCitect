
<script lang="ts" setup>
import { reactive, ref, nextTick, watch, onMounted, onUnmounted, h } from 'vue';
import ContextMenu from '@imengyu/vue3-context-menu'
import AppProperties from '../AppProperties';
import ArcControlService from '../ArcControlService';
import SwateControlService from '../SwateControlService';
import {Investigation, Assays, Studies, Workflows, Runs, Dataset, Protocols} from '../ArcControlService';
import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import StringDialog from '../dialogs/StringDialog.vue';
import AddProtocolDialog from '../dialogs/AddProtocolDialog.vue';
import GitDialog from '../dialogs/GitDialog.vue';
import { useQuasar } from 'quasar'
import {ArcStudy, ArcAssay} from '@nfdi4plants/arctrl';
import IdentifierDialog from '../dialogs/IdentifierDialog.vue';

const Image = 'image';
const Markdown = 'markdown';
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
    isDirectory: true
  }];
  await nextTick();
  arcTree._value.setExpanded(props.root);
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

const addStudy = async (e,n) => {
  if(n && arcTree.value.isExpanded(n.id)){
    e.preventDefault();
    e.stopPropagation();
  }
  $q.dialog({
    component: IdentifierDialog,
    componentProps: {
      label: 'Add Study',
      existing_identifiers: ArcControlService.props.arc.ISA.StudyIdentifiers
    }
  }).onOk( async (identifier: string) => {
    const study = new ArcStudy(identifier,identifier);
    ArcControlService.props.arc.ISA.AddStudy(study);
    await ArcControlService.saveARC();
    await ArcControlService.readARC();
  });
};

const addAssay = async (e,n) => {
  if(n && arcTree.value.isExpanded(n.id)){
    e.preventDefault();
    e.stopPropagation();
  }
  $q.dialog({
    component: IdentifierDialog,
    componentProps: {
      label: 'Add Assay',
      existing_identifiers: ArcControlService.props.arc.ISA.AssayIdentifiers
    }
  }).onOk( async (identifier: string) => {
    const assay = new ArcAssay(identifier);
    ArcControlService.props.arc.ISA.AddAssay(assay);
    await ArcControlService.saveARC();
    await ArcControlService.readARC();
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

const importFilesOrDirectories = async (n,method)=>{
  const path = n.id+'/';
  const paths = await window.ipc.invoke('LocalFileSystemService.'+method);
  for(const path_ of paths){
    await window.ipc.invoke('LocalFileSystemService.copy', [path_,path]);
  }
};

const readDir_ = async (path: string) => {
  const nodes = await window.ipc.invoke('LocalFileSystemService.readDir', path);

  const parent = path.split('/').pop().toLowerCase();

  const isMarkdown = l => {
    return ['md','txt','py','xml','cwl','fsx','json','yml','html','csv','css','js','log','gitignore'].some( i=>new RegExp(`\\.${i}$`,'g').test(l.toLowerCase()))
  };

  const isImage = l => {
    return ['png','jpeg','jpg'].some( i=>new RegExp(`\\.${i}$`,'g').test(l.toLowerCase()))
  };

  const isEditable = (n,p)=>{
    return n.isDirectory && [Studies, Assays].includes(p);
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
    } else if(n.label==='assays'){
      n.type = 'assays';
      n.icon = 'storage';
    } else if(n.label==='studies'){
      n.type = 'studies';
      n.icon = 'science';
    } else if(n.label==='workflows'){
      n.icon = 'settings';
    } else if(n.label==='runs'){
      n.icon = 'timer';
    } else {
      n.type = 'node';
    }
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

const triggerNode = (e,node) => {
  const skip = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const type = node ? node.type : null;
  switch (type) {
    case formatNodeEditString(Investigation):
      skip(e);
      return SwateControlService.LoadSwateState(0);
    case formatNodeEditString(Studies):
      skip(e);
      return SwateControlService.LoadSwateState(1,node.label);
    case formatNodeEditString(Assays):
      skip(e);
      return SwateControlService.LoadSwateState(2,node.label);
    case formatNodeEditString(Markdown):
      AppProperties.active_markdown = node.id;
      return AppProperties.state=AppProperties.STATES.EDIT_MARKDOWN;
    case formatNodeEditString(Image):
      AppProperties.active_image = node.id;
      return AppProperties.state=AppProperties.STATES.EDIT_IMAGE;
    // default:
    //   return AppProperties.state=AppProperties.STATES.HOME;
  }
};

const updatePath = async ([path,type]) => {
  if (!arcTree.value || type==='file_ch')
    return;

  // check if swate view needs to be closed
  if(type==='dir_rm'){
    const elements = path.replace(ArcControlService.props.arc_root+'/','').split('/');
    // if a study or assay was deleted/renamed that is currently opened in swate then close the view
    if(elements.length===2 && ['assays','studies'].includes(elements[0]) && SwateControlService.props.object.Identifier===elements[1])
      AppProperties.state=AppProperties.STATES.HOME;
  }

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

const createDirectory = async node=>{
  $q.dialog({
    component: StringDialog,
    componentProps: {
      title: 'Add Directory',
      property: 'Name',
      icon: 'create_new_folder'
    }
  }).onOk( async name => {
    const path = node.id + '/' + name;
    await window.ipc.invoke('LocalFileSystemService.enforcePath', path);
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

  const icon_style = {
    class: 'q-icon on-left notranslate material-icons material-symbols',
    role:'img',
    style:{fontSize: '1.5em',color:'#666'}
  };

  const rel_path = node.id.replaceAll(ArcControlService.props.arc_root+'/','');
  const rel_path_elements = rel_path.split('/');

  if(node.isDirectory){
    if(rel_path_elements.length===1){
      if(rel_path_elements[0]==='assays'){
        items.push({
          label: "Add Assay",
          icon: h( 'i', icon_style, ['add'] ),
          onClick: ()=>addAssay()
        });
      } else if (rel_path_elements[0]==='studies') {
        items.push({
          label: "Add Study",
          icon: h( 'i', icon_style, ['add'] ),
          onClick: ()=>addStudy()
        });
      }
    }

    items.push({
      label: "New Text File",
      icon: h( 'i', icon_style, ['note_add'] ),
      onClick: ()=>createFile(node)
    });
    items.push({
      label: "New Directory",
      icon: h( 'i', icon_style, ['create_new_folder'] ),
      onClick: ()=>createDirectory(node)
    });
    items.push({
      label: "Import Files",
      icon: h( 'i', icon_style, ['upload_file'] ),
      onClick: ()=>importFilesOrDirectories(node,'selectAnyFiles')
    });
    items.push({
      label: "Import Directories",
      icon: h( 'i', icon_style, ['drive_folder_upload'] ),
      onClick: ()=>importFilesOrDirectories(node,'selectAnyDirectories')
    });
  } else {

    const lfs_files = await window.ipc.invoke('GitService.run', {
      args: ['lfs','ls-files','-n'],
      cwd: ArcControlService.props.arc_root
    });
    if(lfs_files[0] && lfs_files[1].includes(rel_path)){
      items.push({
        label: "Download LFS File",
        icon: h( 'i', icon_style, ['cloud_download'] ),
        onClick: async ()=>{
          let response = null;

          // get remote name and url
          response = await window.ipc.invoke('GitService.run', {
            args: [`remote`],
            cwd: ArcControlService.props.arc_root
          });
          if(!response[0]) return $q.dialog({
            component: ConfirmationDialog,
            componentProps: {
              title: 'Error',
              msg: 'Unable to determine remote name'
            }
          });
          const remote_name = response[1].split('\n')[0];
          response = await window.ipc.invoke('GitService.run', {
            args: [`remote`,`get-url`,remote_name],
            cwd: ArcControlService.props.arc_root
          });
          if(!response[0]) return $q.dialog({
            component: ConfirmationDialog,
            componentProps: {
              title: 'Error',
              msg: 'Unable to determine remote url'
            }
          });
          const remote_url = response[1].split('\n')[0];

          // patch remote
          const patched_remote_url = patchRemote(remote_url);
          if(!patched_remote_url){
            return $q.dialog({
              component: ConfirmationDialog,
              componentProps: {
                title: 'Error',
                msg: 'LFS download requires login'
              }
            });
          }
          response = await window.ipc.invoke('GitService.run', {
            args: [`remote`,`set-url`,remote_name,patched_remote_url],
            cwd: ArcControlService.props.arc_root
          });
          console.log('[GitService.run-response]', response);
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
            args: ['lfs','pull','--include',rel_path],
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

  const confirm_delete = async (node,callback)=>{
    $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        msg: `Are you sure you want to delete:<br><b><i>${node.id}</i></b><br>`,
        ok_text: 'Delete',
        ok_icon: 'delete',
        ok_color: 'red-9',
        cancel_text: 'Cancel',
        cancel_icon: 'cancel',
        cancel_color: 'secondary',
      }
    }).onOk(callback);
  };

  if(node.type===formatNodeEditString(Assays)){
    items.push({
      label: "Rename",
      icon: h( 'i', icon_style, ['edit_note'] ),
      onClick: async () => {
        $q.dialog({
          component: StringDialog,
          componentProps: {
            title: 'Rename',
            property: 'Name',
            icon: 'edit_note'
          }
        }).onOk(
          async new_identifier => ArcControlService.rename('RenameAssay',node.label,new_identifier)
        );
      }
    });
    items.push({
      label: "Delete",
      icon: h( 'i', icon_style, ['delete'] ),
      onClick: ()=>confirm_delete(node,()=>ArcControlService.deleteAssay(node.label))
    });
  } else if (node.type===formatNodeEditString(Studies)){
    items.push({
      label: "Rename",
      icon: h( 'i', icon_style, ['edit_note'] ),
      onClick: async () => {
        $q.dialog({
          component: StringDialog,
          componentProps: {
            title: 'Rename',
            property: 'Name',
            icon: 'edit_note'
          }
        }).onOk(
          async new_identifier => ArcControlService.rename('RenameStudy',node.label,new_identifier)
        );
      }
    });
    items.push({
      label: "Delete",
      icon: h( 'i', icon_style, ['delete'] ),
      onClick: ()=>confirm_delete(node,()=>ArcControlService.deleteStudy(node.label))
    });
  } else {
    //verify that the file/directory is not a MUST keep file/directory
    if (["assays", "studies", "runs", "workflows", "dataset", "protocols", "resources"].includes(node.label.toLowerCase()) === false) {
      items.push({
        label: "Delete",
        icon: h( 'i', icon_style, ['delete'] ),
        onClick: ()=>confirm_delete(node,()=>window.ipc.invoke('LocalFileSystemService.remove', node.id))
      });
    }
  }

  if(items.length){
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
    <div
      v-if='ArcControlService.props.arc'
      class='text-h6 text-grey-7'
      style='font-size:0.9em;border-bottom:0.1em solid #ccc;line-height:1em;padding:0 0 0.7em 0;'
    >{{(props.root.replace(' ', '&nbsp;') || '').split('/').join(' /&nbsp;')}}</div>
    <q-tree
      v-if="ArcControlService.props.arc"
      ref='arcTree'
      :nodes="props.nodes"
      node-key="id"
      dense
      @lazy-load="readDir"
      style="padding:1em;"
      no-nodes-label=' '
    >
      <template v-slot:default-header="prop">
        <div
          v-ripple
          class='text-grey-6'
          style="flex:1;cursor:pointer;white-space: nowrap;"
          @contextmenu="e=>onCellContextMenu(e,prop.node)"
          @click='e=>triggerNode(e,prop.node)'
        >
          <q-icon v-if='prop.node.icon' :name='prop.node.icon' style="padding:0 0.2em 0 0;"></q-icon>
          <span class='text-black'>{{ prop.node.label }}</span>
          <q-icon v-if='prop.node.type==="assays"' name='add' class='tree_add_button' @click='e=>addAssay(e,prop.node)'></q-icon>
          <q-icon v-if='prop.node.type==="studies"' name='add' class='tree_add_button' @click='e=>addStudy(e,prop.node)'></q-icon>
        </div>
      </template>
    </q-tree>

    <div
      class="column"
      style="text-align: center; color:#ccc; cursor: pointer;"
      v-if="props.nodes.length < 1"
      @click='emit("openArc")'
    >
      <q-icon name="find_in_page" size="15em" style="width: 100%"/>
      <h6>Open ARC</h6>
    </div>
  </div>
</template>

<style>
.q-tree__node .q-icon {
  color:#777;
}

.q-tree__node-header:hover{
  background-color: #eee;
}

.tree_add_button{
  text-align: center;
  padding: 0;
  margin: 0;
  border-radius: 1em;
  float:right;
}

.tree_add_button:hover{
  background:#ccc;
}

</style>
