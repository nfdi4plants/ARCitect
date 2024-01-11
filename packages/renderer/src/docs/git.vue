<!-- TODO: need help on q-item section: html markup or links are not inline but wrapped-->
<!-- TODO: link commit explanation -->
<!-- TODO: link LFS explanation -->
<!-- TODO: externals links are not allowed: "Blocked the opening of an unallowed origin: https://www.nfdi4plants.org" -->

<template>
  <div>
    <h5>Versioning</h5>
    <div class="text-body2 text-justify">
      Versioning helps you keep track of your ARC's changes. If you are new to the ARC, the <strong>Versioning</strong>
      menu is likely a more complex feature of the ARCitect. Feel free to contact DataPLANT for data steward support.
      <!-- TODO: Link DataPLANT help desk or email -->
    </div>
    <br>

    <q-separator inset />

    <div class="q-item row">
      <div class="q-item__section column q-item__section--side justify-center">
        <i class="q-icon text-grey-8 material-icons">verified</i>
      </div>
      <div class="q-item__section column justify-center q-item__label">Commit</div>
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>
        <q-item>
          <q-item-section>
            The Commit section allows you to "commit" your changes locally. This saves the changes of your local ARC
            together with your DataHUB credentials (Name and eMail).
            <!-- TODO: Link DataHUB-->
          </q-item-section>
        </q-item>
        
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap items-start q-field--filled q-input q-field--float q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col self-stretch"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Name</div><!----></div></div><!----></div><!----></label>
            <label class="q-field row no-wrap items-start q-field--filled q-input q-field--float q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col self-stretch"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">eMail</div><!----></div></div><!----></div><!----></label>
          </q-item-section>
          <q-item-section>
            Once logged in to the DataHUB your Name and eMail address are automatically filled out.
            <!-- TODO: Link DataHUB-->
          </q-item-section>
        </q-item>
        
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap items-start q-field--filled q-input q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col self-stretch"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Commit Message</div><!----></div></div><!----></div><!----></label>
          </q-item-section>
          <q-item-section>
            Add a commit message to document and communicate your changes.
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap items-start q-field--filled q-input q-field--float q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col self-stretch"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Large File Storage Limit in MB</div><!----></div></div><!----></div><!----></label>
          </q-item-section>
          <q-item-section>
            <!-- You can adapt the <a href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html" target="_blank">large file storage (LFS)</a> Limit as needed. -->
            You can adapt the large file storage (LFS) Limit as needed.
          </q-item-section>
        </q-item>
          
        <q-separator inset />
        
        <div class="q-pt-sm text-justify">
      <q-list>
        <q-item>
          <q-item-section>
            Three types of changes are displayed together with the file size. 
          </q-item-section>
        </q-item>
        
        <q-item>
          <q-item-section>

            <div class="q-item q-item-type row no-wrap" role="listitem">
        <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar"
            style="min-width: 2em;"><i class="q-icon text-secondary notranslate material-icons" aria-hidden="true"
                role="presentation">edit_square</i></div>
        <div class="q-item__section column q-item__section--main justify-center">
            <div class="q-item__label">file edited<span style=""></span></div>
        </div>
    </div>

    <div class="q-item q-item-type row no-wrap" role="listitem">
        <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar"
            style="min-width: 2em;"><i class="q-icon text-secondary notranslate material-icons" aria-hidden="true"
                role="presentation">add_box</i></div>
        <div class="q-item__section column q-item__section--main justify-center">
            <div class="q-item__label">file added <span style=""></span></div>
        </div>
    </div>   
    <div class="q-item q-item-type row no-wrap" role="listitem">
        <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar"
            style="min-width: 2em;"><i class="q-icon text-red-10 notranslate material-icons" aria-hidden="true"
                role="presentation">indeterminate_check_box</i></div>
        <div class="q-item__section column q-item__section--main justify-center">
            <div class="q-item__label">file deleted <span style=""></span></div>
        </div>
    </div>

          </q-item-section>
        </q-item>
