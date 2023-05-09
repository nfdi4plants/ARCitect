<script lang="ts" setup>

import { date } from 'quasar'

export interface Props {
  property: Object
};
const props = defineProps<Props>();

const checkDate = val => {
  return val==='' ? true : date.isValid(val) || 'Invalid date.';
};
const hideDateBoxes = box => {
  box.hide();
}

</script>

<template>
    <q-input
      v-if='props.property.type!=="select"'

      :style="`margin:0 0.5em ${props.property.hint?2:-0.5}em 0.5em;`"
      :bg-color="props.property.dirty ? 'teal-1':'grey-3'"
      filled
      v-model="props.property.value"
      :label="props.property.label"
      :type="props.property.type==='date'?'text':props.property.type"
      :hint="props.property.hint"
      :mask="props.property.type==='date'?'##/##/####':''"
      :rules="props.property.type==='date'?[checkDate]:[]"
      :readonly="props.property.readonly"
      :loading="props.property.loading"
      hide-buttom-space
    >
      <template v-slot:append>
        <q-icon v-if="props.property.type==='date'" name="event" class="cursor-pointer">
          <q-popup-proxy ref="date_boxes">
            <q-date v-model="props.property.value" @update:model-value="hideDateBoxes($refs.date_boxes)" mask="MM/DD/YYYY"></q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-select
      v-else

      :style="`margin:0 0.5em ${props.property.hint?2:-0.5}em 0.5em;`"
      :bg-color="props.property.dirty ? 'teal-1':'grey-3'"
      filled
      v-model="props.property.value"
      :use-input="props.property.useInput"
      fill-input
      input-debounce="0"
      :options="props.property.options"
      @filter="props.property.filterFn"
      @input-value="props.property.setModel"
      :label="props.property.label"
      :loading="props.property.loading"
      :multiple="props.property.multi"
      hide-buttom-space
    >
    </q-select>
    <!--<q-badge color="secondary" class="q-mb-md">-->
    <!--  {{ props.property.value }}-->
    <!--</q-badge>-->

</template>
