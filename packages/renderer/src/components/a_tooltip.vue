<script lang="ts" setup>
import AppProperties from '../AppProperties.ts';
</script>

<template>
  <q-tooltip v-if='AppProperties.showTooltips' style="font-size:1.1em">
    <slot></slot>
  </q-tooltip>
</template>
