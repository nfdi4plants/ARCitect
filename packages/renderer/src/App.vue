<script lang="ts" setup>

import ToolbarButton from './components/ToolbarButton.vue';
import ArcTreeView from './views/ArcTreeView.vue';
import a_tooltip from './components/a_tooltip.vue';

import HomeView from './views/HomeView.vue';

import MarkdownView from './views/MarkdownView.vue';
import ImageView from './views/ImageView.vue';
import HelpView from './views/HelpView.vue';
import LoginView from './views/LoginView.vue';
import GitCommitView from './views/GitCommitView.vue';
import GitSyncView from './views/GitSyncView.vue';
import GitHistoryView from './views/GitHistoryView.vue';
import SwateView from './views/SwateView.vue';
import ValidationView from './views/ValidationView.vue';
import StatusView from './views/StatusView/StatusView.vue';
import BugReportView from './views/BugReportView.vue';
import SettingsView from './views/SettingsView.vue';
import FallbackFileView from './views/FallbackFileView.vue';
import LFSFileView from './views/LFSFileView.vue';

import ConfirmationDialog from './dialogs/ConfirmationDialog.vue';
import GitDialog from './dialogs/GitDialog.vue';
import { watch } from 'vue';
import { checkRemoteDirtyStatus } from './utils/gitRemoteStatus';

import DataHubView from './views/DataHubView.vue';

import logoURL from '../assets/dpLogo2_w.png';
import {KNOWLEDGEBASE_URLS} from "./Constants";

import { setCssVar } from 'quasar';

import { onMounted, ref, reactive } from 'vue';

import AppProperties from './AppProperties';
import ArcControlService from './ArcControlService';
setCssVar('primary', '#2d3e50');

import { useQuasar } from 'quasar'
const $q = useQuasar();

// import { useQuasar } from 'quasar'
// const $q = useQuasar()
// console.log($q.dark.isActive) // true, false
// $q.dark.set(true) // or false or "auto"
// // $q.dark.toggle()

const iProps = reactive({
  showToolbar: true,
  splitterModel: 300,
  error: false,
  error_text: '',
  version: '',
  new_version: ''
});

const openLocalArc = async (path: string | null | void) =>{
  if(!path) path = await window.ipc.invoke('LocalFileSystemService.selectDir', ['Select local ARC','Select local ARC']);
  if(!path) return;

  AppProperties.state=AppProperties.STATES.HOME;

  let isOpen = await ArcControlService.readARC(path);
  if(!isOpen){
    iProps.error_text = 'Invalid ARC format:<br>'+path;
    iProps.error = true;
    return;
  }
  if(!ArcControlService.props.git_initialized){
    $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        title: `Warning`,
        msg: `ARC is not a Git repository.<br>Do you want to initialize Git?`,
        ok_text: 'Initialize Git',
        ok_icon: 'sym_r_folder_data',
        ok_color: 'secondary',
        cancel_text: 'Cancel',
        cancel_icon: 'cancel',
        cancel_color: 'red-8',
      }
    }).onOk( async ()=>{
      const dialogProps = reactive({
        title: 'Initializing Git',
        ok_title: 'Ok',
        cancel_title: null,
        state: 0
      });
      $q.dialog({
        component: GitDialog,
        componentProps: dialogProps
      }).onOk(async ()=>{
        await ArcControlService.saveARC();
        openLocalArc(path);
      });
      const response = await window.ipc.invoke('GitService.run',{
        args: ['init','-b','main'],
        cwd: path
      });
      dialogProps.state=response[0]?1:2;
    });
  }
};

const saveLocalArc = async (force) =>{
  await ArcControlService.saveARC({
    force: force
  });
};

const refreshLocalArc = async () =>{
  let path = ArcControlService.props.arc_root;
  let isOpen = await ArcControlService.readARC(path);
  if(!isOpen){
    iProps.error_text = 'Unable to find valid ARC at:<br>'+path;
    iProps.error = true;
    return;
  }
  AppProperties.state=AppProperties.STATES.HOME;
};

const newLocalArc = async ()=>{
  let path = await window.ipc.invoke('LocalFileSystemService.saveFile');
  if(!path)
    return;

  AppProperties.state=AppProperties.STATES.HOME;
  try {
    await ArcControlService.newARC(path);
  } catch (error) {
    iProps.error_text = error.message;
    iProps.error = true;
    return;
  }
  await openLocalArc(path);
};

