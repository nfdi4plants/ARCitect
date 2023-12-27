<script lang="ts" setup>

import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
import ArcControlService from '../ArcControlService.ts';

import AppProperties from '../AppProperties.ts';

import GitDialog from '../dialogs/GitDialog.vue';
import ProgressDialog from '../dialogs/ProgressDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

const iProps = reactive({
  git_status: [],
  error: '',
  lfs_limit: 1,

  commit: {
    name: '',
    email: '',
    msg: ''
  },

  userListener: ()=>{}
});

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

const isTrackedWithLFS = item=>{
  return item[2]>iProps.lfs_limit;
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

const reset = async()=>{

  const dialogProps = reactive({
    title: 'Resetting ARC',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  });

  const response = await window.ipc.invoke('GitService.run', {
    args: [`reset`,`--hard`],
    cwd: ArcControlService.props.arc_root
  });

  dialogProps.state = response[0] ? 1 : 2;
};

const init = async()=>{

  iProps.error = '';
  await getStatus();

  let user = null;
  if(AppProperties.user)
    user = AppProperties.user;
  else
    user = await getGitUser();

  iProps.commit.name = user.name;
  iProps.commit.email = user.email;
  iProps.commit.msg = '';
};

onMounted(()=>{
  iProps.userListener = watch(()=>AppProperties.user, init);
  window.ipc.on('LocalFileSystemService.updatePath', getStatus);
  init();
});
onUnmounted(()=>{
  iProps.userListener(); // disable old listener
  window.ipc.off('LocalFileSystemService.updatePath', getStatus);
});

</script>

<template>
  <ViewItem
    icon="verified"
    label="Commit"
    caption="Track changes of the ARC"
    group="git"
    defaultOpened
  >
    <q-card flat>
      <q-card-section style="padding-bottom:0;margin-bottom:-1.2em;">
        <div class='row' >
          <div class='col'>
            <a_input v-model='iProps.commit.name' label="Name"/>
          </div>
          <div class='col'>
            <a_input v-model='iProps.commit.email' label="eMail"/>
          </div>
        </div>

        <div class='row' >
          <div class='col'>
            <a_input v-model='iProps.commit.msg' label='Commit Message' type="textarea"/>
          </div>
        </div>

        <div class='row' >
          <div class='col'>
            <a_input type="number" v-model='iProps.lfs_limit' label="LFS Limit in MB"/>
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
              <q-icon :color="state[0].includes('D') ? 'red-10' : 'secondary'" :name="state[0].includes('M') ? 'edit_square' : state[0].includes('D') ? 'indeterminate_check_box' : 'add_box'"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{state[1]}} <span :style="state[2]>=iProps.lfs_limit ? 'font-weight:bold':''">{{!state[0].includes("D") ? `(${state[2].toFixed(2)} MB)` : ''}}</span></q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align='right' style="padding:0 2.1em 1em 2.1em;">
        <a_btn v-if='iProps.error' color="red-10" icon='warning' :label="iProps.error" no-caps style="margin-right:auto"/>
        <a_btn label="Reset" @click="reset" icon='change_circle'/>
        <a_btn label="Commit" @click="commit" icon='check_circle' :disabled='iProps.git_status.length<1'/>
      </q-card-actions>

    </q-card>
  </ViewItem>
</template>
