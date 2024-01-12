<!-- TODO fix button / column design -->

<script setup> 
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
</script>

<template>
  <div class="q-pa-xs">
    <h5>Assay</h5>

    <div class="text-body2 text-justify">
      In the Assay menu you can adapt the metadata of one assay added to your ARC.
    </div>
    <br>

    <q-separator inset />

    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-icon color="grey-8" name="biotech" />
        </q-item-section>
        <q-item-section>Assay</q-item-section>
      </q-item>
    </q-list>

    <q-list class="q-gutter-md">
      <q-item class="row">
        <q-item-section class="col">
          <a_input label='Identifier' v-model='{_:"YourIdentifier"}._' readonly/>
        </q-item-section>
        <q-item-section class="col">
          The assay identifier is automatically added when adding the assay to your ARC and cannot be changed.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <q-item-section class="col">
          <a_input label='Studies' readonly-hidden/>
        </q-item-section>
        <q-item-section class="col">
          List or adapt the studies this assay is linked to.
        </q-item-section>
      </q-item>       
            
      <q-item class="row">
        <q-item-section class="col">
          <a_input label='Measurement Type' readonly-hidden/>
        </q-item-section>
        <q-item-section class="col">
          Add a measurement type for this assay.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <q-item-section class="col">
          <a_input label='Technology Type' readonly-hidden/>
        </q-item-section>
        <q-item-section class="col">
          Add a technology type for this assay.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <q-item-section class="col">
          <a_input label='Technology Platform' readonly-hidden/>
        </q-item-section>
        <q-item-section class="col">
          Add a technology platform for this assay.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <div class="col">
          <a_btn label="delete" icon='delete' color="red-9"/>
        </div>
        <q-item-section class="col">
          Completely delete this assay from the ARC.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <div class="col">
          <a_btn label="edit table" icon='edit' color="secondary" />
        </div>
        <q-item-section class="col">
          Edit experimental metdata.
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator inset />

    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-icon color="grey-8" name="groups" />
        </q-item-section>
        <q-item-section>People</q-item-section>
      </q-item>
    </q-list>

    <q-list>
      <q-item>
        <q-item-section>
          In the people section you can add authors and collaborators of the assay.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <div class="col">
          <a_btn label="add person" icon='person_add_alt_1' color="secondary" />
        </div>
        <q-item-section class="col">
          Click to add a person
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator inset />

    <q-list>
      <q-item v-ripple>
        <q-item-section avatar>
          <q-icon color="grey-8" name="menu_book" />
        </q-item-section>
        <q-item-section>Publications</q-item-section>
      </q-item>
    </q-list>

    <q-list>
      <q-item>
        <q-item-section>
          In the publications section you can add publications to the assay.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <q-item-section class="col">
          <a_btn label="add person" icon='bookmark_add' color="secondary" />
        </q-item-section>
        <q-item-section class="col">
          Click to add a publication
        </q-item-section>
      </q-item>
    </q-list>

  </div>
</template>






<!-- 


<template>
  <div>
  <h5>Assay</h5>

    <div class="text-body2 text-justify">
      In the Assay menu you can adapt the metadata of one assay added to your ARC.
    </div>
    <br>

    <q-separator inset />

    <div class="q-item row">
      <div class="q-item__section column q-item__section--side justify-center">
        <i class="q-icon text-grey-8 material-icons">biotech</i>
      </div>
      <div class="q-item__section column justify-center q-item__label">Assay</div>
    </div>

    <div class="q-pt-sm text-justify">
      <q-list>
              
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap q-field--filled q-field--float q-field--dense" style="padding: 0.4em;"><div class="relative-position col"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Identifier</div></div></div></div></label>            
          </q-item-section>
          <q-item-section>
            The assay identifier is automatically added when adding the assay to your ARC and cannot be changed.
          </q-item-section>
        </q-item>
        
        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap q-field--filled q-field--dense" style="padding: 0.4em;"><div class="relative-position col"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Studies_assay</div></div></div></div></label>
          </q-item-section>
          <q-item-section>
            List or adapt the studies this assay is linked to.
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap q-field--filled q-field--dense" style="padding: 0.4em;"><div class="relative-position col"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Measurement Type</div></div></div></div></label>
          </q-item-section>
          <q-item-section>
            
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap q-field--filled q-field--dense" style="padding: 0.4em;"><div class="relative-position col"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Technology Type</div></div></div></div></label>
          </q-item-section>
          <q-item-section>

          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <label class="q-field row no-wrap q-field--filled q-field--dense" style="padding: 0.4em;"><div class="relative-position col"><div class="q-field__control relative-position row no-wrap"><div class="col relative-position row no-wrap"><div class="q-field__label absolute">Technology Platform</div></div></div></div></label>
          </q-item-section>
          <q-item-section>
            
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
                <q-item-section>If needed, you can delete your assay.</q-item-section>
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
                      role="img">edit</i>edit table</div>
                </button>
              </div>
              <div class="col">
                <q-item-section>Edit the table data</q-item-section>
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
            In the people section you can add authors and collaborators of the assay.
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
      
</div>
</div>
</div>


</template>

 -->