</q-list>
</div>        

        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <button class="q-btn q-btn--rectangle bg-secondary text-white">
                  <div class="col items-center justify-center row"><i class="q-icon on-left material-icons"
                      role="img">check_circle</i>Commit</div>
                </button>
              </div>
              <div class="col">
                <q-item-section>Once ready, click "commit" to store your changes locally.</q-item-section>
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <button class="q-btn q-btn--rectangle bg-secondary text-white">
                  <div class="col items-center justify-center row"><i class="q-icon on-left material-icons"
                      role="img">change_circle</i>Reset</div>
                </button>
              </div>
              <div class="col">
                <q-item-section>Click "RESET" to undo your latest changes and convert the ARC to the last saved
                  commit.</q-item-section>
              </div>
            </div>
          </q-item-section>
        </q-item>

      </q-list>
    </div>

    <q-separator inset />

    <div class="q-item row">
      <div class="q-item__section column q-item__section--side justify-center">
        <i class="q-icon text-grey-8 material-icons">wifi_protected_setup</i>
      </div>
      <div class="q-item__section column justify-center q-item__label">Push / Pull</div>
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>

        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <div class="q-checkbox row items-center q-checkbox--dense">
                  <div class="q-checkbox__inner relative-position non-selectable q-checkbox__inner--falsy"><input
                      class="hidden q-checkbox__native absolute q-ma-none q-pa-none" type="checkbox">
                    <div class="q-checkbox__bg absolute"><svg class="q-checkbox__svg fit absolute-full"
                        viewBox="0 0 24 24">
                        <path class="q-checkbox__truthy" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                        <path class="q-checkbox__indet" d="M4,14H20V10H4"></path>
                      </svg></div>
                  </div><span class="no-outline"></span>
                  <div class="q-checkbox__label">Use Large File <br> Storage</div>
                </div>
              </div>
              <div class="col">
                <q-item-section>Check this box to use <a
                    href="https://www.nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html"
                    target="_blank">large file storage (LFS)</a></q-item-section>
              </div>
            </div>
          </q-item-section>
        </q-item>


        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <button class="q-btn q-btn--rectangle bg-secondary text-white">
                  <div class="col items-center justify-center row"><i class="q-icon on-left material-icons"
                      role="img">cloud_upload</i>Push</div>
                </button>
              </div>
              <div class="col">
                <q-item-section>Click "PUSH" to upload the current status of your ARC to the DataHUB.</q-item-section>
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <button class="q-btn q-btn--rectangle bg-secondary text-white">
                  <div class="col items-center justify-center row"><i class="q-icon on-left material-icons"
                      role="img">cloud_download</i>Pull</div>
                </button>
              </div>
              <div class="col">
                <q-item-section>Click "PULL" to download the latest stage of your ARC from the DataHUB.</q-item-section>
              </div>
            </div>
          </q-item-section>
        </q-item>


        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <button
                  class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle text-secondary q-btn--actionable q-focusable q-hoverable q-btn--dense"
                  tabindex="0" type="button"><span class="q-focus-helper"></span><span
                    class="q-btn__content text-center col items-center justify-center row"><i
                      class="q-icon notranslate material-icons" aria-hidden="true"
                      role="img">add_circle</i></span></button>
              </div>
              <div class="col">
                <q-item-section>You can add additional Remotes using the plus button.</q-item-section>
              </div>
            </div>
          </q-item-section>
        </q-item>

      </q-list>
    </div>

    <q-separator inset />

    <div class="q-item row">
      <div class="q-item__section column q-item__section--side justify-center">
        <i class="q-icon text-grey-8 material-icons">history</i>
      </div>
      <div class="q-item__section column justify-center q-item__label">Log</div>
    </div>

    <div class="q-pt-sm text-justify">
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