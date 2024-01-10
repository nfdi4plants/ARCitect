<script lang="ts" setup>
import { BrowserView } from 'electron';
import { reactive, onMounted, watch, ref } from 'vue';

let iframe: any | HTMLElement = ref({})

enum Msg {
  InitResponse,
  Error
}

interface Message {
  swate: boolean;
  api: string;
  data: any;
}

type MessageHandler = (data: any) => void;

interface SwateAPI {
  handleEvent: (e: MessageEvent) => void;
  [key: string]: MessageHandler | ((msg: string) => void);
}

const send = (msg: Msg, data: any = null): void => {
  const toSwate = (data: any): void => {
    const methodName = Msg[msg];
    const content: Message = {swate: true, api: methodName, data: data }
    iframe.value.contentWindow?.postMessage(content, '*');
  };
  switch (msg) {
    case Msg.InitResponse:
      toSwate("Hello from ARCitect!");
      break;
    case Msg.Error:
      toSwate(data);
      break;
    // Add more cases as needed
  }
};

const SwateAPI : SwateAPI = {
  handleEvent: (e: MessageEvent) => {
    if (e.data.swate) {
      const apiHandler = SwateAPI[e.data.api];
      apiHandler(e.data.data);
    }
  },
  Init: (msg: string) => {
    console.log(msg)
    send(Msg.InitResponse)
  }
}

onMounted(() => {
  window.addEventListener ("message", SwateAPI.handleEvent);
  iframe.value.setAttribute("src","http://localhost:8080")
})

/* 
* This should be abstracted to a robust system for sending messages always in the same pattern 
*/
function initResponse() {
  iframe.value.contentWindow?.postMessage({swate: true, api: "InitResponse", data: "Hello from ARCitect"}, '*')
}

</script>

<template>
  <iframe 
    class='fit'
    style="border: 0; overflow: hidden;"
    ref="iframe">
  </iframe>
</template>