const showHomeView = ()=>{
  AppProperties.state=AppProperties.STATES.HOME;
};

const messagePrompt = msg => {
  $q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      title: `Error`,
      msg: msg,
      ok_text: 'Ok',
      ok_color: 'secondary',
    }
  });
};

onMounted(async () => {
  window.ipc.on('CORE.MSG', console.log);
  window.ipc.on('CORE.Error', (r: Result<string>) => {
    if (r.ok) return;
    iProps.error_text = r.error;
    iProps.error = true;
  });
  window.ipc.on('CORE.messagePrompt', messagePrompt);

  // check git versions
  iProps.version = await window.ipc.invoke('CORE.getVersion');
  const git_running = await window.ipc.invoke('GitService.run','--version');
  if(!git_running[0]){
    iProps.error_text = `Unable to detect GIT.<br>You can install it following these <a href="${KNOWLEDGEBASE_URLS.git_install}" target="_blank">instructions</a>.` ;
    iProps.error = true;
  }
  console.log(git_running[1]);
  const git_lfs_running = await window.ipc.invoke('GitService.run',{args:['lfs','--version']});
  if(!git_lfs_running[0]){
    iProps.error_text = `Unable to detect GIT LFS.<br>You can install it following these <a href="${KNOWLEDGEBASE_URLS.git_install}" target="_blank">instructions</a>.`;
    iProps.error = true;
  }
  console.log(git_lfs_running[1]);

  const git_config = (await window.ipc.invoke('GitService.run', {
    args: [`config`,`--list`]
  }))[1].split('\n');

  // check if lfs installed
  {
    const lfs_checks = [
      'filter.lfs.process=git-lfs filter-process',
      'filter.lfs.required=true',
      'filter.lfs.clean=git-lfs clean -- %f',
      'filter.lfs.smudge=git-lfs smudge -- %f'
    ];
    let lfs_installed = true;
    for(let check of lfs_checks)
      if(!git_config.includes(check)) lfs_installed = false;
    if(!lfs_installed){
      console.log('installing git lfs');
      await window.ipc.invoke('GitService.run', {
        args: [`lfs`,`install`]
      });
    }
  }

  // add common git flags
  {
    // enable network paths (possible git authentication credential leak but requested by community)
    if(!git_config.includes(`safe.directory=*`))
      await window.ipc.invoke('GitService.run', {
        args: [`config`,`--global`,`--add`, `safe.directory`, `"*"`]
      });
    // prevent lfs timeouts
    await window.ipc.invoke('GitService.run', {
      args: [`config`,`--global`,`lfs.activitytimeout`, `0`]
    });
    // enable long paths on windows
    await window.ipc.invoke('GitService.run', {
      args: [`config`,`--global`,`core.longpaths`,`true`]
    });
  }

  // check ARCitect version
  const version_ = iProps.version.slice(1).split('.').map(x=>parseFloat(x));
  const versions = await window.ipc.invoke('InternetService.getArcitectVersions');
  const latest_version = versions[0].tag_name;
  const latest_version_ = latest_version.slice(1).split('.').map(x=>parseFloat(x));
  if(version_[0]<latest_version_[0] || version_[1]<latest_version_[1] || version_[2]<latest_version_[2])
    iProps.new_version = latest_version;

  setInterval(checkRemoteDirtyStatus, 5 * 60 * 1000);

  watch(
    () => [ArcControlService.props.arc_root, AppProperties.user],
    ([arcRoot, user], [oldArcRoot]) => {
      if (arcRoot && arcRoot !== oldArcRoot && !user) {
        $q.notify({
          type: 'info',
          message: 'You are not logged in. Log in to sync with remote repositories.',
          color: 'yellow-8',
          textColor: 'black',
          position: 'bottom-left',
          timeout: 5000,
          actions: [
            { label: 'X', color: 'black', handler: () => {} }
          ]
        });
      }
      checkRemoteDirtyStatus();
    }
  );

  let dirtyRemoteNotification: (() => void) | null = null;

  watch(
    () => AppProperties.has_dirty_remote,
    (newVal, oldVal) => {
      if (!oldVal && newVal) {
        dirtyRemoteNotification = $q.notify({
          type: 'warning',
          message: 'Your local ARC is out of sync with a remote. You can pull or push changes in the DataHUB Sync view.',
          color: 'red-7',
          textColor: 'white',
          position: 'bottom-left',
          timeout: 0,
          actions: [
            { label: 'X', color: 'white', handler: () => { dirtyRemoteNotification = null; } }
          ]
        });
      } else if (oldVal && !newVal && dirtyRemoteNotification) {
        dirtyRemoteNotification();
        dirtyRemoteNotification = null;
      }
    }
  );


});

