<script> 
import { ref } from 'vue'

import logoURL from '/assets/dpLogo2_w.png';

export default {
  setup () {
    
    return {
      selectedInv: ref('YourARC'),
      selectedStudy: ref('YourStudy'),
      selectedAssay: ref('YourAssay'),
      ARCtreeInv: [
        {
          label: 'YourARC',
          icon: "edit_square",
          clickable: false,
          children: [
            {label: 'assays', children:[{label: ''}], clickable: false, expandable: false, selectable: false},
            {label: 'runs', children:[{label: ''}], clickable: false, expandable: false, selectable: false},
            {label: 'studies', children:[{label: ''}], clickable: false, expandable: false, selectable: false},
            {label: 'workflows', children:[{label: ''}], clickable: false, expandable: false, selectable: false},
          ]
        }
      ],
      ARCtreeStudy: [
        {
          label: 'YourStudy',
          icon: "edit_square",
          clickable: false,
          children: [
            {label: 'protocols', children:[{label: ''}], clickable: false, expandable: false, selectable: false},
            {label: 'resources', children:[{label: ''}], clickable: false, expandable: false, selectable: false},
            {label: 'README.md', icon: "edit_square", clickable: false, expandable: false, selectable: false},
          ]
        }],
      ARCtreeAssay: [
        {
          label: 'YourAssay',
          icon: "edit_square",
          clickable: false,
          children: [
            {label: 'protocols', children:[{label: ''}], clickable: false, expandable: false, selectable: false},
            {label: 'resources', children:[{label: ''}], clickable: false, expandable: false, selectable: false},
            {label: 'README.md', icon: "edit_square", clickable: false, expandable: false, selectable: false},
          ]
        }],
        addStudies: [
        {
          label: 'studies',
          clickable: false,
          children: [
            {label: 'Add Study', icon: "add_box", clickable: false, expandable: false, selectable: false}
          ]
        }],
        addProtocols: [
        {
          label: 'protocols',
          clickable: false,
          children: [
            {label: 'Add Protocol', icon: "add_box", clickable: false, expandable: false, selectable: false}
          ]
        }],
        addAssays: [
        {
          label: 'assays',
          clickable: false,
          children: [
            {label: 'Add Assay', icon: "add_box", clickable: false, expandable: false, selectable: false}
          ]
        }],
        importDatasets: [
        {
          label: 'dataset',
          clickable: false,
          children: [
            {label: 'Import Dataset Files', icon: "add_box", clickable: false, expandable: false, selectable: false},
            {label: 'Import Dataset Folders', icon: "add_box", clickable: false, expandable: false, selectable: false}
          ]
        }]
    }
  }
}
</script>


