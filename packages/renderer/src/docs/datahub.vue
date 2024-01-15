<script setup>
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
</script>

<template>
  <div>
    <h5>Download ARC</h5>
    <div class="q-pa-sm text-body2 text-justify">
      In the "Download ARC" menu, you can download ARCs from the DataHUB.
    </div>

    <div class="q-pt-sm text-justify" style="background-color: white;">
      <q-list>

        <q-item class="row">
          <q-item-section class="col">
            <q-field label='ARC Identifier' dense outlined readonly-hidden>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-field>
          </q-item-section>
          <q-item-section class="col">
            Use the search field to find an ARC by the name of the ARC or its creator.
          </q-item-section>
        </q-item>

        <q-item class="row">
          <q-item-section class="col">
            <q-checkbox label='LFS' dense readonly-hidden />
          </q-item-section>
          <q-item-section class="col">
            (Un)check the LFS box to (not) download <a href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html" target="_blank">large file storage (LFS)</a> objects
          </q-item-section>
        </q-item>

        <q-item class="row">
          <q-item-section class="col">
            <q-field label='Host' dense readonly-hidden>
              <span>git.nfdi4plants.org</span>
              <template v-slot:append>
                <q-icon name="arrow_drop_down" />
              </template>
            </q-field>
          </q-item-section>
          <q-item-section class="col">
            Select a DataHUB host from the dropdown menu.
          </q-item-section>
        </q-item>

        <q-item class="row">
          <div class="col">
            <a_btn icon='refresh' />
          </div>
          <q-item-section class="col">
            Refresh the list of available ARCs.
          </q-item-section>
        </q-item>

        <q-separator />

        <div class="q-pa-sm text-body2 text-justify">
          The list of available ARCs is alphabetically sorted.
        </div>

        <q-item class="row">
          <div class="col">
            <a_btn icon='search' />
          </div>
          <q-item-section class="col">
            Check out an ARC in the DataHUB (opens a new browser window).
          </q-item-section>
        </q-item>

        <q-item class="row">
          <div class="col">
            <a_btn icon='file_download' />
          </div>
          <q-item-section class="col">
            Download (pull) the selected ARC from the DataHUB.
          </q-item-section>
        </q-item>

      </q-list>
    </div>
  </div>
</template>