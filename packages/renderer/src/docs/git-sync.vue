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
      <q-card-section><b>Upload of large data files</b></q-card-section>
      <q-card-section>      
        For upload of large amounts of data we recommend to use a personal access token (PAT). You can add a PAT generated at the DataHUB for your ARC or your DataHUB account to your remote connection:
        <ol>
          <li>Click <q-icon name="add_circle" color="secondary" /> to a add remote connection</li>
          <li>Click <q-icon name="key" color="grey-7" /> to a open the PAT menu in the DataHUB</li>
          <ul>
            <li>Give your PAT a <b>Token name</b> (e.g. "ARCitect data upload")</li>
            <li>Adjust the <b>Expiration date</b> (Be aware that you might have to redo this once the PAT expires) </li>
            <li>Select a scope "api" or "write_repository"</li>
            <li>Copy the PAT shown under <b>Your new personal access token</b> on top of the menu</li>
          </ul>
          <li>Paste the token string into the field Personal Access Token (Optional)</li>
        </ol>
      </q-card-section>
    </q-card>

    <q-separator />

    <q-card>
      <q-card-section>
        <div>
          Check out the DataPLANT knowledgebase to learn more about <a
            href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html"
            target="_blank">large file storage (LFS)</a> or <a
            href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/datahub-GeneratePAT.html"
            target="_blank">generating personal access tokens</a>.
            <!-- TODO: add explanation about remotes  -->
        </div>
      </q-card-section>
    </q-card>

</div></template>
