<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';
import FormInput from '../components/FormInput.vue';
import ArcCommanderService from '../ArcCommanderService.ts';
import Investigation from '../interfaces/Investigation.ts';

export interface Props {
  group: String
};
const props = defineProps<Props>();

const investigation = new Investigation();
const form = [
  [
    investigation.model.identifier,
    investigation.model.title
  ],
  [investigation.model.description],
  [
    investigation.model.submissionDate,
    investigation.model.publicReleaseDate
  ],
];

const init = async config=>{
  investigation.init(config);
};
defineExpose({init});

const onReset = async ()=>{
  await ArcCommanderService.getArcProperties();
};

const onSubmit = async ()=>{
  const args = ['s','update'];
  for(const p in investigation.model){
    args.push(`--${p.toLowerCase()}`);
    args.push(investigation.model[p].value);
  }

  await ArcCommanderService.run({
      args: args,
      title: 'Updating Investigation Data',
      silent: true
    },
    true
  );
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
