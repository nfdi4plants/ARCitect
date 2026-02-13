<script lang="ts" setup>

import { onMounted, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import a_checkbox from '../components/a_checkbox.vue';
import a_btn from '../components/a_btn.vue';
import a_tooltip from '../components/a_tooltip.vue';
import ArcControlService from '../ArcControlService.ts';
import GitService from '../GitService.ts';
import { checkRemoteDirtyStatus } from '../utils/gitRemoteStatus';

import {abortMerge} from './GitCommitView.vue';

import AppProperties from '../AppProperties.ts';

import { Xlsx } from '@fslab/fsspreadsheet/Xlsx.js';
import { Json } from '@fslab/fsspreadsheet/Json.js';

import AddRemoteDialog from '../dialogs/AddRemoteDialog.vue';
import GitDialog from '../dialogs/GitDialog.vue';
import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import GitMergeTextDialog from '../dialogs/GitMergeTextDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

interface ProjectMember {
  id: number;
  name: string;
  username: string;
  email?: string;
  access_level: number;
}

const iProps = reactive({
  remote: '',
  userListener: ()=>{},
  collaborators: [] as ProjectMember[],
  loadingCollaborators: false,
  collaboratorsError: null as string | null
});

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
  const finalState = response[0]?1:2;
  dialogProps.state=finalState;
  AppProperties.updateGitDialogState(finalState);
};

const showError = async msg=>{
  $q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      title: 'Error',
      msg: msg
    }
  });
};

const push = async()=>{
  if(GitService._.change_tree[0].children_.length>0)
    return showError('Commit changes before pushing.');

  const dialogProps = reactive({
    title: 'Pushing ARC',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk(async ()=>{
    await GitService.check_remotes();
  });

  let response = null;

  // get current branch
  const branches = await GitService.get_branches();
  if(!branches.current) {
    dialogProps.state=2;
    AppProperties.updateGitDialogState(2);
    return;
  }
  if(branches.current.startsWith('(HEAD detached at ')){
    dialogProps.state=2;
    AppProperties.updateGitDialogState(2);
    return showError('No Branch Selected (Detached HEAD). Fix in Commit View.');
  }

  // patch remote
  const remote = GitService._.remotes[iProps.remote].url;
  const patched_remote = GitService.patch_remote(GitService._.remotes[iProps.remote].url);
  if(GitService._.remotes[iProps.remote].url!==patched_remote)
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
    '"'+branches.current+'"'
  ];

  // Always use LFS for push
  response = await window.ipc.invoke('GitService.run', {
    args: args,
    cwd: ArcControlService.props.arc_root,
    debug: AppProperties.config.gitDebug
  });

  // unpatch
  if(GitService._.remotes[iProps.remote].url!==patched_remote)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`set-url`,iProps.remote,remote],
      cwd: ArcControlService.props.arc_root
    });

  dialogProps.state=1;
  AppProperties.updateGitDialogState(1);
};

const process_merged_json = (name,json) => {
  return new Promise((resolve,reject)=>{
    if(!json.includes('<<<<<<<'))
      return resolve(json);

    $q.dialog({
      component: GitMergeTextDialog,
      componentProps: {
        title: 'Merging '+name,
        content: json
      }
    })
      .onOk( final_json => resolve(final_json))
      .onCancel( ()=>resolve(null) )
    ;
  });
};

