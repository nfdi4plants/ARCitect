<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useDialogPluginComponent } from 'quasar';

import a_input from '../components/a_input.vue';
import a_select from '../components/a_select.vue';
import ArcControlService from '../ArcControlService.ts';

export interface Props {
  remotes: [String],
  user?: Object
};
const props = defineProps<Props>();

const iProps = reactive({
  mode: 'DataHub',
  name: '',
  account: '',
  accounts: {},
  url: '',
  error: ''
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const setDataHubURL = ()=>{
  iProps.url = `https://${props.user.host}/${iProps.accounts[iProps.account]}/${ArcControlService.props.arc_root.split('/').pop().split(' ').join('_')}.git`;
};

const getAccounts = async (val, update, abort) => {
  if(!props.user)
    return update();

  const groups = await window.ipc.invoke('DataHubService.getGroups', [props.user.host,props.user.token.access_token]);

  update(()=>{
    for(let group of groups)
      iProps.accounts[group.full_name] = group.full_path;
  });
};

const init = async ()=>{
  if(props.remotes.indexOf('origin')<0)
    iProps.name = 'origin';
  else if (props.user && props.user.host && props.remotes.indexOf(props.user.host)<0)
    iProps.name = props.user.host;
  else
    iProps.name = '';

  if(props.user && props.user.host){
    iProps.accounts[props.user.username] = props.user.username;
    iProps.account = props.user.username;
    setDataHubURL();
  } else {
    iProps.account = 'Login to use DataHub Account'
  }
};

onMounted(init);

const validName = val=>props.remotes.indexOf(val)<0;

const onSubmit = async () => {
  if (!iProps.name)
    return iProps.error = 'Remote requires name';
  else if (!validName(iProps.name))
    return iProps.error = 'Remote name already exsists';
  else if (!iProps.url)
    return iProps.error = 'Remote requires URL';

  onDialogOK(iProps);
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" persistent>
      <q-card class="q-dialog-plugin" style="min-width:40em;">
        <q-card-section>
          <div class="text-h6">Add Remote</div>
        </q-card-section>

        <q-card-section>
          <div class='row'>
            <div class='col'>
              <a_input
                v-model='iProps.name'
                label="Remote Name"
              />
            </div>
            <div class='col'>
              <a_select v-model='iProps.account' :options='Object.keys(iProps.accounts)' label="DataHub Account" :readonly='!props.user' @filter="getAccounts" @update:model-value='setDataHubURL()'/>
            </div>
          </div>
          <div class='row'>
            <div class='col'>
              <a_input v-model='iProps.url' label="URL"/>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn v-if='iProps.error' color="red-10" icon='warning' :label="iProps.error" no-caps style="margin-right:auto"/>
          <q-btn color="secondary" icon='add_circle' label="Add Remote" type='submit' class='text-weight-bold'/>
          <q-btn color="secondary" label="Cancel" @click='onDialogCancel' class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>
