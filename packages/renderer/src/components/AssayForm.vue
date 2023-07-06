<script lang="ts" setup>

import { onMounted, ref, reactive } from 'vue';

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import ArcCommanderService from '../ArcCommanderService.ts';
import Assay from '../interfaces/Assay.ts';

export interface Props {
  group: String
};
const props = defineProps<Props>();
const iProps = reactive({
  error: ''
});

const assay = new Assay();
const form = [
  [
    assay.model.assayIdentifier,
    assay.model.studies
  ],
  [assay.model.measurementtype],
  [assay.model.technologytype],
  [assay.model.technologyplatform]
];

const init = async config=>{
  assay.init(config);
};
defineExpose({init});

const onReset = async ()=>{
  await ArcCommanderService.getArcProperties();
};

const onSubmit = async ()=>{
  const assayIdentifier = Assay.getIdentifier(assay);
  const old_assay = Assay.getAssay(assayIdentifier);
  const old_studies = Assay.getStudies(old_assay).sort();
  const new_studies = assay.model.studies.value.sort();

  if(new_studies.length<1){
    iProps.error = 'An assay must belong to at least one study';
    return;
  } else {
    iProps.error = '';
  }

  const updateStudies = old_studies.length !== new_studies.length || !old_studies.every((val, index) => val === new_studies[index]);
  if(updateStudies){
    const commands = [];
    for(let s of new_studies){
      if(!old_studies.includes(s))
        commands.push({
            args: ['a','register','--studyidentifier',s,'--assayidentifier',assayIdentifier],
            title: 'Registering Assay',
            silent: false
        });
    }
    for(let s of old_studies){
      if(!new_studies.includes(s))
        commands.push({
            args: ['a','unregister','--studyidentifier',s,'--assayidentifier',assayIdentifier],
            title: 'Unregistering Assay',
            silent: false
        });
    }

    await ArcCommanderService.run(
      commands,
      true
    );
  }

  {
    const args = ['a','update','--studyidentifier',new_studies[0],'--assayidentifier',assayIdentifier];
    args.push('--measurementtype')
    args.push( assay.model.measurementtype.value)
    args.push('--technologytype')
    args.push( assay.model.technologytype.value)
    args.push('--technologyplatform')
    args.push( assay.model.technologyplatform.value)

    await ArcCommanderService.run(
      {
          args: args,
          title: 'Updating Assay',
          silent: false
      },
      true
    );
  }
};

</script>

<template>

  <ViewItem
    icon="biotech"
    label="Assay"
    caption="General Meta Data of the Assay"
    :group="props.group"
  >
    <q-card flat>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-card-section>
          <div class='row' v-for="(row,i) in form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property='property'></FormInput>
            </div>
          </div>

          <div style="margin:1em 1em -2em 1em;" v-if='iProps.error'>
            <q-banner rounded inline-actions class="bg-red-10 text-white" dense>
              <template v-slot:avatar>
                <q-icon name="warning"/>
              </template>
              <b>{{iProps.error}}.</b>
            </q-banner>
          </div>
        </q-card-section>


        <q-card-actions align='right' style="padding:2.1em;">
          <q-btn label="Update" type="submit" icon='check_circle' color="secondary" :disabled='ArcCommanderService.props.busy'/>
          <q-btn label="Reset" type="reset" icon='change_circle' color="secondary" class="q-ml-sm" :disabled='ArcCommanderService.props.busy'/>
        </q-card-actions>
      </q-form>
    </q-card>
  </ViewItem>
</template>
