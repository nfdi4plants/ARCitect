<script setup>
import d_input from '../components/d_input.vue';
import d_btn from '../components/d_btn.vue';
import d_checkbox from '../components/d_checkbox.vue';

</script>

<template>
  <div class="q-py-sm">
    <h5 style="margin-bottom:0.5em;">
      <q-icon color="grey-8" name="published_with_changes" />
      DataHUB Sync
    </h5>
    
    <q-card>


          <q-item>
            <div>
              Here you can synchronize your ARC with the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a>
            </div>
          </q-item>
          <q-item>
        <div class="text-body2 text-justify" style="padding-bottom:1em;">
          Versioning helps you keep track of your ARC's changes. If you are new to the ARC, the <strong>Commit</strong>
          and <strong>DataHUB Sync</strong>
          menus are likely a more complex feature of the ARC and ARCitect. Feel free to <a
            href="https://helpdesk.nfdi4plants.org" target="_blank">contact DataPLANT</a> for data steward support.
        </div>
      </q-item>
    </q-card>

    <q-separator />

    <q-card>
      <q-item>
        <div>
          Check out the DataPLANT knowledgebase to learn more about <a
            href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html"
            target="_blank">large file storage (LFS)</a>.

            <!-- TODO: add explanation about remotes  -->
        </div>
      </q-item>
    </q-card>

</div></template>
