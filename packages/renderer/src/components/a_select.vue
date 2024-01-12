<script lang="ts" setup>

export interface Props {
  hint?: String
};
const props = withDefaults(defineProps<Props>(), {
  hint: ''
});
</script>

<template>
  <q-select v-bind="$attrs" filled options-dense dense style="padding:0.4em;" hide-bottom-space>
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </q-select>
</template>
