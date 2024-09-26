<script lang="ts" setup>

import { reactive, watch, onMounted, onUnmounted} from 'vue';

import Markdown from 'vue3-markdown-it';
import ViewItem from '../components/ViewItem.vue';
import a_input from '../components/a_input.vue';
import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

const iProps = reactive({
  path: '',
  text: '',
  original: '',
  processed: '',
  base64Images: new Map(),
  tab: 'editor'
});

const extractFilePaths = markdown => {
  const regex = /!\[.*?\]\((.*?)\s*(?:"[^"]*")?\)/g;
  const filePaths = [];
  let match;
  while ((match = regex.exec(markdown)) !== null)
    filePaths.push(match[1]);
  return filePaths;
};

const processText = async ()=>{
  console.log('edit');

  let text = iProps.text;
  for(let path of extractFilePaths(text)){
    let value = null;
    if(iProps.base64Images.has(path)){
      value = iProps.base64Images.get(path);
    } else {
      if(path.startsWith('http://') || path.startsWith('https://')){
        iProps.base64Images.set(path,path);
      } else {
        const imageAs64 = await window.ipc.invoke('LocalFileSystemService.readImage', ArcControlService.props.arc_root+'/'+path);
        iProps.base64Images.set(path,imageAs64);
      }
    }
  }
  for(let [path,path_] of iProps.base64Images)
    text = text.replaceAll(path,path_);
  iProps.processed = text;
};

const init = async ()=>{
  iProps.path = AppProperties.active_markdown;
  iProps.text = '';
  iProps.original = '';
  iProps.text = await window.ipc.invoke('LocalFileSystemService.readFile', iProps.path);
  iProps.original = iProps.text;
  processText();
};

const save = async ()=>{
  if(iProps.text===iProps.original) return;
  await window.ipc.invoke('LocalFileSystemService.writeFile', [iProps.path,iProps.text]);
  init();
};

onMounted(init);
onUnmounted(save);
watch( ()=>AppProperties.active_markdown, init );
watch( ()=>iProps.tab, processText );

</script>

<template>
  <q-list>
    <ViewItem
      icon="edit_note"
      label="Markdown Editor"
      :caption="iProps.path"
    >
      <q-card flat>
        <q-tabs
          v-if='iProps.path.endsWith(".md")'
          v-model="iProps.tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="editor" label="Editor" />
          <q-tab name="preview" label="Preview" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="iProps.tab" class='q-pa-none'>
          <q-tab-panel name="editor" class='q-pl-none q-pr-none'>

            <a_input v-model='iProps.text' type='textarea' autogrow :bg-color='iProps.text!==iProps.original ? "teal-1":""' />
            <q-card-actions align='right' style="padding:0.5em 1em;">
              <q-btn label="Save" type="submit" icon='check_circle' color="secondary" @click='save'/>
              <q-btn label="Reset" type="submit" icon='refresh' color="secondary" @click='init'/>
            </q-card-actions>
          </q-tab-panel>

          <q-tab-panel name="preview">
            <Markdown class='markdown' :source="iProps.processed" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </ViewItem>
  </q-list>
</template>

<style>

  .toppad .q-field__control-container {
    padding-top:0.6em !important;
  }

  .markdown * {
    margin: 0.2em 0em;
    line-height: 1.2;
  }
  .markdown h1 {
    font-size:3em;
    margin-top: 1em;
  }
  .markdown h2 {
    font-size:2em;
    margin-top: 1em;
  }
  .markdown h3 {
    font-size:2em;
    margin-top: 1em;
  }
  /*.markdown h4 {*/
  /*  font-size:1.4em;*/
  /*}*/
  /*.markdown h5 {*/
  /*  font-size:1.2em;*/
  /*}*/
  /*.markdown h6 {*/
  /*  font-size:1em;*/
  /*}*/

</style>
