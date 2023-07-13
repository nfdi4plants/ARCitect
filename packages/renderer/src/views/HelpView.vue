<script lang="ts" setup>

import {reactive,watch,onMounted} from 'vue';
import Markdown from 'vue3-markdown-it';
import appProperties from '../AppProperties.ts';

import assay_help from '../docs/assay.ts';
import study_help from '../docs/study.ts';
import home_help from '../docs/home.ts';
import investigation_help from '../docs/investigation.ts';
import datahub_help from '../docs/datahub.ts';

const props = reactive({
  help: '# Help'
});

const init = async () => {
  switch(appProperties.state){
    case appProperties.STATES.HOME: return props.help = home_help;
    case appProperties.STATES.EDIT_INVESTIGATION: return props.help = investigation_help;
    case appProperties.STATES.EDIT_STUDY: return props.help = study_help;
    case appProperties.STATES.EDIT_ASSAY: return props.help = assay_help;
    case appProperties.STATES.OPEN_DATAHUB: return props.help = datahub_help;
    default: return props.help = '# ';
  }
};

watch( ()=>appProperties.state, init );
onMounted(init);

</script>

<template>
  <Markdown class='markdown q-pa-lg' :source="props.help" />
</template>

<style>
.markdown * {
  font-size:1.1em;
  margin: 0.2em 0em;
  line-height: 1.2;
}
.markdown h1 {
  font-size:2em;
  margin-top: 0em;
}
.markdown h2 {
  font-size:1.5em;
  margin-top: 1em;
}
.markdown h3 {
  font-size:1.2em;
  margin-top: 1em;
}
.markdown p {
  font-size:1.15em;
  margin-top: 1em;
}
.markdown img{
  max-width: 100%;
}
</style>
