<!-- TODO fix button / column design -->

<template>
  <div class="q-pt-sm">
    <h5>Study</h5>

    <div class="text-body2 text-justify">
      In the Study menu you can adapt the metadata of one study added to your ARC.
    </div>
    <br>

    <q-separator inset />

    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-icon color="grey-8" name="biotech" />
        </q-item-section>
        <q-item-section>Study</q-item-section>
      </q-item>
    </q-list>

    <q-list class="q-gutter-xs">

      <q-item class="row">
        <q-item-section class="col">
          <q-field filled readonly label="Identifier" stack-label>
            <template v-slot:control>
              <div class="self-center no-outline">YourStudy</div>
            </template>
          </q-field>
        </q-item-section>
        <q-item-section class="col">
          The study identifier is automatically added when adding the study to your ARC and cannot be changed.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <q-item-section class="col">
          <q-field filled label="Title" stack-label>
            <template v-slot:control>
              <div class="self-center no-outline">Your study title</div>
            </template>
          </q-field>
        </q-item-section>
        <q-item-section class="col">
          Give your study a short title.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <q-item-section class="col">
          <q-field filled label="Description" />
        </q-item-section>
        <q-item-section class="col">
          Add a description about your study.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <div class="col">
          <q-btn label="Delete" icon='delete' color="red-9" />
        </div>
        <div class="col">
          Completely delete a study from the ARC.
        </div>
      </q-item>

      <q-item class="row">
        <div class="col">
          <q-btn label="Reset" icon='change_circle' color="secondary" class="q-ml-sm" />
        </div>
        <div class="col">
          Click "reset" to undo your changes.
        </div>
      </q-item>

      <q-item class="row">
        <div class="col">
          <q-btn label="Update" icon='check_circle' color="secondary" />
        </div>
        <div class="col">
          Once ready, click "update" to store your changes in the ARC.
        </div>
      </q-item>
    </q-list>

    <q-separator inset />

    <q-list>
      <q-item v-ripple>
        <q-item-section avatar>
          <q-icon color="grey-8" name="groups" />
        </q-item-section>
        <q-item-section>People</q-item-section>
      </q-item>
    </q-list>

    <q-list>
      <q-item>
        <q-item-section>
          In the people section you can add authors and collaborators of the study.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <div class="col">
          <q-btn label="add person" icon='person_add_alt_1' color="secondary" />
        </div>
        <div class="col">
          Click "add person" to add a person
        </div>
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
          In the publications section you can add publications to the study.
        </q-item-section>
      </q-item>

      <q-item class="row">
        <div class="col">
          <q-btn label="add person" icon='bookmark_add' color="secondary" />
        </div>
        <div class="col">
          Click "add person" to add a person
        </div>
      </q-item>
    </q-list>

  </div>
</template>


