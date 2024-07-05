<script lang="ts" setup>

import { onMounted, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import a_checkbox from '../components/a_checkbox.vue';
import a_btn from '../components/a_btn.vue';
import ArcControlService from '../ArcControlService.ts';

import AppProperties from '../AppProperties.ts';

import AddRemoteDialog from '../dialogs/AddRemoteDialog.vue';
import GitDialog from '../dialogs/GitDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

const iProps = reactive({
  git_status: [],
  error: '',

  use_lfs: false,

  remote: null,
  remotes: {},

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

const getUrlCredentials = url => {
  // Regular expression to match URLs with embedded credentials
  const regex = /^(https?|git|ssh):\/\/([^\/:@]+(:[^\/:@]+)?@)?([^\/:]+)(:[0-9]+)?(\/.*)?$/;
  // Test the URL against the regular expression
  const match = url.match(regex);
  return match ? (match[2] || '') : '';
};

const patchRemote = url => {
  return AppProperties.user && url.includes(AppProperties.user.host) && getUrlCredentials(url)===''
    ? `https://oauth2:${AppProperties.user.token.access_token}@${AppProperties.user.host}` + url.split(AppProperties.user.host)[1]
    : url;
};

const push = async()=>{
  iProps.error = '';

  if(!iProps.remote)
    return raiseError('Pushing requires remote.');

  if(!AppProperties.user)
    return raiseError('Pushing requires login.');

  await getStatus();
  if(iProps.git_status.length>0)
    return raiseError('Commit changes before pushing.');

  const dialogProps = reactive({
    title: 'Pushing ARC',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  });

  let response = null;

  // get current branch
  const branches = await getBranches();
  if(!branches.current) return dialogProps.state=2;

  // patch remote
  const remote = iProps.remotes[iProps.remote].url;
  const patched_remote = patchRemote(iProps.remotes[iProps.remote].url);
  if(iProps.remotes[iProps.remote].url!==patched_remote)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`set-url`,iProps.remote,patched_remote],
      cwd: ArcControlService.props.arc_root
    });

  // push
  const args = [
    `push`,
    `--verbose`,
    `--atomic`,
    `--progress`,
    iProps.remote,
    branches.current
  ];
  if(!iProps.use_lfs)
    args.push('--no-verify');

  response = await window.ipc.invoke('GitService.run', {
    args: args,
    cwd: ArcControlService.props.arc_root
  });

  // unpatch
  if(iProps.remotes[iProps.remote].url!==patched_remote)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`set-url`,iProps.remote,remote],
      cwd: ArcControlService.props.arc_root
    });

  dialogProps.state=1;

  await checkRemotes();
};

const pull = async()=>{
  iProps.error = '';

  if(!iProps.remote)
    return raiseError('Pulling requires remote.');

  await getStatus();
  if(iProps.git_status.length>0)
    return raiseError('Commit changes before pulling.');

  const dialogProps = reactive({
    title: 'Pulling ARC',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  });

  let response = null;

  // get current branch
  const branches = await getBranches();
  if(!branches.current) return dialogProps.state=2;

  // patch remote
  const remote = iProps.remotes[iProps.remote].url;
  const patched_remote = patchRemote(iProps.remotes[iProps.remote].url);
  if(iProps.remotes[iProps.remote].url!==patched_remote)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`set-url`,iProps.remote,patched_remote],
      cwd: ArcControlService.props.arc_root
    });

  // pull
  response = await window.ipc.invoke('GitService.run', {
    args: [`pull`,iProps.remote,branches.current,'--progress'],
    cwd: ArcControlService.props.arc_root,
    env: {
      GIT_LFS_SKIP_SMUDGE: iProps.use_lfs?0:1
    }
  });
  if(iProps.use_lfs){
    response = await window.ipc.invoke('GitService.run', {
      args: [`lfs`,`pull`,iProps.remote,branches.current],
      cwd: ArcControlService.props.arc_root
    });
  }

  // unpatch
  if(iProps.remotes[iProps.remote].url!==patched_remote)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`set-url`,iProps.remote,remote],
      cwd: ArcControlService.props.arc_root
    });

  dialogProps.state=1;

  await checkRemotes();
};

const checkRemotes = async()=>{
  const branches = await getBranches();

  const hash_response = await window.ipc.invoke('GitService.run', {
    args: [`rev-parse`,`HEAD`],
    cwd: ArcControlService.props.arc_root
  });
  const latest_local_hash = hash_response[1].trim();

  for(let id in iProps.remotes){
    const url = patchRemote(iProps.remotes[id].url);
    if(AppProperties.user && url.includes(AppProperties.user.host)){
      const fetch_response = await window.ipc.invoke('GitService.run', {
        args: [`ls-remote`,url,`-h`,`refs/heads/${branches.current}`],
        cwd: ArcControlService.props.arc_root
      });
      iProps.remotes[id].dirty = fetch_response[0] && latest_local_hash!==fetch_response[1].split('\t')[0];
    }
  }
};

