<script lang="ts" setup>

import appProperties from '../AppProperties.ts';

import GitCommitHelp from '../docs/git-commit.vue';
import GitSyncHelp from '../docs/git-sync.vue';
import GitHistoryHelp from '../docs/git-history.vue';
import DataHubHelp from '../docs/datahub.vue';
import ValidationHelp from '../docs/validation.vue';
import MarkdownHelp from '../docs/markdown.vue';
import HomeHelp from '../docs/home.vue';
import SwateHelp from '../docs/swate.vue';

</script>

<template>
  <div style='margin:-2.5em 2em 0 1em'>
    <GitCommitHelp v-if='appProperties.state===appProperties.STATES.GIT_COMMIT'></GitCommitHelp>
    <GitSyncHelp v-else-if='appProperties.state===appProperties.STATES.GIT_SYNC'></GitSyncHelp>
    <GitHistoryHelp v-else-if='appProperties.state===appProperties.STATES.GIT_HISTORY'></GitHistoryHelp>
    <SwateHelp v-else-if='appProperties.state===appProperties.STATES.EDIT_SWATE'></SwateHelp>
    <DataHubHelp v-else-if='appProperties.state===appProperties.STATES.OPEN_DATAHUB'></DataHubHelp>
    <ValidationHelp v-else-if='appProperties.state===appProperties.STATES.VALIDATION'></ValidationHelp>
    <MarkdownHelp v-else-if='appProperties.state===appProperties.STATES.EDIT_MARKDOWN'></MarkdownHelp>
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
