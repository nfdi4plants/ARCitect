<script lang="ts" setup>
import { reactive, ref, nextTick, watch, onMounted, onUnmounted, h } from 'vue';
import ContextMenu from '@imengyu/vue3-context-menu'
import AppProperties from '../AppProperties';
import ArcControlService from '../ArcControlService';
import GitService from '../GitService';
import SwateControlService from '../SwateControlService';
import {Investigation, Assays, Studies, Workflows, Runs, Dataset, Protocols} from '../ArcControlService';
import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import StringDialog from '../dialogs/StringDialog.vue';
import AddProtocolDialog from '../dialogs/AddProtocolDialog.vue';
import ProgressDialog from '../dialogs/ProgressDialog.vue';
import GitDialog from '../dialogs/GitDialog.vue';
import { useQuasar } from 'quasar'
import {ArcStudy, ArcAssay} from '@nfdi4plants/arctrl';
import { setAssayIdentifier, setStudyIdentifier } from "@nfdi4plants/arctrl/Core/IdentifierSetters";
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
  root: string,
  selection: string,
} = {
  nodes: [],
  root: '',
  selection: ''
};

const emit = defineEmits(['openArc']);

let update_path_listener=null;

const props = reactive(init);
const arcTree = ref(null);

function formatNodeEditString(contentType: string) {
  return NodeEdit_PreFix + contentType;
}

function formatNodeAddString(label: string) {
  return NodeAdd_PreFix + label.replace(" ","");
}

let uniqueLabelCounter = 0;

const addStudy = async (event,node,study) => {
  if(node && arcTree.value.isExpanded(node.id)){
    event.preventDefault();
    event.stopPropagation();
  }
  $q.dialog({
    component: IdentifierDialog,
    componentProps: {
      label: study ? 'Copy Study' : 'New Study',
      existing_identifiers: ArcControlService.props.arc.ISA.StudyIdentifiers,
      identifier: study ? study.Identifier : ''
    }
  }).onOk( async (identifier: string) => {
    let new_study = null;
    if(study){
      new_study = study.Copy();
      setStudyIdentifier(identifier,new_study);
    } else {
      new_study = new ArcStudy(identifier);
    }
    ArcControlService.props.arc.ISA.AddStudy(new_study);
    await ArcControlService.saveARC();
  });
};

