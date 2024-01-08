<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';

import AppProperties from '../AppProperties.ts';

const iProps = reactive({
  value: ''
});

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

// onMounted(()=>iProps.value=props.value);

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="min-width:45em;">
      <q-card-section>
        <div class="text-h6">User Information</div>
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="account_circle" />
            </q-item-section>
            <q-item-section>
              <q-input readonly label='Name' v-model='AppProperties.user.name' dense borderless />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="mail" />
            </q-item-section>
            <q-item-section>
              <q-input readonly label='eMail' v-model='AppProperties.user.email' dense borderless />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="storage" />
            </q-item-section>
            <q-item-section>
              <q-input readonly label='Host' v-model='AppProperties.user.host' dense borderless />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <q-btn color="secondary" icon='logout' label="Logout" @click='onDialogOK' class='text-weight-bold' />
        <q-btn color="secondary" label="Close" @click='onDialogCancel' class='text-weight-bold'/>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>
