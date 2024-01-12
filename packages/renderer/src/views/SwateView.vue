<script lang="ts" setup>
import { reactive, onMounted, watch, ref } from 'vue';
import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';
import { ArcAssay, ArcStudy } from '@nfdi4plants/arctrl';
import { ArcAssay_fromJsonString, ArcAssay_toJsonString } from '@nfdi4plants/arctrl/ISA/ISA.Json/ArcTypes/ArcAssay.js'
import { ArcStudy_fromJsonString, ArcStudy_toJsonString } from '@nfdi4plants/arctrl/ISA/ISA.Json/ArcTypes/ArcStudy.js'

let iframe: any | HTMLElement = ref({})

enum Msg {
  Error,
  AssayToSwate,
  StudyToSwate
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
    const content: Message = { swate: true, api: methodName, data: data }
    iframe.value.contentWindow?.postMessage(content, '*');
  };
  switch (msg) {
    case Msg.AssayToSwate:
      if (data instanceof ArcAssay) {
        const jsonString = ArcAssay_toJsonString(data);
        toSwate({ ArcAssayJsonString: jsonString });
      } else {
        console.error('Invalid data type for Msg.AssayToSwate');
        return;
      }
      break;
    case Msg.StudyToSwate:
      if (data instanceof ArcStudy) {
        const jsonString = ArcStudy_toJsonString(data);
        toSwate({ ArcStudyJsonString: jsonString });
      } else {
        console.error('Invalid data type for Msg.AssayToSwate');
        return;
      }
      break;
    default:
      toSwate(data)
      break;
    // Add more cases as needed
  }
};

const SwateAPI: SwateAPI = {
  handleEvent: (e: MessageEvent) => {
    if (e.data.swate) {
      const apiHandler = SwateAPI[e.data.api];
      apiHandler(e.data.data);
    }
  },
  Init: (msg: string) => {
    console.log(msg);
    if (!ArcControlService.props.arc || !AppProperties.active_assay) return;
    const assay = ArcControlService.props.arc.ISA.TryGetAssay(AppProperties.active_assay);
    if (!assay) return;
    send(Msg.AssayToSwate, assay)
  },
  AssayToARCitect: (assayJsonString: string) => {
    let assay = ArcAssay_fromJsonString(assayJsonString);
    ArcControlService.props.arc.ISA.SetAssay(assay.Identifier, assay);
  },
  StudyToARCitect: (studyJsonString: string) => {
    let study = ArcStudy_fromJsonString(studyJsonString);
    ArcControlService.props.arc.ISA.SetStudy(study.Identifier, study);
  },
  Error: (e) => {
    console.log(e)
  }
}

onMounted(() => {
  window.addEventListener("message", SwateAPI.handleEvent);
  iframe.value.setAttribute("src", "http://localhost:8080/?is_swatehost=1")
})

</script>

<template>
  <iframe class='fit' style="border: 0; overflow: hidden; margin-bottom: -1em" ref="iframe">
  </iframe>
</template>
