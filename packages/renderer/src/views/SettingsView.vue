<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import a_input from '../components/a_input.vue';
import AppProperties from '../AppProperties.ts';

import {reactive} from 'vue';

const iProps = reactive({
});

const resetARCitect = async ()=>{
  await window.ipc.invoke('CORE.reset');
  AppProperties.read_config();
};

</script>

<template>
  <q-list>
    <ViewItem
      icon="settings"
      label="Settings"
      caption="General and Advanced ARCitect Settings"
    >
      <q-list dense>
        <q-expansion-item
          dense
          label="General"
          default-opened
        >
          <q-list dense>
            <q-item tag="label" v-ripple="{color:'grey'}">
              <q-item-section avatar>
                <q-checkbox v-model="AppProperties.config.gitDebug" color='secondary'/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Git Debugging</q-item-label>
                <q-item-label caption>Enables verbose git messages during push and pull requests</q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple="{color:'grey'}">
              <q-item-section avatar>
                <q-checkbox v-model="AppProperties.config.showTooltips" color='secondary'/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Tooltips</q-item-label>
                <q-item-label caption>Show tooltips while hovering over UI elements</q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple="{color:'grey'}">
              <q-item-section avatar>
                <q-checkbox v-model="AppProperties.config.showHelp" color='secondary'/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Help Menu</q-item-label>
                <q-item-label caption>Display the help menu on the right side of the ARCitect window</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item
          dense
          label="Advanced"
        >
          <q-list dense>

            <q-item tag="label" v-ripple="{color:'grey'}">
              <q-item-section avatar>
                <q-icon name='dns' color='secondary' style="margin:0 auto"/>
              </q-item-section>
              <q-item-section>
                <q-item-label><a_input label='SWATE URL' v-model='AppProperties.config.swate_url'/></q-item-label>
              </q-item-section>
            </q-item>


            <q-item tag="label" v-ripple="{color:'grey'}"
              @click='resetARCitect'
            >
              <q-item-section avatar>
                <q-icon name='warning' color='red-9' style="margin:0 auto"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Reset ARCitect</q-item-label>
                <q-item-label caption>Delete all local ARCitect config files</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </ViewItem>
  </q-list>

</template>
