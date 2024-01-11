<template>
  <div>
  <h5>Investigation</h5>

    <div class="text-body2 text-justify">
      In the Investigation menu you can adapt the investigation-level metadata of your ARC.
    </div>
    <br>

    <q-separator inset />

    <div class="q-item row">
      <div class="q-item__section column q-item__section--side justify-center">
        <i class="q-icon text-grey-8 material-icons">biotech</i>
      </div>
      <div class="q-item__section column justify-center q-item__label">Investigation</div>
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>
        <q-item>
          <q-item-section>
            The Commit section you to "commit" your changes locally. This saves the changes of your local ARC
            together with your DataHUB credentials (Name and eMail).
            <!-- TODO: Link DataHUB-->
          </q-item-section>
        </q-item>

               
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap items-start q-field--filled q-input q-field--float q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col self-stretch"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Identifier</div><!----></div></div><!----></div><!----></label>            
          </q-item-section>
          <q-item-section>
            Your ARC's identifier is automatically added based on the name of your ARC and cannot be changed.
          </q-item-section>
        </q-item>
        
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap items-start q-field--filled q-input q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col self-stretch"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Title</div><!----></div></div><!----></div><!----></label>
          </q-item-section>
          <q-item-section>
            Give your ARC a short title.
          </q-item-section>
        </q-item>
        
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap items-start q-field--filled q-input q-field--dense" style="padding: 0.4em;"><!----><div class="relative-position col self-stretch"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Description</div><!----></div></div><!----></div><!----></label>
          </q-item-section>
          <q-item-section>
            Add a description about your investigation. This can be the abstract of your publication. 
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
      </div>
</div>


</template>



