<script lang="ts" setup>

import ArcControlService from '../ArcControlService.ts';
import appProperties from '../AppProperties.ts';

export interface Props {
  icon: string,
  text: string,
  requiresARC?: boolean,
  requiresUser?: boolean,
  requiresGit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'help',
  text: 'TODO',
  requiresARC: false,
  requiresUser: false,
  requiresGit: false
});

const emit = defineEmits(['clicked']);

const enabled = ()=>{
  return (!props.requiresARC || ArcControlService.props.arc_root) && (!props.requiresUser || appProperties.user) && (!props.requiresGit || ArcControlService.props.git_initialized);
}

</script>

<template>
  <q-item v-ripple clickable :style="enabled() ? '' : 'opacity:0.4;'" v-on:click="enabled() && emit('clicked')">
    <q-item-section avatar>
      <q-icon color='grey-7' :name="props.icon"></q-icon>
    </q-item-section>
    <q-item-section style="margin-left:-1.2em;">{{props.text}}</q-item-section>
    <slot></slot>
  </q-item>
</template>
