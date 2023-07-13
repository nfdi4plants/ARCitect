<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';

export interface Props {
  items: Array,
  title: String,
  ok_title: String,
  cancel_title: String,
  error: String
};
const props = defineProps<Props>();

const iProps = reactive({
  value: ''
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:45em;">
      <q-card-section>
        <div class="text-h6">{{props.title}}</div>
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item v-for='item in props.items'>
            <q-item-section avatar style="min-width:2em;">
              <q-circular-progress
                :indeterminate='item[1]<1'
                rounded
                size="2em"
                :thickness="0.7"
                track-color="grey-3"
                :color="item[1]===2 ? 'red-8' : item[1]===1 ? 'green' : 'primary'"
                class="q-ma-md"
                :value='100'
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{item[0]}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-banner rounded inline-actions class="bg-red-10 text-white" dense v-if='props.error'>
          <template v-slot:avatar>
            <q-icon name="warning"/>
          </template>
          <div v-html='props.error'></div>
        </q-banner>

      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <q-btn color="secondary" :label="props.ok_title" @click="onDialogOK" type='submit' class='text-weight-bold' :disabled='props.items[props.items.length-1][1]!==1'/>
        <q-btn color="secondary" :label="props.cancel_title" @click="onDialogCancel" class='text-weight-bold' :disabled='props.items[props.items.length-1][1]<1'/>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>
