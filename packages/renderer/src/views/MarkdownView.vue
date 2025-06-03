<script lang="ts" setup>

import { reactive, watch, onMounted, onUnmounted} from 'vue';

import Markdown from 'vue3-markdown-it';
import ViewItem from '../components/ViewItem.vue';
import a_input from '../components/a_input.vue';
import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

import { VMarkdownEditor } from 'vue3-markdown'
import 'vue3-markdown/dist/vue3-markdown.css'

const iProps = reactive({
  path: '',
  text: '',
  original: '',
  processed: '',
  base64Images: new Map(),
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

const handleUpload = async file => {
  const imageAs64 = await window.ipc.invoke('LocalFileSystemService.readImage', file.path);
  return imageAs64;
}

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
  <div class='fit markdown_container'>
    <div>
      <ViewItem
        icon="edit_note"
        label="Markdown Editor"
        :caption="iProps.path"
      >
      </ViewItem>
    </div>

    <div class='markdown_container_div'>
      <VMarkdownEditor
        v-model="iProps.text"
        locale="en"
        :upload-action="handleUpload"
      />
    </div>

    <div style="padding:0.5em 1em;text-align:right;">
      <q-btn label="Save" type="submit" icon='check_circle' color="secondary" @click='save'/>
      &nbsp;
      <q-btn label="Reset" type="submit" icon='refresh' color="secondary" @click='init'/>
    </div>
  </div>
</template>

<style>
  .markdown_container {
    display: block;
    display:flex;
    flex-direction: column;
  }

  .markdown_container_div {
    flex-grow:1;
  }
</style>
