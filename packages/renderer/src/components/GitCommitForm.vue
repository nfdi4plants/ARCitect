<script lang="ts" setup>

import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import ArcControlService from '../ArcControlService.ts';

import Property from '../Property.ts';

import AppProperties from '../AppProperties.ts';

import ProgressDialog from '../dialogs/ProgressDialog.vue';
import GitDialog from '../dialogs/GitDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

const iProps = reactive({
  git_status: [],
  error: '',
  lfs_limit: 1,
  lfs_pull: false,
  commit: {
    name: '',
    email: '',
    remote: '',
    msg: ''
  },
  form: []
});

iProps.form = [
  [
    Property( iProps.commit, 'name', {label:'Full Name'}),
    Property( iProps.commit, 'email', {label:'eMail'} )
  ],
  [Property( iProps.commit, 'remote')],
  [Property( iProps.commit, 'msg', {label:'Commit Message',hint:'A short description of the made changes',type:'textarea'})],
  [
    Property( iProps, 'lfs_limit', {label:'LFS Size Limit in MB',hint:'File above limit are tracked via LFS',dense:true}),
    Property( iProps, 'lfs_pull', {type:'checkbox',label:'Download LFS Files'})
  ],
];

const raiseError = err => {
  iProps.error = err;
  return false;
};

const getStatus = async()=>{
  const response = await window.ipc.invoke('GitService.run', {
    args: [`status`,`-z`,`-u`],
    cwd: ArcControlService.props.arc_root
  });
  const status = response[1].split('\u0000').map(x => [x.slice(0,2),x.slice(3)]).slice(0,-1);
  const sizes = await window.ipc.invoke('LocalFileSystemService.getFileSizes', status.map(x=> ArcControlService.props.arc_root +'/'+x[1]));
  for(let i in sizes)
    status[i].push(sizes[i]);
  iProps.git_status = status;
};

const setGitUser = async(name,email)=>{
  let response = null;

  // set git user and email
  response = await window.ipc.invoke('GitService.run', {
    args: [`config`,`user.name`,name],
    cwd: ArcControlService.props.arc_root
  });
  response = await window.ipc.invoke('GitService.run', {
    args: [`config`,`user.email`,email],
    cwd: ArcControlService.props.arc_root
  });
};

const trackChanges = async progress =>{
  let git_lfs = ['lfs','track'];
  let git_add = ['add'];
  let git_rm = ['rm'];
  for(let item of iProps.git_status){
    if(item[0].includes('D'))
      git_rm.push(item[1]);
    else
      git_add.push(item[1]);

    if(isTrackedWithLFS(item)){
      const gitattributes = ArcControlService.props.arc_root + '/.gitattributes';
      if(!git_add.includes(gitattributes))
        git_add.push(gitattributes);
      git_lfs.push(item[1]);
    }
  }

  if(git_rm.length>1)
    await window.ipc.invoke('GitService.run', {
      args: git_rm,
      cwd: ArcControlService.props.arc_root
    });
  progress[1][1]=1;

  if(git_lfs.length>2)
    await window.ipc.invoke('GitService.run', {
      args: git_lfs,
      cwd: ArcControlService.props.arc_root
    });
  progress[2][1]=1;

  if(git_add.length>1)
    await window.ipc.invoke('GitService.run', {
      args: git_add,
      cwd: ArcControlService.props.arc_root
    });
  progress[3][1]=1;
};

const commit = async()=>{
  const name = iProps.commit.name;
  const email = iProps.commit.email;
  const msg = iProps.commit.msg;
  if(!name || !email || !msg)
    return raiseError('Name, eMail, and commit message required');

  const dialogProps = reactive({
    title: 'Committing Changes',
    ok_title: 'Ok',
    cancel_title: null,
    error: '',
    succ: '',
    items: [
      ['Retrieving User Credentials',0],
      ['Removing Files',0],
      ['Tracking LFS Files',0],
      ['Adding Files',0],
      ['Performing Commit',0],
    ]
  });

  $q.dialog({
    component: ProgressDialog,
    componentProps: dialogProps
  }).onOk( async () => {
    await init();
  });

  await setGitUser(name,email);
  dialogProps.items[0][1] = 1;
  await trackChanges(dialogProps.items);

  await window.ipc.invoke('GitService.run', {
    args: ['commit','-m',msg],
    cwd: ArcControlService.props.arc_root
  });
  dialogProps.succ = 'Commit Complete';
  dialogProps.items[4][1] = 1;
};

