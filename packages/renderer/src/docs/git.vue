<template>
  <div>
    <h5>Versioning</h5>

  For newcomers the Versioning menu is likely the most complicated feature of the ARCitect.
  Feel free to contact a data steward for more support.
<hr>
    
      <div class="q-item q-item-type row no-wrap">
        <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar">
          <i class="q-icon text-grey-8 notranslate material-icons" aria-hidden="true" role="presentation">verified</i>
        </div>
        <div class="q-item__section column q-item__section--main justify-center q-item__section--nowrap">
          <div class="q-item__label">Commit</div>
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

    <div style="padding-left: 50px; text-align: justify">

      <div class="q-checkbox cursor-pointer no-outline row inline no-wrap items-center q-checkbox--dense" tabindex="0" role="checkbox" aria-label="Use Large File Storage" aria-checked="true" filled=""><div class="q-checkbox__inner relative-position non-selectable q-checkbox__inner--falsy" aria-hidden="true"><input class="hidden q-checkbox__native absolute q-ma-none q-pa-none" type="checkbox"><div class="q-checkbox__bg absolute"><svg class="q-checkbox__svg fit absolute-full" viewBox="0 0 24 24"><path class="q-checkbox__truthy" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path><path class="q-checkbox__indet" d="M4,14H20V10H4"></path></svg></div></div><span class="no-outline" tabindex="-1"></span><div class="q-checkbox__label q-anchor--skip">Use Large File Storage</div></div>

      <p style="padding-top: 10px;">Check this box to use LFS.</p>
      

      <button class="q-btn q-btn--rectangle bg-secondary text-white"><span
          class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i
              class="q-icon on-left notranslate material-icons" aria-hidden="true" role="img">cloud_upload</i><span
              class="block">Push</span></span>
    </button>

    <p style="padding-top: 10px;">Click "PUSH" to upload the current status of your ARC to the DataHUB.</p>
    
    <button class="q-btn q-btn--rectangle bg-secondary text-white"><span
          class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i
              class="q-icon on-left notranslate material-icons" aria-hidden="true" role="img">cloud_download</i><span
              class="block">Pull</span></span>
    </button>

    <p style="padding-top: 10px;">Click "PULL" to donload the latest stage of your ARC from the DataHUB.</p>

    <button class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle text-secondary q-btn--actionable q-focusable q-hoverable q-btn--dense" tabindex="0" type="button"><span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon notranslate material-icons" aria-hidden="true" role="img">add_circle</i></span></button>
    
      <p style="padding-top: 10px;">You can add additional <strong>Remotes</strong> using the plus button.</p>

      
    </div>



      <div class="q-item q-item-type row no-wrap">
        <div class="q-focus-helper" tabindex="-1"></div>
        <div class="q-item__section column q-item__section--side justify-center q-item__section--avatar"><i
            class="q-icon text-grey-8 notranslate material-icons" aria-hidden="true" role="presentation">history</i></div>
        <div class="q-item__section column q-item__section--main justify-center q-item__section--nowrap">
          <div class="q-item__label">Log</div>
        </div>
      </div>

  <div style="padding-left: 50px; text-align: justify">
  
    The ARC's change history (i.e. "commits") is listed chronologically in the <strong>Log</strong> section together with the date and time the change was committed and by whom.
  
  </div>

</div>


</template>


