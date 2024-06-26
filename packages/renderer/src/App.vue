<script lang="ts" setup>

import ToolbarButton from './components/ToolbarButton.vue';
import ArcTreeView from './views/ArcTreeView.vue';

import HomeView from './views/HomeView.vue';

import MarkdownView from './views/MarkdownView.vue';
import ImageView from './views/ImageView.vue';
import HelpView from './views/HelpView.vue';
import LoginView from './views/LoginView.vue';
import GitCommitView from './views/GitCommitView.vue';
import GitSyncView from './views/GitSyncView.vue';
import GitHistoryView from './views/GitHistoryView.vue';
import SwateView from './views/SwateView.vue';

import DataHubView from './views/DataHubView.vue';

import logoURL from '../assets/dpLogo2_w.png';

import { setCssVar } from 'quasar';

import { onMounted, ref, reactive } from 'vue';

import AppProperties from './AppProperties';
import ArcControlService from './ArcControlService';
setCssVar('primary', '#2d3e50');

// import { useQuasar } from 'quasar'
// const $q = useQuasar()
// console.log($q.dark.isActive) // true, false
// $q.dark.set(true) // or false or "auto"
// // $q.dark.toggle()

const iProps = reactive({
  showToolbar: true,
  toolbarMinimized: false,
  showHelp: false,
  splitterModel: 300,
  error: false,
  error_text: '',
  version: '',
  new_version: ''
});

const openLocalArc = async (path: string | null | void) =>{
  if(!path) path = await window.ipc.invoke('LocalFileSystemService.selectDir', ['Select local ARC','Select local ARC']);
  if(!path) return;
  let isOpen = await ArcControlService.readARC(path);
  if(!isOpen){
    iProps.error_text = 'Invalid ARC format:<br>'+path;
    iProps.error = true;
    return;
  }
  AppProperties.state=AppProperties.STATES.HOME;
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
  await ArcControlService.new_arc(path);
};

const showHomeView = ()=>{
  AppProperties.state=AppProperties.STATES.HOME;
}

onMounted(async () => {
  window.ipc.on('CORE.MSG', console.log);
  iProps.version = await window.ipc.invoke('CORE.getVersion');
  const git_running = await window.ipc.invoke('GitService.run','--version');
  if(!git_running[0]){
    iProps.error_text = 'Unable to detect GIT.<br>Please verify that GIT is installed.';
    iProps.error = true;
  }
  console.log(git_running[1]);
  const git_lfs_running = await window.ipc.invoke('GitService.run',{args:['lfs','--version']});
  if(!git_lfs_running[0]){
    iProps.error_text = 'Unable to detect GIT LFS.<br>Please verify that GIT LFS is installed.';
    iProps.error = true;
  }
  console.log(git_lfs_running[1]);

  const versions = await window.ipc.invoke('InternetService.getArcitectVersions');
  const latest_version = versions[0].name;
  if(latest_version !== iProps.version)
    iProps.new_version = latest_version;
});

const downloadArcitect = async ()=>{
  await window.ipc.invoke('InternetService.openExternalURL','https://github.com/nfdi4plants/ARCitect/releases');
};

const test = async ()=>{
};

</script>

