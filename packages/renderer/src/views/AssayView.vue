<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import AssayForm from '../components/AssayForm.vue';
import SwateForm from '../components/SwateForm.vue';

</script>

<template>
  <q-list>
    <AssayForm group="igroup" defaultOpened></AssayForm>
    <q-separator />
    <SwateForm group="igroup" defaultOpened></SwateForm>
  </q-list>
</template>
