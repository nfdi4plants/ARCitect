<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import ArcControlService from '../ArcControlService.ts';
import a_btn from '../components/a_btn.vue';

const iProps = reactive({
  mode: '0',
  items: [],
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

onMounted(async ()=>{
  const response = await window.ipc.invoke('GitService.run', {
    args: ['clean','-n','-d'],
    cwd: ArcControlService.props.arc_root
  });
  iProps.items = response[1] ? response[1].split('\n').slice(0,-1).map(x=>x.replace('Would remove ','')) : [];
});

</script>

<template>

  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin" style="width:auto;max-width:80vw;">
      <q-card-section>
        <div class="text-h6">Resetting ARC - Beware of data loss!</div>
      </q-card-section>

      <q-card-section class="row no-wrap items-center" style="padding:0 2em 0 0.5em;">

        <q-list>
          <q-item tag="label" v-ripple>
            <q-item-section avatar top>
              <q-radio v-model="iProps.mode" val='0' color='secondary' />
            </q-item-section>
            <q-item-section>
              <q-item-label>Soft</q-item-label>
              <q-item-label caption>This mode will reset all files that are tracked by git to the last commited version.</q-item-label>
            </q-item-section>
          </q-item>
          <q-item tag="label" v-ripple :disable='iProps.items.length<1'>
            <q-item-section avatar top>
              <q-radio v-model="iProps.mode" val='1' color='secondary' :disable='iProps.items.length<1' />
            </q-item-section>
            <q-item-section>
              <q-item-label>Hard</q-item-label>
              <q-item-label caption>Same as a soft reset but this will also delete the following files and directories that are not tracked by git:
                <q-scroll-area style="height: 90px;">
                  <ul>
                    <li v-for='i in iProps.items'>
                      {{i}}
                    </li>
                    <li v-if='iProps.items.length<1'>
                      No untracked files or directories
                    </li>
                  </ul>
                </q-scroll-area>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
        <a_btn icon='warning' label='Reset' @click='()=>onDialogOK(parseInt(iProps.mode))' class='text-weight-bold'/>
        <a_btn icon='cancel' label='Cancel' @click='onDialogCancel' class='text-weight-bold'/>
      </q-card-actions>
    </q-card>

  </q-dialog>
</template>
