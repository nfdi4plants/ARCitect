<script setup>
import d_input from '../components/d_input.vue';
import d_btn from '../components/d_btn.vue';
import d_checkbox from '../components/d_checkbox.vue';

</script>

<template>
  <div class="q-py-sm">
    <h5 style="margin-bottom:0.5em;">History</h5>
    <!-- <div class="text-body2 text-justify" style="padding-bottom:1em;">
      Versioning helps you keep track of your ARC's changes. If you are new to the ARC, the <strong>Versioning</strong>
      menu is likely a more complex feature of the ARCitect. Feel free to <a href="https://helpdesk.nfdi4plants.org"
        target="_blank">contact DataPLANT</a> for data steward support.

    </div> -->

    <q-card>

      <q-card-section>

        <!-- <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="history" />
          </q-item-section>
          <q-item-section>Log</q-item-section>
        </q-item> -->

        <q-item>
          <div>
          The ARC's change history is listed chronologically together with the date and time the change was committed and by whom.
          You can also see these commits listed with your ARC in the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a>. 
          </div>
      </q-item>

    </q-card-section>

  </q-card>

</div></template>
