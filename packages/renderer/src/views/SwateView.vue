<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';

</script>

<template>
  <webview
    class='fit'
    src="https://www.w3schools.com"
    disablewebsecurity
  ></webview>
</template>
