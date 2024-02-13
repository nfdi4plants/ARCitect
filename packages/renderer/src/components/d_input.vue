<script lang="ts" setup>
export interface Props {
  label?: String,
  value?: String,
};
const props = withDefaults(defineProps<Props>(), {
  label: '',
  value: '',
});
</script>

<template>
  <label
    class="d-input q-field row no-wrap items-start q-field--filled q-field--float q-field--labeled q-field--dense q-field--readonly"
    style="padding: 0.4em;">
    <div class="q-field__inner relative-position col self-stretch">
      <div class="q-field__control relative-position row no-wrap" tabindex="-1">
        <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip">
          <input class="q-field__native q-placeholder" type="text" :value='props.value' readonly>
          <div class="q-field__label no-pointer-events absolute ellipsis">{{props.label}}</div>
        </div>
      </div>
    </div>
  </label>
</template>

<style>
.d-input .q-field__control:before {
  border: 0 !important;
}
</style>
