<script lang="ts" setup>

import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
import a_select from '../components/a_select.vue';
import a_select_git_branch from '../components/a_select_git_branch.vue';
import ArcControlService from '../ArcControlService.ts';

import AppProperties from '../AppProperties.ts';

import pDebounce from 'p-debounce';

import GitDialog from '../dialogs/GitDialog.vue';
import StringDialog from '../dialogs/StringDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

interface Props {
  git_status: string[][],
  error: string,
  lfs_limit: number,
  commit: {
    name: string,
    email: string,
    msg: string
  }
};

const iProps : Props = reactive({
  git_status: [],
  error: '',
  lfs_limit: 1,

  commit: {
    name: '',
    email: '',
    msg: ''
  }
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
    args: [`config`,`user.name`,'"'+name+'"'],
    cwd: ArcControlService.props.arc_root
  });
  if(!response[0]) return response;
  response = await window.ipc.invoke('GitService.run', {
    args: [`config`,`user.email`,email],
    cwd: ArcControlService.props.arc_root
  });
  return response;
};

const trackChanges = async () => {
  let git_lfs = [];
  let git_add = [];
  let git_rm = [];
  for(let item of iProps.git_status){
    if(item[0].includes('D')){
      git_rm.push(item[1]);
    } else {
      git_add.push(item[1]);
      if(isTrackedWithLFS(item)){
        const gitattributes = '.gitattributes';
        if(!git_add.includes(gitattributes))
          git_add.push(gitattributes);
        git_lfs.push(item[1]);
      }
    }
  }

  for(let [a,b,c] of [
    [['rm'],git_rm,1],
    [['lfs','untrack'],git_rm,1],
    [['lfs','track'],git_lfs,2],
    [['add'],git_add,3]
  ]){
    for(let i=0; i<b.length; i++){
      const args = a.concat(['"'+b[i]+'"']);
      const response = await window.ipc.invoke('GitService.run', {
        args: args,
        cwd: ArcControlService.props.arc_root
      });
      if(!response[0]) return response;
    }
  }
  return [1];
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
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk( async () => {
    await init();
  });

  let response=null;
  response = await setGitUser(name,email);
  if(!response[0])
    return dialogProps.state=2;

  response = await trackChanges();
  if(!response[0])
    return dialogProps.state=2;

  response = await window.ipc.invoke('GitService.run', {
    args: ['commit','-m','"'+msg+'"'],
    cwd: ArcControlService.props.arc_root
  });
  if(!response[0])
    return dialogProps.state=2;

  dialogProps.state = 1;

  AppProperties.force_lfs_update++;
};

const isTrackedWithLFS = item=>{
  return item[2]>=parseFloat(iProps.lfs_limit);
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
  }).onOk( async () => {
    ArcControlService.readARC();
    init();
  });

  const response = await window.ipc.invoke('GitService.run', {
    args: [`reset`,`--hard`],
    cwd: ArcControlService.props.arc_root
  });
  dialogProps.state = response[0] ? 1 : 2;
};

const init = async()=>{

  if(!AppProperties.user)
    AppProperties.state = AppProperties.STATES.HOME;

  iProps.error = '';
  await getStatus();

  iProps.commit.name = AppProperties.user.name;
  iProps.commit.email = AppProperties.user.email;
  iProps.commit.msg = '';
};

const debouncedGetStatus = pDebounce(getStatus,300);
const filteredGetStatus = ([path,type])=>{
  if(path.startsWith(ArcControlService.props.arc_root+'/.git/')) return;
  debouncedGetStatus();
};

onMounted(()=>{
  watch(()=>AppProperties.user, init);
  watch(()=>AppProperties.force_commit_update, init);
  window.ipc.on('LocalFileSystemService.updatePath', filteredGetStatus);
  init();
});
onUnmounted(()=>{
  window.ipc.off('LocalFileSystemService.updatePath', filteredGetStatus);
});

</script>

<template>
  <q-list bordered class="rounded-borders">
    <ViewItem
      icon="rule"
      label="Commit Changes"
      caption="Track changes of the ARC with git"
      group="git"
      defaultOpened
      hide-expand-icon
      expand-icon-toggle
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
          </div>

          <div class='row' >
            <div class='col'>
              <a_select_git_branch />
            </div>
          </div>

          <div class='row' >
            <div class='col'>
              <a_input v-model='iProps.commit.msg' label='Commit Message' type="textarea" autogrow/>
            </div>
          </div>

          <div class='row' >
            <div class='col'>
              <a_input type="number" v-model='iProps.lfs_limit' label="Large File Storage Limit in MB"/>
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
                <q-item-label>{{state[1]}} <span :style="isTrackedWithLFS(state) ? 'font-weight:bold':''">{{!state[0].includes("D") ? `(${state[2].toFixed(2)} MB)` : ''}}</span></q-item-label>
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
  </q-list>
</template>

