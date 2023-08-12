<script lang="ts" setup>

import { onMounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import ArcCommanderService from '../ArcCommanderService.ts';

import Property from '../interfaces/Property.ts';

import appProperties from '../AppProperties.ts';

const iProps = reactive({
  git_status: [],
  error: '',
  succ: '',
});

class CommitProperties extends PropertyTree {
  // constructor(){
  //   super([
  //     new Property('name',{label:'Full Name'}),
  //     new Property('email',{label:'eMail'}),
  //     new Property('remote',{label:'Remote'}),
  //     new Property('msg',{label:'Commit Message',hint:'A short description of the made changes',type:'textarea'}),
  //   ])
  // }
};

const raiseError = err => {
  iProps.busy = false;
  iProps.error = err;
  return false;
};

const commitProperties = new CommitProperties();
const form = [
  [
    commitProperties.model.name,
    commitProperties.model.email
  ],
  [commitProperties.model.remote],
  [commitProperties.model.msg],
];

const getStatus = async()=>{
  const response = await window.ipc.invoke('GitService.run', {
    args: [`status`,`-z`],
    cwd: ArcCommanderService.props.arc_root
  });
  iProps.git_status = response[1].split('\u0000').map(x => [x.slice(0,2),x.slice(3)]).slice(0,-1);
};

const setGitUser = async(name,email)=>{
  let response = null;

  // set git user and email
  response = await window.ipc.invoke('GitService.run', {
    args: [`config`,`user.name`,name],
    cwd: ArcCommanderService.props.arc_root
  });
  response = await window.ipc.invoke('GitService.run', {
    args: [`config`,`user.email`,email],
    cwd: ArcCommanderService.props.arc_root
  });
};

const trackChanges = async()=>{
  let git_add = ['add'];
  let git_rm = ['rm'];
  for(let item of iProps.git_status){
    if(item[0].includes('D'))
      git_rm.push(item[1]);
    else
      git_add.push(item[1]);
  }

  if(git_rm.length>1)
    await window.ipc.invoke('GitService.run', {
      args: git_rm,
      cwd: ArcCommanderService.props.arc_root
    });

  if(git_add.length>1)
    await window.ipc.invoke('GitService.run', {
      args: git_add,
      cwd: ArcCommanderService.props.arc_root
    });
};

const commit = async()=>{
  iProps.busy = true;
  iProps.error = '';
  iProps.succ = '';
  const name = commitProperties.model.name.value;
  const email = commitProperties.model.email.value;
  const msg = commitProperties.model.msg.value;
  if(!name || !email || !msg)
    return raiseError('Name, eMail, and commit message required');

  await setGitUser(name,email);
  await trackChanges();

  await window.ipc.invoke('GitService.run', {
    args: ['commit','-m',msg],
    cwd: ArcCommanderService.props.arc_root
  });

  await init();

  iProps.succ = 'Commit Successful';
  iProps.busy = false;
};

const push = async()=>{
  iProps.busy = true;
  iProps.error = '';
  iProps.succ = '';
  if(iProps.git_status.length>0)
    return raiseError('Commit changes before push.');
  if(!appProperties.user)
    return raiseError('Sign in to push to <b>nfdi4plants.org</b>.');

  let response = null;

  // get current branch
  response = await window.ipc.invoke('GitService.run', {
    args: [`branch`],
    cwd: ArcCommanderService.props.arc_root
  });
  const branches = response[1].split('\n').slice(0,-1);
  const cBranch = branches.filter(x=>x[0]=='*').pop().slice(2);
  if(!cBranch)
    return raiseError('Unable to find current branch');

  // fetch remote
  const remote = commitProperties.model.remote.value;
  const remotes = await getRemotes();
  let remoteExistsLocally = false;
  for(const r of remotes)
    if(r.includes(remote)){
      remoteExistsLocally = true;
      break;
    }

  if(!remoteExistsLocally)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`add`,'origin',remote],
      cwd: ArcCommanderService.props.arc_root
    });

  // patch remote with token
  const patched_remote = `https://oauth2:${appProperties.user.token.access_token}@git.nfdi4plants.org` + remote.split('git.nfdi4plants.org')[1];

  // add patched remote
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`add`,'arcitect_remote',patched_remote],
    cwd: ArcCommanderService.props.arc_root
  });

  // push
  response = await window.ipc.invoke('GitService.run', {
    args: [`push`,`arcitect_remote`,cBranch],
    cwd: ArcCommanderService.props.arc_root
  });
  if(response[1].includes('up-to-date'))
    iProps.succ = 'Everything Up-To-Date';
  else if(response[1].includes('Updates were rejected because the remote contains work'))
    iProps.error = 'ARC on server contains updates. Please download updates first.';
  else
    iProps.succ = 'Upload Successful';

  // remove patched remote
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`remove`,'arcitect_remote'],
    cwd: ArcCommanderService.props.arc_root
  });

  iProps.busy = false;
};