const getBranches = async () => {
  const response = await window.ipc.invoke('GitService.run', {
    args: [`branch`],
    cwd: ArcControlService.props.arc_root
  });
  const branches_raw = response[1].split('\n').slice(0,-1);
  const branches = {
    list: [],
    current: null
  };
  for(let branch of branches_raw){
    const branch_name = branch.slice(2);
    branches.list.push(branch_name);
    if(branch[0]==='*')
      branches.current = branch_name;
  }

  return branches;
};

const patchRemote = async () => {
  let response = null;

  const remote = iProps.commit.remote;
  const remotes = await getRemotes();

  let remoteExistsLocally = false;
  for(const r in remotes)
    if(remotes[r].includes(remote)){
      remoteExistsLocally = true;
      break;
    }
  if(!remoteExistsLocally)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`add`,'origin',remote],
      cwd: ArcControlService.props.arc_root
    });

  // patch remote with token
  const patched_remote = `https://oauth2:${AppProperties.user.token.access_token}@git.nfdi4plants.org` + remote.split('git.nfdi4plants.org')[1];

  // add patched remote
  if(Object.keys(remotes).includes('arcitect_remote'))
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`remove`,'arcitect_remote'],
      cwd: ArcControlService.props.arc_root
    });
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`add`,'arcitect_remote',patched_remote],
    cwd: ArcControlService.props.arc_root
  });
  return patched_remote;
};

const push = async()=>{
  iProps.error = '';
  if(iProps.git_status.length>0)
    return raiseError('Commit changes before push.');
  if(!AppProperties.user)
    return raiseError('Sign in to push to <b>nfdi4plants.org</b>.');

  const dialogProps = reactive({
    title: 'Uploading ARC',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk( async () => {
    await init();
  });

  let response = null;

  // get current branch
  const branches = await getBranches();
  if(!branches.current) return dialogProps.state=2;

  // patch remote
  const patched_remote = await patchRemote();
  if(!patched_remote) return dialogProps.state=2;

  // push
  response = await window.ipc.invoke('GitService.run', {
    args: [`push`,`--verbose`,`--atomic`,`--progress`,`arcitect_remote`,branches.current],
    cwd: ArcControlService.props.arc_root
  });

  // remove patched remote
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`remove`,'arcitect_remote'],
    cwd: ArcControlService.props.arc_root
  });

  dialogProps.state=1;
};

const isTrackedWithLFS = item=>{
  return item[2]>iProps.lfs_limit;
};

const pull = async()=>{
  iProps.busy = true;
  iProps.error = '';
  if(iProps.git_status.length>0)
    return raiseError('Commit changes before pull.');
  if(!AppProperties.user)
    return raiseError('Sign in to pull from <b>nfdi4plants.org</b>.');

  const dialogProps = reactive({
    title: 'Downloading ARC',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk( async () => {
    await init();
  });

  let response = null;

  // get current branch
  const branches = await getBranches();
  if(!branches.current) return dialogProps.state=2;

  // patch remote
  const patched_remote = await patchRemote();
  if(!patched_remote) return dialogProps.state=2;

  // pull
  response = await window.ipc.invoke('GitService.run', {
    args: [`pull`,`arcitect_remote`,branches.current,'--progress'],
    cwd: ArcControlService.props.arc_root
  });
  if(iProps.lfs_pull){
    response = await window.ipc.invoke('GitService.run', {
      args: [`lfs`,`pull`,`arcitect_remote`,branches.current],
      cwd: ArcControlService.props.arc_root
    });
  }

  // remove patched remote
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`remove`,'arcitect_remote'],
    cwd: ArcControlService.props.arc_root
  });
  dialogProps.state=1;
};

const getGitUser = async()=>{
  const response = await window.ipc.invoke('GitService.run', {
    args: [`config`,`--list`],
    cwd: ArcControlService.props.arc_root
  });
  let name='';
  let email='';
  for(let row of response[1].split('\n')){
    if(row.includes('user.name='))
      name = row.split('user.name=').pop();
    else if(row.includes('user.email='))
      email = row.split('user.email=').pop();
  }
  return {
    name: name,
    email: email
  };
};

