<script lang="ts" setup>

export interface Props {
  label: String,
  caption: String,
  icon: String
};
const props = defineProps<Props>();

</script>

<template>
  <q-expansion-item
    defaultOpened
    hide-expand-icon
    expand-icon-toggle
  >
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon color="grey-8" :name="props.icon" />
      </q-item-section>

      <q-item-section no-wrap>
        <q-item-label>{{props.label}}</q-item-label>
        <q-item-label caption>{{props.caption}}</q-item-label>
      </q-item-section>
    </template>

    <div style="display:block;margin:0 auto;border-top:1px solid #ccc;">
      <slot></slot>
    </div>
  </q-expansion-item>
</template>
