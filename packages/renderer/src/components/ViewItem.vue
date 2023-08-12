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
    :icon="props.icon"
    :label="props.label"
    :caption="props.caption"
    header-class="bg-grey-33"
    :group='props.group'
    :default-opened='props.defaultOpened'
  >

    <div v-if='props.fullWidth' style="display:block;margin:0 auto;">
      <slot></slot>
    </div>
    <div v-else style="display:block;margin:0 auto;max-width:700px;">
      <slot></slot>
    </div>
  </q-expansion-item>
</template>