<template>
    <q-layout view="hHh LpR fFf" class="no-selection">
      <q-drawer
        v-model='iProps.showToolbar'
        show-if-above

        :mini="iProps.toolbarMinimized"

        :width="190"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
        content-class="column justify-between no-wrap bg-grey-1"
      >
        <q-list class="column sidebar-container" style="height:100%; flex-wrap: nowrap;">
          <q-item v-ripple clickable class='bg-primary text-white' @click="showHomeView" style="padding-top:1em;padding-bottom:1em;">
            <q-item-section avatar>
              <q-icon size="2.5rem" style="margin: 0 -0.20em;" :name="'img:'+logoURL" @click='showHomeView'></q-icon>
            </q-item-section>
            <q-item-section style="margin:0.6em 0 0 -1.2em">
              <q-item-label><b style="font-size:2em">ARC</b><span style="font-size:1.2em">itect</span></q-item-label>
            </q-item-section>
          </q-item>

          <LoginView />

          <q-separator />

          <ToolbarButton text='New ARC' icon='note_add' @clicked='newLocalArc()'></ToolbarButton>
          <ToolbarButton text='Open ARC' icon='file_open' @clicked='openLocalArc()'></ToolbarButton>
          <ToolbarButton text='Download ARC' icon='cloud_download' @clicked='AppProperties.state=AppProperties.STATES.OPEN_DATAHUB'></ToolbarButton>

          <q-separator />

          <!--<ToolbarButton text='Refresh ARC' icon='refresh' requiresARC @clicked='refreshLocalArc()'></ToolbarButton>-->
          <ToolbarButton text='Save ARC' icon='save' requiresARC @clicked='saveLocalArc()'></ToolbarButton>
          <ToolbarButton text='Explorer' icon='folder_open' requiresARC @clicked='ArcControlService.openArcInExplorer()'></ToolbarButton>
          <q-separator />

          <ToolbarButton text='Commit' icon='verified' requiresARC requiresUser @clicked='AppProperties.state=AppProperties.STATES.GIT_COMMIT'></ToolbarButton>
          <ToolbarButton text='DataHUB Sync' icon='published_with_changes' requiresARC requiresUser @clicked='AppProperties.state=AppProperties.STATES.GIT_SYNC'></ToolbarButton>
          <ToolbarButton text='History' icon='history' requiresARC requiresUser @clicked='AppProperties.state=AppProperties.STATES.GIT_HISTORY'></ToolbarButton>
          <q-separator />

          <q-item class="col-grow"></q-item>
          <ToolbarButton text='Toggle Help' icon='help' @clicked='iProps.showHelp=!iProps.showHelp;'></ToolbarButton>
          <ToolbarButton :text="iProps.toolbarMinimized ? '' : 'Minimize Sidebar'" :icon="iProps.toolbarMinimized ? 'chevron_right' : 'chevron_left'" @clicked='iProps.toolbarMinimized=!iProps.toolbarMinimized;'></ToolbarButton>
          <q-separator />

          <q-item v-ripple clickable dense @click='downloadArcitect'>
            <q-item-section avatar>
              <q-icon color='red-9' name="error" v-if='iProps.new_version'>
                <q-tooltip>
                  New Version Available!
                </q-tooltip>
              </q-icon>
            </q-item-section>
            <q-item-section style="margin-left:-1.2em;">{{iProps.version}}</q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <q-drawer
        v-model="iProps.showHelp"
        side="right"
        bordered
        :breakpoint='0'
        class="bg-grey-3"
        :width="400"
      >
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
                      <tr>
                        <td style="padding-right:1em"><q-icon name='warning' size='2em' color='grey-7' /></td>
                        <td v-html='iProps.error_text'></td>
                      </tr>
                    </table>
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn label="OK" color="teal" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <DataHubView v-if='AppProperties.state===AppProperties.STATES.OPEN_DATAHUB'></DataHubView>
              <MarkdownView v-else-if='AppProperties.state===AppProperties.STATES.EDIT_MARKDOWN'></MarkdownView>
              <ImageView v-else-if='AppProperties.state===AppProperties.STATES.EDIT_IMAGE'></ImageView>
              <GitCommitView v-else-if='AppProperties.state===AppProperties.STATES.GIT_COMMIT' />
              <GitSyncView v-else-if='AppProperties.state===AppProperties.STATES.GIT_SYNC' />
              <GitHistoryView v-else-if='AppProperties.state===AppProperties.STATES.GIT_HISTORY' />
              <SwateView v-else-if='AppProperties.state===AppProperties.STATES.EDIT_SWATE'></SwateView>
              <HomeView v-else></HomeView>
            </template>
          </q-splitter>
        </q-page>
      </q-page-container>
    </q-layout>

    <div class='ModalLoading' v-if='ArcControlService.props.busy'>
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

</style>
