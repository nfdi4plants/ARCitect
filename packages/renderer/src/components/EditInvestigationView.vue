<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import PeopleView from './PeopleView.vue';
import PublicationsView from './PublicationsView.vue';

import appProperties from '../AppProperties.ts';
import arcProperties from '../ArcProperties.ts';
import ArcCommanderService from '../ArcCommanderService.ts';
import { date } from 'quasar'

const props = reactive({
  refreshing: false,
  error: false
});

const showError = ()=>{
  props.refreshing = false;
  props.error=true;
  return 0;
}

const onReset = async ()=>{
  await ArcCommanderService.getArcProperties();
};

const onSubmit = async ()=>{
  await ArcCommanderService.run({
      args: [
        'i','update',
        '--identifier',arcProperties.identifier,
        '--title',arcProperties.title,
        '--description',arcProperties.description,
        '--submissiondate',arcProperties.submissionDate,
        '--publicreleasedate',arcProperties.publicReleaseDate
      ],
      title: 'Updating Investigation Data',
      silent: true
    },
    true
  );
};

const checkDate = val => {
  return val==='' ? true : date.isValid(val) || 'Invalid date.';
};

</script>

<template>

  <q-list>
      <q-expansion-item
        expand-separator
        icon="biotech"
        label="Investigation"
        caption="General Meta Data of the Investigation"
        group="igroup"
        default-opened
      >
        <q-card>
          <q-form
            @submit="onSubmit"
            @reset="onReset"
          >
            <q-card-section>
              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="arcProperties.identifier"
                    label="Identifier"
                    hint="Locally Unique ARC Name"
                    readonly
                    bg-color='grey-5'
                  />
                </div>

                <div class="col myP">
                  <q-input
                    filled
                    v-model="arcProperties.title"
                    label="Title"
                    hint="A concise name given to the investigation"
                    :readonly='ArcCommanderService.props.busy'
                    @update='update(value)'
                  />
                </div>
              </div>

              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="arcProperties.description"
                    label="Description"
                    hint="A textual description of the investigation"
                    type='textarea'
                    :readonly='ArcCommanderService.props.busy'
                  />
                </div>
              </div>

              <div class="row">
                <div class="col myP">
                  <q-input
                    filled
                    v-model="arcProperties.submissionDate"
                    mask="##/##/####"
                    :rules="[checkDate]"
                    label='Submission Date'
                    hint="The date the investigation was reported to the repository"
                    :readonly='ArcCommanderService.props.busy'
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="sdRef">
                          <q-date v-model="arcProperties.submissionDate" @update:model-value="$refs.sdRef.hide()"  mask="MM/DD/YYYY"></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col myP">
                  <q-input
                    filled
                    v-model="arcProperties.publicReleaseDate"
                    mask="##/##/####"
                    :rules="[checkDate]"
                    label='Public Release Date'
                    hint="The date the investigation was was released publicly"
                    :readonly='ArcCommanderService.props.busy'
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="pdRef">
                          <q-date v-model="arcProperties.publicReleaseDate" @update:model-value="$refs.pdRef.hide()"  mask="MM/DD/YYYY"></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align='right' style="padding:2.2em;">
              <q-btn label="Submit" type="submit" icon='check_circle' color="teal" :disabled='ArcCommanderService.props.busy'/>
              <q-btn label="Reset" type="reset" icon='change_circle' color="teal" class="q-ml-sm" :disabled='ArcCommanderService.props.busy'/>
            </q-card-actions>

          </q-form>
        </q-card>
      </q-expansion-item>

      <q-separator />

      <PeopleView :people='arcProperties.people' group="igroup"></PeopleView>

      <q-separator />

      <PublicationsView :publications='arcProperties.publications' group="igroup"></PublicationsView>

    </q-list>
</template>

<style>
.myP {
  padding: 0 1em;
}

</style>