const downloadArcitect = async ()=>{
  await window.ipc.invoke('InternetService.openExternalURL','https://github.com/nfdi4plants/ARCitect/releases');
};

const restoreGitDialog = ()=>{
  const dialogProps = reactive({
    title: AppProperties.git_dialog_state.title,
    ok_title: AppProperties.git_dialog_state.ok_title,
    cancel_title: AppProperties.git_dialog_state.cancel_title,
    state: AppProperties.git_dialog_state.state
  });

  // Watch for global state changes and sync to dialog
  const stopWatcher = watch(() => AppProperties.git_dialog_state.state, (newState) => {
    dialogProps.state = newState;
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  })
  .onOk(() => { stopWatcher(); })
  .onCancel(() => { stopWatcher(); })
  .onDismiss(() => { stopWatcher(); });
};


</script>

<template>
    <q-layout view="hHh LpR fFf" class="no-selection">
      <q-drawer
        v-model='iProps.showToolbar'
        show-if-above

        :mini="AppProperties.config.toolbarMinimized"

        :width="190"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
        content-class="column justify-between no-wrap bg-grey-1"
      >
        <q-list class="column sidebar-container" style="height:100%; flex-wrap: nowrap;">
          <q-item v-ripple clickable class='bg-primary text-white' @click="showHomeView" style="padding-top:1em;padding-bottom:1em;">
            <q-item-section avatar style="height:2.5em">
              <q-inner-loading
                :showing="ArcControlService.props.busy"
                style="width:4em;background-color:transparent"
              >
                <q-spinner
                  color="white"
                  size="2.5em"
                  :thickness="10"
                />
              </q-inner-loading>
              <q-inner-loading
                :showing="!ArcControlService.props.busy"
                style="width:4em;background-color:transparent"
              >
                <q-icon
                  size="2.5rem"
                  style="margin: 0 -0.20em;"
                  :name="'img:'+logoURL"
                  @click='showHomeView'>
                </q-icon>
              </q-inner-loading>
            </q-item-section>

            <q-item-section style="margin:0.6em 0 0 -1.2em">
              <q-item-label><b style="font-size:2em">ARC</b><span style="font-size:1.2em">itect</span></q-item-label>
            </q-item-section>
            <a_tooltip>
            Return to home view
            </a_tooltip>
          </q-item>

          <LoginView />

          <q-separator />

          <ToolbarButton text='New ARC' icon='note_add' @clicked='newLocalArc()'>
            <a_tooltip>
              Create a new ARC on your computer
            </a_tooltip>
          </ToolbarButton>
          <ToolbarButton text='Open ARC' icon='file_open' @clicked='openLocalArc()'>
            <a_tooltip>
              Open an existing ARC from your computer
            </a_tooltip>
          </ToolbarButton>
          <ToolbarButton text='Download ARC' icon='cloud_download' @clicked='AppProperties.state=AppProperties.STATES.OPEN_DATAHUB'>
            <a_tooltip> Download an ARC from the DataHUB</a_tooltip>
          </ToolbarButton>

          <q-separator />

          <!--<ToolbarButton text='Refresh ARC' icon='refresh' requiresARC @clicked='refreshLocalArc()'></ToolbarButton>-->
          <!--<ToolbarButton text='Save ARC' icon='save' requiresARC @clicked='saveLocalArc()'>-->
          <!--  <a_tooltip> Save the ARC locally</a_tooltip>-->
          <!--</ToolbarButton>-->
          <ToolbarButton text='Explorer' icon='folder_open' requiresARC @clicked='ArcControlService.openArcInExplorer()'>
            <a_tooltip>Open the ARC in your Explorer or Finder</a_tooltip>
          </ToolbarButton>
          <q-separator />
          <a_tooltip>
            The menus "Save ARC", "Explorer" and "Validation" are available on open ARCs.<br>
            The menus "Commit", "DataHUB Sync" and "History" are available after login
          </a_tooltip>
          <ToolbarButton text='Commit' icon='rule' requiresARC requiresUser requiresGit @clicked='AppProperties.state=AppProperties.STATES.GIT_COMMIT'>
            <a_tooltip>Track changes of the ARC with git</a_tooltip>
          </ToolbarButton>
          <ToolbarButton text='DataHUB Sync' icon='published_with_changes' requiresARC requiresUser requiresGit @clicked='AppProperties.state=AppProperties.STATES.GIT_SYNC'>
            <q-icon
              color='red-9'
              name="error"
              v-if="AppProperties.has_dirty_remote"
              style="vertical-align: middle; display: inline-flex; align-items: center; height: 24px;"
            />
            <a_tooltip>Synchronize the ARC with a DataHUB</a_tooltip>
          </ToolbarButton>
          <ToolbarButton text='History' icon='history' requiresARC requiresGit @clicked='AppProperties.state=AppProperties.STATES.GIT_HISTORY'>
            <a_tooltip>Inspect ARC history</a_tooltip>
          </ToolbarButton>
          <q-separator />

          <ToolbarButton text='Validation' icon='verified' requiresARC @clicked='AppProperties.state=AppProperties.STATES.VALIDATION'>
            <a_tooltip>Validate ARC against specifications</a_tooltip>
          </ToolbarButton>
          <q-separator />

          <q-item class="col-grow"></q-item>
          <ToolbarButton text='Bugs & Support'  icon='support_agent' @clicked='AppProperties.state=AppProperties.STATES.BUG_REPORT;'>
            <a_tooltip>Report a bug or ask for help.</a_tooltip>
          </ToolbarButton>
          <ToolbarButton text='Services' :icon='Object.values(AppProperties.datahub_hosts_msgs).some(x=>x.critical)?"warning":"dns"' @clicked='AppProperties.state=AppProperties.STATES.STATUS;'>
            <a_tooltip>Check on the status of <b>nfdi4plants</b> services</a_tooltip>
          </ToolbarButton>
          <ToolbarButton text='Settings' icon='settings' @clicked='AppProperties.state=AppProperties.STATES.SETTINGS;'>
            <a_tooltip>Modify ARCitect settings</a_tooltip>
          </ToolbarButton>
          <ToolbarButton :text="AppProperties.config.toolbarMinimized ? '' : 'Toggle Sidebar'" :icon="AppProperties.config.toolbarMinimized ? 'chevron_right' : 'chevron_left'" @clicked='AppProperties.config.toolbarMinimized=!AppProperties.config.toolbarMinimized;'></ToolbarButton>
          <q-separator />

          <q-item v-ripple clickable dense @click='downloadArcitect'>
            <q-item-section avatar>
              <q-icon color='red-9' name="error" v-if='iProps.new_version'>
              </q-icon>
            </q-item-section>
            <q-item-section style="margin-left:-1.2em;">{{iProps.version}}</q-item-section>
            <a_tooltip v-if='iProps.new_version'>
              New Version Available!
            </a_tooltip>
          </q-item>
        </q-list>
      </q-drawer>

      <q-drawer
        v-model="AppProperties.config.showHelp"
        side="right"
        bordered
        :breakpoint='0'
        class="bg-grey-3"
        :width="400"
      >
        <q-btn style="position:absolute;right:0em; top:0.6em; z-index:9999" icon="chevron_right" flat round @click='AppProperties.config.showHelp=false' />
        <q-scroll-area class='fit' style="height: 100%;width:100%;">
          <HelpView></HelpView>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <q-splitter
            v-model="iProps.splitterModel"
            class='full'
            unit='px'
            :limits='[300,Infinity]'
           >
            <template v-slot:before>
                <q-scroll-area class='fit' style="flex-grow: 1;">
                    <ArcTreeView @openArc='openLocalArc'></ArcTreeView>
                </q-scroll-area>
            </template>


            <template v-slot:after>
              <q-dialog v-model="iProps.error">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Error</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none text-body1">
                    <table>
                      <tbody>
                        <tr>
                          <td style="padding-right:1em"><q-icon name='warning' size='2em' color='grey-7' /></td>
                          <td v-html='iProps.error_text'></td>
                        </tr>
                      </tbody>
                    </table>
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn label="OK" color="teal" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <DataHubView v-if='AppProperties.state===AppProperties.STATES.OPEN_DATAHUB'></DataHubView>
              <LFSFileView
                v-else-if='AppProperties.state===AppProperties.STATES.EDIT_LFS'
                :filePath="AppProperties.active_lfs_file"
              />
              <MarkdownView v-else-if='AppProperties.state===AppProperties.STATES.EDIT_MARKDOWN'></MarkdownView>
              <ImageView v-else-if='AppProperties.state===AppProperties.STATES.EDIT_IMAGE'></ImageView>
              <GitCommitView v-else-if='AppProperties.state===AppProperties.STATES.GIT_COMMIT' />
              <GitSyncView v-else-if='AppProperties.state===AppProperties.STATES.GIT_SYNC' />
              <GitHistoryView v-else-if='AppProperties.state===AppProperties.STATES.GIT_HISTORY' />
              <ValidationView v-else-if='AppProperties.state===AppProperties.STATES.VALIDATION'></ValidationView>
              <StatusView v-else-if='AppProperties.state===AppProperties.STATES.STATUS'></StatusView>
              <BugReportView v-else-if='AppProperties.state===AppProperties.STATES.BUG_REPORT'></BugReportView>
              <SettingsView v-else-if='AppProperties.state===AppProperties.STATES.SETTINGS'></SettingsView>
              <HomeView v-else-if='AppProperties.state===AppProperties.STATES.HOME'></HomeView>
              <FallbackFileView
                v-else-if='AppProperties.state===AppProperties.STATES.EDIT_FALLBACK'
                :filePath="AppProperties.active_fallback"
              />


              <SwateView v-if='AppProperties.load_swate' v-show='AppProperties.state===AppProperties.STATES.EDIT_SWATE'></SwateView>
            </template>
          </q-splitter>
        </q-page>
      </q-page-container>
    </q-layout>

    <div class='ModalLoading' v-if='ArcControlService.props.super_busy'>
      <div>
        <q-circular-progress
          indeterminate
          size="20em"
          color="primary"
          class="q-ma-md"
          :thickness="0.6"
        />
      </div>
    </div>

    <q-btn
      v-if='AppProperties.git_dialog_state.visible && AppProperties.git_dialog_state.minimized'
      fab
      :color="AppProperties.git_dialog_state.state === 0 ? 'secondary' : AppProperties.git_dialog_state.state === 1 ? 'positive' : 'negative'"
      :icon="AppProperties.git_dialog_state.state === 0 ? 'hourglass_empty' : AppProperties.git_dialog_state.state === 1 ? 'check_circle' : 'error'"
      @click="restoreGitDialog"
      style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;"
    >
      <q-tooltip>
        {{ AppProperties.git_dialog_state.state === 0 ? 'Git operation running - Click to view' :
           AppProperties.git_dialog_state.state === 1 ? 'Git operation completed - Click to view' :
           'Git operation failed - Click to view' }}
      </q-tooltip>
    </q-btn>
</template>

<style>

.q-list.sidebar-container > .q-item {
  min-height: unset;
}

.ModalLoading {
  position: absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  z-index:9999;
  background-color: #00000044;

  display: flex;
  align-items: center;
  justify-content: center;
}

.ModalLoading > div {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.no-selectionn {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

body {
  /*font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;*/
  /*font-family: system-ui !important;*/
  /*font-family: monospace !important;*/
}

.q-drawer__resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -2px;
  width: 4px;
  background-color: #ccc;
  cursor: ew-resize;
}

.link {

}

.full{
  position:absolute;
  top:0;
  left:0;
  bottom:0;
  right:0;
}

.logo-text-0 {
  display: inline-block;
  font-weight:bold;
  /*border:1px solid #0f0;*/
  font-size:1.8em;
  line-height: 40px;
  padding: 0;
  margin: 0;
}
.logo-text-1 {
  display: inline-block;
  font-size:0.8em;
  padding:0.9em 0 0 0.1em;
}
.logo-text-2 {
  font-size:0.7em;
  color:#ddd;
  padding:0 0 0 0.2em;
}

.material-symbols-rounded {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}

</style>
