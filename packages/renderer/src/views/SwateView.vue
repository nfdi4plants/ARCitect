<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, reactive } from 'vue';
import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';
import SwateControlService from '../SwateControlService.ts';
import { ArcInvestigation, ArcAssay, ArcStudy, JsonController } from '@nfdi4plants/arctrl';

let iframe: any | HTMLElement = ref({})

const iProps = reactive({
  loading: false
});

enum Msg {
  Error,
  AssayToSwate,
  StudyToSwate,
  InvestigationToSwate,
  PathsToSwate
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
    case Msg.InvestigationToSwate:
      if (data instanceof ArcInvestigation) {
        const jsonString = JsonController.Investigation.toJsonString(data,0)
        toSwate({ ArcInvestigationJsonString: jsonString });
      } else return console.error('Invalid data type for Msg.InvestigationToSwate');
      break;
    case Msg.AssayToSwate:
      if (data instanceof ArcAssay) {
        const jsonString = JsonController.Assay.toJsonString(data,0)
        toSwate({ ArcAssayJsonString: jsonString });
      } else return console.error('Invalid data type for Msg.AssayToSwate');
      break;
    case Msg.StudyToSwate:
      if (data instanceof ArcStudy) {
        const jsonString = JsonController.Study.toJsonString(data,0);
        toSwate({ ArcStudyJsonString: jsonString });
      } else return console.error('Invalid data type for Msg.AssayToSwate');
      break;
    case Msg.PathsToSwate:
      let paths: [string] = data
      toSwate({ paths: paths });
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
    switch(SwateControlService.props.type){
      case 0: send(Msg.InvestigationToSwate, SwateControlService.props.object); break;
      case 1: send(Msg.StudyToSwate, SwateControlService.props.object); break;
      case 2: send(Msg.AssayToSwate, SwateControlService.props.object); break;
    }
    iProps.loading = false;
  },
  RequestPaths: async (selectDirectories: boolean) => {
    let selection = null;
    let options: Electron.OpenDialogOptions = {}
    options.defaultPath = ArcControlService.props.arc_root!;
    if (selectDirectories) {
      selection = await window.ipc.invoke("LocalFileSystemService.selectAnyFolders") 
    } else {
      selection = await window.ipc.invoke("LocalFileSystemService.selectAnyFiles")
    }
    if (selection === null || selection.length < 1) return;
    if (selection[0].startsWith(ArcControlService.props.arc_root)) {
      selection = selection.map((p: string) => p.replaceAll(ArcControlService.props.arc_root!, "."))
    }
    send(Msg.PathsToSwate, selection)
  },
  InvestigationToARCitect: (investigationJsonString: string) => {
    let investigation = JsonController.Investigation.fromJsonString(investigationJsonString);
    ArcControlService.props.arc.ISA = investigation;
  },
  AssayToARCitect: (assayJsonString: string) => {
    let assay = JsonController.Assay.fromJsonString(assayJsonString);
    ArcControlService.props.arc.ISA.SetAssay(assay.Identifier, assay);
  },
  StudyToARCitect: (studyJsonString: string) => {
    /// ignore assays, I am actually not sure why this must be create, but it will be empty. Must talk to Lukas Weil about this.
    /// ~Kevin F. 12.01.2024
    let study = JsonController.Study.fromJsonString(studyJsonString);
    ArcControlService.props.arc.ISA.SetStudy(study.Identifier, study);
  },
  Error: (e) => {
    console.log('[Swate-Interop-Error]', e)
  }
}

const init = async ()=>{
  console.log('init');
  iProps.loading = true;
  iframe.value.setAttribute("src", "https://swate-alpha.nfdi4plants.org?is_swatehost=1&random="+SwateControlService.props.cacheNumber);
  // iframe.value.setAttribute("src", "https://localhost:3000?is_swatehost=1&random="+SwateControlService.props.cacheNumber);
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

  <Transition>
    <div>
      <q-linear-progress size="45px" indeterminate color="primary" class='justify-start' v-show='iProps.loading'/>
    </div>
  </Transition>
  <iframe
    class='fit'
    style="border: 0; overflow: hidden; margin-bottom: -1em"
    ref="iframe"
    v-show='!iProps.loading'
    allow='clipboard-read;clipboard-write;'
  >
  </iframe>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
