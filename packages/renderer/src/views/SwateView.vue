<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';
import {ArcAssay, ArcStudy} from '@nfdi4plants/arctrl';
import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';

let iframe: any | HTMLElement = ref({})

enum Msg {
  Error,
  AssaySend,
  StudySend
}

interface Message {
  swate: boolean;
  api: string;
  data: any;
}

type MessageHandler = (data: any) => void;

interface SwateAPI {
  handleEvent: (e: MessageEvent) => void;
  [key: string]: MessageHandler;
}

const send = (msg: Msg, data: any = null): void => {
  const toSwate = (data: any): void => {
    const methodName = Msg[msg];
    const content: Message = {swate: true, api: methodName, data: data }
    iframe.value.contentWindow?.postMessage(content, '*');
  };
  switch (msg) {
    // case Msg.InitResponse:
    //   toSwate("Hello from ARCitect!");
    //   break;
    default:
      toSwate(data)
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
    if(!ArcControlService.props.arc || !AppProperties.active_assay) return;
    const assay = ArcControlService.props.arc.ISA.TryGetAssay(AppProperties.active_assay);
    if (!assay) return;
    send(Msg.AssaySend, assay)
  },
  AssayReceive: (assay:ArcAssay) => {
    ArcControlService.props.arc.ISA.SetAssay(assay.Identifier, assay)
  },
  StudyReceive: (study:ArcStudy) => {
    ArcControlService.props.arc.ISA.SetStudy(study.Identifier, study)
  },
  Error: (e) => {
    console.log(e)
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
    style="border: 0; overflow: hidden; margin-bottom: -1em"
    ref="iframe">
  </iframe>
</template>
