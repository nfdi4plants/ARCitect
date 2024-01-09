<script lang="ts" setup>
import { BrowserView } from 'electron';
import { reactive, onMounted, watch, ref } from 'vue';

let iframe: any | HTMLElement = ref({})

const SwateAPI = {
  handleEvent: (e: MessageEvent) => {
    if (e.data.swate) {
      SwateAPI[e.data.api](e.data.data);
    }
  },
  init: () => {
    console.log("swate/init")
    iframe?.contentWindow?.postMessage({swate: true, api: "init", data: {name: "Kevin"}}, '*')
  }
}

onMounted(() => {
  window.addEventListener ("message", SwateAPI.handleEvent);
  iframe.value.setAttribute("src","http://localhost:8080")
})

</script>

<template>
  <iframe 
    class='fit'
    style="border: 0; overflow: hidden;"
    ref="iframe">
  </iframe>
</template>