const addAssay = async (event,node,assay) => {
  if(node && arcTree.value.isExpanded(node.id)){
    event.preventDefault();
    event.stopPropagation();
  }
  $q.dialog({
    component: IdentifierDialog,
    componentProps: {
      label: assay ? 'Copy Assay' : 'New Assay',
      existing_identifiers: ArcControlService.props.arc.ISA.AssayIdentifiers,
      identifier: assay ? assay.Identifier : ''
    }
  }).onOk( async (identifier: string) => {
    let new_assay = null;
    if(assay){
      new_assay = assay.Copy();
      setAssayIdentifier(identifier,new_assay);
    } else {
      new_assay = new ArcAssay(identifier);
    }
    ArcControlService.props.arc.ISA.AddAssay(new_assay);
    await ArcControlService.saveARC();
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
  if(paths.length<1) return;

  const dialogProps = reactive({
    title: 'Importing Files and Directories',
    progress: 0,
    progress_text: '',
    error: '',
    abort: false
  });

  $q.dialog({
    component: ProgressDialog,
    componentProps: dialogProps
  }).onCancel(()=>{
    dialogProps.abort = true;
  });

  for(let i=0; i<paths.length; i++){
    dialogProps.progress_text = `Copying ${(i+1)}/${paths.length}: ${paths[i].split('/').pop()}`;
    await window.ipc.invoke('LocalFileSystemService.copy', [paths[i],path]);
    dialogProps.progress = (i+1)/paths.length;
    if(dialogProps.abort) break;
  }
  if(!dialogProps.abort) dialogProps.progress_text = `Done Copying ${paths.length}/${paths.length} Files`;
};

const readDir_ = async (path: string) => {
  const nodes = await window.ipc.invoke('LocalFileSystemService.readDir', path);

  const parent = path.split('/').pop().toLowerCase();

  const isMarkdown = l => {
    return ['md','txt','py','xml','cwl','fsx','json','yml','html','csv','css','js','log','gitignore','gitattributes'].some( i=>new RegExp(`\\.${i}$`,'g').test(l.toLowerCase()))
  };

  const isImage = l => {
    return ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "webp", "svg", "ico", "heic", "heif", "avif", "raw", "psd", "ai", "eps"].some( i=>new RegExp(`\\.${i}$`,'g').test(l.toLowerCase()))
  };

  const isEditable = (n,p)=>{
    return n.isDirectory && [Studies, Assays].includes(p);
  };

  for(const n of nodes){
    n.label = n.id.split('/').pop();
    n.id_rel = n.id.replace(ArcControlService.props.arc_root+'/', '');
    n.lazy = n.isDirectory;
    n.selectable = false;
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

  const enforced_order = ['studies','assays','workflows','runs'];

  nodes.sort((a,b)=>{
    const a_idx = enforced_order.indexOf(a.label);
    const b_idx = enforced_order.indexOf(b.label);
    if((a.isDirectory && !b.isDirectory) || (a_idx>=0 && b_idx<0)){
      return -1;
    } else if ((!a.isDirectory && b.isDirectory) || (b_idx>=0 && a_idx<0)){
      return 1;
    } else if (a_idx>=0 && b_idx>=0)
      return a_idx-b_idx;

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
      props.selection = node.id;
      return SwateControlService.LoadSwateState(0);
    case formatNodeEditString(Studies):
      skip(e);
      props.selection = node.id;
      return SwateControlService.LoadSwateState(1,node.label);
    case formatNodeEditString(Assays):
      skip(e);
      props.selection = node.id;
      return SwateControlService.LoadSwateState(2,node.label);
    case formatNodeEditString(Markdown):
      props.selection = node.id;
      AppProperties.active_markdown = node.id;
      return AppProperties.state=AppProperties.STATES.EDIT_MARKDOWN;
    case formatNodeEditString(Image):
      props.selection = node.id;
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
    if(elements.length===2 && ['assays','studies'].includes(elements[0]) && SwateControlService.props.object && SwateControlService.props.object.Identifier===elements[1])
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
    if(!name.includes('.'))
      name += '.md';

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

const downloadLFSFiles = async paths => {

  if(!AppProperties.user)
    return $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        title: 'Authentication Error',
        msg: 'You need to be logged in to download LFS files.'
      }
    });

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
  const patched_remote_url = GitService.patch_remote(remote_url);

  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`set-url`,remote_name,patched_remote_url],
    cwd: ArcControlService.props.arc_root
  });
  if(!response[0]) return;

  const dialogProps = reactive({
    title: 'Pulling Individual LFS Files',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  });

  for(let path of paths)
    await window.ipc.invoke('GitService.run', {
      args: ['lfs','pull','--include',`"${path}"`],
      cwd: ArcControlService.props.arc_root
    });

  // unpatch
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`set-url`,remote_name,remote_url],
    cwd: ArcControlService.props.arc_root
  });

  dialogProps.state=1;
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

  const rel_path_elements = (node.id_rel || '').split('/');

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
    items.push({
      label: "Download LFS Files",
      icon: h( 'i', icon_style, ['cloud_download'] ),
      onClick: ()=>downloadLFSFiles([node.id_rel+'/**'])
    });
  } else {
    if(node.isLFSPointer){
      items.push({
        label: "Download LFS File",
        icon: h( 'i', icon_style, ['cloud_download'] ),
        onClick: ()=>downloadLFSFiles([node.id_rel])
      });
    }
  }

  const confirm_delete = async (node,callback)=>{
    $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        title: `Delete`,
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
            icon: 'edit_note',
            initial_value: node.label,
          }
        }).onOk(
          async new_identifier => ArcControlService.rename('GetAssayRenameContracts',node.label,new_identifier)
        );
      }
    });
    items.push({
      label: "Copy",
      icon: h( 'i', icon_style, ['content_copy'] ),
      onClick: ()=>addAssay(null,null,ArcControlService.props.arc.ISA.GetAssay(node.label))
    });
    items.push({
      label: "Delete",
      icon: h( 'i', icon_style, ['delete'] ),
      onClick: ()=>confirm_delete(node,()=>ArcControlService.delete('GetAssayRemoveContracts',node.label))
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
            icon: 'edit_note',
            initial_value: node.label,
          }
        }).onOk(
          async new_identifier => ArcControlService.rename('GetStudyRenameContracts',node.label,new_identifier)
        );
      }
    });
    items.push({
      label: "Copy",
      icon: h( 'i', icon_style, ['content_copy'] ),
      onClick: ()=>addStudy(null,null,ArcControlService.props.arc.ISA.GetStudy(node.label))
    });
    items.push({
      label: "Delete",
      icon: h( 'i', icon_style, ['delete'] ),
      onClick: ()=>confirm_delete(node,()=>ArcControlService.delete('GetStudyRemoveContracts',node.label))
    });
  } else {
    //verify that the file/directory is not a MUST keep file/directory
    if (["assays", "studies", "runs", "workflows", "dataset", "protocols", "resources"].includes(node.label.toLowerCase()) === false && node.type!=='node_edit_investigation') {
      items.push({
        label: "Rename",
        icon: h( 'i', icon_style, ['edit_note'] ),
        onClick: ()=>{
          $q.dialog({
            component: StringDialog,
            componentProps: {
              title: 'Rename',
              property: 'Name',
              icon: 'edit_note',
              initial_value: node.label,
            }
          }).onOk(
            new_label => new_label && window.ipc.invoke('LocalFileSystemService.rename', [
              node.id,
              node.id.split('/').slice(0,-1).join('/')+'/'+new_label
            ])
          );
        }
      });
      items.push({
        label: "Toggle Git Ignore",
        icon: h( 'i', icon_style, ['visibility'] ),
        onClick: ()=>window.ipc.invoke('GitService.toggleGitIgnore', [ArcControlService.props.arc_root,node.id])
      });
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

onMounted( ()=>{update_path_listener = window.ipc.on('LocalFileSystemService.updatePath', updatePath);} );
onUnmounted( ()=>{update_path_listener();} );

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
    AppProperties.STATES.GIT_COMMIT,
    AppProperties.STATES.GIT_SYNC,
    AppProperties.STATES.GIT_HISTORY,
    AppProperties.STATES.VALIDATION
  ].includes(newValue)){
    props.selection = '';
  }
});

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
          style="flex:1;cursor:pointer;white-space: nowrap;"
          :class="props.selection===prop.node.id ? 'a_selected' : ''"
          @contextmenu="e=>onCellContextMenu(e,prop.node)"
          @click='e=>triggerNode(e,prop.node)'
        >
          <table class='tree_node'><tbody><tr>
            <td>
              <q-icon v-if='prop.node.icon' :name='prop.node.icon' style="padding:0 0.2em 0 0;"></q-icon>
              <span>{{ prop.node.label }}</span>
            </td>
            <td style="text-align:right">
              <q-icon v-if='prop.node.type==="assays"' name='add' class='tree_button' @click='e=>addAssay(e,prop.node)'></q-icon>
              <q-icon v-if='prop.node.type==="studies"' name='add' class='tree_button' @click='e=>addStudy(e,prop.node)'></q-icon>
              <q-badge v-if='prop.node.isLFSPointer' color="secondary" text-color="white" label="LFS" class='tree_button'/>
            </td>
          </tr></tbody></table>
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

.tree_node {
  width: 100%;
  padding: 0;
  margin: 0;
  color:#000;
}
.tree_node td {
  padding: 0;
  margin: 0;
}

.tree_button{
  text-align: center;
  padding: 0;
  margin: 0;
  border-radius: 1em;
}

.tree_button:hover{
  background:#ccc;
}

.a_selected {
  background-color: #26a69a;
  border-radius: 0.3em;
}
.a_selected .q-icon {
  color: #fff;
}
.a_selected .tree_node {
  color: #fff;
}

</style>
