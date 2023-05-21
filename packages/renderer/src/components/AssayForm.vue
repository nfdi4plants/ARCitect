<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import ArcCommanderService from '../ArcCommanderService.ts';
import Assay from '../interfaces/Assay.ts';

export interface Props {
  group: String
};
const props = defineProps<Props>();

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
  console.log(old_studies);
  console.log(new_studies);

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

  // const args = ['a','update'];

  // for(const p in investigation.model){
  //   args.push(`--${p.toLowerCase()}`);
  //   args.push(investigation.model[p].value);
  // }

  // await ArcCommanderService.run({
  //     args: args,
  //     title: 'Updating Investigation Data',
  //     silent: true
  //   },
  //   true
  // );
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
        </q-card-section>

        <q-card-actions align='right' style="padding:2.1em;">
          <q-btn label="Update" type="submit" icon='check_circle' color="secondary" :disabled='ArcCommanderService.props.busy'/>
          <q-btn label="Reset" type="reset" icon='change_circle' color="secondary" class="q-ml-sm" :disabled='ArcCommanderService.props.busy'/>
        </q-card-actions>
      </q-form>
    </q-card>
  </ViewItem>
</template>
