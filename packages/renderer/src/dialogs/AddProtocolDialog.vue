<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';

const iProps = reactive({
  value: ''
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  onDialogOK([true,iProps.value]);
};

const importProtocol = async ()=>{
  const files = await window.ipc.invoke('LocalFileSystemService.selectAnyFiles');
  onDialogOK([false,files]);
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">Create or Import Protocol</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="iProps.value"
            label="Protocol Name"
            :rules="[
                val => !!val || `invalid ${props.property}`,
              ]"
            lazy-rules
          />
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="secondary" icon='add_box' label="New Protocol" type='submit' class='text-weight-bold' />
          <q-btn color="secondary" icon='open_in_new' label="Import Protocol" @click='importProtocol' class='text-weight-bold' />
          <q-btn color="secondary" label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>
