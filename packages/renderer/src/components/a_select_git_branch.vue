<script lang="ts" setup>
import { reactive, onMounted } from 'vue';

import GitDialog from '../dialogs/GitDialog.vue';
import StringDialog from '../dialogs/StringDialog.vue';
import a_btn from '../components/a_btn.vue';
import a_select from '../components/a_select.vue';

import ArcControlService from '../ArcControlService.ts';

import { useQuasar } from 'quasar'
const $q = useQuasar();

const iProps = reactive({
  branches: [],
  branch: null
});

const switchBranch = async ()=>{
  const dialogProps = reactive({
    title: 'Switching Branch',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk( init );

  const response = await window.ipc.invoke('GitService.run', {
    args: [`checkout`, iProps.branch],
    cwd: ArcControlService.props.arc_root
  });

  dialogProps.state = response[0] ? 1 : 2;
};

const addBranch = async ()=>{
  $q.dialog({
    component: StringDialog,
    componentProps: {
      title: 'Add Branch',
      property: 'Branch Name',
      icon: 'img:../../assets/arrow_split.svg',
      verify: async name => iProps.branches.indexOf(name)<0 ? '' : 'branch exists'
    }
  }).onOk( async name => {
    const dialogProps = reactive({
      title: 'Creating New Branch',
      ok_title: 'Ok',
      cancel_title: null,
      state: 0,
    });

    $q.dialog({
      component: GitDialog,
      componentProps: dialogProps
    }).onOk( init );

    const response = await window.ipc.invoke('GitService.run', {
      args: [`checkout`, `-b`, name],
      cwd: ArcControlService.props.arc_root
    });

    dialogProps.state = response[0] ? 1 : 2;
  });
};

const deleteBranch = async name => {
  const dialogProps = reactive({
    title: 'Deleting Branch',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps
  }).onOk( init );

  const response = await window.ipc.invoke('GitService.run', {
    args: [`branch`, `--delete`, name],
    cwd: ArcControlService.props.arc_root
  });

  dialogProps.state = response[0] ? 1 : 2;
};

const getBranches = async () => {
  const response = await window.ipc.invoke('GitService.run', {
    args: [`branch`],
    cwd: ArcControlService.props.arc_root
  });
  const branches_raw = response[1].split('\n').slice(0,-1);
  const branches = {
    list: [],
    current: null
  };
  if(branches_raw.length<1)
    branches_raw.push('* main')

  for(let branch of branches_raw){
    const branch_name = branch.slice(2);
    branches.list.push(branch_name);
    if(branch[0]==='*')
      branches.current = branch_name;
  }

  return branches;
};

const init = async ()=>{
  const branches = await getBranches();
  iProps.branches=branches.list;
  iProps.branch=branches.current;
};

onMounted( init );

</script>

<template>
  <a_select
    label='Branch'
    v-model='iProps.branch'
    :options='iProps.branches'
    @update:model-value='switchBranch'
  >
    <template v-slot:after-options="scope">
      <a_btn v-close-popup class='fit' label="Add Branch" @click="addBranch" icon='add_circle' flat no-caps size='12px'/>
    </template>
    <template v-slot:option="{ itemProps, opt }">
      <q-item clickable dense>
        <q-item-section v-bind="itemProps">
          <q-item-label :class="opt===iProps.branch ? 'text-bold text-secondary' : ''" v-html="opt" />
        </q-item-section>
        <q-item-section side>
          <q-btn class="gt-xs" size="12px" flat dense round icon="delete" color='grey-6' @click='deleteBranch(opt)'>
            <q-tooltip>
              Delete Branch
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </template>
  </a_select>
</template>
