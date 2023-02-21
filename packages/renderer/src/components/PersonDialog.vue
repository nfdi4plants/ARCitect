<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';
import appProperties from '../AppProperties.ts';

export interface Props {
  person?: Object
};

const props = withDefaults(defineProps<Props>(), {
  person: {}
});

const componentProperties = reactive({
  valid: true,
  mode: 'Add'
});

const personProperties = reactive({
  ORCID: {v:'',t:'s',l:0},
  firstName: {v:'',t:'s',l:1, d:'First Name'},
  lastName: {v:'',t:'s',l:1, d:'Last Name'},
  email: {v:'',t:'e',l:2},
  phone: {v:'',t:'t',l:3},
  fax: {v:'',t:'t',l:3},
  address: {v:'',t:'s',l:4},
  affiliation: {v:'',t:'s',l:5},
});

const layout = [[],[],[],[],[],[]];
for(const p in personProperties)
  layout[personProperties[p].l].push(p);

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  componentProperties.valid = personProperties.firstName.v&&personProperties.lastName.v;
  if(!componentProperties.valid)
    return;

  onDialogOK(personProperties);
};

onMounted(async ()=>{
  componentProperties.valid = true;
  componentProperties.mode = 'Add';

  const initialProperties = Object.keys(props.person);

  if(initialProperties.length){
    componentProperties.mode = 'Edit';
    for(const k of initialProperties){
      if(!personProperties.hasOwnProperty(k)){
        console.log(k);
        continue;
      }
      if(k==='comments')
        continue;
      personProperties[k].v = props.person[k];
    }
    if(props.person.comments && props.person.comments[0] && props.person.comments[0].name.includes('ORCID') && props.person.comments[0].value){
      personProperties.ORCID.v = props.person.comments[0].value;
    }
  }
});

const getLabel = property => {
  return personProperties[property].d ? personProperties[property].d : property[0].toUpperCase()+property.slice(1);
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:35em;">
        <q-card-section>
          <div class="text-h6">Add Person</div>
        </q-card-section>

        <q-card-section>
          <div class='row' v-for="(row,i) in layout">
            <div class='col' v-for="(item,j) in row">
              <q-input
                class='myP'
                filled
                v-model="personProperties[item].v"
                :type="personProperties[item].t === 's' ? 'text' : personProperties[item].t === 'e' ? 'email' : 'tel'"
                :label="getLabel(item)"
                hide-buttom-space
              />
            </div>
          </div>
          <div style="min-height:3.5em;margin:1em 1em -1em 1em;">
            <q-banner rounded inline-actions class="bg-red-10 text-white" v-if='!componentProperties.valid' dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <b>Full Name Required.</b>
            </q-banner>
            <!--<q-banner rounded inline-actions class="bg-grey-3" v-if='!componentProperties.valid' dense>-->
            <!--  <template v-slot:avatar>-->
            <!--    <q-icon name="warning" color="primary" />-->
            <!--  </template>-->
            <!--  Full Name Required.-->
            <!--</q-banner>-->
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="teal" icon='person_add_alt_1' :label="`${componentProperties.mode} Person`" type='submit' class='text-weight-bold' />
          <q-btn color="teal" label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>

      </q-card>

    </q-dialog>
  </q-form>
</template>

<style>
.myP {
  margin: 0.5em 0;
}
</style>
