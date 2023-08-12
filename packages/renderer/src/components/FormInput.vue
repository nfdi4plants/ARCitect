<script lang="ts" setup>

import { date } from 'quasar'

import {OntologyAnnotation} from '../../../../dist/ARCC/ISA/ISA/JsonTypes/OntologyAnnotation.js';

export interface Props {
  property: Object
};
const props = defineProps<Props>();

const checkDate = val => {
  return val==='' || val===undefined  ? true : date.isValid(val) || 'Invalid date.';
};
const hideDateBoxes = box => {
  box.hide();
}

</script>

<template>

    <q-select
      v-if='props.property.type==="ontology"'
      v-model="props.property.model[props.property.property]"
      :style="`margin:0 0.5em ${props.property.hint?2:-0.5}em 0.5em;${props.property.disabled?'opacity:0.6':''}`"
      :bg-color="props.property.model[props.property.property]!=props.property.org_value ? 'teal-1':'grey-3'"
      :hint="props.property.hint"
      filled
      use-input
      hide-selected
      fill-input
      input-debounce="500"
      :label="props.property.label"
      :options="props.property.options"
      :option-id="'TermAccessionNumber'"
      :option-label="a=> a ? a.NameText : ''"
      @input-value="v=>{if(props.property.model[props.property.property].NameText!==v){props.property.model[props.property.property] = OntologyAnnotation.fromString(v)}}"
      @filter="props.property.filter"
      :disable="props.property.disabled"
    >
      <template v-slot:append>
        <div v-if='props.property.model[props.property.property]'>
          <div v-if='props.property.model[props.property.property].TermAccessionNumber'>
            <span class='text-body2' style="padding-right:0.5em;">
              {{props.property.model[props.property.property].TermAccessionShort}}
            </span>
            <q-icon name="check_circle"/>
            <q-tooltip class='text-body2'>
              Verified Ontology Term
            </q-tooltip>
          </div>
          <div v-else-if='props.property.model[props.property.property].NameText'>
            <q-icon name="help">
              <q-tooltip class='text-body2'>
                Unverified Ontology Term
              </q-tooltip>
            </q-icon>
          </div>
        </div>
      </template>
    </q-select>

    <div v-else-if='props.property.type==="toggle_select"' style="text-align:center;margin:0.5em 0;">
      {{props.property.label}}:&nbsp;
      <q-btn-toggle
        v-model="props.property.model[props.property.property]"
        toggle-color="secondary"
        :options="props.property.options"
      />
    </div>

    <q-checkbox
      v-else-if='props.property.type==="checkbox"'
      v-model="props.property.model[props.property.property]"
      :label="props.property.label"
      color='secondary'
    />

    <q-input
      v-else-if='props.property.type!=="select"'

      :style="`margin:0 0.5em ${props.property.hint?2:-0.5}em 0.5em;`"
      :bg-color="props.property.model[props.property.property]!=props.property.org_value ? 'teal-1':'grey-3'"
      filled
      v-model="props.property.model[props.property.property]"
      :label="props.property.label"
      :type="props.property.type==='date'?'text':props.property.type"
      :hint="props.property.hint"
      :mask="props.property.type==='date'?'##.##.####':''"
      :rules="props.property.type==='date'?[checkDate]:[]"
      :readonly="props.property.readonly"
      :loading="props.property.loading"
      :disable="props.property.disabled"
      hide-buttom-space
    >
      <template v-slot:append>
        <q-icon v-if="props.property.type==='date'" name="event" class="cursor-pointer">
          <q-popup-proxy ref="date_boxes">
            <q-date v-model="props.property.model[props.property.property]" @update:model-value="hideDateBoxes($refs.date_boxes)" mask="DD.MM.YYYY"></q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <q-select
      v-else
      :style="`margin:0 0.5em ${props.property.hint?1:-0.5}em 0.5em;`"
      :bg-color="props.property.model[props.property.property]!=props.property.org_value ? 'teal-1':'grey-3'"
      filled
      v-model="props.property.model[props.property.property]"
      :use-input="props.property.useInput"
      :hide-selected="props.property.useInput"
      :hint="props.property.hint"
      fill-input
      input-debounce="0"
      :options="props.property.options"
      @filter="props.property.filterFn"
      @input-value="props.property.setModel"
      :label="props.property.label"
      :loading="props.property.loading"
      :multiple="props.property.multi"
      :disable="props.property.disabled"
    >
    </q-select>
    <!--<q-badge color="secondary" class="q-mb-md">-->
    <!--  {{ props.property.value }}-->
    <!--</q-badge>-->

</template>
