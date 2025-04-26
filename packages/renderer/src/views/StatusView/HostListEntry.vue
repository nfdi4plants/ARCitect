<script lang="ts" setup>

import { DATAHUB_STATUS } from '../../AppProperties';
import DeleteDataHubDialog from './DeleteDataHubDialog.vue';
import {ref} from 'vue';
import { watch, computed } from 'vue';

const props = defineProps({
    hostname: String,
    messages: Object,
    show_old_msgs: Boolean,
    editable: Boolean
    })

const format_date = utc => {
  const format = x => ('00' + x).slice(-2);
  const d = new Date(Date.parse(utc));
  return `${format(d.getDate())}.${format(d.getMonth()+1)}.${d.getFullYear()} - ${format(d.getHours())}:${format(d.getMinutes())}`;
};

// dialog reference
let deleteDialog = ref(false);

// determine icon styling from message status
const { icon, text_color } = computed(() => {
    if (props.messages.critical) {
        return { icon: 'warning', text_color: 'red-9' };
    } else if (props.messages.length === 1 && props.messages[0].status == DATAHUB_STATUS.PROBING) {
        return { icon: 'warning', text_color: 'orange-6' };
    } else {
        return { icon: 'check_circle', text_color: 'secondary' };
    }
}).value;

// open delete dialog
// stop event propagation to prevent expansion item from toggling
const deleteHostDialog = () => {
    //e.preventDefault();
    //e.stopPropagation();
    deleteDialog.value = true;
}

</script>

<template>
    <q-expansion-item dense :label="hostname">
        <template v-slot:header>
            
            <q-item-section avatar>
                <q-avatar :icon="icon" :text-color="text_color" />
            </q-item-section>

            <q-item-section style="text-align:left">
                <b>{{ hostname }}</b>
            </q-item-section>
            
            <q-item-section v-if='editable' style="align-items: end;">
                <q-btn round flat @click="deleteHostDialog" class="hover:bg-color-red">
                    <q-icon name="delete" color="grey-5" />
                    <q-tooltip anchor="top middle" self="bottom middle">Delete service {{hostname}}.</q-tooltip>
                </q-btn>
            </q-item-section>

        </template>
        
        <q-card>
            <q-card-section>
            <q-list dense bordered class="rounded-borders bg-grey-2">
                <q-item v-for='msg of messages.filter(x=>show_old_msgs || x.active)' 
                        style="border-bottom:1px solid #ccc" >
                    <q-item-section avatar>
                        <q-icon :color="msg.critical?'red-9' : 'grey-5'" name="warning" />
                    </q-item-section>

                    <q-item-section>
                        <!--<q-item-label>{{msg.starts_at}}</q-item-label>-->
                        <q-item-label>{{ format_date(msg.starts_at) }}</q-item-label>
                        <q-item-label caption>{{ msg.message }}</q-item-label>
                    </q-item-section>
                </q-item>
                
                <q-item v-if='messages.filter(x=>show_old_msgs || x.active).length < 1'>
                <q-item-section>
                    <q-item-label>No Messages</q-item-label>
                </q-item-section>
                </q-item>

            </q-list>
            </q-card-section>
        </q-card>
    </q-expansion-item>

    <DeleteDataHubDialog v-model="deleteDialog" :host="hostname" />
</template>