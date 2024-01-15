<!-- TODO: need help on q-item section: html markup or links are not inline but wrapped-->
<!-- TODO: link commit explanation -->
<!-- TODO: link LFS explanation -->
<!-- TODO: externals links are not allowed: "Blocked the opening of an unallowed origin: https://www.nfdi4plants.org" -->

<script setup>
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';

</script>

<template>
  <div class="q-pa-xs">
    <h5>Versioning</h5>
    <div class="text-body2 text-justify">
      Versioning helps you keep track of your ARC's changes. If you are new to the ARC, the <strong>Versioning</strong>
      menu is likely a more complex feature of the ARCitect. Feel free to contact DataPLANT for data steward support.
      <!-- TODO: Link DataPLANT help desk or email -->
    </div>

    <q-separator inset />

    <q-item>
      <q-item-section avatar>
        <q-icon color="grey-8" name="verified" />
      </q-item-section>
      <q-item-section>Commit</q-item-section>
    </q-item>

    <div class="q-pt-sm text-justify">
      <q-list class="q-gutter-md">
        <q-item>
          <q-item-section>
            The Commit section allows you to "commit" your changes locally. This saves the changes of your local ARC
            together with your DataHUB credentials (Name and eMail).
            <!-- TODO: Link DataHUB-->
          </q-item-section>
        </q-item>

        <q-item class="row">
          <q-item-section class="col">
            <a_input label='Name' v-model='{ _: " " }._' readonly-hidden />
            <a_input label='eMail' v-model='{ _: " " }._' readonly-hidden />
          </q-item-section>
          <q-item-section class="col">
            Once logged in to the DataHUB your Name and eMail address are automatically filled out.
            <!-- TODO: Link DataHUB-->
          </q-item-section>
        </q-item>

        <q-item class="row">
          <q-item-section class="col">
            <a_input label='Commit Message' readonly-hidden />
          </q-item-section>
          <q-item-section class="col">
            Add a commit message to document and communicate your changes.
            <!-- TODO: Link KB article commit messages-->
          </q-item-section>
        </q-item>

        <q-item class="row">
          <q-item-section class="col">
            <a_input label='Large File Storage Limit in MB' v-model='{ _: " " }._' readonly-hidden />
          </q-item-section>
          <q-item-section class="col">
            You can adapt the <a href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html" target="_blank">large file storage (LFS)</a> Limit as needed.
            <!-- You can adapt the large file storage (LFS) Limit as needed. -->
          </q-item-section>
        </q-item>

        <q-separator inset />

        <div class="q-pt-sm">
          <q-list>
            <q-item>
              <q-item-section>
                Three types of changes are displayed together with the file size.
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="edit_square" color="secondary" />
              </q-item-section>
              <q-item-section>
                file edited
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="add_box" color="secondary" />
              </q-item-section>
              <q-item-section>
                file added
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="indeterminate_check_box" color="red-10" />
              </q-item-section>
              <q-item-section>
                file deleted
              </q-item-section>
            </q-item>

            <q-item class="row">
              <div class="col">
                <a_btn label="commit" icon='check_circle' color="secondary" />
              </div>
              <q-item-section class="col">
                Once ready, click "commit" to store your changes locally.
              </q-item-section>
            </q-item>

            <q-item class="row">
              <div class="col">
                <a_btn label="reset" icon='change_circle' color="secondary" />
              </div>
              <q-item-section class="col">
                Click "RESET" to undo your latest changes and convert the ARC to the last saved commit.
              </q-item-section>
            </q-item>

          </q-list>
        </div>

      </q-list>
    </div>

    <q-separator inset />

    <q-item>
      <q-item-section avatar>
        <q-icon color="grey-8" name="wifi_protected_setup" />
      </q-item-section>
      <q-item-section>Push / Pull</q-item-section>
    </q-item>

    <div class="q-pt-sm">
      <q-list>
        <q-item>
          <q-item-section>
            The Push / Pull section allows you to synchronize your ARC with the DataHUB.
            <!-- TODO: Link DataHUB-->
          </q-item-section>
        </q-item>


        <q-item>
          <q-item-section avatar>
            <q-icon name="add_circle" color="secondary" />
          </q-item-section>
          <q-item-section>
            You can add additional Remotes using the plus button.
          </q-item-section>
        </q-item>

        <q-item class="row">
          <q-item-section class="col">
            <q-checkbox label='Use Large File Storage' dense readonly-hidden />
          </q-item-section>
          <q-item-section class="col">
            (Un)check the LFS box to (not) download LFS objects
          </q-item-section>
        </q-item>

        <q-item class="row">
          <div class="col">
            <a_btn label="push" icon='cloud_upload' color="secondary" />
          </div>
          <q-item-section class="col">
            Click "PUSH" to upload the current status of your ARC to the DataHUB.
          </q-item-section>
        </q-item>

        <q-item class="row">
          <div class="col">
            <a_btn label="pull" icon='cloud_download' color="secondary" />
          </div>
          <q-item-section class="col">
            Click "PULL" to download the latest stage of your ARC from the DataHUB.
          </q-item-section>
        </q-item>

      </q-list>
    </div>

    <q-separator inset />

    <q-item>
      <q-item-section avatar>
        <q-icon color="grey-8" name="history" />
      </q-item-section>
      <q-item-section>Log</q-item-section>
    </q-item>

    <div class="q-pt-sm">
      <q-list>
        <q-item>
          <q-item-section>
            The ARC's change history (i.e. "commits") is listed chronologically in the Log section together with the
            date and time the change was committed and by whom.
          </q-item-section>
        </q-item>

      </q-list>
    </div>

  </div>
</template>