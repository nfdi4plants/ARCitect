<script lang="ts" setup>
import { date } from "quasar";
import { onMounted, reactive, watch } from "vue";
import a_btn from "./a_btn.vue";

const model = defineModel();

</script>

<template>
  <q-input
      v-bind="$attrs"
      dense
      filled
      style="padding:0.4em;"
      v-model='model'
      class='a_date cursor-pointer'
      readonly
      >
      <template v-slot:prepend>
        <q-icon
          name="event"
          class="cursor-pointer"
        />
      </template>

      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-date
          color='secondary'
          v-model="model"
          mask='DD.MM.YYYY'
        >
          <div class="row items-center justify-end q-gutter-sm">
            <a_btn label="Clear" icon='delete' @click='model=""' v-close-popup />
            <a_btn label="Confirm" icon='check_circle' v-close-popup />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-input>
</template>

<style>
  .a_date .q-field__control:before  {
    border-bottom-style: none !important;
  }
</style>