const merge_xlsx = async (rel_path,pointers) => {
  const tempPath = await window.ipc.invoke('CORE.getTempPath');

  console.log('merging',rel_path);

  for(const pointer of pointers){
    const path = `${tempPath}/arc_merge/${pointer}/${rel_path}`;
    console.log('  retrieving',path+'.json');

    // get xlsx file
    await window.ipc.invoke('GitService.run', {
      args: [`show`,`${pointer}:${rel_path}`],
      cwd: ArcControlService.props.arc_root,
      pipe: path
    });

    // write json representation
    const buffer = await window.ipc.invoke('LocalFileSystemService.readFile', [path,{}]);
    const wb = await Xlsx.fromBytes(buffer);
    const json = Json.toRowsJsonString(wb,1,true);
    await window.ipc.invoke('LocalFileSystemService.writeFile', [path+'.json',json]);

  }

  // merge json representations
  console.log('  merging jsons');
  const merged_json = await window.ipc.invoke('GitService.run', {
    args: [`merge-file`,`-p`,
      `${tempPath}/arc_merge/${pointers[0]}/${rel_path}.json`,
      `${tempPath}/arc_merge/${pointers[1]}/${rel_path}.json`,
      `${tempPath}/arc_merge/${pointers[2]}/${rel_path}.json`,
    ],
    cwd: ArcControlService.props.arc_root,
    silent: true
  });
  console.log('    ->',merged_json);

  const final_json = await process_merged_json(rel_path,merged_json[1]);
  if(!final_json)
    return 0;

  console.log('  final json:', final_json);

  // write merged workbooks
  console.log('  adding merged xlsx');
  const merged_wb = Json.fromRowsJsonString(final_json);
  const merged_buffer = await Xlsx.toBytes(merged_wb);
  await window.ipc.invoke(
    'LocalFileSystemService.writeFile',
    [
      `${ArcControlService.props.arc_root}/${rel_path}`,
      merged_buffer,
      {}
    ]
  );
  await window.ipc.invoke('GitService.run', {
    args: [`add`,rel_path],
    cwd: ArcControlService.props.arc_root
  });

  return 1;
};

const merge = async ()=>{
  const dialogProps = reactive({
    title: 'Merge Divergent Branches',
    ok_title: 'Ok',
    cancel_title: 'Cancel',
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk(async ()=>{
    await ArcControlService.readARC();
    await GitService.check_remotes();
  });

  const branches = await GitService.get_branches();
  if(!branches.current) return;

  // clean helper function
  const clean = x => x[1].split('\n')[0].trim();

  // get latest commit hash
  const local_commit = clean(await window.ipc.invoke('GitService.run', {
    args: [`rev-parse`,`HEAD`],
    cwd: ArcControlService.props.arc_root
  }));

  // get common ancestor
  const common_ancestor = clean(await window.ipc.invoke('GitService.run', {
    args: [`merge-base`,`HEAD`,iProps.remote+'/'+branches.current],
    cwd: ArcControlService.props.arc_root
  }));

  // initiate rebase
  const rebase = await window.ipc.invoke('GitService.run', {
    args: [`rebase`,iProps.remote+'/'+branches.current],
    cwd: ArcControlService.props.arc_root
  });

  // get conflicts
  const conflicts = rebase[1].split('\n').filter(r=>r.startsWith('CONFLICT')).map(r=>r.split('Merge conflict in ').pop());

  // attempt to resolve conflicts
  ArcControlService.props.skip_fs_updates = true;
  for(let file of conflicts.filter(f=>f.endsWith('.xlsx'))){
    const merge_status = await merge_xlsx(file,[local_commit,common_ancestor,iProps.remote+'/'+branches.current]);
    console.log(merge_status);
    if(!merge_status){
      dialogProps.state=2;
      AppProperties.updateGitDialogState(2);
      return;
    }
  }
  ArcControlService.props.skip_fs_updates = false;

  dialogProps.state=1;
  AppProperties.updateGitDialogState(1);
};

const pull = async()=>{
  if(GitService._.change_tree[0].children_.length>0)
    return showError('Commit changes before pulling.');

  const dialogProps = reactive({
    title: 'Pulling ARC',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
    needs_merge: false
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk(async ()=>{
    if(dialogProps.needs_merge)
      await merge();
    else
      await GitService.check_remotes();
  }).onCancel(async ()=>{
    await GitService.check_remotes();
  });

  let response = null;

  // get current branch
  const branches = await GitService.get_branches();
  if(!branches.current) {
    dialogProps.state=2;
    AppProperties.updateGitDialogState(2);
    return;
  }

  // patch remote
  const remote = GitService._.remotes[iProps.remote].url;
  const patched_remote = GitService.patch_remote(GitService._.remotes[iProps.remote].url);
  if(GitService._.remotes[iProps.remote].url!==patched_remote)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`set-url`,iProps.remote,patched_remote],
      cwd: ArcControlService.props.arc_root
    });

  // pull
  response = await window.ipc.invoke('GitService.run', {
    args: [`pull`,iProps.remote,branches.current,'--progress'],
    cwd: ArcControlService.props.arc_root,
    env: {
      GIT_LFS_SKIP_SMUDGE: 1 // Always skip smudge, never use LFS for pull
    },
    debug: AppProperties.config.gitDebug
  });
  dialogProps.needs_merge = !response[0] && response[1].includes('You have divergent branches and need to specify how to reconcile them.');
  if(dialogProps.needs_merge){
    dialogProps.ok_title = 'Merge';
    dialogProps.cancel_title = 'Cancel';
    dialogProps.ok_icon = 'merge';
  }

  // unpatch
  if(GitService._.remotes[iProps.remote].url!==patched_remote)
    response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`set-url`,iProps.remote,remote],
      cwd: ArcControlService.props.arc_root
    });

  dialogProps.state=1;
  AppProperties.updateGitDialogState(1);

  GitService.update_lfs_files();
  await checkRemoteDirtyStatus();
};

