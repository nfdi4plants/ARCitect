<script lang="ts" setup>

export interface Props {
  label?: String,
  icon?: String,
  color?: String
};
const props = withDefaults(defineProps<Props>(), {
  label: '',
  icon: '',
  color: 'secondary',
});
</script>

<template>
  <button :class="'q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-'+props.color+' text-white'" type="button">
    <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
      <i class="q-icon on-left notranslate material-icons" aria-hidden="true" role="img">{{props.icon}}</i>
      <span class="block">{{props.label}}</span>
    </span>
  </button>
</template>
