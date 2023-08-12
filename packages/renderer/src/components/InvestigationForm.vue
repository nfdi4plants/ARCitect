<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';

import ArcControlService from '../ArcControlService.ts';

export interface Props {
  group: String
};
const props = defineProps<Props>();

const iProps = reactive({
  form: [[]]
});

const init = async ()=>{
  const arc = ArcControlService.props.arc;

  iProps.form = [
    [
      Property( arc.ISA, 'Identifier', {readonly:true} ),
      Property( arc.ISA, 'Title' ),
    ],
    [
      Property( arc.ISA, 'Description', {hint:'A textual description of the investigation'} ),
    ],
    [
      Property(arc.ISA, 'SubmissionDate',{hint:'The date the investigation was was released publicly'}),
      Property(arc.ISA, 'PublicReleaseDate',{hint:'The date the investigation was was released publicly'}),
    ]
  ];
};
onMounted( init );

const onReset = async ()=>{
  await ArcControlService.readARC();
  init();
};

const onSubmit = async ()=>{
  await ArcControlService.writeARC(ArcControlService.props.arc_root,['ISA_Investigation']);
  await ArcControlService.readARC();
  init();
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
