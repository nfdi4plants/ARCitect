<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import AppProperties from '../AppProperties.ts';

import {reactive} from 'vue';

const iProps = reactive({
  show_old_msgs: false
});

const format_date = utc => {
  const format = x => ('00' + x).slice(-2);
  const d = new Date(Date.parse(utc));
  return `${format(d.getDate())}.${format(d.getMonth()+1)}.${d.getFullYear()} - ${format(d.getHours())}:${format(d.getMinutes())}`;
};

</script>

<template>
  <q-list>
    <ViewItem
      icon="dns"
      label="Services"
      caption="Status of nfdi4plants Services"
    >
      <q-banner>
        <q-toggle
          v-model="iProps.show_old_msgs"
          label="Show old Messages"
          color='secondary'
        />
      </q-banner>

      <q-list>
        <div v-for='host in AppProperties.datahub_hosts_by_provider.dataplant'>
          <q-expansion-item
            dense
            :label="host"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar v-if='AppProperties.datahub_hosts_msgs[host].critical' icon="warning" :text-color="AppProperties.datahub_hosts_msgs[host].critical?'red-9' : 'grey-5'" />
                <q-avatar v-else icon="check_circle" text-color="secondary" />
              </q-item-section>
              <q-item-section style="text-align:left">
                <b>{{host}}</b>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <q-list dense bordered class="rounded-borders bg-grey-2">
                  <q-item
                    v-for='msg of AppProperties.datahub_hosts_msgs[host].filter(x=>iProps.show_old_msgs || x.active)' style="border-bottom:1px solid #ccc"
                  >
                    <q-item-section avatar>
                      <q-icon :color="msg.critical?'red-9' : 'grey-5'" name="warning" />
                    </q-item-section>

                    <q-item-section>
                      <!--<q-item-label>{{msg.starts_at}}</q-item-label>-->
                      <q-item-label>{{format_date(msg.starts_at)}}</q-item-label>
                      <q-item-label caption>{{msg.message}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if='AppProperties.datahub_hosts_msgs[host].filter(x=>iProps.show_old_msgs || x.active).length<1'
                  >
                    <q-item-section>
                      <q-item-label>No Messages</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator />
        </div>
      </q-list>
      
    </ViewItem>

    <ViewItem
      icon="dns"
      label="Additional Services"
      caption="Status of additional Services"
    >
  </ViewItem>

  <q-list>
      <div v-for='host in AppProperties.datahub_hosts_by_provider.additional'>
        <q-expansion-item
          dense
          :label="host"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar v-if='AppProperties.datahub_hosts_msgs[host].critical' icon="warning" :text-color="AppProperties.datahub_hosts_msgs[host].critical?'red-9' : 'grey-5'" />
              <q-avatar v-else icon="check_circle" text-color="secondary" />
            </q-item-section>
            <q-item-section style="text-align:left">
              <b>{{host}}</b>
            </q-item-section>
          </template>
          <q-card>
            <q-card-section>
              <q-list dense bordered class="rounded-borders bg-grey-2">
                <q-item
                  v-for='msg of AppProperties.datahub_hosts_msgs[host].filter(x=>iProps.show_old_msgs || x.active)' style="border-bottom:1px solid #ccc"
                >
                  <q-item-section avatar>
                    <q-icon :color="msg.critical?'red-9' : 'grey-5'" name="warning" />
                  </q-item-section>

                  <q-item-section>
                    <!--<q-item-label>{{msg.starts_at}}</q-item-label>-->
                    <q-item-label>{{format_date(msg.starts_at)}}</q-item-label>
                    <q-item-label caption>{{msg.message}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  v-if='AppProperties.datahub_hosts_msgs[host].filter(x=>iProps.show_old_msgs || x.active).length<1'
                >
                  <q-item-section>
                    <q-item-label>No Messages</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator />
      </div>
    </q-list>
  </q-list>

</template>

