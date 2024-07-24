<template>
  <div class="q-pt-sm">

    <h5 style="margin-bottom:0.5em;">
      <q-icon color="grey-8" name="cloud_download" />
      Download ARC
    </h5>

    <div class="text-body2 text-justify" style="padding-bottom:1em;">
      Here you can download ARCs from the <a href="https://git.nfdi4plants.org/" target="_blank">DataHUB</a>.
    </div>
    <q-card>
      <q-item>
          <div>
            With the LFS checkbox you can select whether or not download large files. Read more about <a
              href="https://nfdi4plants.org/nfdi4plants.knowledgebase/docs/guides/arc_WorkingWithLargeDataFiles.html"
              target="_blank">large file storage (LFS)</a> in the DataPLANT knowledgebase.
          </div>
      </q-item>
    </q-card>
    
    <q-separator/>
    
    <q-card>
      <q-item>
          <div>
            If you are logged in, the list of ARCs will include public and private ARCs that you can access. 
          </div>
      </q-item>
    </q-card>
  </div>
</template>
