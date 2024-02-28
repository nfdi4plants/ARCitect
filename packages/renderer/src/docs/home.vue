<!-- 
TODO: fix logo import 
-->

<script lang="ts">
import { ref } from 'vue'

import logoURL from '/assets/dpLogo2_w.png';

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

    <h5 style="margin-bottom:0.5em;">Help</h5>

    <div class="q-pa-sm text-body2 text-justify">
      The ARCitect is divided into three panels: sidebar, file tree and main menu.
    </div>

    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
      narrow-indicator>
      <q-tab name="sidebar" label="Sidebar" />
      <q-tab name="filetree" label="File Tree" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="sidebar">

        <div class="q-pa-sm text-body2 text-justify">
          Navigate the ARCitect via the sidebar on the left.
        </div>

        <q-list class="text-justify bg-grey-2">
          <q-item>

            <q-item class='bg-primary text-white' style="padding-top:1em;padding-bottom:1em;">
              <q-item-section avatar>
                <q-icon size="2.5rem" style="margin: 0 -0.20em;" :name="'img:/assets/dpLogo2_w.png'"></q-icon>
                <!-- <q-icon size="2.5rem" style="margin: 0 -0.20em;" :name="'img:' + logoURL"></q-icon> -->
              </q-item-section>
              <q-item-section style="margin:0.6em 0 0 -1.2em">
                <q-item-label><b style="font-size:2em">ARC</b><span style="font-size:1.2em">itect</span></q-item-label>
              </q-item-section>
            </q-item>

            <q-separator inset />

            <q-item-section>
              Return to home view
            </q-item-section>
          </q-item>

          <q-separator inset />

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="exit_to_app" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">Login</q-item-section>
            <q-item-section>
              Login to the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="note_add" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              New ARC
            </q-item-section>
            <q-item-section>
              Create a new ARC on your computer
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="file_open" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              Open ARC
            </q-item-section>
            <q-item-section>
              Open an ARC existing from your computer
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="cloud_download" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              Download ARC
            </q-item-section>
            <q-item-section>
              Download an ARC from the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a>
            </q-item-section>
          </q-item>

          <q-separator inset />

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="save" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              Save ARC
            </q-item-section>
            <q-item-section>
              Save the ARC locally
            </q-item-section>
          </q-item>
          
          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="folder_open" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              Explorer
            </q-item-section>
            <q-item-section>
              Open the ARC in your Explorer or Finder on your computer
            </q-item-section>
          </q-item>

          <q-separator inset />

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="verified" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              Commit
            </q-item-section>
            <q-item-section>
              Track and communicate changes of your ARC
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="published_with_changes" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              DataHUB Sync
            </q-item-section>
            <q-item-section>
              Synchronize the ARC with a DataHub
            </q-item-section>
          </q-item>
          
          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="history" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              History
            </q-item-section>
            <q-item-section>
              Inspect the ARC's history
            </q-item-section>
          </q-item>

          <q-separator inset />

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="help" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              Toggle Help
            </q-item-section>
            <q-item-section>
              Show or hide the help menu
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="grey-7" name="chevron_left" />
            </q-item-section>
            <q-item-section style="margin-left: -1.2em;">
              Minimize Sidebar
            </q-item-section>
            <q-item-section>
              Minimize or maximize the sidebar
            </q-item-section>
          </q-item>

        </q-list>


      </q-tab-panel>

      <q-tab-panel name="filetree">

        <div class="q-pa-sm text-body2 text-justify">
          Access and edit the files in your ARC via the file tree.
        </div>

        <q-list class="q-pa-md q-gutter-sm">

          <q-item>
            <q-item-section>
              The root of your ARC by default contains the folders: studies - assays - workflows - runs
            </q-item-section>
          </q-item>

          <q-tree :nodes="ARCtreeInv" node-key="label" dense default-expand-all />

          <q-separator inset />

          <div class="text-subtitle1 text-weight-bold">Investigation</div>

          <q-item>
            <q-item-section>
              Click on your ARC's name to open the "Investigation" menu
            </q-item-section>
          </q-item>


          <q-tree :nodes="ARCtreeInv" node-key="label" dense selected-color='white' v-model:selected="selectedInv"
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

          <q-tree :nodes="ARCtreeStudy" node-key="label" dense selected-color='white' v-model:selected="selectedStudy"
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



          <q-tree :nodes="ARCtreeAssay" node-key="label" dense selected-color='white' v-model:selected="selectedAssay"
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
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>