const pull = async()=>{
  iProps.busy = true;
  iProps.error = '';
  iProps.succ = '';
  if(iProps.git_status.length>0)
    return raiseError('Commit changes before pull.');
  if(!appProperties.user)
    return raiseError('Sign in to pull from <b>nfdi4plants.org</b>.');

  let response = null;

  // get current branch
  response = await window.ipc.invoke('GitService.run', {
    args: [`branch`],
    cwd: ArcCommanderService.props.arc_root
  });
  const branches = response[1].split('\n').slice(0,-1);
  const cBranch = branches.filter(x=>x[0]=='*').pop().slice(2);
  if(!cBranch)
    return raiseError('Unable to find current branch.');

  // fetch remote
  const remote = commitProperties.model.remote.value;
  const remotes = await getRemotes();
  let remoteExistsLocally = false;
  for(const r of remotes)
    if(r.includes(remote)){
      remoteExistsLocally = true;
      break;
    }

  if(!remoteExistsLocally)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`add`,'origin',remote],
      cwd: ArcCommanderService.props.arc_root
    });

  // patch remote with token
  const patched_remote = `https://oauth2:${appProperties.user.token.access_token}@git.nfdi4plants.org` + remote.split('git.nfdi4plants.org')[1];

  // add patched remote
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`add`,'arcitect_remote',patched_remote],
    cwd: ArcCommanderService.props.arc_root
  });

  // pull
  response = await window.ipc.invoke('GitService.run', {
    args: [`pull`,`arcitect_remote`,cBranch],
    cwd: ArcCommanderService.props.arc_root
  });
  if(response[1].includes('Already up to date.'))
    iProps.succ = 'Everything Up-To-Date';
  else
    iProps.succ = 'Download Successful';

  // remove patched remote
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`remove`,'arcitect_remote'],
    cwd: ArcCommanderService.props.arc_root
  });

  iProps.busy = false;
};

const getGitUser = async()=>{
  const response = await window.ipc.invoke('GitService.run', {
    args: [`config`,`--list`],
    cwd: ArcCommanderService.props.arc_root
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
    cwd: ArcCommanderService.props.arc_root
  });
  return response[1].split('\n');
};

const getRemote = async()=>{
  const remotes = await getRemotes();
  for(let r of remotes)
    if(r.includes('(push)') && r.includes('git.nfdi4plants.org'))
      return r.replace(' (push)','').split('\t')[1];

  return `https://git.nfdi4plants.org/${appProperties.user.username}/${ArcCommanderService.props.arc_root.split('/').pop()}.git`;
};

const init = async()=>{
  iProps.busy = true;
  iProps.error = '';
  iProps.succ = '';
  await getStatus();
  const remote = await getRemote();

  let user = null;
  if(appProperties.user)
    user = appProperties.user;
  else
    user = await getGitUser();

  commitProperties.init({
    'name': user.name,
    'email': user.email,
    'remote': remote,
    'msg': '',
  });

  iProps.busy = false;
};

onMounted(init);

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
        <div class='row' v-for="(row,i) in form">
          <div class='col' v-for="(property,j) in row">
            <FormInput :property='property'></FormInput>
          </div>
        </div>
      </q-card-section>

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
              <q-item-label>{{state[1]}}</q-item-label>
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
        <q-banner rounded inline-actions class="bg-secondary text-white" dense v-if='iProps.succ'>
          <template v-slot:avatar>
            <q-icon name="check_circle"/>
          </template>
          <div v-html='iProps.succ'></div>
        </q-banner>
      </div>

      <q-card-actions align='right' style="padding:0 2.1em 1em 2.1em;">
        <q-btn label="Refresh" style="margin-bottom:0.5em;" @click="getStatus" icon='change_circle' color="secondary" :disabled='ArcCommanderService.props.busy || iProps.busy'/>
        <q-btn label="Commit" style="margin-bottom:0.5em;" @click="commit" icon='check_circle' color="secondary" :disabled='ArcCommanderService.props.busy || iProps.busy || iProps.git_status.length<1'/>
        <q-btn label="Upload" style="margin-bottom:0.5em;" @click="push" icon='cloud_upload' color="secondary" :disabled='ArcCommanderService.props.busy || iProps.busy'/>
        <q-btn label="Download" style="margin-bottom:0.5em;" @click="pull" icon='cloud_download' color="secondary" :disabled='ArcCommanderService.props.busy || iProps.busy'/>
        <!--<q-btn label="Sync" @click="" icon='cloud_sync' color="secondary" :disabled='ArcCommanderService.props.busy'/>-->
      </q-card-actions>

    </q-card>
  </ViewItem>
</template>
