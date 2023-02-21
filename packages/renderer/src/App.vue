<script lang="ts" setup>

import ToolbarButton from './components/ToolbarButton.vue';
import ArcTreeView from './components/ArcTreeView.vue';

import HomeView from './components/HomeView.vue';

import EditInvestigationView from './components/EditInvestigationView.vue';
import AssayView from './components/AssayView.vue';
import StudyView from './components/StudyView.vue';

import DataHubView from './components/DataHubView.vue';

import logoURL from '../assets/dpLogo2_w.png'

import { setCssVar } from 'quasar';
setCssVar('primary', '#2d3e50');

import { onMounted, ref, reactive } from 'vue';

import appProperties from './AppProperties.ts';
import ArcCommanderService from './ArcCommanderService.ts';

const layoutProperties = reactive({
  showToolbar: true,
  toolbarMinimized: false,
  showHelp: true,
  splitterModel: 40
});

const showError = ()=>{
  return 0;
}

const openLocalArc = async path=>{
  if(!path)
    path = await window.ipc.invoke('LocalFileSystemService.selectDir');
  if(!path)
    return;
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

  const id = path.split('/').pop();

  response = await window.ipc.invoke('ArcCommanderService.run', {
    args: [`-p`,path,'i','create','-i',id,'--title',id]
  });
  if(!response[0])
    return showError();

  openLocalArc(path);
};

onMounted(async () => {
  await ArcCommanderService.init();
  appProperties.state=appProperties.STATES.HOME;
  // setTimeout(1000, ()=>{console.log(layoutProperties.showHelp)})

  // layoutProperties.showHelp = true;
  // layoutProperties.toolbarMinimized = false;

});
// let initialDrawerWidth = 0;
// const resizeDrawer = e=> {
//   if (e.isFirst === true) {
//     initialDrawerWidth = layoutProperties.drawerWidth;
//   }
//   layoutProperties.drawerWidth = Math.max(200,initialDrawerWidth + e.offset.x);
// };

</script>

<template>
    <q-layout view="hHh LpR fFf" class="no-selection">
      <q-header>
        <q-toolbar style="padding:0 0.7em;">
          <!--<q-icon size="2.5rem" style="margin:0.1em;padding:0.2em;border:0.05em solid white;border-radius:1em;" :name="'img:'+logoURL"></q-icon>-->
          <q-icon size="2rem" style="padding:0.05em;border:0.05em solid white;border-radius:0.2em;" :name="'img:'+logoURL"></q-icon>
          <!--<q-toolbar-title>{{appProperties.title}}</q-toolbar-title>-->
          <q-toolbar-title>
              <span style="border-bottom:0em solid white;">
                <div class='logo-text-0'>ARC</div>
                <div class='logo-text-1'>itect</div>
              </span>
            <!--<div class='row' style='height:40px;overflow:hidden;'>-->
            <!--  <div class='logo-text-0'>ARC</div>-->
            <!--  <div class='logo-text-1'>itect</div>-->
            <!--</div>-->
            <!--<div class='row' style='height:20px;overflow:hidden;'>-->
            <!--  <div class='logo-text-2'>@nfdi4plants.de</div>-->
            <!--</div>-->
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model='layoutProperties.showToolbar'
        show-if-above

        :mini="layoutProperties.toolbarMinimized"

        :width="200"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <q-list padding>
          <ToolbarButton text='New ARC' icon='note_add' @clicked='newLocalArc()'></ToolbarButton>
          <ToolbarButton text='Open ARC' icon='file_open' @clicked='openLocalArc()'></ToolbarButton>
          <ToolbarButton text='Import ARC' icon='cloud_download' @clicked='appProperties.state=appProperties.STATES.OPEN_DATAHUB'></ToolbarButton>

          <q-separator />

          <ToolbarButton text='Upload ARC' icon='cloud_upload' requiresARC='true' @clicked=''></ToolbarButton>
          <ToolbarButton text='Refresh ARC' icon='autorenew' requiresARC='true' @clicked='ArcCommanderService.getArcProperties()'></ToolbarButton>

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
      >
        <q-scroll-area class='fit' style="height: 100%;width:100%;">
          <div class='q-pa-md'>
            <div class='text-h6 text-weight-bold'>Help</div>

            <p>This space can be used for detailed instructions for the current context.</p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus sit amet metus eu dictum. In hac habitasse platea dictumst. Nunc iaculis, sem feugiat luctus eleifend, odio tortor laoreet turpis, a cursus quam dolor ac justo. Sed vel dui eget diam placerat blandit in sed metus. In metus felis, congue et rutrum ac, aliquet quis urna. Phasellus vel diam eu nunc lacinia interdum eu at lorem. Praesent lacus lacus, facilisis vel lacinia at, iaculis in sem. Nam sed sagittis lorem, sed ultricies dui. Etiam imperdiet ullamcorper purus, sed aliquet elit efficitur et. Mauris a porta magna.</p>

            <p>Vestibulum pretium leo felis, a rutrum dui vulputate id. Duis nec lacus ut ante dapibus varius. Proin vitae turpis in metus posuere auctor. Morbi massa erat, suscipit non elementum sit amet, blandit ut tellus. Cras facilisis, turpis nec vulputate convallis, leo lacus facilisis metus, a eleifend nunc magna vel risus. Fusce non purus id ex ultricies aliquam. Proin fermentum magna nisi, ac gravida nibh elementum at. Vestibulum ligula leo, vestibulum a viverra nec, sollicitudin gravida orci. Praesent pellentesque sapien lorem, at porttitor enim tristique non. Suspendisse dictum quam augue, id iaculis ipsum semper a. Suspendisse ac sollicitudin turpis, a volutpat dolor.</p>

            <p>Aenean et dolor vehicula, hendrerit ante ac, fringilla est. Sed ultrices commodo nunc ac pretium. Donec commodo sem ultrices imperdiet hendrerit. Nam lobortis accumsan luctus. Mauris posuere convallis urna, vitae placerat ante accumsan sit amet. Ut eleifend iaculis erat id tincidunt. Morbi auctor metus risus, sed scelerisque odio convallis in. Ut sollicitudin magna eu orci pretium volutpat. Maecenas vulputate lectus ac justo convallis, eu tempor magna blandit. Cras imperdiet gravida augue, quis aliquam enim volutpat eu. Quisque eu est convallis, luctus purus eu, placerat risus.</p>


            <!--<p v-for='(item,i) in Array(100)'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?</p>-->
            <!--<p v-for='(item,i) in ArcCommanderService.props.log'>-->
            <!--  {{item}}-->
            <!--</p>-->

          </div>

        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <q-splitter
            v-model="layoutProperties.splitterModel"
            class='full'
            :limits='[30,70]'
           >
            <template v-slot:before>
              <q-scroll-area class='fit' style="height: 100%;">
                <ArcTreeView></ArcTreeView>
              </q-scroll-area>
            </template>

            <template v-slot:after>
              <q-scroll-area class='fit' style="height: 100%;">
              <!--<HomeView v-if ='appProperties.state===appProperties.STATES.HOME'></HomeView>-->
              <DataHubView v-if='appProperties.state===appProperties.STATES.OPEN_DATAHUB'></DataHubView>

              <EditInvestigationView v-else-if='appProperties.state===appProperties.STATES.EDIT_INVESTIGATION'></EditInvestigationView>
              <AssayView v-else-if='appProperties.state===appProperties.STATES.EDIT_ASSAY'></AssayView>
              <StudyView v-else-if='appProperties.state===appProperties.STATES.EDIT_STUDY'></StudyView>
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
