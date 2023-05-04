<script lang="ts" setup>

import { reactive, watch, onMounted } from 'vue';

import Markdown from 'vue3-markdown-it';
import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import {Property,PropertyTree} from '../interfaces/Property.ts';
import appProperties from '../AppProperties.ts';

class MarkdownSource extends PropertyTree {
  constructor(){
    super([
      new Property('source', {type:'textarea',label:' '})
    ]);
  }
}

const props = reactive({
  file: ''
});

const markdownSource = new MarkdownSource();

const init = async ()=>{
  markdownSource.model.source.value = '';
  markdownSource.model.source.loading = true;
  const path = appProperties.active_markdown;
  const s = await window.ipc.invoke('LocalFileSystemService.readFile', path);

  markdownSource.model.source.setOriginalValue(s);
  props.file = path;
  markdownSource.model.source.loading = false;
}

onMounted(init);
watch( ()=>appProperties.active_markdown, init );

</script>

<template>
  <q-list>
    <ViewItem
      icon="biotech"
      label="Markdown Editor"
      :caption="props.file"
      group='mgroup'
      defaultOpened
    >
      <q-card flat>
        <br>
        <FormInput :property='markdownSource.model.source'></FormInput>
        <br>
        <Markdown class='markdown' :source="markdownSource.model.source.value" />
      </q-card>
    </ViewItem>
  </q-list>
</template>

<style>
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
