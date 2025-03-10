<script lang="ts" setup>
import AppProperties from '../AppProperties.ts';

defineProps<{
  force?: Boolean
}>()


</script>

<template>
  <q-tooltip v-if='AppProperties.config.showTooltips || force' style="font-size:1.1em">
    <slot></slot>
  </q-tooltip>
</template>
