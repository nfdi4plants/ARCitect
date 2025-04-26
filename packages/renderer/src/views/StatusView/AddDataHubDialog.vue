<script lang="ts" setup>

import type { AuthIdOnly, AuthWithSecret } from '../../../../main/src/DataHubService.d.ts';
import { addDataHub } from '../../AppProperties';
import { ref, computed } from 'vue';

const addHost = () => {
    let credentials: AuthIdOnly | AuthWithSecret
    if (server_address.value !== '' && server_client_id.value !== ''){
      credentials = {id: server_client_id.value}
    } else {
      credentials = {id: server_client_id.value, secret: server_client_secret.value}
    }
    addDataHub(server_address.value, credentials);
    clearHostData();
}

const clearHostData = () => {
    server_address.value = '';
    server_client_id.value = '';
    server_client_secret.value = '';
}

const checkHostValidity = () => {
    host_data_invalid.value = !(server_address.value !== '' && server_client_id.value !== '');
}

const server_address = ref('');
const server_client_id = ref('');
const server_client_secret = ref('');
const host_data_invalid = ref(true);
const x = computed(()=>server_address.value + ' ' + server_client_id.value + ' ' + server_client_secret.value);

</script>

<template>
<q-dialog>
    <q-card>
      <q-card-section>
        <div class="text-h6">Add a Datahub Service</div>
      </q-card-section>
      <q-card-section>
      Please add address and credentials for your additional datahub service. If you only have a client ID, leave the client secret empty. 
      Otherwise both are required. If you are unsure about the credentials, please contact your datahub admin.
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="server_address" label="Server" placeholder="e.g. git.nfdi4plants.de"  @update:model-value="checkHostValidity" autofocus/>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="server_client_id" label="Client ID"   @update:model-value="checkHostValidity" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="server_client_secret" label="Client Secret" placeholder="if applicable"  @update:model-value="checkHostValidity"/>
      </q-card-section>
      <q-card-section class="q-pt-none">
        Please note: Only instances of gitlab can be added as datahub services. Make sure to follow the Dataplant guidelines for your datahub service.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="clearHostData" v-close-popup />
        <q-btn :disable=host_data_invalid label="Add" :color='host_data_invalid ? "grey" : "secondary"' @click="addHost" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>