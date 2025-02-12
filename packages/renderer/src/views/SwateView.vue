
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, reactive } from 'vue';
import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';
import SwateControlService from '../SwateControlService.ts';
import { ArcInvestigation, ArcAssay, ArcStudy, JsonController } from '@nfdi4plants/arctrl';

import a_btn from '../components/a_btn.vue';

let iframe: any | HTMLElement = ref({})

const iProps = reactive({
  loading: false,
  showTimeout: false,
});

enum Msg {
  Error,
  AssayToSwate,
  StudyToSwate,
  InvestigationToSwate,
  PathsToSwate,
  PersonsToSwate
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
        const jsonString = JsonController.Investigation.toJsonString(data,0);
        toSwate({ ArcInvestigationJsonString: jsonString });
      } else return console.error('Invalid data type for Msg.InvestigationToSwate');
      break;
    case Msg.AssayToSwate:
      if (data instanceof ArcAssay) {
        const jsonString = JsonController.Assay.toJsonString(data,0);
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
      toSwate({ paths: data });
      break;
    case Msg.PersonsToSwate:
      toSwate({ persons: ArcControlService.props.arc.ISA.GetAllPersons() });
      break;
    default:
      toSwate(data);
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
      selection = await window.ipc.invoke("LocalFileSystemService.selectAnyDirectories")
    } else {
      selection = await window.ipc.invoke("LocalFileSystemService.selectAnyFiles")
    }
    if (selection === null || selection.length < 1) return;
    if (selection[0].startsWith(ArcControlService.props.arc_root)) {
      selection = selection.map((p: string) => p.replaceAll(ArcControlService.props.arc_root!, "."))
    }
    send(Msg.PathsToSwate, selection)
  },
  RequestPersons: () => send(Msg.PersonsToSwate),
  InvestigationToARCitect: (investigationJsonString: string) => {
    let nextInvestigation = JsonController.Investigation.fromJsonString(investigationJsonString);
    let oldInvestigation = ArcControlService.props.arc.ISA
    nextInvestigation.StaticHash = oldInvestigation.StaticHash;
    ArcControlService.props.arc.ISA = nextInvestigation;
    ArcControlService.saveARC({});
  },
  AssayToARCitect: (assayJsonString: string) => {
    let nextAssay = JsonController.Assay.fromJsonString(assayJsonString);
    let oldAssay = ArcControlService.props.arc.ISA.TryGetAssay(nextAssay.Identifier);
    if(oldAssay) {
      nextAssay.StaticHash = oldAssay.StaticHash;
    }
    ArcControlService.props.arc.ISA.SetAssay(nextAssay.Identifier, nextAssay);
    ArcControlService.saveARC({});
  },
  StudyToARCitect: (studyJsonString: string) => {
    let nextStudy = JsonController.Study.fromJsonString(studyJsonString);
    let oldStudy : ArcStudy | undefined = ArcControlService.props.arc.ISA.TryGetStudy(nextStudy.Identifier)
    if(oldStudy) {
      nextStudy.StaticHash = oldStudy.StaticHash;
    }
    ArcControlService.props.arc.ISA.SetStudy(nextStudy.Identifier, nextStudy);
    ArcControlService.saveARC({});
  },
  Error: (e) => {
    console.log('[Swate-Interop-Error]', e)
  }
}

const init = async ()=>{
  iProps.loading = true;
  iProps.showTimeout = false;
  setTimeout(()=>iProps.showTimeout=true,4000);

  if(!SwateControlService.props.object) return;
  iframe.value.setAttribute("src", `${AppProperties.config.swate_url}?is_swatehost=1&random=${SwateControlService.props.cacheNumber}`);
};

onMounted(() => {
  window.addEventListener("message", SwateAPI.handleEvent);
  watch(()=>SwateControlService.props.object, init);
  init();
});

onUnmounted(() => {
  window.removeEventListener("message", SwateAPI.handleEvent);
  SwateControlService.props.object = null;
});

const openStatusPage = ()=>{
  window.ipc.invoke(
    "InternetService.openExternalURL",
    "https://status.nfdi4plants.org/status/dataplant"
  );
}

</script>

<template>

  <Transition>
    <div v-show='iProps.loading' style='position:absolute;top:0;left:0;right:0;bottom:0;'>
      <q-linear-progress size="45px" indeterminate color="primary" class='justify-start'/>
      <div class="q-pa-md q-gutter-sm" v-if='iProps.showTimeout'>
        <q-banner class="bg-grey-3 text-black" rounded inline-actions>
          SWATE Service might be down
          <template v-slot:avatar>
            <q-icon name="sym_r_cloud_off" color="primary" />
          </template>
          <template v-slot:action>
            <a_btn label='Check' @click='openStatusPage'/>
          </template>
        </q-banner>
      </div>
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
