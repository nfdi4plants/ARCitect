<template>
  <div class='editor' id='editor-container'>
  </div>
</template>

<script lang="ts" setup>
import * as monaco from 'monaco-editor'
import { onMounted } from 'vue';

const data = {}

onMounted(()=>{
  data.editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: '',
    language: 'text',
    automaticLayout: true
  });
})

const openFile = file => {
  data.file = file;
  window.ipc.invoke('LocalFileSystemService.readFile', file.id).then( text => {
    data.editor.setValue(text);
  });
}

defineExpose({openFile});

// console.log(monaco);
// let ME = null;
// onMounted(() => {
//   ME = monaco.editor.create(document.getElementById('editor-container'), {
//     value: '',
//     language: 'text',
//     automaticLayout: true
//   });
//   // console.log(ME);
//   // console.log(monaco.editor);
// });

// const openFile = path => {
//   console.log(path);
//   window.ipc.invoke('readFile', path).then( text => {
//     ME.setValue(text);
//   });
// }



</script>

<style>
.editor {
  height: 100%;
  /*position: absolute;*/
  /*left: 2em;*/
  /*right: 2em;*/
  /*top: 0.4em;*/
  /*bottom: 0em;*/
  /*border: 0.5em solid #f00;*/
}
</style>
