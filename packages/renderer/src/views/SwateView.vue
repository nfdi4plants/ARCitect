<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';
import SwateControlService from '../SwateControlService.ts';
import { ArcAssay, ArcStudy } from '@nfdi4plants/arctrl';
import { ArcAssay_fromArcJsonString, ArcAssay_toArcJsonString } from '@nfdi4plants/arctrl/ISA/ISA.Json/ArcTypes/ArcAssay.js'
import { ArcStudy_fromArcJsonString, ArcStudy_toArcJsonString } from '@nfdi4plants/arctrl/ISA/ISA.Json/ArcTypes/ArcStudy.js'

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
        const jsonString = ArcAssay_toArcJsonString(data);
        toSwate({ ArcAssayJsonString: jsonString });
      } else {
        console.error('Invalid data type for Msg.AssayToSwate');
        return;
      }
      break;
    case Msg.StudyToSwate:
      if (data instanceof ArcStudy) {
        const jsonString = ArcStudy_toArcJsonString(data);
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
    switch(SwateControlService.props.type){
      case 0: return send(Msg.AssayToSwate, SwateControlService.props.object);
      case 1: return send(Msg.StudyToSwate, SwateControlService.props.object);
    }
  },
  AssayToARCitect: (assayJsonString: string) => {
    let assay = ArcAssay_fromArcJsonString(assayJsonString);
    ArcControlService.props.arc.ISA.SetAssay(assay.Identifier, assay);
  },
  StudyToARCitect: (studyJsonString: string) => {
    /// ignore assays, I am actually not sure why this must be create, but it will be empty. Must talk to Lukas Weil about this.
    /// ~Kevin F. 12.01.2024
    let study = ArcStudy_fromArcJsonString(studyJsonString);
    ArcControlService.props.arc.ISA.SetStudy(study.Identifier, study);
  },
  TriggerSwateClose: () => {
    AppProperties.state=SwateControlService.props.HOME
    SwateControlService.Reset()
  },
  Error: (e) => {
    console.log(e)
  }
}

const init = async ()=>{
  iframe.value.setAttribute("src", "https://swate-alpha.nfdi4plants.org?is_swatehost=1");
};

onMounted(() => {
  window.addEventListener("message", SwateAPI.handleEvent);
  watch(()=>SwateControlService.props.object, init);
  init();
});

onUnmounted(() => {
  window.removeEventListener("message", SwateAPI.handleEvent)
});

</script>

<template>
  <iframe class='fit' style="border: 0; overflow: hidden; margin-bottom: -1em" ref="iframe">
  </iframe>
</template>
