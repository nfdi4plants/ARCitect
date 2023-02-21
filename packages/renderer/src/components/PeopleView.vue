<script lang="ts" setup>

import PersonDialog from './PersonDialog.vue';
import ArcCommanderService from '../ArcCommanderService.ts';
import { useQuasar } from 'quasar'
const $q = useQuasar();

export interface Props {
  people: Object[],
  group: String
};
const props = withDefaults(defineProps<Props>(), {
  people: ()=>[],
  group: ''
});

const addPerson = async person => {
  const args = [`i`,`person`,'register'];
  for(const p in person){
    const v = person[p].v;
    if(!v)
      continue;
    args.push(`--${p.toLowerCase().split('_').join('')}`);
    args.push(v);
  }

  await ArcCommanderService.run({
      args: args,
      title: 'Registering Person',
      silent: true
    },
    true
  );
};

const removePerson = async (person,updateArcProperties) => {
  await ArcCommanderService.run({
      args: ['i','person','unregister','-f',person.firstName,'-l',person.lastName],
      title: 'Unregistering Person',
      silent: true
    },
    updateArcProperties
  );
};

const showPersonDialog = async person_o => {
  $q.dialog({
    component: PersonDialog,
    componentProps: person_o ? {person: person_o} : {}
  }).onOk( async person_n => {
    if(person_o)
      await removePerson(person_o,false);
    await addPerson(person_n);
  });
}

</script>

<template>
  <q-expansion-item
    expand-separator
    icon="groups"
    label="People"
    caption="Authors and Collaborators"
    header-class="bg-grey-33"
    :group='props.group'
  >
    <q-card>
      <q-card-section>
        <q-list>
          <q-item clickable v-ripple v-for='(item,i) in props.people'>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{item.lastName[0].toUpperCase()}}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{item.firstName}} {{item.lastName}}</q-item-label>
              <q-item-label caption>{{item.comments && item.comments.length>0 && item.comments[0].hasOwnProperty('value') ? 'ORCID: '+item.comments[0].value : 'Missing ORCID'}}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class='row'>
                <div class='col' style="padding:0 0.3em 0 0">
                  <q-btn label="" icon='edit' color="secondary" :disabled='ArcCommanderService.props.busy' v-on:click='showPersonDialog(item)'/>
                </div>
                <div class='col'>
                  <q-btn label="" icon='person_remove' color="secondary" :disabled='ArcCommanderService.props.busy' v-on:click='removePerson(item,true)'/>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align='right' style="padding:0 2.2em 1em 0;">
        <q-btn label="Add Person" icon='person_add_alt_1' color="secondary" :disabled='ArcCommanderService.props.busy' v-on:click='showPersonDialog()'/>
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>

<style>
.myP {
  padding: 0 1em;
}

</style>