// GitLab access level constants
const ACCESS_LEVEL_NAMES: Record<number, string> = {
  10: 'Guest',
  20: 'Reporter',
  30: 'Developer',
  40: 'Maintainer',
  50: 'Owner'
};

// Parse project ID from GitLab remote URL
const parseProjectIdFromUrl = (url: string): string | null => {
  try {
    // Remove credentials from URL
    const cleanUrl = url.replace(GitService.get_url_credentials(url), '');

    // Handle different URL formats:
    // git@host:group/project.git
    // https://host/group/project.git
    // https://host/group/subgroup/project.git

    let projectPath = '';

    if (cleanUrl.includes('@')) {
      // SSH format: git@host:path/to/project.git
      const parts = cleanUrl.split(':');
      if (parts.length >= 2) {
        projectPath = parts[1];
      }
    } else {
      // HTTPS format: https://host/path/to/project.git
      const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : 'https://' + cleanUrl);
      projectPath = urlObj.pathname.substring(1); // Remove leading /
    }

    // Remove .git extension
    projectPath = projectPath.replace(/\.git$/, '');

    return projectPath || null;
  } catch (error) {
    console.error('Error parsing project ID from URL:', error);
    return null;
  }
};

// Load collaborators for the current remote
const loadCollaborators = async () => {
  if (!iProps.remote || !AppProperties.user) {
    console.log('loadCollaborators: Missing required data');
    return;
  }

  iProps.loadingCollaborators = true;
  iProps.collaboratorsError = null;
  const remoteUrl = GitService._.remotes[iProps.remote].url;
  const host = AppProperties.user.host;
  const token = AppProperties.user.token.access_token;
  const projectId = parseProjectIdFromUrl(remoteUrl);

  console.log('loadCollaborators: Loading for project', projectId);

  if (!projectId) {
    console.log('loadCollaborators: Could not parse project ID');
    iProps.collaboratorsError = 'Could not determine project from remote URL';
    iProps.loadingCollaborators = false;
    return;
  }

  try {
    const members = await window.ipc.invoke('DataHubService.getProjectMembers', [host, token, projectId]);
    console.log('loadCollaborators: Result:', members);

    if (members && Array.isArray(members)) {
      iProps.collaborators = members;
      iProps.collaboratorsError = null;
    } else {
      iProps.collaborators = [];
      iProps.collaboratorsError = 'Repository does not exist on remote or you lack permission to view members';
    }
  } catch (error) {
    console.error('loadCollaborators: Error loading collaborators', error);
    iProps.collaborators = [];
    iProps.collaboratorsError = error;
  }

  iProps.loadingCollaborators = false;
};

