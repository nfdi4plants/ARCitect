<script lang="ts" setup>

import HostListEntry from './HostListEntry.vue';
import AddDataHubDialog from './AddDataHubDialog.vue';
import { ref } from 'vue';

defineProps({
    hosts: Array,
    hostmessages: Object,
    service_name: String,
    show_old_msgs: Boolean,
    editable: Boolean
})

const add_dialog = ref(false);

</script>

<template>
    <q-list>

      <!-- Host list header-->
      <q-item>
        <q-item-section class="text-grey text-bold">
            <span>Status of {{ service_name }} services</span>
        </q-item-section>

        <!-- Add Service Button -->
        <q-item-section v-if='editable' side>
            <q-btn flat @click="add_dialog=true" color="secondary" size="sm">
              Add Service
              <q-tooltip anchor="top middle" self="bottom middle">Add a new service.</q-tooltip>
            </q-btn>
        </q-item-section>
      </q-item>
      <q-separator />

      <!-- list of hosts-->
      <div v-for='host in hosts'>
        <HostListEntry :hostname="host"
                       :messages="hostmessages[host]"
                       :show_old_msgs="show_old_msgs"
                       :editable="editable"/>
        <q-separator />
      </div>

      <AddDataHubDialog v-model="add_dialog" />

    </q-list>
</template>
