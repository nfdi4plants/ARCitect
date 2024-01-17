<script setup>
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
</script>

<template>
  <div class="q-pt-sm">
  
  <h5 style="margin-bottom:0.5em;">Download ARC</h5>
  <div class="text-body2 text-justify" style="padding-bottom:1em;">
      In the "Download ARC" menu, you can download ARCs from the <a href="https://git.nfdi4plants.org/"
        target="_blank">DataHUB</a>.
    </div>

  <q-card>

    <q-card-section>

      <q-item>
        <q-item-section>
          <q-field label='ARC Identifier' dense outlined readonly-hidden>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-field>
        </q-item-section>
        <q-item-section>
          <div>
            Use the search field to find an ARC by the name of the ARC or its creator
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-checkbox label='LFS' dense readonly-hidden />
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
          <q-field label='Host' dense readonly-hidden>
            <span>git.nfdi4plants.org</span>
            <template v-slot:append>
              <q-icon name="arrow_drop_down" />
            </template>
          </q-field>
        </q-item-section>
        <q-item-section>
          <div>
            Select a <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a> host from the dropdown menu
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div>
            <a_btn icon='refresh' />
          </div>
        </q-item-section>
        <q-item-section>
          Refresh the list of available ARCs.
        </q-item-section>
      </q-item>

    </q-card-section>

    <q-separator inset />

    <q-card-section>

      <q-item>
        <q-item-section>
          The list of available ARCs is alphabetically sorted.
        </q-item-section>
      </q-item>


      <q-item>
        <q-item-section>
          <div>
            <a_btn icon='search' />
          </div>
        </q-item-section>
        <q-item-section>
          <div>
            Check out an ARC in the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a> (opens a new
            browser window)
          </div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div>
            <a_btn icon='file_download' />
          </div>
        </q-item-section>
        <q-item-section>
          <div>
            Download (pull) the selected ARC from the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a>
          </div>
        </q-item-section>
      </q-item>

    </q-card-section>
  </q-card>
</div>
</template>
