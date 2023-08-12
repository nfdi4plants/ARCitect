<script lang="ts" setup>

import { reactive, watch, onMounted } from 'vue';

import Markdown from 'vue3-markdown-it';
import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import AppProperties from '../AppProperties.ts';
import Property from '../Property.ts';

const iProps = reactive({
  path: '',
  text: '',
  tab: 'editor',
  property: null
});
iProps.property = Property(iProps,'text',{type:'textarea',label:' '});

const init = async ()=>{
  iProps.text = '';
  iProps.property.loading = true;

  iProps.path = AppProperties.active_markdown;
  iProps.text = await window.ipc.invoke('LocalFileSystemService.readFile', iProps.path);
  iProps.property.org_value = iProps.text;

  iProps.property.loading = false;
};

const save = async ()=>{
  await window.ipc.invoke('LocalFileSystemService.writeFile', [iProps.path,iProps.text]);
  init();
};

onMounted(init);
watch( ()=>AppProperties.active_markdown, init );

</script>

<template>
  <q-list>
    <ViewItem
      icon="edit_note"
      label="Markdown Editor"
      :caption="iProps.path"
      group='mgroup'
      defaultOpened
    >
      <q-card flat>
        <q-tabs
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
            <FormInput class='toppad' :property='iProps.property' autogrow></FormInput>
            <q-card-actions align='right' style="padding:0.5em 1em;">
              <q-btn label="Save" type="submit" icon='check_circle' color="secondary" @click='save'/>
              <q-btn label="Reset" type="submit" icon='check_circle' color="secondary" @click='init'/>
            </q-card-actions>
          </q-tab-panel>

          <q-tab-panel name="preview">
            <Markdown class='markdown' :source="iProps.text" />
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