<template>

    <div class="q-pa-md q-gutter-sm" style="padding:1em;">
    
      <q-tree
      :nodes="ARCtreeInv"
      node-key="label"
      dense
      default-expand-all
      />
      
      <q-tree
      :nodes="ARCtreeInv"
      node-key="label"
      dense
      selected-color='white'
      v-model:selected="selectedInv"
      default-expand-all
      />

      <q-tree
      :nodes="addStudies"
      node-key="label"
      dense
      default-expand-all
      />
    
      <q-tree
      :nodes="ARCtreeStudy"
      node-key="label"
      dense
      selected-color='white'
      v-model:selected="selectedStudy"
      default-expand-all
      />

      <q-tree
      :nodes="addAssays"
      node-key="label"
      dense
      default-expand-all
      />
    
      <q-tree
      :nodes="ARCtreeAssay"
      node-key="label"
      dense
      selected-color='white'
      v-model:selected="selectedAssay"
      default-expand-all
      />

      <q-tree
      :nodes="addProtocols"
      node-key="label"
      dense
      default-expand-all
      />

      <q-tree
      :nodes="importDatasets"
      node-key="label"
      dense
      default-expand-all
      />    
    
    </div>



  <div class="q-pa-sm">
    <h5>Help</h5>

    <div class="text-h6 text-weight-bold">Sidebar</div>
    <div class="q-pa-sm text-body2 text-justify">
      Navigate the ARCitect via the sidebar on the left.
    </div>

    <div class="text-justify">
      <q-list>
        <q-item>

          <q-item class='bg-primary text-white' style="padding-top:1em;padding-bottom:1em;">
            <q-item-section avatar>
              <q-icon size="2.5rem" style="margin: 0 -0.20em;" :name="'img:'+logoURL"></q-icon>
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
            Login to the DataHUB
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
            Download an ARC from the DataHUB
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
            <!-- TODO -->
            Save the ARC locally
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-7" name="refresh" />
          </q-item-section>
          <q-item-section style="margin-left: -1.2em;">
            Refresh ARC
          </q-item-section>
          <q-item-section>
            Refresh the open ARC (Reopens the latest state stored on your computer)
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-7" name="mediation" />
          </q-item-section>
          <q-item-section style="margin-left: -1.2em;">
            Versioning
          </q-item-section>
          <q-item-section>
            Track and communicate changes of your ARC
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
            Open the ARC in the explorer on your computer
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

    </div>

    <q-separator size=".5em" />


    <div class="text-h6 text-weight-bold">File tree</div>
    <div class="q-pa-sm text-body2 text-justify">
      Access and edit the files in your ARC via the file tree.
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>
        <q-item>
          <q-item-section>
            <div class="q-tree q-tree--dense" role="tree" style="padding: 1em;">
              <div class="q-tree__node relative-position q-tree__node--parent">
                <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0" role="treeitem"
                  aria-expanded="true">
                  <div class="q-focus-helper" tabindex="-1"></div><i
                    class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                  <div class="q-tree__node-header-content col row no-wrap items-center"><i
                      class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                    <div style="flex: 100 1 0%; white-space: nowrap;">YourARC</div><!--v-if-->
                  </div>
                </div>
                <div class="q-tree__node-collapsible" style="">
                  <div class="q-tree__children" role="group">
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                        role="treeitem" aria-expanded="false">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">assays</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group">
                          <div class="q-tree__node relative-position q-tree__node--parent">
                            <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                              role="treeitem" aria-expanded="true">
                              <div class="q-focus-helper" tabindex="-1"></div><i
                                class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">rnaseq</div><!--v-if-->
                              </div>
                            </div>
                            <div class="q-tree__node-collapsible" style="">
                              <div class="q-tree__children" role="group">
                                <div class="q-tree__node relative-position q-tree__node--parent">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                                    role="treeitem" aria-expanded="true">
                                    <div class="q-focus-helper" tabindex="-1"></div><i
                                      class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                                      <div style="flex: 100 1 0%; white-space: nowrap;">dataset</div><!--v-if-->
                                    </div>
                                  </div>
                                  <div class="q-tree__node-collapsible" style="">
                                    <div class="q-tree__children" role="group">
                                      <div class="q-tree__node relative-position q-tree__node--child">
                                        <div class="q-tree__node-header relative-position row no-wrap items-center"
                                          tabindex="0" role="treeitem">
                                          <div class="q-focus-helper" tabindex="-1"></div>
                                          <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                              class="q-icon notranslate material-icons"
                                              style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                            <div style="flex: 100 1 0%; white-space: nowrap;">Import Dataset Files</div>
                                            <!--v-if-->
                                          </div>
                                        </div>
                                      </div>
                                      <div class="q-tree__node relative-position q-tree__node--child">
                                        <div class="q-tree__node-header relative-position row no-wrap items-center"
                                          tabindex="0" role="treeitem">
                                          <div class="q-focus-helper" tabindex="-1"></div>
                                          <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                              class="q-icon notranslate material-icons"
                                              style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                            <div style="flex: 100 1 0%; white-space: nowrap;">Import Dataset Folders</div>
                                            <!--v-if-->
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="q-tree__node relative-position q-tree__node--parent">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                                    role="treeitem">
                                    <div class="q-focus-helper" tabindex="-1"></div><i
                                      class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                                      <div style="flex: 100 1 0%; white-space: nowrap;">protocols</div><!--v-if-->
                                    </div>
                                  </div>
                                  <div class="q-tree__node-collapsible" style="display: none;">
                                    <div class="q-tree__children" role="group"></div>
                                  </div>
                                </div>
                                <div class="q-tree__node relative-position q-tree__node--child">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                                    role="treeitem">
                                    <div class="q-focus-helper" tabindex="-1"></div>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                        class="q-icon notranslate material-icons"
                                        style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                                      <div style="flex: 100 1 0%; white-space: nowrap;">README.md</div>
                                      <div style="flex: 1 1 0%; white-space: nowrap; margin-left: 1em;">0.00 B</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="q-tree__node relative-position q-tree__node--child">
                            <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                              role="treeitem">
                              <div class="q-focus-helper" tabindex="-1"></div>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">Add Assay</div><!--v-if-->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">runs</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group"></div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                        role="treeitem" aria-expanded="false">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">studies</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group">
                          <div class="q-tree__node relative-position q-tree__node--parent">
                            <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                              role="treeitem" aria-expanded="true">
                              <div class="q-focus-helper" tabindex="-1"></div><i
                                class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">plants samples</div><!--v-if-->
                              </div>
                            </div>
                            <div class="q-tree__node-collapsible" style="">
                              <div class="q-tree__children" role="group">
                                <div class="q-tree__node relative-position q-tree__node--parent">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                                    role="treeitem" aria-expanded="true">
                                    <div class="q-focus-helper" tabindex="-1"></div><i
                                      class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                                      <div style="flex: 100 1 0%; white-space: nowrap;">protocols</div><!--v-if-->
                                    </div>
                                  </div>
                                  <div class="q-tree__node-collapsible" style="">
                                    <div class="q-tree__children" role="group">
                                      <div class="q-tree__node relative-position q-tree__node--child">
                                        <div class="q-tree__node-header relative-position row no-wrap items-center"
                                          tabindex="0" role="treeitem">
                                          <div class="q-focus-helper" tabindex="-1"></div>
                                          <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                              class="q-icon notranslate material-icons"
                                              style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                            <div style="flex: 100 1 0%; white-space: nowrap;">Add Protocol</div>
                                            <!--v-if-->
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="q-tree__node relative-position q-tree__node--parent">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                                    role="treeitem" aria-expanded="false">
                                    <div class="q-focus-helper" tabindex="-1"></div><i
                                      class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                                      <div style="flex: 100 1 0%; white-space: nowrap;">resources</div><!--v-if-->
                                    </div>
                                  </div>
                                  <div class="q-tree__node-collapsible" style="display: none;">
                                    <div class="q-tree__children" role="group">
                                      <div class="q-tree__node relative-position q-tree__node--child">
                                        <div class="q-tree__node-header relative-position row no-wrap items-center"
                                          tabindex="-1" role="treeitem">
                                          <div class="q-focus-helper" tabindex="-1"></div>
                                          <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                              class="q-icon notranslate material-icons"
                                              style="padding: 0px 0.2em 0px 0px;">block</i>
                                            <div style="flex: 100 1 0%; white-space: nowrap;">empty</div><!--v-if-->
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="q-tree__node relative-position q-tree__node--child">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                                    role="treeitem">
                                    <div class="q-focus-helper" tabindex="-1"></div>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                        class="q-icon notranslate material-icons"
                                        style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                                      <div style="flex: 100 1 0%; white-space: nowrap;">README.md</div>
                                      <div style="flex: 1 1 0%; white-space: nowrap; margin-left: 1em;">0.00 B</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="q-tree__node relative-position q-tree__node--child">
                            <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                              role="treeitem">
                              <div class="q-focus-helper" tabindex="-1"></div>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">Add Study</div><!--v-if-->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                        role="treeitem" aria-expanded="false">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">workflows</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group">
                          <div class="q-tree__node relative-position q-tree__node--child">
                            <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                              role="treeitem">
                              <div class="q-focus-helper" tabindex="-1"></div>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">Import Workflows Files</div><!--v-if-->
                              </div>
                            </div>
                          </div>
                          <div class="q-tree__node relative-position q-tree__node--child">
                            <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                              role="treeitem">
                              <div class="q-focus-helper" tabindex="-1"></div>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">Import Workflows Folders</div>
                                <!--v-if-->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            The root of your ARC by default contains the folders: studies - assays - workflows - runs
          </q-item-section>
        </q-item>

        <q-separator inset />

        <div class="text-subtitle1 text-weight-bold">Investigation</div>

        <q-item>
          <q-item-section>
            <div class="q-tree q-tree--dense" role="tree" style="padding: 1em;">
              <div class="q-tree__node relative-position q-tree__node--parent">
                <div class="q-tree__node-header relative-position row no-wrap items-center  q-tree__node--selected"
                  tabindex="0" role="treeitem" aria-expanded="true">
                  <div class="q-focus-helper" tabindex="-1"></div><i
                    class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                  <div class="q-tree__node-header-content col row no-wrap items-center text-white"><i
                      class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                    <div style="flex: 100 1 0%; white-space: nowrap;">YourARC</div><!--v-if-->
                  </div>
                </div>
                <div class="q-tree__node-collapsible" style="">
                  <div class="q-tree__children" role="group">
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                        role="treeitem" aria-expanded="false">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">assays</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group">
                          <div class="q-tree__node relative-position q-tree__node--parent">
                            <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                              role="treeitem" aria-expanded="false">
                              <div class="q-focus-helper" tabindex="-1"></div><i
                                class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">rnaseq</div><!--v-if-->
                              </div>
                            </div>
                            <div class="q-tree__node-collapsible" style="display: none;">
                              <div class="q-tree__children" role="group">
                                <div class="q-tree__node relative-position q-tree__node--parent">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center   "
                                    tabindex="0" role="treeitem">
                                    <div class="q-focus-helper" tabindex="-1"></div><i
                                      class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                                      <div style="flex: 100 1 0%; white-space: nowrap;">dataset</div><!--v-if-->
                                    </div>
                                  </div>
                                  <div class="q-tree__node-collapsible" style="display: none;">
                                    <div class="q-tree__children" role="group"></div>
                                  </div>
                                </div>
                                <div class="q-tree__node relative-position q-tree__node--parent">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center   "
                                    tabindex="0" role="treeitem">
                                    <div class="q-focus-helper" tabindex="-1"></div><i
                                      class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                                      <div style="flex: 100 1 0%; white-space: nowrap;">protocols</div><!--v-if-->
                                    </div>
                                  </div>
                                  <div class="q-tree__node-collapsible" style="display: none;">
                                    <div class="q-tree__children" role="group"></div>
                                  </div>
                                </div>
                                <div class="q-tree__node relative-position q-tree__node--child">
                                  <div class="q-tree__node-header relative-position row no-wrap items-center   "
                                    tabindex="0" role="treeitem">
                                    <div class="q-focus-helper" tabindex="-1"></div>
                                    <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                        class="q-icon notranslate material-icons"
                                        style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                                      <div style="flex: 100 1 0%; white-space: nowrap;">README.md</div>
                                      <div style="flex: 1 1 0%; white-space: nowrap; margin-left: 1em;">0.00 B</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="q-tree__node relative-position q-tree__node--child">
                            <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                              role="treeitem">
                              <div class="q-focus-helper" tabindex="-1"></div>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">Add Assay</div><!--v-if-->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                        role="treeitem" aria-expanded="false">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">runs</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group">
                          <div class="q-tree__node relative-position q-tree__node--child">
                            <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                              role="treeitem">
                              <div class="q-focus-helper" tabindex="-1"></div>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">Import Runs Files</div><!--v-if-->
                              </div>
                            </div>
                          </div>
                          <div class="q-tree__node relative-position q-tree__node--child">
                            <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                              role="treeitem">
                              <div class="q-focus-helper" tabindex="-1"></div>
                              <div class="q-tree__node-header-content col row no-wrap items-center"><i
                                  class="q-icon notranslate material-icons"
                                  style="padding: 0px 0.2em 0px 0px;">add_box</i>
                                <div style="flex: 100 1 0%; white-space: nowrap;">Import Runs Folders</div><!--v-if-->
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">studies</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group"></div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">workflows</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            Click on your ARC's name to open the "Investigation" menu
          </q-item-section>
        </q-item>


        <q-separator inset />

        <div class="text-subtitle1 text-weight-bold">Studies</div>

        <q-item>
          <q-item-section>
            <div class="q-tree q-tree--dense" role="tree" style="padding: 1em;">
              <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0" role="treeitem"
                aria-expanded="true">
                <div class="q-focus-helper" tabindex="-1"></div><i
                  class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                  <div style="flex: 100 1 0%; white-space: nowrap;">studies</div><!--v-if-->
                </div>
              </div>
              <div class="q-tree__node-collapsible" style="">
                <div class="q-tree__children" role="group">
                  <div class="q-tree__node relative-position q-tree__node--child">
                    <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                      role="treeitem">
                      <div class="q-focus-helper" tabindex="-1"></div>
                      <div class="q-tree__node-header-content col row no-wrap items-center"><i
                          class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">add_box</i>
                        <div style="flex: 100 1 0%; white-space: nowrap;">Add Study</div><!--v-if-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            Unfold studies and click "Add Study" to add a new study to your ARC
          </q-item-section>
        </q-item>

        <q-separator inset />
        <q-item>
          <q-item-section>
            <div class="q-tree q-tree--dense" role="tree" style="padding: 1em;">
              <div class="q-tree__node relative-position q-tree__node--parent">
                <div class="q-tree__node-header relative-position row no-wrap items-center  q-tree__node--selected"
                  tabindex="0" role="treeitem" aria-expanded="true">
                  <div class="q-focus-helper" tabindex="-1"></div><i
                    class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                  <div class="q-tree__node-header-content col row no-wrap items-center text-white"><i
                      class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                    <div style="flex: 100 1 0%; white-space: nowrap;">YourStudy</div><!--v-if-->
                  </div>
                </div>
                <div class="q-tree__node-collapsible" style="">
                  <div class="q-tree__children" role="group">
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center  " tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">protocols</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group"></div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">resources</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group"></div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--child">
                      <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><i
                            class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                          <div style="flex: 100 1 0%; white-space: nowrap;">README.md</div>
                          <div style="flex: 1 1 0%; white-space: nowrap; margin-left: 1em;">0.00 B</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="q-tree__node relative-position q-tree__node--child">
                <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                  role="treeitem">
                  <div class="q-focus-helper" tabindex="-1"></div>
                  <div class="q-tree__node-header-content col row no-wrap items-center"><i
                      class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">add_box</i>
                    <div style="flex: 100 1 0%; white-space: nowrap;">Add Study</div><!--v-if-->
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            Click on your study's name to open the "Study" menu
          </q-item-section>
        </q-item>

        <q-separator inset />

        <div class="text-subtitle1 text-weight-bold">Assays</div>

        <q-item>
          <q-item-section>
            <div class="q-tree q-tree--dense" role="tree" style="padding: 1em;">
              <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0" role="treeitem"
                aria-expanded="true">
                <div class="q-focus-helper" tabindex="-1"></div><i
                  class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                  <div style="flex: 100 1 0%; white-space: nowrap;">assays</div><!--v-if-->
                </div>
              </div>
              <div class="q-tree__node-collapsible" style="">
                <div class="q-tree__children" role="group">
                  <div class="q-tree__node relative-position q-tree__node--child">
                    <div class="q-tree__node-header relative-position row no-wrap items-center   " tabindex="0"
                      role="treeitem">
                      <div class="q-focus-helper" tabindex="-1"></div>
                      <div class="q-tree__node-header-content col row no-wrap items-center"><i
                          class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">add_box</i>
                        <div style="flex: 100 1 0%; white-space: nowrap;">Add Assay</div><!--v-if-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            Unfold assays and click "Add Assay" to add a new assay to your ARC
          </q-item-section>
        </q-item>

        <q-separator inset />
        <q-item>
          <q-item-section>
            <div class="q-tree q-tree--dense" role="tree" style="padding: 1em;">
              <div class="q-tree__node relative-position q-tree__node--parent">
                <div class="q-tree__node-header relative-position row no-wrap items-center q-tree__node--selected"
                  tabindex="0" role="treeitem" aria-expanded="true">
                  <div class="q-focus-helper" tabindex="-1"></div><i
                    class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                  <div class="q-tree__node-header-content col row no-wrap items-center text-white"><i
                      class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                    <div style="flex: 100 1 0%; white-space: nowrap;">YourAssay</div><!--v-if-->
                  </div>
                </div>
                <div class="q-tree__node-collapsible" style="">
                  <div class="q-tree__children" role="group">
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center" tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">dataset</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group"></div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--parent">
                      <div class="q-tree__node-header relative-position row no-wrap items-center " tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div><i
                          class="q-icon notranslate material-icons q-tree__arrow">play_arrow</i>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                          <div style="flex: 100 1 0%; white-space: nowrap;">protocols</div><!--v-if-->
                        </div>
                      </div>
                      <div class="q-tree__node-collapsible" style="display: none;">
                        <div class="q-tree__children" role="group"></div>
                      </div>
                    </div>
                    <div class="q-tree__node relative-position q-tree__node--child">
                      <div class="q-tree__node-header relative-position row no-wrap items-center " tabindex="0"
                        role="treeitem">
                        <div class="q-focus-helper" tabindex="-1"></div>
                        <div class="q-tree__node-header-content col row no-wrap items-center"><i
                            class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">edit_square</i>
                          <div style="flex: 100 1 0%; white-space: nowrap;">README.md</div>
                          <div style="flex: 1 1 0%; white-space: nowrap; margin-left: 1em;">0.00 B</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="q-tree__node relative-position q-tree__node--child">
                <div class="q-tree__node-header relative-position row no-wrap items-center " tabindex="0" role="treeitem">
                  <div class="q-focus-helper" tabindex="-1"></div>
                  <div class="q-tree__node-header-content col row no-wrap items-center"><i
                      class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">add_box</i>
                    <div style="flex: 100 1 0%; white-space: nowrap;">Add Assay</div><!--v-if-->
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            Click on your assay's name to open the "Assay" menu
          </q-item-section>
        </q-item>




        <q-separator inset />

        <div class="text-subtitle1 text-weight-bold">Study / Assay protocols</div>
        <q-item>
          <q-item-section>
            <div class="q-tree q-tree--dense" role="tree" style="padding: 1em;">
              <div class="q-tree__node-header relative-position row no-wrap items-center " tabindex="0" role="treeitem"
                aria-expanded="true">
                <div class="q-focus-helper" tabindex="-1"></div><i
                  class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                  <div style="flex: 100 1 0%; white-space: nowrap;">protocols</div><!--v-if-->
                </div>
              </div>
              <div class="q-tree__node-collapsible" style="">
                <div class="q-tree__children" role="group">
                  <div class="q-tree__node relative-position q-tree__node--child">
                    <div class="q-tree__node-header relative-position row no-wrap items-center " tabindex="0"
                      role="treeitem">
                      <div class="q-focus-helper" tabindex="-1"></div>
                      <div class="q-tree__node-header-content col row no-wrap items-center"><i
                          class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">add_box</i>
                        <div style="flex: 100 1 0%; white-space: nowrap;">Add Protocol</div><!--v-if-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            Protocols can be added to individual studies or assays, respectively.
          </q-item-section>
        </q-item>


        <q-separator inset />

        <div class="text-subtitle1 text-weight-bold">Assay datasets</div>
        <q-item>
          <q-item-section>
            <div class="q-tree q-tree--dense" role="tree" style="padding: 1em;">
              <div class="q-tree__node-header relative-position row no-wrap items-center " tabindex="0" role="treeitem"
                aria-expanded="true">
                <div class="q-focus-helper" tabindex="-1"></div><i
                  class="q-icon notranslate material-icons q-tree__arrow q-tree__arrow--rotate">play_arrow</i>
                <div class="q-tree__node-header-content col row no-wrap items-center"><!--v-if-->
                  <div style="flex: 100 1 0%; white-space: nowrap;">dataset</div><!--v-if-->
                </div>
              </div>
              <div class="q-tree__node-collapsible" style="">
                <div class="q-tree__children" role="group">
                  <div class="q-tree__node relative-position q-tree__node--child">
                    <div class="q-tree__node-header relative-position row no-wrap items-center " tabindex="0"
                      role="treeitem">
                      <div class="q-focus-helper" tabindex="-1"></div>
                      <div class="q-tree__node-header-content col row no-wrap items-center"><i
                          class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">add_box</i>
                        <div style="flex: 100 1 0%; white-space: nowrap;">Import Dataset Files</div><!--v-if-->
                      </div>
                    </div>
                  </div>
                  <div class="q-tree__node relative-position q-tree__node--child">
                    <div class="q-tree__node-header relative-position row no-wrap items-center " tabindex="0"
                      role="treeitem">
                      <div class="q-focus-helper" tabindex="-1"></div>
                      <div class="q-tree__node-header-content col row no-wrap items-center"><i
                          class="q-icon notranslate material-icons" style="padding: 0px 0.2em 0px 0px;">add_box</i>
                        <div style="flex: 100 1 0%; white-space: nowrap;">Import Dataset Folders</div><!--v-if-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            Dataset files or folders can imported to individual assays.
          </q-item-section>
        </q-item>


      </q-list>
    </div>

  </div>
</template>



<!-- TODO: remove these classes to not render elements "actionable"
q-tree__node--link
q-focusable
q-hoverable
-->

