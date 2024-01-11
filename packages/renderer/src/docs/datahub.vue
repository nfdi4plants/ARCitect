<template>
  <div>
    <h5>Download ARC</h5>
    <div class="q-pa-sm text-body2 text-justify">
      In the "Download ARC" menu, you can download ARCs from the DataHUB.
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>

        <q-item>
          <q-item-section>
            <div class="col">
              <div
                class="q-field row no-wrap q-field--outlined q-field--labeled q-field--dense col-grow q-field--outlined q-field__inner relative-position col self-stretch">
                <div class="q-field__control relative-position row no-wrap">
                  <div class="col relative-position row">
                    <input class="q-field__native q-placeholder">
                    <div class="q-field__label absolute">ARC Identifier</div>
                  </div>
                  <div class="q-field__append q-field__marginal row no-wrap items-center">
                    <i class="q-icon notranslate material-icons">search</i>
                  </div>
                </div>
              </div>
            </div>

          </q-item-section>
          <q-item-section>
            Use the search field to find an ARC by the name of the ARC or its creator.
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <div class="col">
              <div class="row items-center q-checkbox--dense">
                <div class="q-checkbox__inner relative-position">
                  <div class="q-checkbox__bg absolute"></div>
                </div>
                <div class="q-checkbox__label">LFS</div>
              </div>
            </div>

          </q-item-section>
          <q-item-section>
            (Un)check the LFS box to (not) download LFS objects
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <div class="col">

              <label
                class="q-field row no-wrap q-field--standard q-select q-field--auto-height q-field--float q-field--labeled q-field--dense">
                <div class="q-field__inner relative-position col self-stretch">
                  <div class="q-field__control relative-position row no-wrap">
                    <div class="q-field__control-container col relative-position row no-wrap">
                      <div class="q-field__native row items-center">
                        <span>git.nfdi4plants.org</span>
                      </div>
                      <div class="q-field__label absolute">Host</div>
                    </div>
                    <div class="q-field__append q-field__marginal row no-wrap items-center">
                      <i class="q-icon notranslate material-icons">arrow_drop_down</i>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </q-item-section>
          <q-item-section>
            Select a DataHUB host from the dropdown menu.
          </q-item-section>
        </q-item>


        <q-item>
          <q-item-section>
            <div class="col">
              <button
                class="q-btn q-btn-item non-selectable no-outline q-btn--standard bg-secondary text-white q-btn--active">
                <span
                  class="q-btn__content text-center col items-center q-anchor--skip justify-center row no-wrap text-no-wrap">
                  <i class="q-icon notranslate material-icons" aria-hidden="true" role="img">refresh</i></span></button>
            </div>
          </q-item-section>
          <q-item-section>
            Refresh the list of available ARCs.
          </q-item-section>
        </q-item>

        <q-separator />

        <div class="q-pa-sm text-body2 text-justify">
          The list of available ARCs is alphabetically sorted.
        </div>

        <q-item>
          <q-item-section>
            <div class="col">
              <button class="q-btn q-btn--unelevated q-btn--rectangle bg-secondary text-white">
                <span class="q-btn__content text-center col items-center justify-center row">
                  <i class="q-icon notranslate material-icons">search</i>
                </span>
              </button>
            </div>
          </q-item-section>
          <q-item-section>
            Check out an ARC in the DataHUB (opens a new browser window).
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <div class="col">
              <button class="q-btn q-btn--unelevated q-btn--rectangle bg-secondary text-white">
                <span class="q-btn__content text-center col items-center justify-center row">
                  <i class="q-icon notranslate material-icons">file_download</i>
                </span>
              </button>
            </div>
          </q-item-section>
          <q-item-section>
            Download (pull) the selected ARC from the DataHUB.
          </q-item-section>
        </q-item>



      </q-list>
    </div>


  </div>

</template>