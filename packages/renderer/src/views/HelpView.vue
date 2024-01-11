<script lang="ts" setup>

import appProperties from '../AppProperties.ts';

import GitHelp from '../docs/git.vue';
import AssayHelp from '../docs/assay.vue';
import StudyHelp from '../docs/study.vue';
import DataHubHelp from '../docs/datahub.vue';
import HomeHelp from '../docs/home.vue';
import InvestigationHelp from '../docs/investigation.vue';

</script>

<template>
  <div style='margin:-2.5em 2em 0 1em'>
    <GitHelp v-if='appProperties.state===appProperties.STATES.GIT'></GitHelp>
    <InvestigationHelp v-else-if='appProperties.state===appProperties.STATES.EDIT_INVESTIGATION'></InvestigationHelp>
    <DataHubHelp v-else-if='appProperties.state===appProperties.STATES.OPEN_DATAHUB'></DataHubHelp>
    <AssayHelp v-else-if='appProperties.state===appProperties.STATES.EDIT_ASSAY'></AssayHelp>
    <StudyHelp v-else-if='appProperties.state===appProperties.STATES.EDIT_STUDY'></StudyHelp>
    <HomeHelp v-else></HomeHelp>
  </div>
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
