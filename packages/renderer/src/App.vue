<script lang="ts" setup>

import ToolbarButton from './components/ToolbarButton.vue';
import ArcTreeView from './views/ArcTreeView.vue';

import HomeView from './views/HomeView.vue';

import InvestigationView from './views/InvestigationView.vue';
import AssayView from './views/AssayView.vue';
import StudyView from './views/StudyView.vue';
import MarkdownView from './views/MarkdownView.vue';
import HelpView from './views/HelpView.vue';
import LoginView from './views/LoginView.vue';
import GitView from './views/GitView.vue';

import DataHubView from './views/DataHubView.vue';

import logoURL from '../assets/dpLogo2_w.png'

import { setCssVar } from 'quasar';
setCssVar('primary', '#2d3e50');

import { onMounted, ref, reactive } from 'vue';

import appProperties from './AppProperties.ts';
import arcProperties from './ArcProperties.ts';
import ArcCommanderService from './ArcCommanderService.ts';

// import { useQuasar } from 'quasar'
// const $q = useQuasar()
// console.log($q.dark.isActive) // true, false
// $q.dark.set(true) // or false or "auto"
// // $q.dark.toggle()


const layoutProperties = reactive({
  showToolbar: true,
  toolbarMinimized: false,
  showHelp: true,
  splitterModel: 300,
});

const showError = ()=>{
  return 0;
}

const openLocalArc = async path=>{
  if(!ArcCommanderService.props.ac_state)
    return;
  if(!path)
    path = await window.ipc.invoke('LocalFileSystemService.selectDir', ['Select local ARC','Select local ARC']);
  if(!path)
    return;
  appProperties.state=appProperties.STATES.HOME;
  ArcCommanderService.props.arc_root = path;
  await ArcCommanderService.getArcProperties();
};

const newLocalArc = async ()=>{
  const path = await window.ipc.invoke('LocalFileSystemService.saveFile');
  if(!path)
    return;

  let response = await window.ipc.invoke('ArcCommanderService.run', {
    args: [`-p`,path,'init']
  });
  if(!response[0])
    return showError();

  const id = path.split(appProperties.path_sep).pop();
  console.log(id)

  response = await window.ipc.invoke('ArcCommanderService.run', {
    args: [`-p`,path,'i','create','-i',id,'--title',id]
  });
  if(!response[0])
    return showError();

  openLocalArc(path);
};

const showHomeView = ()=>{
  appProperties.state=appProperties.STATES.HOME;
}

onMounted(async () => {
  await ArcCommanderService.init();
  appProperties.state=appProperties.STATES.HOME;
  appProperties.path_sep = await window.ipc.invoke('LocalFileSystemService.getPathSeparator');
});

const test = async ()=>{
}

</script>

<template>
    <q-layout view="hHh LpR fFf" class="no-selection">
      <q-drawer
        v-model='layoutProperties.showToolbar'
        show-if-above

        :mini="layoutProperties.toolbarMinimized"

        :width="190"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list>
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
            <ToolbarButton text='Download ARC' icon='cloud_download' @clicked='appProperties.state=appProperties.STATES.OPEN_DATAHUB'></ToolbarButton>

            <q-separator />

            <!--<ToolbarButton text='Upload ARC' icon='cloud_upload' requiresARC='true' @clicked='test()'></ToolbarButton>-->
            <ToolbarButton text='Reset ARC' icon='autorenew' requiresARC='true' @clicked='ArcCommanderService.getArcProperties()'></ToolbarButton>
            <ToolbarButton text='Synchronize ARC' icon='update' requiresARC='true' @clicked='appProperties.state=appProperties.STATES.GIT'></ToolbarButton>

            <q-separator />

            <ToolbarButton text='Toggle Help' icon='help' @clicked='layoutProperties.toolbarMinimized=!layoutProperties.toolbarMinimized;layoutProperties.showHelp=!layoutProperties.showHelp;'></ToolbarButton>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-drawer
        show-if-above
        v-model="layoutProperties.showHelp"
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
            v-model="layoutProperties.splitterModel"
            class='full'
            unit='px'
            :limits='[300,Infinity]'
           >
            <template v-slot:before>
              <q-scroll-area class='fit' style="height: 100%;">
                <ArcTreeView @openArc='openLocalArc'></ArcTreeView>
              </q-scroll-area>
            </template>

            <template v-slot:after>
              <q-scroll-area class='fit' style="height: 100%;">
                <!--<HomeView v-if ='appProperties.state===appProperties.STATES.HOME'></HomeView>-->
                <DataHubView v-if='appProperties.state===appProperties.STATES.OPEN_DATAHUB'></DataHubView>

                <InvestigationView v-else-if='appProperties.state===appProperties.STATES.EDIT_INVESTIGATION'></InvestigationView>
                <AssayView v-else-if='appProperties.state===appProperties.STATES.EDIT_ASSAY'></AssayView>
                <StudyView v-else-if='appProperties.state===appProperties.STATES.EDIT_STUDY'></StudyView>
                <MarkdownView v-else-if='appProperties.state===appProperties.STATES.EDIT_MARKDOWN'></MarkdownView>
                <GitView v-else-if='appProperties.state===appProperties.STATES.GIT'></GitView>
                <HomeView v-else></HomeView>
                <!--<div v-else></div>-->
              </q-scroll-area>
            </template>
          </q-splitter>
        </q-page>
      </q-page-container>
    </q-layout>

</template>

<style>

.no-selection {
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
