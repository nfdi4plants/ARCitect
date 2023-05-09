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
  file: '',
  tab: 'editor'
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

const save = async ()=>{
  await window.ipc.invoke('LocalFileSystemService.writeFile', [props.file,markdownSource.model.source.value]);
  init();
}

onMounted(init);
watch( ()=>appProperties.active_markdown, init );

</script>

<template>
  <q-list>
    <ViewItem
      icon="edit_note"
      label="Markdown Editor"
      :caption="props.file"
      group='mgroup'
      defaultOpened
    >
      <q-card flat>
        <q-tabs
          v-model="props.tab"
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

        <q-tab-panels v-model="props.tab" class='q-pa-none'>
          <q-tab-panel name="editor" class='q-pl-none q-pr-none'>
            <FormInput :property='markdownSource.model.source' autogrow></FormInput>
            <q-card-actions align='right' style="padding:0.5em 1em;">
              <q-btn label="Save" type="submit" icon='check_circle' color="secondary" @click='save'/>
              <q-btn label="Reset" type="submit" icon='check_circle' color="secondary" @click='init'/>
            </q-card-actions>
          </q-tab-panel>

          <q-tab-panel name="preview">
            <Markdown class='markdown' :source="markdownSource.model.source.value" />
          </q-tab-panel>
        </q-tab-panels>
        <!--<br>-->
        <!--<FormInput :property='markdownSource.model.source'></FormInput>-->
        <!--<br>-->
        <!--<Markdown class='markdown' :source="markdownSource.model.source.value" />-->
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
