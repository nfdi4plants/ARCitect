<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import AppProperties from '../AppProperties.ts';

</script>

<template>
  <q-list>
    <ViewItem
      icon="dns"
      label="Services"
      caption="Status of nfdi4plants Services"
      :fullWidth="true"
    >
      <q-list>
        <div v-for='host in AppProperties.datahub_hosts'>
          <q-expansion-item
            dense
            :label="host"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar v-if='AppProperties.datahub_hosts_msgs[host].level<2' icon="warning" :text-color="AppProperties.datahub_hosts_msgs[host].level==1?'red-9' : 'grey-5'" />
                <q-avatar v-else icon="check_circle" text-color="secondary" />
              </q-item-section>

              <q-item-section style="text-align:left">
                <b>{{host}}</b>
              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                <q-list dense bordered class="rounded-borders bg-grey-2">

                  <q-item v-for='msg of AppProperties.datahub_hosts_msgs[host]'  style="border-bottom:1px solid #ccc">
                    <q-item-section avatar>
                      <q-icon :color="msg.level===1?'red-9' : 'grey-5'" name="warning" />
                    </q-item-section>

                    <q-item-section style="text-align:left;">{{msg.message}}</q-item-section>
                  </q-item>

                  <q-item v-if='AppProperties.datahub_hosts_msgs[host].level===2' style="border-bottom:1px solid #ccc">
                    <q-item-section avatar>
                      <q-icon color="grey-5" name="check_circle" />
                    </q-item-section>

                    <q-item-section style="text-align:left;">No Messages</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
        </div>

      </q-list>
    </ViewItem>
  </q-list>

</template>

