<script lang="ts" setup>
import ViewItem from '../../components/ViewItem.vue';
import AppProperties from '../../AppProperties.ts';

import {reactive, ref} from 'vue';
import HostList from './HostList.vue';

const iProps = reactive({
  show_old_msgs: false
});


</script>

<template>
  <q-list>
    
    <ViewItem
      icon="dns"
      label="Services"
      caption="Status of nfdi4plants and addional Services"
    >
      <template v-slot:left>
        <q-toggle v-model="iProps.show_old_msgs" label="Show old Messages" color='secondary'/>
      </template>

      <HostList service_name="nfdi4plants"
              :hosts="AppProperties.datahub_hosts_by_provider.dataplant" 
              :hostmessages="AppProperties.datahub_hosts_msgs"
              :show_old_msgs="iProps.show_old_msgs"/>

      <HostList service_name="additional" 
              :hosts="AppProperties.datahub_hosts_by_provider.additional" 
              :hostmessages="AppProperties.datahub_hosts_msgs"
              :show_old_msgs="iProps.show_old_msgs"
              editable/>
  
    </ViewItem>
  </q-list>
</template>

