<script lang="ts" setup>
export interface Props {
  label?: String
};
const props = withDefaults(defineProps<Props>(), {
  label: ''
});
</script>

<template>
  <div class="q-checkbox cursor-pointer no-outline row inline no-wrap items-center q-checkbox--dense" aria-label="Use large File Storage" aria-checked="false" filled="" style="float: right; padding: 0.8em 1em 0px;">
    <div class="q-checkbox__inner relative-position non-selectable q-checkbox__inner--truthy text-secondary" aria-hidden="true">
      <input class="hidden q-checkbox__native absolute q-ma-none q-pa-none" type="checkbox"><div class="q-checkbox__bg absolute"><svg class="q-checkbox__svg fit absolute-full" viewBox="0 0 24 24"><path class="q-checkbox__truthy" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path><path class="q-checkbox__indet" d="M4,14H20V10H4"></path></svg></div>
    </div>
    <span class="no-outline" tabindex="-1"></span>
    <div class="q-checkbox__label q-anchor--skip">{{props.label}}</div>
  </div>
</template>
