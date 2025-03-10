<script lang="ts" setup>

import { deleteDataHub } from '../../AppProperties';

const props = defineProps({
    host: String
})

const deleteHost = () => {
    deleteDataHub(props.host);
}

</script>

<template>
<q-dialog>
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete {{host}}</div>
      </q-card-section>
      
      <q-card-section>
        Are you sure you want to delete the datahub service {{host}}? This will mean you can not sync ARCs with the remote set to this service anymore.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn label="Delete" color="primary" @click="deleteHost" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>