// Open GitLab project members page
const openProjectMembersPage = () => {
  if (!iProps.remote) return;

  const remoteUrl = GitService._.remotes[iProps.remote].url;
  const projectId = parseProjectIdFromUrl(remoteUrl);

  if (!projectId) {
    showError('Could not determine project from remote URL');
    return;
  }

  // Remove credentials from URL
  const cleanUrl = remoteUrl.replace(GitService.get_url_credentials(remoteUrl), '');

  // Build the GitLab URL
  let baseUrl = '';
  if (cleanUrl.includes('@')) {
    // SSH format: git@host:path/to/project.git -> https://host/path/to/project
    const parts = cleanUrl.split(':');
    const host = parts[0].split('@')[1];
    baseUrl = `https://${host}/${projectId}`;
  } else {
    // HTTPS format: https://host/path/to/project.git
    baseUrl = cleanUrl.replace(/\.git$/, '');
    if (!baseUrl.startsWith('http')) {
      baseUrl = 'https://' + baseUrl;
    }
  }

  const membersUrl = `${baseUrl}/-/project_members`;
  window.ipc.invoke('InternetService.openExternalURL', membersUrl);
};

const init = async()=>{
  await GitService.parse_status();
  await GitService.get_remotes();
  await GitService.check_remotes();
  iProps.remote = Object.keys(GitService._.remotes)[0];
};

onMounted( init );
watch(()=>AppProperties.user, init);
watch(()=>iProps.remote, async ()=>{
  iProps.collaborators = [];
  iProps.collaboratorsError = null;
  if (iProps.remote && AppProperties.user) {
    await loadCollaborators();
  }
});

const addRemote = e=>{
  $q.dialog({
    component: AddRemoteDialog,
    componentProps: {
      user: AppProperties.user,
      remotes: Object.keys(GitService._.remotes)
    }
  }).onOk( async data => {
    await window.ipc.invoke('GitService.run', {
      args: [`remote`,`add`,data.name,data.url],
      cwd: ArcControlService.props.arc_root
    });
    await GitService.get_remotes();
  });
};

