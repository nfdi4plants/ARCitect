<script setup>
import a_input from '../components/a_input.vue';
import a_btn from '../components/a_btn.vue';
</script>

<template>
  <div class="q-pt-sm">

    <h5 style="margin-bottom:0.5em;">Assay</h5>
    <div class="text-body2 text-justify" style="padding-bottom:1em;">
      In the Assay menu you can adapt the metadata of one assay added to your ARC.
    </div>

    <q-card>

      <q-card-section>

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="biotech" />
          </q-item-section>
          <q-item-section>Assay</q-item-section>
        </q-item>

        <q-list class="q-gutter-xs">
          <q-item>
            <q-item-section>
              <a_input label='Identifier' v-model='{ _: "YourIdentifier" }._' readonly />
            </q-item-section>
            <q-item-section>
              The assay identifier is automatically added when adding the assay to your ARC and cannot be changed
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <a_input label='Studies' readonly-hidden />
            </q-item-section>
            <q-item-section>
              List or adapt the studies this assay is linked to
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <a_input label='Measurement Type' readonly-hidden />
            </q-item-section>
            <q-item-section>
              Add a measurement type for this assay
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <a_input label='Technology Type' readonly-hidden />
            </q-item-section>
            <q-item-section>
              Add a technology type for this assay
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <a_input label='Technology Platform' readonly-hidden />
            </q-item-section>
            <q-item-section>
              Add a technology platform for this assay
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div>
                <a_btn label="delete" icon='delete' color="red-9" />
              </div>
            </q-item-section>
            <q-item-section>
              Completely delete this assay from the ARC
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

      </q-card-section>

      <q-separator inset size="0.3em" />

      <q-card-section>

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="groups" />
          </q-item-section>
          <q-item-section>People</q-item-section>
        </q-item>

        <q-list class="q-gutter-xs">
          <q-item>
            <q-item-section>
              In the people section you can add authors and collaborators of the assay.
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

      </q-card-section>

      <q-separator inset size="0.3em" />

      <q-card-section>

        <q-item>
          <q-item-section avatar>
            <q-icon color="grey-8" name="menu_book" />
          </q-item-section>
          <q-item-section>
            Publications
          </q-item-section>
        </q-item>

        <q-list class="q-gutter-xs">
          <q-item>
            <q-item-section>
              In the publications section you can add publications to the assay.
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

      </q-card-section>

    </q-card>

  </div>
</template>