const getRemotes = async()=>{
  const response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`-v`],
    cwd: ArcControlService.props.arc_root
  });
  const remotes = {};
  for(let row of response[1].split('\n').slice(0,-1)){
    const row_ = row.split('\t');
    remotes[row_[0]] = row_[1];
  }
  return remotes;
};

const getRemote = async()=>{
  const remotes = await getRemotes();
  for(let r in remotes)
    if(remotes[r][1].includes('(push)') && remotes[r][1].includes('git.nfdi4plants.org'))
      return remotes[r][1].replace(' (push)','');

  if(AppProperties.user)
    return `https://git.nfdi4plants.org/${AppProperties.user.username}/${ArcControlService.props.arc_root.split('/').pop().split(' ').join('_')}.git`;

  return '';
};

const init = async()=>{

  iProps.busy = true;
  iProps.error = '';
  await getStatus();
  const remote = await getRemote();

  let user = null;
  if(AppProperties.user)
    user = AppProperties.user;
  else
    user = await getGitUser();

  iProps.commit.name = user.name;
  iProps.commit.email = user.email;
  iProps.commit.remote = remote;
  iProps.commit.msg = '';

  for(const row of iProps.form)
    for(const property of row)
      property.updateOriginalValue();

  iProps.busy = false;

  window.ipc.on('LocalFileSystemService.updatePath', getStatus);
};

onMounted(init);
onUnmounted(()=>window.ipc.off('LocalFileSystemService.updatePath', getStatus));
watch(()=>AppProperties.user, init);

</script>

<template>
  <ViewItem
    icon="update"
    label="Update"
    caption="Commit changes and upload ARC"
    group="git"
    defaultOpened
    @before-show='init'
  >
    <q-card flat>
      <q-card-section style="padding-bottom:0;margin-bottom:-1.2em;">
        <div class='row' v-for="(row,i) in iProps.form">
          <div class='col' v-for="(property,j) in row">
            <FormInput :property='property'></FormInput>
          </div>
        </div>
      </q-card-section>

      <br>
      <q-separator/>
      <br>

      <q-card-section style="padding-top:0">
        <q-list dense>
          <q-item>
            <q-item-section>
              <q-item-label style="font-weight:bold;font-size:1em;">Changes</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if='iProps.git_status.length<1'>
            <q-item-section avatar>
              <q-icon color='secondary' name='inventory'></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>No changes to commit</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-for='(state,i) in iProps.git_status'>
            <q-item-section avatar style="min-width:2em;">
              <q-icon color='secondary' :name="state[0].includes('M') ? 'edit_square' : state[0].includes('D') ? 'indeterminate_check_box' : 'add_box'"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{state[1]}} {{!state[0].includes("D") ? `(${state[2].toFixed(2)} MB)` : ''}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <div style="margin:0 2em 0.4em 2em;">
        <q-banner rounded inline-actions class="bg-red-10 text-white" dense v-if='iProps.error'>
          <template v-slot:avatar>
            <q-icon name="warning"/>
          </template>
          <div v-html='iProps.error'></div>
        </q-banner>
        <q-banner rounded inline-actions class="bg-red-10 text-white" dense v-if='!AppProperties.user'>
          <template v-slot:avatar>
            <q-icon name="warning"/>
          </template>
          <div>Sign in to push to <b>nfdi4plants.org</b>.</div>
        </q-banner>
      </div>

      <q-card-actions align='right' style="padding:0 2.1em 1em 2.1em;">
        <q-btn label="Commit" style="margin-bottom:0.5em;" @click="commit" icon='check_circle' color="secondary" :disabled='ArcControlService.props.busy || iProps.busy || iProps.git_status.length<1'/>
        <q-btn label="Upload" style="margin-bottom:0.5em;" @click="push" icon='cloud_upload' color="secondary" :disabled='ArcControlService.props.busy || iProps.busy || !AppProperties.user'/>
        <q-btn label="Download" style="margin-bottom:0.5em;" @click="pull" icon='cloud_download' color="secondary" :disabled='ArcControlService.props.busy || iProps.busy || !AppProperties.user'/>
        <!--<q-btn label="Sync" @click="" icon='cloud_sync' color="secondary" :disabled='ArcControlService.props.busy'/>-->
      </q-card-actions>

    </q-card>
  </ViewItem>
</template>
