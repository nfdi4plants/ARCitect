<!-- TODO fix add buttons -->

<template>
  <div>
  <h5>Study</h5>

    <div class="text-body2 text-justify">
      In the Study menu you can adapt the metadata of one study added to your ARC.
    </div>
    <br>

    <q-separator inset />

    <div class="q-item row">
      <div class="q-item__section column q-item__section--side justify-center">
        <i class="q-icon text-grey-8 material-icons">biotech</i>
      </div>
      <div class="q-item__section column justify-center q-item__label">Study</div>
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>
              
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap q-field--filled q-field--float q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Identifier</div><!----></div></div><!----></div><!----></label>            
          </q-item-section>
          <q-item-section>
            The study identifier is automatically added when adding the study to your ARC and cannot be changed.
          </q-item-section>
        </q-item>
        
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap q-field--filled q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Title</div><!----></div></div><!----></div><!----></label>
          </q-item-section>
          <q-item-section>
            Give your study a short title.
          </q-item-section>
        </q-item>
        
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap q-field--filled q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Description</div><!----></div></div><!----></div><!----></label>
          </q-item-section>
          <q-item-section>
            Add a description about your study.
          </q-item-section>
        </q-item>
           

        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <button class="q-btn q-btn--rectangle bg-red-9 text-white">
                  <div class="col items-center justify-center row"><i class="q-icon on-left material-icons"
                      role="img">delete</i>Delete</div>
                </button>
              </div>
              <div class="col">
                <q-item-section>If needed, you can delete your study.</q-item-section>
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
                      role="img">check_circle</i>Update</div>
                </button>
              </div>
              <div class="col">
                <q-item-section>Once ready, click "update" to store your changes in the ARC.</q-item-section>
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
                      role="img">change_circle</i>reset</div>
                </button>
              </div>
              <div class="col">
                <q-item-section>Click "reset" to undo your changes.</q-item-section>
              </div>
            </div>
          </q-item-section>
        </q-item>


      </q-list>
      
      <br>
    <q-separator inset />

    <div class="q-item row">
      <div class="q-item__section column q-item__section--side justify-center">
        <i class="q-icon text-grey-8 material-icons">groups</i>
      </div>
      <div class="q-item__section column justify-center q-item__label">People</div>
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>
        <q-item>
          <q-item-section>
            In the people section you can add authors and collaborators of the study.
          </q-item-section>
       </q-item>

        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <button class="q-btn q-btn--rectangle bg-secondary text-white">
                  <div class="col items-center justify-center row"><i class="q-icon on-left material-icons"
                      role="img">person_add_alt_1</i>add person</div>
                </button>
              </div>

                <q-item-section>Click "add person" to add a person</q-item-section>

            </div>
          </q-item-section>
        </q-item>


      </q-list>
      
      <br>
    <q-separator inset />

    <div class="q-item row">
      <div class="q-item__section column q-item__section--side justify-center">
        <i class="q-icon text-grey-8 material-icons">menu_book</i>
      </div>
      <div class="q-item__section column justify-center q-item__label">Publications</div>
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>
        <q-item>
          <q-item-section>
            In the people section you can add publications to the study.
          </q-item-section>
       </q-item>

        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col">
                <button class="q-btn q-btn--rectangle bg-secondary text-white">
                  <div class="col items-center justify-center row"><i class="q-icon on-left material-icons"
                      role="img">bookmark_add</i>add pub</div>
                </button>
              </div>

                <q-item-section>Click "add publication" to add a new publication</q-item-section>

            </div>
          </q-item-section>
        </q-item>


      </q-list>
      </div>
</div>
</div>
</div>


</template>


