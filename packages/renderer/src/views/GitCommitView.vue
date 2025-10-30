<script lang="ts" setup>

import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
import a_select from '../components/a_select.vue';
import a_tooltip from '../components/a_tooltip.vue';
import a_select_git_branch from '../components/a_select_git_branch.vue';
import ArcControlService from '../ArcControlService.ts';
import GitService from '../GitService.ts';

import AppProperties from '../AppProperties.ts';

import pDebounce from 'p-debounce';

import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import GitDialog from '../dialogs/GitDialog.vue';
import GitResetDialog from '../dialogs/GitResetDialog.vue';
import StringDialog from '../dialogs/StringDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

interface Props {
  attach_file_listener: Boolean,
  status_listener: Function,
  commit: {
    name: string,
    email: string,
    msg: string
  }
};

const iProps : Props = reactive({
  attach_file_listener: true,
  status_listener: null,

  commit: {
    name: '',
    email: '',
    msg: ''
  }
});

const raiseError = err => {
  $q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      title: 'Error',
      msg: err
    }
  });
  return false;
};

const trackChanges = async () => {
  let git_lfs = [];
  let git_add = [];
  let git_rm = [];

  const leaf_nodes = [];
  GitService.get_leaf_nodes(leaf_nodes);

  for(let node of leaf_nodes){
    if(node.type.includes('D')){
      git_rm.push(node.id);
    } else {
      git_add.push(node.id);
      if(GitService._.change_tree_selected.includes(node.id))
        git_lfs.push(node.id);
    }
  }

  // read git attributes
  const gitattributesRaw = await window.ipc.invoke('LocalFileSystemService.readFile', ArcControlService.props.arc_root+'/.gitattributes');
  const gitattributesRows = gitattributesRaw.split('\n');
  const gitattributes = {};
  for(let row of gitattributesRows){
    const s = row.split(' filter=lfs ');
    if(s.length>1)
      gitattributes[s[0]] = row;
    else
      gitattributes[row] = row;
  }

  // delete entries
  for(let file of git_rm)
    delete gitattributes[file];

  // add entries
  for(let file of git_lfs)
    if(!gitattributes.hasOwnProperty(file)) {
      const safe = file.replace(/\s/g, '[[:space:]]');
      gitattributes[file] = `${safe} filter=lfs diff=lfs merge=lfs -text`;
    }

  await window.ipc.invoke(
    'LocalFileSystemService.writeFile',
    [
      ArcControlService.props.arc_root+'/.gitattributes',
      Object.values(gitattributes).join(`\n`)
    ]
  );

  const response = await window.ipc.invoke('GitService.run', {
    args: ['add','--all',AppProperties.config.gitDebug ? '--verbose' : ''],
    cwd: ArcControlService.props.arc_root
  });
  if(!response[0]) return response;
  return [1];
};

