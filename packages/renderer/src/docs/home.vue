<script lang="ts" setup>

import imageURL from '../../assets/Home-Help.png';

</script>

<style>
  h5 {
    margin: 2em 0 0.5em 0;
    font-weight:bold !important;
  }
  ul {
    margin: -0.8em 0 2em 0;
    padding: 0 0 0 2em;
  }
  ul li {
    margin: 0;
    padding:0;
  }
</style>

<template>

  <h5>Help</h5>
  <p>If you want to create, edit, or extend an ARC, this is the tool to use.</p>

  <img :src="imageURL" style="box-sizing:border-box;width:100%;padding:0em;border:0.1em solid #ccc;"/>

  <p>The ARCitect offers the following ways to open an ARC:</p>
  <ul>
    <li><b>New ARC (1): </b>Create a brand new ARC on your local computer.</li>
    <li><b>Open ARC (2): </b>Open an ARC on your computer.</li>
    <li><b>Download ARC (3): </b>Browse and import an ARC from the DataHUB.</li>
  </ul>

  <p>Once opened, it is possible to navigate through your ARC much like a file browser and perform the following functions:</p>
  <ul>
    <li><b>Add Items (4): </b>Create new items.</li>
    <li><b>Adjust Information (5): </b>Add context to your research.</li>
    <li><b>Add Content (6): </b>Upload existing datasets or write down protocols.</li>
  </ul>

  <p>After completing the adjustments, the following options are available:</p>
  <ul>
    <li><b>Login (7): </b>Log into your DataPLANT account and you will be able to view your private ARCs, commit changes and upload them.</li>
    <li><b>Reset ARC (8): </b>If you are unsure about your changes, reset the ARC.</li>
    <li><b>Synchronize ARC (9): </b>Commit your changes indicating them and synchronize your ARC, allowing your colleagues or yourself to follow the process.</li>
  </ul>

</template>
