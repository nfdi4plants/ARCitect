<script lang="ts" setup>

import ArcCommanderService from '../ArcCommanderService.ts';

export interface Props {
  icon: String,
  text: String,
  requiresARC?: Boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'help',
  text: 'TODO',
  requiresARC: false
});

const emit = defineEmits(['clicked']);

const enabled = ()=>{
  return ArcCommanderService.props.ac_state && (!props.requiresARC || ArcCommanderService.props.arc_root);
}

</script>

<template>
  <q-item v-ripple clickable :style="enabled() ? '' : 'opacity:0.4;'" v-on:click="enabled() && emit('clicked')">
    <q-item-section avatar>
      <q-icon color='grey-7' :name="props.icon"></q-icon>
    </q-item-section>
    <q-item-section style="margin-left:-1.2em;">{{props.text}}</q-item-section>
  </q-item>
</template>
