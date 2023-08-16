<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';

import ArcControlService from '../ArcControlService.ts';

export interface Props {
  group: String,
  investigation: Object
};
const props = defineProps<Props>();

const iProps = reactive({
  form: [[]]
});

const init = async ()=>{
  iProps.form = [
    [
      Property( props.investigation, 'Identifier', {readonly:true} ),
      Property( props.investigation, 'Title' ),
    ],
    [
      Property( props.investigation, 'Description', {hint:'A textual description of the investigation'} ),
    ],
    [
      Property( props.investigation, 'SubmissionDate',{hint:'The date the investigation was was released publicly'}),
      Property( props.investigation, 'PublicReleaseDate',{hint:'The date the investigation was was released publicly'}),
    ]
  ];
};
onMounted( init );
watch( ()=>props.investigation, init );

const onReset = async ()=>{
  await ArcControlService.readARC();
};

const onSubmit = async ()=>{
  await ArcControlService.writeARC(ArcControlService.props.arc_root,['ISA_Investigation']);
  await ArcControlService.readARC();
};

</script>

<template>

  <ViewItem
    icon="biotech"
    label="Investigation"
    caption="General Meta Data of the Investigation"
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
          <q-btn label="Update" type="submit" icon='check_circle' color="secondary"/>
          <q-btn label="Reset" type="reset" icon='change_circle' color="secondary" class="q-ml-sm"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </ViewItem>
</template>
