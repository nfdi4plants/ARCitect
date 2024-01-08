<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';

import ArcControlService from '../ArcControlService.ts';

import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

export interface Props {
  group: String,
  study: Object
};
const props = defineProps<Props>();

const iProps = reactive({
  form: [[]]
});

const init = async ()=>{
  if(!props.study.Identifier)
    return;

  iProps.form = [
    [
      Property( props.study, 'Identifier', {readonly:true} ),
      Property( props.study, 'Title' ),
    ],
    [
      Property( props.study, 'Description', {hint:'A textual description of the study'} ),
    ],
    [
      Property( props.study, 'SubmissionDate',{hint:'The date the study was released publicly'} ),
      Property( props.study, 'PublicReleaseDate',{hint:'The date the study was released publicly'} ),
    ]
  ];
};
onMounted( init );
watch( ()=>props.study, init );

const onReset = async ()=>{
  await ArcControlService.readARC();
};

const onSubmit = async ()=>{
  await ArcControlService.writeARC(ArcControlService.props.arc_root,['ISA_Investigation','ISA_Study']);
  await ArcControlService.readARC();
};

const deleteStudy = async ()=>{
  $q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      msg: `Are you sure you want to delete study <b>'${props.study.Identifier}'</b>?`,
      ok_text: 'Delete',
      ok_icon: 'delete',
      ok_color: 'red-9',
      cancel_text: 'Cancel',
      cancel_icon: 'cancel',
      cancel_color: 'secondary'
    }
  }).onOk( async () => {
    ArcControlService.deleteStudy(props.study.Identifier);
  });
};

</script>

<template>
  <ViewItem
    icon="biotech"
    label="Study"
    caption="General Meta Data of the Study"
    :group="props.group"
  >
    <q-card flat>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-card-section>
          <div class='row' v-for="(row,i) in iProps.form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property='property'></FormInput>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align='right' style="padding:2.1em;">
          <q-btn label="Delete" icon='delete' color="red-9" @click='deleteStudy'/>
          <q-btn label="Update" type="submit" icon='check_circle' color="secondary"/>
          <q-btn label="Reset" type="reset" icon='change_circle' color="secondary" class="q-ml-sm"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </ViewItem>
</template>
