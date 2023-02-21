<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';
import appProperties from '../AppProperties.ts';

export interface Props {
  publication?: Object
};

const props = withDefaults(defineProps<Props>(), {
  publication: {}
});

const componentProperties = reactive({
  valid: true,
  mode: 'Add'
});

const publicationProperties = reactive({
  doi: {v:'',t:'s',l:0, d:'DOI'},
  pubMedID: {v:'',t:'s',l:0, d:'PubMed ID'},
  title: {v:'',t:'a',l:1},
  authorList: {v:'',t:'a',l:2, d:'Author List'
  },
  status: {v:'Published',t:'o',l:3,
    o_a:['Published', 'Submitted', 'In Preparation'].reduce(
      (acc, opt) => {
        for (let i = 1; i <= 5; i++)
          acc.push(opt + ' ' + i);
        return acc
      },
      []
    ),
    o_f: ['Published', 'Submitted', 'In Preparation']
  }
});

const filterStatus = (val, update, abort) => {
  update(() => {
    const needle = val.toLocaleLowerCase();
    publicationProperties.status.o_f.value = publicationProperties.status.o_a.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1);
  });
};

const setStatus = val => {
  publicationProperties.status.v = val;
};

const layout = [];
{
  let maxL = -1;
  for(let p of Object.keys(publicationProperties))
    if(maxL<publicationProperties[p].l)
      maxL=publicationProperties[p].l;
  for(let i=0; i<=maxL; i++)
    layout.push([]);
}

for(const p in publicationProperties)
  layout[publicationProperties[p].l].push(p);

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  componentProperties.valid = publicationProperties.doi.v || publicationProperties.pubMedID.v || publicationProperties.title.v;
  if(!componentProperties.valid)
    return;

  onDialogOK(publicationProperties);
};

onMounted(async ()=>{
  componentProperties.valid = true;
  componentProperties.mode = 'Add';

  const initialProperties = Object.keys(props.publication);

  if(initialProperties.length){
    componentProperties.mode = 'Edit';
    for(const k of initialProperties){
      if(k==='status'){
        publicationProperties[k].v = props.publication[k].annotationValue;
      } else {
        publicationProperties[k].v = props.publication[k];
      }
    }
  }
});

const autoComplete = async ()=>{

};

const getLabel = property => {
  return publicationProperties[property].d ? publicationProperties[property].d : property[0].toUpperCase()+property.slice(1);
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:35em;">
        <q-card-section>
          <div class="text-h6">Add Publication</div>
        </q-card-section>

        <q-card-section>
          <div class='row' v-for="(row,i) in layout">
            <div class='col' v-for="(item,j) in row">

              <q-input
                v-if='publicationProperties[item].t!=="o"'

                class='myP'
                filled
                v-model="publicationProperties[item].v"
                :type="publicationProperties[item].t==='a' ? 'textarea' : 'text'"
                :label="getLabel(item)"
                hide-buttom-space
              />

              <q-select
                v-else

                class='myP'
                filled
                v-model="publicationProperties[item].v"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="publicationProperties[item].o_f"
                @filter="filterStatus"
                @input-value="setStatus"
                :label="getLabel(item)"
                hide-buttom-space
              >
              </q-select>

            </div>
          </div>
          <div style="min-height:3.5em;margin:1em 1em -1em 1em;">
            <q-banner rounded inline-actions class="bg-red-10 text-white" v-if='!componentProperties.valid' dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <b>DOI, PubMed ID, or Title Required.</b>
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="teal" icon='bookmark_add' :label="`${componentProperties.mode} Publication`" type='submit' class='text-weight-bold' />
          <q-btn color="teal" icon='find_replace' label="Find" @click="autoComplete" class='text-weight-bold' />
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
