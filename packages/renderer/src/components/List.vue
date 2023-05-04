<script lang="ts" setup>

import ArcCommanderService from '../ArcCommanderService.ts';

export interface Props {
  items: Object[],
  name: String,
  label(i: Object): String,
  caption(i: Object): String,
  avatar(i: Object): String,
  icon_add: String,
  icon_remove: String,
};
const props = defineProps<Props>();

const emit = defineEmits(['edit','add','remove']);

</script>

<template>
  <q-card flat>

    <q-card-section>
      <q-list separator>
        <q-item clickable v-ripple v-for='(item,i) in props.items'>
          <q-item-section avatar v-if='props.avatar(item)'>
            <q-avatar color="primary" text-color="white">
              {{props.avatar(item)}}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{props.label(item)}}</q-item-label>
            <q-item-label caption>{{props.caption(item)}}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class='row'>
              <div class='col' style="padding:0 0.3em 0 0">
                <q-btn label="" icon='edit' color="secondary" :disabled='ArcCommanderService.props.busy' v-on:click='()=>emit("edit",item)'/>
              </div>
              <div class='col'>
                <q-btn label="" :icon='props.icon_remove' color="secondary" :disabled='ArcCommanderService.props.busy' v-on:click='()=>emit("remove",item)'/>
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-actions align='right' style="padding:2.2em;">
      <q-btn :label="`Add ${props.name}`" :icon='props.icon_add' color="secondary" class="q-ml-sm" :disabled='ArcCommanderService.props.busy' v-on:click='()=>emit("add")'/>
    </q-card-actions>
  </q-card>
</template>

<style>
.myP {
  padding: 0 1em;
}

</style>
