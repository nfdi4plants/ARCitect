<script lang="ts" setup>

import { reactive } from 'vue'
import PublicationDialog from './PublicationDialog.vue';
import ArcCommanderService from '../ArcCommanderService.ts';
import { useQuasar } from 'quasar'
const $q = useQuasar();

export interface Props {
  publications: Object[]
};
const props = withDefaults(defineProps<Props>(), {
  publications: ()=>[]
});

const addItem = async publication => {
  const args = [`i`,`publication`,'register'];
  for(const p in publication){
    const v = publication[p].v;
    if(!v)
      continue;
    args.push(`--${p.toLowerCase()}`);
    args.push(v);
  }

  await ArcCommanderService.run({
      args: args,
      title: 'Registering Publication',
      silent: true
    },
    true
  );
};

const removeItem = async (publication,updateArcProperties) => {
  await ArcCommanderService.run({
      args: ['i','publication','unregister','--doi',publication.doi],
      title: 'Unregistering Publication',
      silent: true
    },
    updateArcProperties
  );
};

const showDialog = async item_o => {
  $q.dialog({
    component: PublicationDialog,
    componentProps: item_o ? {publication: item_o} : {}
  }).onOk( async item_n => {
    if(item_o)
      await removeItem(item_o,false);
    await addItem(item_n);
  });
}

</script>

<template>
  <q-expansion-item
    expand-separator
    icon="menu_book"
    label="Publications"
    caption="Papers, Books and Other Media"
    header-class="bg-grey-33"
  >
    <q-card>
      <q-card-section>
        <q-list>
          <q-item clickable v-ripple v-for='(item,i) in props.publications'>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{item.title ? item.title[0].toUpperCase() : ''}}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{item.title}}</q-item-label>
              <q-item-label caption>{{item.doi ? 'DOI: '+item.doi : item.pubMedID ? 'PubMed ID: '+item.pubMedID : 'Missing DOI and PubMed ID'}}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class='row'>
                <div class='col' style="padding:0 0.3em 0 0">
                  <q-btn label="" icon='edit' color="secondary" :disabled='ArcCommanderService.props.busy' v-on:click='showDialog(item)'/>
                </div>
                <div class='col'>
                  <q-btn label="" icon='bookmark_remove' color="secondary" :disabled='ArcCommanderService.props.busy' v-on:click='removeItem(item,true)'/>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align='right' style="padding:0 2.2em 1em 0;">
        <q-btn label="Add Publication" icon='bookmark_add' color="secondary" :disabled='ArcCommanderService.props.busy' v-on:click='showDialog()'/>
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<style>
.myP {
  padding: 0 1em;
}

</style>