const getRemotes = async()=>{
  const response = await window.ipc.invoke('GitService.run', {
    args: [`remote`,`-v`],
    cwd: ArcControlService.props.arc_root
  });
  iProps.remotes = {};

  for(let row of response[1].split('\n').slice(0,-1)){
    const row_ = row.split('\t');
    const name = row_[0];
    const url = row_[1].split(' ')[0];

    iProps.remotes[name] = {
      url: url,
      dirty: false
    };
  }

  iProps.remote = Object.keys(iProps.remotes)[0];
};

const init = async()=>{
  iProps.error = '';
  await getRemotes();
  await checkRemotes();
};

onMounted( init );
watch(()=>AppProperties.user, init);

const addRemote = e=>{
  $q.dialog({
    component: AddRemoteDialog,
    componentProps: {
      user: AppProperties.user,
      remotes: Object.keys(iProps.remotes)
    }
  }).onOk( async data => {
    await window.ipc.invoke('GitService.run', {
      args: [`remote`,`add`,data.name,data.url],
      cwd: ArcControlService.props.arc_root
    });
    await getRemotes();
  });
};

const removeRemote = async remote=>{
  await window.ipc.invoke('GitService.run', {
    args: [`remote`,`remove`,remote],
    cwd: ArcControlService.props.arc_root
  });
  getRemotes();
};

const inspectArc = url =>{
  window.ipc.invoke(
    'InternetService.openExternalURL',
    url.startsWith('http://') || url.startsWith('https://')
      ? url
      : 'https://' + url
  );
};


</script>

<template>
  <q-list bordered class="rounded-borders">
    <ViewItem
      icon="published_with_changes"
      label="DataHUB Sync"
      caption="Synchronize the ARC with a DataHub"
      group="git"
      defaultOpened
      hide-expand-icon
      expand-icon-toggle
    >
      <q-card flat>
        <q-card-section>
          <div class='row'>
            <div class='col'>
              <q-list class='bg-grey-3' dense style="border-radius:0.3em; margin:0.4em;">
                <q-item-label style="padding:0.5em 1em;">Remote</q-item-label>

                <q-item tag="label" v-ripple v-for='id of Object.keys(iProps.remotes)'>
                  <q-item-section side>
                    <q-radio v-model='iProps.remote' :val='id' color='secondary' dense/>
                  </q-item-section>

                  <q-item-section no-wrap>
                    <q-item-label>{{id}}</q-item-label>
                    <q-item-label caption style="overflow:hidden;">
                      {{iProps.remotes[id].url.replace(getUrlCredentials(iProps.remotes[id].url),'')}}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn v-if='getUrlCredentials(iProps.remotes[id].url)' class="gt-xs" size="12px" flat dense round icon="key" color='gray-7'>
                        <q-tooltip>
                          Remote uses an access token.
                        </q-tooltip>
                      </q-btn>

                      <q-btn v-if='iProps.remotes[id].dirty' class="gt-xs" size="12px" flat dense round icon="running_with_errors" color='gray-7' @click='inspectArc(iProps.remotes[id].url)'>
                        <q-tooltip>
                          ARC is out of Sync!
                        </q-tooltip>
                      </q-btn>

                      <q-btn class="gt-xs" size="12px" flat dense round icon="search" color='gray-7' @click='inspectArc(iProps.remotes[id].url)'>
                        <q-tooltip>
                          Inspect Remote in the Browser
                        </q-tooltip>
                      </q-btn>

                      <q-btn class="gt-xs" size="12px" flat dense round icon="delete" color='gray-7' @click='removeRemote(id)'>
                        <q-tooltip>
                          Remove Remote
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-btn icon='add_circle' color='secondary' flat dense @click='addRemote' />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align='right' style="padding:0 2.1em 1em 2.1em;">
          <a_btn v-if='iProps.error' color="red-10" icon='warning' :label="iProps.error" no-caps style="margin-right:auto"/>
          <div>
            <a_checkbox v-model='iProps.use_lfs' label="Use Large File Storage"/>
            <q-tooltip>
              <div style="float:left; padding:0.5em 1em 0 0">
                <q-icon name="warning" color="grey-3" size="3em"/>
              </div>
              <div style="float:right;font-size:1.4em;max-width:20em;">
                Data up- and downloads taking more than one hour require a personal access token.
              </div>
            </q-tooltip>
          </div>
          <a_btn label="Push" @click="push" icon='cloud_upload' :disabled='!iProps.remote || !AppProperties.user'/>
          <a_btn label="Pull" @click="pull" icon='cloud_download' :disabled='!iProps.remote'/>
        </q-card-actions>

      </q-card>
    </ViewItem>
  </q-list>
</template>

