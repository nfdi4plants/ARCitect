<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';

export interface Props {
  title: String,
  property: String,
  icon: String
};
const props = defineProps<Props>();

const iProps = reactive({
  value: ''
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  onDialogOK(iProps.value);
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">{{props.title}}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="iProps.value"
            :label="props.property"
            :rules="[
                val => !!val || `invalid ${props.property}`,
              ]"
            lazy-rules
          />
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="secondary" :icon='props.icon || ""' :label="props.title" type='submit' class='text-weight-bold' />
          <q-btn color="secondary" label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>
