<script setup>
import d_input from '../components/d_input.vue';
import d_btn from '../components/d_btn.vue';
import d_checkbox from '../components/d_checkbox.vue';
</script>

<template>
  <div class="q-py-sm">

    <h5 style="margin-bottom:0.5em;">
      <q-icon color="grey-8" name="verified" />
      Validation
    </h5>
    <q-card>
      <q-card-section>
        <q-item><div>
        Here you can choose, how your ARC shall be validated.
        The actual validation occurs in the DataHUB once you synchronize your ARC for the next time.
        Please check out the <a
          href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/DataHUB-Manual/cqc-pipelines/cqc-pipelines.html"
          target="_blank">DataPLANT knowledge base</a> for more information.
        </div></q-item>
      </q-card-section>

    </q-card>
    
    <q-separator inset />

    <q-card>
      <q-card-section>
        <q-item><div>
        By default every ARC is validated against the <a
          href="https://github.com/nfdi4plants/ARC-specification"
          target="_blank">"ARC specification"</a> to guarantee ARC intactness.
        </div>
      </q-item>                
      
        <q-item><div>
        Under "Custom Validation Packages" you can add or remove additional validation packages.
        For instance, if you want to publish your ARC and receive a DOI via the DataHUB, select and add the "invenio" validation. 
        Please check out the <a
          href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/DataHUB-Manual/datahub-data-publications.html"
          target="_blank">DataPLANT knowledge base</a> for more information about publishing your ARC.        
        </div>
      </q-item>    
    </q-card-section>
    </q-card>


  </div>
</template>
