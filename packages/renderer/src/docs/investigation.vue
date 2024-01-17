
<script setup>
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
</script>

<template>
  <div class="q-pa-xs">
    <h5>Investigation</h5>

    <div class="text-body2 text-justify">
      In the Investigation menu you can adapt the investigation-level metadata of your ARC.
    </div>

    <q-separator inset />

    <q-item>
      <q-item-section avatar>
        <q-icon color="grey-8" name="biotech" />
      </q-item-section>
      <q-item-section>Investigation</q-item-section>
    </q-item>

    <q-list class="q-gutter-xs">
      <q-item>
        <q-item-section>
          <a_input label='Identifier' v-model='{ _: "YourIdentifier" }._' readonly />
        </q-item-section>
        <q-item-section>
          Your ARC's identifier is automatically added based on the name of your ARC and cannot be changed.
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <a_input label='Title' v-model='{ _: "Your investigation" }._' readonly-hidden />
        </q-item-section>
        <q-item-section>
          Give your ARC a short title.
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <a_input label='Description' readonly-hidden />
        </q-item-section>
        <q-item-section>
          Add a description about your investigation. This can be the abstract of your publication.
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

    <q-list class="q-gutter-xs">
      <q-item>
        <q-item-section>
          In the people section you can add authors and collaborators of the investigation.
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div>
            <a_btn label="add person" icon='person_add_alt_1' color="secondary" />
          </div>
        </q-item-section>
        <q-item-section>
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
          In the publications section you can add publications to the investigation.
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div>
            <a_btn label="add publication" icon='bookmark_add' color="secondary" />
          </div>
        </q-item-section>
        <q-item-section>
          Click to add a publication
        </q-item-section>
      </q-item>
    </q-list>

  </div>
</template>
