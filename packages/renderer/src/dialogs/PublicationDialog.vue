<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';
import FormInput from '../components/FormInput.vue';
import Publication from '../interfaces/Publication.ts';

const item = new Publication();
const props = defineProps<{config?:Object}>();
const iProps = reactive({
  valid: true,
  mode: 'Add'
});

const form = [
  [item.model.doi, item.model.pubMedID],
  [item.model.title],
  [item.model.authorList],
  [item.model.status],
];

// const layout = [
//   [FormElement(item,'doi'),FormElement(item,'pubMedID')],
//   [FormElement(item,'title')],
//   [FormElement(item,'authorList')],
//   [FormElement(item,'status',{type:'select',options:['Published', 'Submitted', 'In Preparation']})],
// ];

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  iProps.valid = item.model.doi.value || item.model.pubMedID.value || item.model.title.value;
  if(!iProps.valid)
    return;

  onDialogOK(item);
};

onMounted(async ()=>{
  iProps.valid = true;
  iProps.mode = props.config ? 'Edit' : 'Add';
  item.init(props.config || {});
});

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:35em;">
        <q-card-section>
          <div class="text-h6">{{iProps.mode}} Publication</div>
        </q-card-section>

        <q-card-section>
          <div class='row' v-for="(row,i) in form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property="property"></FormInput>
            </div>
          </div>
          <div style="min-height:3.5em;margin:1em 1em -1em 1em;">
            <q-banner rounded inline-actions class="bg-red-10 text-white" v-if='!iProps.valid' dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <b>DOI, PubMed ID, or Title Required.</b>
            </q-banner>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="teal" icon='bookmark_add' :label="`${iProps.mode==='Edit'?'Update':'Add'} Publication`" type='submit' class='text-weight-bold' />
          <!--<q-btn color="teal" icon='find_replace' label="Find" @click="autoComplete" class='text-weight-bold' />-->
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