const commit = async()=>{
  const name = iProps.commit.name;
  const email = iProps.commit.email;
  const msg = iProps.commit.msg;
  if(!name || !email || !msg)
    return raiseError('Name, eMail, and commit message required');

  const branches = await GitService.get_branches();

  if (!branches.current)
    return raiseError('No current branch selected');

  if(branches.current && branches.current.includes('HEAD detached'))
    return raiseError('Unable to commit in detached head state.<br>It seems you have checked out a pervious commit in the git history.<br>Either switch back to the latest commit, or create a new branch.');

  iProps.attach_file_listener = false;

  const dialogProps = reactive({
    title: 'Committing Changes',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk( async () => {
    await init();
    await GitService.update_lfs_files();
    iProps.attach_file_listener = true;
  });

  let response=null;
  response = await GitService.set_git_user(name,email);
  if(!response[0])
    return dialogProps.state=2;

  response = await trackChanges();
  if(!response[0])
    return dialogProps.state=2;

  response = await window.ipc.invoke('GitService.run', {
    args: ['commit','-m','"'+msg+'"',AppProperties.config.gitDebug ? '--verbose' : '--quiet'],
    cwd: ArcControlService.props.arc_root,
    silent:false
  });
  if(!response[0])
    return dialogProps.state=2;
  dialogProps.state = 1;
};

const abortMerge = async()=>{
  const dialogProps = reactive({
    title: 'Aborting Interactive Merge',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk( async () => {
    ArcControlService.readARC();
    init();
  });

  const response = await window.ipc.invoke('GitService.run', {
    args: [`rebase`,`--abort`],
    cwd: ArcControlService.props.arc_root
  });
  dialogProps.state = response[0] ? 1 : 2;
};

const reset = async()=>{
  $q.dialog({
    component: GitResetDialog
  }).onOk( async hard => {
    const dialogProps = reactive({
      title: `Resetting ARC (${hard?'hard':'soft'})`,
      ok_title: 'Ok',
      cancel_title: null,
      state: 0,
    });

    $q.dialog({
      component: GitDialog,
      componentProps: dialogProps
    }).onOk( async () => {
      ArcControlService.readARC();
      init();
    });

    // perform git reset
    {
      const response = await window.ipc.invoke('GitService.run', {
        args: [`reset`,`--hard`],
        cwd: ArcControlService.props.arc_root
      });
      if(!response[0]) return dialogProps.state = 2;
    }

    // optionally perform git clean
    if(hard){
      const response = await window.ipc.invoke('GitService.run', {
        args: [`clean`,`-d`, `-f`],
        cwd: ArcControlService.props.arc_root
      });
      if(!response[0]) return dialogProps.state = 2;
    }
    dialogProps.state = 1;
  });
};

const init = async()=>{

  if(!AppProperties.user)
    AppProperties.state = AppProperties.STATES.HOME;

  await GitService.parse_status();

  iProps.commit.name = AppProperties.user.name;
  iProps.commit.email = AppProperties.user.email;
  iProps.commit.msg = '';
};

const debouncedParseStatus = pDebounce(GitService.parse_status,300);
const filteredParseStatus = ([path,type])=>{
  if(!iProps.attach_file_listener) return;
  if(path.startsWith(ArcControlService.props.arc_root+'/.git/')) return;
  debouncedParseStatus();
};

onMounted(()=>{
  watch(()=>AppProperties.user, init);
  watch(()=>AppProperties.force_commit_update, init);
  iProps.status_listener = window.ipc.on('LocalFileSystemService.updatePath', filteredParseStatus);
  init();
});
onUnmounted(()=>{
  iProps.status_listener();
});

const formatFileSize = (size) => {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}

</script>

<template>
  <q-list bordered class="rounded-borders">
    <ViewItem
      icon="rule"
      label="Commit Changes"
      caption="Track changes of the ARC with git"
      group="git"
    >
      <q-card flat>
        <q-card-section style="padding-bottom:0;margin-bottom:-1.2em;">
          <div class='row' >
            <div class='col'>
              <a_input v-model='iProps.commit.name' label="Name" readonly/>
            </div>
            <div class='col'>
              <a_input v-model='iProps.commit.email' label="eMail" readonly/>
            </div>
            <a_tooltip>
              Once logged in to the DataHUB your Name and eMail address are automatically filled out
            </a_tooltip>
          </div>

          <div class='row' >
            <div class='col'>
              <a_select_git_branch />
              <a_tooltip>
                You can add (<q-icon name="add_circle" color="secondary" />), delete (<q-icon name="delete" color="grey-9" />), or switch between branches of your ARC
              </a_tooltip>
            </div>
          </div>

          <div class='row' >
            <div class='col'>
              <a_input v-model='iProps.commit.msg' label='Commit Message' type="textarea" autogrow/>
              <a_tooltip>
                Add a commit message to document and communicate your changes
              </a_tooltip>
            </div>
          </div>

          <div class='row' >
            <div class='col'>
              <a_input type="number" v-model='GitService._.lfs_size_limit' label="Large File Storage Limit in MB"/>
              <a_tooltip>
                You can adapt the large file storage (LFS) Limit as needed
              </a_tooltip>
            </div>
          </div>
        </q-card-section>

        <br>
        <q-separator/>
        <br>

        <q-card-section style="padding-top:0">
          <q-tree
            v-if='GitService._.change_tree.length && GitService._.change_tree[0].children.length'
            :nodes="GitService._.change_tree"
            node-key="id"
            label-key="name"
            dense
            default-expand-all
            style="display:inline-block"
            @lazy-load="GitService.load"
            v-model:selected="GitService._.change_tree_selected_"
            v-model:expanded="GitService._.change_tree_expanded"
          >
            <template v-slot:header-root="prop">
              <div class="row items-center">
                <div class="text-weight-bold text-primary text-body1">{{ prop.node.name }}
                  <q-icon name="help" color='grey-6'/>
                  <q-tooltip style="font-size:1.1em">
                    This tree lists all files that will be added <q-icon name="add_box" color='white'/>, removed <q-icon name="indeterminate_check_box" color='white'/>, and updated <q-icon name="edit_square" color='white'/>.<br>
                    Their file sizes and if they are tracked by <q-badge color="white" text-color="grey-9" label="LFS" /> are shown on the right.<br>
                    By clicking on nodes one can track or untrack individual files and directories with LFS.
                  </q-tooltip>
                </div>
              </div>
            </template>

            <template v-slot:default-header="prop">
              <div
                style="display:flex;cursor:pointer;white-space: nowrap;width:100%"
              >
                <div v-if='!GitService._.change_tree_expanded.includes(prop.node.id)' style="margin-right:0.2em;flex-shrink:0;">
                  <q-icon v-if='prop.node.types.includes("D")' name='indeterminate_check_box' color='red' />
                  <q-icon v-if='["M","C","R"].some(i=>prop.node.types.includes(i))' name='edit_square' color='teal' />
                  <q-icon v-if='["?","A"].some(i=>prop.node.types.includes(i))' name='add_box' color='teal' />
                </div>
                <span class="text-black" style="margin-right:0.2em;flex-grow:1;">{{ prop.node.name }}</span>
                <q-badge
                  color="transparent"
                  text-color="grey"
                  :label="formatFileSize(prop.node.size)" style="margin-left:1em;flex-shrink:0"
                />
                <q-badge v-if='prop.node.containsLFS && !GitService._.change_tree_expanded.includes(prop.node.id)' color="teal" text-color="white" label="LFS" style="margin-left:1em;flex-shrink:0"/>
              </div>
            </template>
          </q-tree>
          <q-banner v-else class="">
            <template v-slot:avatar>
              <q-icon name="warning" color="grey-6" />
            </template>
            No Changes to Commit
          </q-banner>
        </q-card-section>

        <q-card-actions align='right' style="padding:0 2.1em 1em 2.1em;">
          <a_btn v-if='GitService._.rebase_in_progress' label="Abort Merge" @click="abortMerge" icon='dangerous' color='red-10'>
            <a_tooltip>
              There is an interactive git rebase in progress. You can abort the merge process by reverting back to the last commit.
            </a_tooltip>
          </a_btn>
          <a_btn label="Reset" @click="reset" icon='change_circle'>
            <a_tooltip>
              Click RESET to undo your latest changes and convert the ARC to the last saved commit
            </a_tooltip>
          </a_btn>
          <a_btn label="Commit" @click="commit" icon='check_circle' :disabled='GitService._.change_tree.length<1 || GitService._.change_tree[0].children.length<1'>
            <a_tooltip>
              Once ready, click COMMIT to store your changes locally
            </a_tooltip>
          </a_btn>
        </q-card-actions>

      </q-card>
    </ViewItem>
  </q-list>
</template>

