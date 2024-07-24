<script lang="ts">
import { ref } from 'vue'


export default {
  setup() {

    return {
      tab: ref('Sidebar'),
      selectedInv: ref('YourARC'),
      selectedStudy: ref('YourStudy'),
      selectedAssay: ref('YourAssay'),
      ARCtreeInv: [
        {
          label: 'YourARC',
          icon: "edit_square",
          clickable: false,
          children: [
            { label: 'assays', children: [{ label: '' }], clickable: false, expandable: false, selectable: false },
            { label: 'runs', children: [{ label: '' }], clickable: false, expandable: false, selectable: false },
            { label: 'studies', children: [{ label: '' }], clickable: false, expandable: false, selectable: false },
            { label: 'workflows', children: [{ label: '' }], clickable: false, expandable: false, selectable: false },
          ]
        }
      ],
      ARCtreeStudy: [
        {
          label: 'YourStudy',
          icon: "edit_square",
          clickable: false,
          children: [
            { label: 'protocols', children: [{ label: '' }], clickable: false, expandable: false, selectable: false },
            { label: 'resources', children: [{ label: '' }], clickable: false, expandable: false, selectable: false },
            { label: 'README.md', icon: "edit_square", clickable: false, expandable: false, selectable: false },
          ]
        }],
      ARCtreeAssay: [
        {
          label: 'YourAssay',
          icon: "edit_square",
          clickable: false,
          children: [
            { label: 'protocols', children: [{ label: '' }], clickable: false, expandable: false, selectable: false },
            { label: 'resources', children: [{ label: '' }], clickable: false, expandable: false, selectable: false },
            { label: 'README.md', icon: "edit_square", clickable: false, expandable: false, selectable: false },
          ]
        }],
      addStudies: [
        {
          label: 'studies',
          clickable: false,
          children: [
            { label: 'Add Study', icon: "add_box", clickable: false, expandable: false, selectable: false }
          ]
        }],
      addProtocols: [
        {
          label: 'protocols',
          clickable: false,
          children: [
            { label: 'Add Protocol', icon: "add_box", clickable: false, expandable: false, selectable: false }
          ]
        }],
      addAssays: [
        {
          label: 'assays',
          clickable: false,
          children: [
            { label: 'Add Assay', icon: "add_box", clickable: false, expandable: false, selectable: false }
          ]
        }],
      importDatasets: [
        {
          label: 'dataset',
          clickable: false,
          children: [
            { label: 'Import Dataset Files', icon: "add_box", clickable: false, expandable: false, selectable: false },
            { label: 'Import Dataset Folders', icon: "add_box", clickable: false, expandable: false, selectable: false }
          ]
        }]
    }
  }
}
</script>

<template>
  <div class="q-pa-sm">

    <h5 style="margin-bottom:0.5em;">Help menu</h5>

    <q-card>
      <q-card-section style="font-size: 1.2em;font-weight: bold;">
        Overview
      </q-card-section>
      <q-card-section>
        The ARCitect is divided into multiple panels (left to right):
        <q-list class='bg-grey-3' dense style="border-radius:0.3em; margin:0.2em;">
          <q-item>Sidebar</q-item>
          <q-item>File Tree</q-item>
          <q-item>Main panel</q-item>
          <q-item>This help menu (if activated)</q-item>
        </q-list>
      </q-card-section>

      <q-separator inset style="height:0.2em" />


      <q-list>
        <q-item>
          This help menu provides explanations, additional context, and helpful links related to the selected menu.
        </q-item>
        <q-item>
          <q-icon color="grey-7" name="help" />Toggle Help in the sidebar to show or hide the help menu.
        </q-item>
      </q-list>

      <q-separator inset style="height:0.2em" />
      <q-list>
        <q-item>
          Short explanations are provided as tooltips. Simply hover-over a button or function to get more info.
        </q-item>
        <q-item>
          <q-icon color="grey-7" name="sym_r_mark_chat_read" /> / <q-icon color="grey-7" name="sym_r_chat_bubble" />
          Toggle Tooltips in the sidebar to show or hide tooltips.
        </q-item>
      </q-list>
    </q-card>

    <q-separator inset style="height:0.2em" />

    <q-card>
      <q-card-section style="font-size: 1.2em;font-weight: bold;">
        File Tree
      </q-card-section>
      <q-card-section>
        In the file tree panel you can access and edit the files in your ARC.
      </q-card-section>
      <q-card-section>
        <q-list class='bg-grey-3' dense style="border-radius:0.3em; margin:0.2em;">
          Many functions to work on files are provided via a <b>context menu (right-click)</b>:
          <q-item>Adding or importing files or directories</q-item>
          <q-item>Deleting files or folders</q-item>
          <q-item>Adding, deleting, renaming studies or assays</q-item>
          <q-item>This help menu (if activated)</q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <q-list class="q-pa-md q-gutter-sm">

          <q-item-section>
            The root of your ARC by default contains the folders: studies - assays - workflows - runs
          </q-item-section>

          <q-tree :nodes="ARCtreeInv" node-key="label" dense default-expand-all />

          <q-separator inset />

          <div class="text-subtitle1 text-weight-bold">Investigation</div>

          <q-item>
            <q-item-section>
              Click on your ARC's name to open the "Investigation" menu
            </q-item-section>
          </q-item>


          <q-tree :nodes="ARCtreeInv" node-key="label" dense selected-color='grey-10' v-model:selected="selectedInv"
            default-expand-all />

          <q-separator inset />

          <div class="text-subtitle1 text-weight-bold">Studies</div>

          <q-item>
            <q-item-section>
              Unfold studies and click "Add Study" to add a new study to your ARC
            </q-item-section>
          </q-item>

          <q-tree :nodes="addStudies" node-key="label" dense default-expand-all />

          <q-separator inset />

          <q-item>
            <q-item-section>
              Click on your study's name to open the "Study" menu
            </q-item-section>
          </q-item>

          <q-tree :nodes="ARCtreeStudy" node-key="label" dense selected-color='grey-10' v-model:selected="selectedStudy"
            default-expand-all />

          <q-separator inset />

          <div class="text-subtitle1 text-weight-bold">Assays</div>

          <q-item>
            <q-item-section>
              Unfold assays and click "Add Assay" to add a new assay to your ARC
            </q-item-section>
          </q-item>


          <q-tree :nodes="addAssays" node-key="label" dense default-expand-all />

          <q-separator inset />

          <q-item>
            <q-item-section>
              Click on your assay's name to open the "Assay" menu
            </q-item-section>
          </q-item>



          <q-tree :nodes="ARCtreeAssay" node-key="label" dense selected-color='grey-10' v-model:selected="selectedAssay"
            default-expand-all />


          <q-separator inset />

          <div class="text-subtitle1 text-weight-bold">Protocols</div>

          <q-item>
            <q-item-section>
              Protocols can be added to individual studies or assays, respectively.
            </q-item-section>
          </q-item>

          <q-tree :nodes="addProtocols" node-key="label" dense default-expand-all />

          <q-separator inset />

          <div class="text-subtitle1 text-weight-bold">Datasets</div>

          <q-item>
            <q-item-section>
              Dataset files or folders can be imported to individual assays.
            </q-item-section>
          </q-item>

          <q-tree :nodes="importDatasets" node-key="label" dense default-expand-all />

        </q-list>
      </q-card-section>
    </q-card>


  </div>

</template>