const removeRemote = async remote=>{
  await window.ipc.invoke('GitService.run', {
    args: [`remote`,`remove`,remote],
    cwd: ArcControlService.props.arc_root
  });
  GitService.get_remotes();
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
    >
      <q-card flat>
        <q-card-section>
          <div class='row'>
            <div class='col'>
              <q-list class='bg-grey-3' dense style="border-radius:0.3em; margin:0.4em;">
                <q-item-label style="padding:0.5em 1em;">Remote</q-item-label>
                <q-item tag="label" v-ripple v-for='id of Object.keys(GitService._.remotes)'>
                  <q-item-section side>
                    <q-radio v-model='iProps.remote' :val='id' color='secondary' dense/>
                  </q-item-section>

                  <q-item-section no-wrap>
                    <q-item-label>{{id}}</q-item-label>
                    <q-item-label caption style="overflow:hidden;">
                      {{GitService._.remotes[id].url.replace(GitService.get_url_credentials(GitService._.remotes[id].url),'')}}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn v-if='GitService.get_url_credentials(GitService._.remotes[id].url)' class="gt-xs" size="12px" flat dense round icon="key" color='gray-7'>
                        <q-tooltip>
                          Remote uses an access token.
                        </q-tooltip>
                      </q-btn>

                      <q-btn v-if='GitService._.remotes[id].dirty' class="gt-xs" size="12px" flat dense round icon="running_with_errors" color='gray-7' @click='inspectArc(GitService._.remotes[id].url)'>
                        <q-tooltip>
                          ARC is out of Sync!
                        </q-tooltip>
                      </q-btn>

                      <q-btn class="gt-xs" size="12px" flat dense round icon="sym_r_captive_portal" color='gray-7' @click='inspectArc(GitService._.remotes[id].url)'>
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

                <a_tooltip>
                  Managing remotes
                  <ul>
                    <li><q-icon name="add_circle" color="secondary" />: Add additional remote connections</li>
                    <li><q-icon name="running_with_errors" color="black" />: Your ARC is out of sync with the ARC stored in the DataHUB</li>
                    <li><q-icon name="sym_r_captive_portal" color="black" />: Open your ARC in the DataHUB</li>
                    <li><q-icon name="delete" color="black" />: Delete a remote connection</li>
                  </ul>
                </a_tooltip>

              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align='right' style="padding:0 2.1em 1em 2.1em;">
          <a_btn v-if='iProps.error' color="red-10" icon='warning' :label="iProps.error" no-caps style="margin-right:auto"/>
          <a_btn v-if='GitService._.rebase_in_progress' label="Abort Merge" @click="abortMerge" icon='dangerous' color='red-10'>
            <a_tooltip>
              There is an interactive git rebase in progress.<br>By aborting the merge process you revert back to the last commit.
            </a_tooltip>
          </a_btn>
          <a_btn label="Push" @click="push" icon='cloud_upload' :disabled='!iProps.remote || !AppProperties.user || AppProperties.git_dialog_state.visible'>
            <a_tooltip>
              Upload the current status of your ARC to the DataHUB
            </a_tooltip>
          </a_btn>
          <a_btn label="Pull" @click="pull" icon='cloud_download' :disabled='!iProps.remote || AppProperties.git_dialog_state.visible'>
            <a_tooltip>
              Download the latest stage of your ARC from the DataHUB
            </a_tooltip>
          </a_btn>
        </q-card-actions>

        <q-card-section v-if="iProps.remote && AppProperties.user">
          <div class='row'>
            <div class='col'>
              <div class='bg-grey-3' style="border-radius:0.3em; margin:0.4em; padding:0.5em;">
                <div style="padding:0 0.5em 0.5em 0.5em; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <q-item-label>
                      Collaborators on <strong>{{ iProps.remote }}</strong>
                    </q-item-label>
                    <q-item-label caption>
                      Current members and their access levels
                    </q-item-label>
                  </div>
                  <div style="display:flex; gap:0.5em;">
                    <a_btn
                      label="Manage in GitLab"
                      icon="open_in_new"
                      size="sm"
                      color="primary"
                      @click="openProjectMembersPage"
                    >
                      <q-tooltip>Open project members page in GitLab to add/remove collaborators</q-tooltip>
                    </a_btn>
                    <a_btn
                      label="Refresh"
                      icon="refresh"
                      size="sm"
                      :loading="iProps.loadingCollaborators"
                      @click="loadCollaborators"
                    >
                      <q-tooltip>Reload collaborators list</q-tooltip>
                    </a_btn>
                  </div>
                </div>

                <q-table
                  v-if="iProps.collaborators.length > 0"
                  :rows="iProps.collaborators"
                  :columns="[
                    { name: 'name', label: 'Name', field: 'name', align: 'left' },
                    { name: 'username', label: 'Username', field: 'username', align: 'left' },
                    { name: 'access', label: 'Access Level', field: (row) => ACCESS_LEVEL_NAMES[row.access_level] || 'Unknown', align: 'center' }
                  ]"
                  row-key="id"
                  flat
                  bordered
                  dense
                  :rows-per-page-options="[10]"
                >
                  <template v-slot:body-cell-access="props">
                    <q-td :props="props">
                      <q-badge
                        :color="props.row.access_level >= 40 ? 'primary' : 'secondary'"
                        :label="ACCESS_LEVEL_NAMES[props.row.access_level] || 'Unknown'"
                      />
                    </q-td>
                  </template>
                </q-table>

                <div v-else-if="iProps.collaboratorsError" style="padding:1em; text-align:center; color:var(--q-color-grey-6);">
                  <q-icon name="warning" size="sm" color="orange" />
                  <div style="margin-top:0.5em;">{{ iProps.collaboratorsError }}</div>
                </div>

                <div v-else-if="!iProps.loadingCollaborators" style="padding:1em; text-align:center; color:var(--q-color-grey-6);">
                  No collaborators loaded. Click refresh to load.
                </div>

                <div v-if="iProps.loadingCollaborators" style="padding:1em; text-align:center;">
                  <q-spinner size="md" color="primary" />
                </div>

              </div>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </ViewItem>
  </q-list>
</template>
