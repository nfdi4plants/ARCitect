
<script setup>
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';

</script>

<template>
  <div class="q-py-sm">
    <h5 style="margin-bottom:0.5em;">Versioning</h5>
    <div class="text-body2 text-justify" style="padding-bottom:1em;">
      Versioning helps you keep track of your ARC's changes. If you are new to the ARC, the <strong>Versioning</strong>
      menu is likely a more complex feature of the ARCitect. Feel free to <a href="https://helpdesk.nfdi4plants.org"
        target="_blank">contact DataPLANT</a> for data steward support.

    </div>

    <q-card>

      <q-card-section>

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="verified" />
          </q-item-section>
          <q-item-section>Commit</q-item-section>
        </q-item>

        <q-list class="q-gutter-xs">
          <q-item>
            <div>
              The Commit section allows you to "commit" your changes locally. This saves the changes of your local ARC
              together with your <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a> credentials (Name and
              eMail).
            </div>
          </q-item>

          <q-item>
            <q-item-section>
              <a_input label='Name' v-model='{ _: " " }._' readonly-hidden />
              <a_input label='eMail' v-model='{ _: " " }._' readonly-hidden />
            </q-item-section>
            <q-item-section>
              <div>
                Once logged in to the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a> your Name and
                eMail address are automatically filled out.
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <a_input label='Commit Message' readonly-hidden />
            </q-item-section>
            <q-item-section>
              <div>
                Add a <a
                  href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_SyncingRecommendation.html"
                  target="_blank">commit message </a> to document and communicate your changes
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <a_input label='Large File Storage Limit in MB' v-model='{ _: " " }._' readonly-hidden />
            </q-item-section>
            <q-item-section>
              <div>
                You can adapt the <a
                  href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html"
                  target="_blank">large file storage (LFS)</a> Limit as needed
              </div>

            </q-item-section>
          </q-item>

        </q-list>

        <q-separator inset />

        <q-list class="q-gutter-xs">
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

          <q-item>
            <q-item-section>
              <div>
                <a_btn label="commit" icon='check_circle' color="secondary" />
              </div>
            </q-item-section>
            <q-item-section>
              Once ready, click "commit" to store your changes locally
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div>
                <a_btn label="reset" icon='change_circle' color="secondary" />
              </div>
            </q-item-section>
            <q-item-section>
              Click "RESET" to undo your latest changes and convert the ARC to the last saved commit
            </q-item-section>
          </q-item>

        </q-list>

      </q-card-section>

      <q-separator inset size="0.3em" />

      <q-card-section>

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="wifi_protected_setup" />
          </q-item-section>
          <q-item-section>Push / Pull</q-item-section>
        </q-item>

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
            <q-item-section>
              <q-checkbox label='Use Large File Storage' dense readonly-hidden />
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
                <a_btn label="push" icon='cloud_upload' color="secondary" />
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
                <a_btn label="pull" icon='cloud_download' color="secondary" />
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

      <q-separator inset size="0.3em" />

      <q-card-section>

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="history" />
          </q-item-section>
          <q-item-section>Log</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            The ARC's change history (i.e. "commits") is listed chronologically in the Log section together with the
          date and time the change was committed and by whom.
        </q-item-section>
      </q-item>

    </q-card-section>

  </q-card>

</div></template>
