<script setup>
import d_input from '../components/d_input.vue';
import d_btn from '../components/d_btn.vue';
import d_checkbox from '../components/d_checkbox.vue';

</script>

<template>
  <div class="q-py-sm">

    <h5 style="margin-bottom:0.5em;"> 
      <q-icon color="grey-8" name="verified" /> Commit Changes
    </h5>   

    <q-card>

      <q-card-section>

        <q-list class="q-gutter-xs">
          <q-item>
            <div>
              This menu allows you to "commit" your changes locally. This saves the changes of your local ARC
              together with your <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a> credentials (Name and
              eMail).
            </div>
          </q-item>

          <q-item>
            <q-item-section>
              <d_input label='Name' value='Jon'/>
              <d_input label='eMail' value='Doe'/>
            </q-item-section>
            <q-item-section>
              <div>
                Once logged in to the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a> your Name and
                eMail address are automatically filled out
              </div>
            </q-item-section>
          </q-item>
          
          <q-item>
            <q-item-section>
              <d_input label='Branch' value='main'/>
            </q-item-section>
            <q-item-section>
              <div>
                You can add (<q-icon name="add_circle" color="secondary" />), delete (<q-icon name="delete" color="grey-8" />), or switch between branches of your ARC
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <d_input label='Commit Message' value='Add Readme'/>
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
              <d_input label='Large File Storage Limit in MB' value='1' />
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
                <d_btn label="commit" icon='check_circle' color="secondary" doc />
              </div>
            </q-item-section>
            <q-item-section>
              Once ready, click "commit" to store your changes locally
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div>
                <d_btn label="reset" icon='change_circle' color="secondary" />
              </div>
            </q-item-section>
            <q-item-section>
              Click "RESET" to undo your latest changes and convert the ARC to the last saved commit
            </q-item-section>
          </q-item>

        </q-list>

      </q-card-section>

  </q-card>

  <q-card>
    <q-card-section>
    <div class="text-body2 text-justify" style="padding-bottom:1em;">
        Versioning helps you keep track of your ARC's changes. If you are new to the ARC, the <strong>Commit</strong> and <strong>DataHUB Sync</strong>
        menus are likely a more complex feature of the ARC and ARCitect. Feel free to <a href="https://helpdesk.nfdi4plants.org"
          target="_blank">contact DataPLANT</a> for data steward support.</div>
    </q-card-section>
  </q-card>

</div></template>
