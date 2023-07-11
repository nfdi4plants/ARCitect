<script lang="ts" setup>

import { onMounted, ref, reactive, watch } from 'vue';

import GitCommitForm from '../components/GitCommitForm.vue';
import GitHistory from '../components/GitHistory.vue';

</script>

<template>

  <q-list bordered class="rounded-borders">
    <GitCommitForm></GitCommitForm>
    <q-separator />
    <GitHistory></GitHistory>
  </q-list>

</template>

