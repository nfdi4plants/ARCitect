<script setup>
import d_input from '../components/d_input.vue';
import d_btn from '../components/d_btn.vue';
import d_checkbox from '../components/d_checkbox.vue';

</script>

<template>
  <div class="q-py-sm">
    <h5 style="margin-bottom:0.5em;">DataHUB Sync</h5>
    <div class="text-body2 text-justify" style="padding-bottom:1em;">
      Versioning helps you keep track of your ARC's changes. If you are new to the ARC, the <strong>Commit</strong> and <strong>DataHUB Sync</strong>
      menus are likely a more complex feature of the ARC and ARCitect. Feel free to <a href="https://helpdesk.nfdi4plants.org"
        target="_blank">contact DataPLANT</a> for data steward support.

    </div>

    <q-card>


      <q-card-section>
<!-- 
        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="wifi_protected_setup" />
          </q-item-section>
          <q-item-section>Push / Pull</q-item-section>
        </q-item> -->

        <q-list class="q-gutter-xs">
          <q-item>
            <div>
              The Push / Pull section allows you to synchronize your ARC with the <a href="https://git.nfdi4plants.org/"
                target="_blank">DataHUB</a>
            </div>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="add_circle" color="secondary" />
            </q-item-section>
            <q-item-section>
              You can add additional remotes using the plus button.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="running_with_errors" color="grey-8" />
            </q-item-section>
            <q-item-section>
              You see this warning, if the ARC is out of sync with the ARC stored in the DataHUB.
            </q-item-section>
          </q-item>
          
          <q-item>
            <q-item-section avatar>
              <q-icon name="search" color="grey-8" />
            </q-item-section>
            <q-item-section>
              You can open your ARC in the DataHUB.
            </q-item-section>
          </q-item>
          
          <q-item>
            <q-item-section avatar>
              <q-icon name="delete" color="grey-8" />
            </q-item-section>
            <q-item-section>
              You can delete a remote.
            </q-item-section>
          </q-item>

          <q-separator inset />

          <q-item>
            <q-item-section>
              <d_checkbox label='Use Large File Storage' />
            </q-item-section>
            <q-item-section>
              <div>
                (Un)check the LFS box to (not) download <a
                  href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html"
                  target="_blank">large file storage (LFS)</a> objects
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div>
                <d_btn label="push" icon='cloud_upload' color="secondary" />
              </div>
            </q-item-section>
            <q-item-section>
              <div>
                Click "PUSH" to upload the current status of your ARC to the <a href="https://git.nfdi4plants.org/"
                  target="_blank">DataHUB</a>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div>
                <d_btn label="pull" icon='cloud_download' color="secondary" />
              </div>
            </q-item-section>
            <q-item-section>
              <div>
                Click "PULL" to download the latest stage of your ARC from the <a href="https://git.nfdi4plants.org/"
                  target="_blank">DataHUB</a>
              </div>
            </q-item-section>
          </q-item>

        </q-list>

      </q-card-section>

  </q-card>

</div></template>
