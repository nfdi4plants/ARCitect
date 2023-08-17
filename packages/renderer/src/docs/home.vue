<script lang="ts" setup>


import imageURL from '../../assets/ARCitect-help.drawio.svg';

</script>

<style>

  .help {
    font-size:1.2em;
  }

  h5 {
    margin: 2em 0 0.5em 0;
    font-weight:bold !important;
  }
  ol {
    margin: -0.8em 0 2em 0;
    padding: 0 0 0 2em;
  }
  ol li {
    margin: 0;
    padding:0;
  }
  ol li::marker {
    font-weight: bold;
  }

</style>

<template>
  <div class='help'>
    <h5>Help</h5>
    <p>If you want to create, edit, or extend an ARC, this is the tool to use.</p>

    <img :src="imageURL" style="box-sizing:border-box;width:100%;padding:0em;border:0.1em solid #ccc;"/>

    <p>Use the sidebar to:</p>
    <ol>
      <li>Login to the DataHUB</li>
      <li>Create a New ARC on your local computer</li>
      <li>Open an existing ARC on your computer</li>
      <li>Download an ARC from the DataHUB</li>
      <li>Reset your ARC, if you are unsure about your changes</li>
      <li>Save the current version of your ARC and synchronize it to the DataHUB</li>
      <li>Toggle the help menu</li>
    </ol>

    <p>Once opened, it is possible to navigate through your ARC much like a file browser:</p>
    <ol type='a'>
      <li>Find the name of your ARC</li>
      <li>Find the ARC's assays</li>
      <li>Find the ARC's studies</li>
      <li>Add a dataset to an existing assay</li>
      <li>Add a protocol to an existing assay</li>
      <li>Add a new assay</li>
      <li>Add a protocol to an existing study</li>
      <li>Add a new study.</li>
    </ol>
  </div>

</template>
