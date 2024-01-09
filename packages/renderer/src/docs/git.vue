<template>
  <div>
    <h5>Versioning</h5>
    
    <div class="q-expansion-item__container relative-position">
      <div class="q-item q-item-type row no-wrap">
        <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar">
          <i class="q-icon text-grey-8 notranslate material-icons" aria-hidden="true" role="presentation">verified</i>
        </div>
        <div class="q-item__section column q-item__section--main justify-center q-item__section--nowrap">
          <div class="q-item__label">Commit</div>
        </div>
      </div>
    </div>

  <div style="padding-left: 50px; text-align: justify">
    The <strong>Commit</strong> section allows you to "commit" your changes locally. This saves the changes of your local ARC together with your DataHUB credentials (<strong>Name</strong> and <strong>eMail</strong>).
      <br><br>
    Add a <strong>Commit Message</strong> to comment your changes.
      <br><br>
    <!-- TODO: link commit explanation -->
    You can adapt the <strong>Large File Storage Limit</strong> as needed.
    <!-- TODO: link to LFS explanation -->
      <br><br>
    <button class="q-btn q-btn--rectangle bg-secondary text-white"><span
          class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i
              class="q-icon on-left notranslate material-icons" aria-hidden="true" role="img">check_circle</i><span
              class="block">Commit</span></span>
    </button>
    
    <p style="padding-top: 10px;">Once ready, click "commit" to store your changes locally.</p>
    <span style="display: inline-block;">
    <button class="q-btn q-btn--rectangle bg-secondary text-white"><span
          class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i
              class="q-icon on-left notranslate material-icons" aria-hidden="true" role="img">change_circle</i><span
              class="block">Reset</span></span>
    </button>
    <p style="padding-top: 10px;">Click "RESET" to undo your latest changes and convert the ARC to the last saved commit.</p>
  </span>

</div> 

<br>

    <div class="q-expansion-item__container relative-position">
      <div class="q-item q-item-type row no-wrap">
        <div class="q-focus-helper" tabindex="-1"></div>
        <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar">
          <i class="q-icon text-grey-8 notranslate material-icons" aria-hidden="true"
            role="presentation">wifi_protected_setup</i>
        </div>
        <div class="q-item__section column q-item__section--main justify-center q-item__section--nowrap">
          <div class="q-item__label">Push / Pull</div>
        </div>
      </div>
    </div>

    <div style="padding-left: 50px; text-align: justify">
    
      <button class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle text-secondary q-btn--actionable q-focusable q-hoverable q-btn--dense" tabindex="0" type="button"><span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon notranslate material-icons" aria-hidden="true" role="img">add_circle</i></span></button>
    
    </div>


    <div class="q-expansion-item__container relative-position">
      <div class="q-item q-item-type row no-wrap">
        <div class="q-focus-helper" tabindex="-1"></div>
        <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar"><i
            class="q-icon text-grey-8 notranslate material-icons" aria-hidden="true" role="presentation">history</i></div>
        <div class="q-item__section column q-item__section--main justify-center q-item__section--nowrap">
          <div class="q-item__label">Log</div>
        </div>
      </div>
    </div>

  <div style="padding-left: 50px; text-align: justify">
  
    The ARC's change history (i.e. "commits") is listed chronologically in the <strong>Log</strong> section together with the date and time the change was committed and by whom.
  
  </div>

</div>


</template>


