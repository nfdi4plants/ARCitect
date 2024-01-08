<script lang="ts" setup>

export interface Props {
  label: String,
  caption: String,
  icon: String,
  group: String,
  defaultOpened?: Boolean,
  fullWidth?: Boolean,
};
const props = defineProps<Props>();

</script>

<template>
  <q-expansion-item
    expand-separator
    :group='props.group'
    :default-opened='props.defaultOpened'
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

    <div v-if='props.fullWidth' style="display:block;margin:0 auto;">
      <slot></slot>
    </div>
    <div v-else style="display:block;margin:0 auto;max-width:700px;">
      <slot></slot>
    </div>
  </q-expansion-item>
</template>
