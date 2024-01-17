<script setup>
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
</script>

<template>
  <div class="q-pa-xs">
    <h5>Study</h5>

    <div class="text-body2 text-justify">
      In the Study menu you can adapt the metadata of one study added to your ARC.
    </div>

    <q-separator inset />

    <q-item>
      <q-item-section avatar>
        <q-icon color="grey-8" name="biotech" />
      </q-item-section>
      <q-item-section>Study</q-item-section>
    </q-item>

    <q-list class="q-gutter-xs">
      <q-item>
        <q-item-section>
          <a_input label='Identifier' v-model='{ _: "YourIdentifier" }._' readonly />
        </q-item-section>
        <q-item-section>
          The study identifier is automatically added when adding the study to your ARC and cannot be changed
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <a_input label='Title' v-model='{ _: "Your study title" }._' readonly-hidden />
        </q-item-section>
        <q-item-section>
          Give your study a short title
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <a_input label='Description' readonly-hidden />
        </q-item-section>
        <q-item-section>
          Add a description about your study
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div>
            <a_btn label="delete" icon='delete' color="red-9" />
          </div>
        </q-item-section>
        <q-item-section>
          Completely delete this study from the ARC
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div>
            <a_btn label="edit table" icon='edit' color="secondary" />
          </div>
        </q-item-section>
        <q-item-section>
          Edit experimental metadata using <a
            href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/implementation/Swate.html"
            target="_blank">Swate</a>
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
          In the people section you can add authors and collaborators of the study.
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

    <q-list class="q-gutter-xs">
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
          In the publications section you can add publications to the study.
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
