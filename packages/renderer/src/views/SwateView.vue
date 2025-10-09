<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, reactive } from 'vue';
import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';
import SwateControlService from '../SwateControlService.ts';
// @ts-ignore
import { ArcInvestigation, ArcAssay, ArcStudy, JsonController, type Person } from '@nfdi4plants/arctrl';
// @ts-ignore
import { ARCtrl_Person__Person_toJsonString_71136F3F as personToJson } from '@nfdi4plants/arctrl/JsonIO/Person.js'

import a_btn from '../components/a_btn.vue';
import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';

import { useQuasar } from 'quasar'
const $q = useQuasar();

let iframe: any | HTMLElement = ref({})

type PendingRequests = Map<string, { resolve: (data: any) => void; reject: (error: any) => void }>;

type MessagePayload<T = any> = {
  swate: boolean;
  requestId: string;
  /// Only send api when starting a request, together with requestId in PendingRequests this is used to determine if a response is expected
  api?: string;
  data?: T;
  error?: string;
};

function sendMessageWithResponse<T extends keyof OutgoingMsg>(
    msg: T,
    data: OutgoingMsg[T]["request"]
): Promise<OutgoingMsg[T]["response"]> {
    return new Promise((resolve, reject) => {
      const requestId = crypto.randomUUID(); // Unique ID
      const timeout = setTimeout(() => {
          iProps.pendingRequests.delete(requestId);
          reject(new Error("Response timed out"));
      }, 5000); // Timeout after 5s

      iProps.pendingRequests.set(requestId, { timeout, resolve, reject });
      const content: MessagePayload = { swate: true, api: msg, data, requestId };
      iframe.value.contentWindow?.postMessage(content, '*');
    });
}

function messageListener(event: MessageEvent) {
    if (!event.data.swate) return; // Validate origin

    const { requestId, api, data, error } : MessagePayload = event.data || {};
    if (error) {
      console.error("ARCitect encountered error in Swate interop:", error);
      return;
    }

    // Handle response to a previous request
    if (requestId && iProps.pendingRequests.has(requestId) && !api) {
        const { timeout, resolve } = iProps.pendingRequests.get(requestId)!;
        iProps.pendingRequests.delete(requestId);
        clearTimeout(timeout);
        resolve(data);
        return;
    }

    // Handle incoming requests
    if (api) {
        handleRequest(api, requestId, data);
    }
}

/// Handle incoming requests
/// Incoming requests from swate will wrap all data always inside of an array
async function handleRequest(api: string, requestId: string, data: any) {
    let response;
    try {
      if (!(api in IncomingMsgHandlers)) {
        throw new Error(`ARCitect unknown request from Swate: ${api}`);
      }
      // Call the correct handler dynamically
      console.log(`[ARCitect] Handling request: ${api}`);
      let handler = IncomingMsgHandlers[api];
      response = { data: await handler(data) }

    } catch (error: any) {
      response = { error: error.message };
    }

    const newMessage: MessagePayload = { swate: true, requestId, ...response };
    if (requestId) {
      iframe.value.contentWindow?.postMessage(newMessage, "*");
    }
}

namespace InteropTypes {

  export enum ArcFiles {
    Assay = "assay",
    Study = "study",
    Investigation = "investigation",
    Template = "template",
  }

  export interface ARCitectFileInfo {
    name: string,
    size: number,
    mimetype: string,
    content: string
  }
}

interface Props {
  pendingRequests: PendingRequests;
  swateReady: Boolean;
  swateObjectListener: () => void;
  swateUrlListener: () => void;
}

const iProps: Props = reactive({
  pendingRequests: new Map(),
  swateReady: false,
  swateObjectListener: ()=>{},
  swateUrlListener: ()=>{}
});

/// Update this to add more ARCitect initiated messages
type OutgoingMsg = {
  TestHello: { request: string; response: string },
  ResponsePaths: {request: string[]; response: boolean},
  ResponseFile: {request: InteropTypes.ARCitectFileInfo; response: boolean},
  SetARCFile: {request: InteropTypes.ArcFiles; response: boolean}
};

/// Update this to add more Swate initiated messages
/// Incoming parameters are packed inside array
const IncomingMsgHandlers: Record<string, (data: any) => Promise<any>> = {
  TestHello: async (data: string) => {
    return `Hello, ${data}!`;
  },
  Save: async ([type, json]: [InteropTypes.ArcFiles, string]) => {
    switch (type) {
      case InteropTypes.ArcFiles.Assay:
        let nextAssay = JsonController.Assay.fromJsonString(json);
        let oldAssay = ArcControlService.props.arc.ISA.TryGetAssay(nextAssay.Identifier);
        if(oldAssay) {
          nextAssay.StaticHash = oldAssay.StaticHash;
        }
        ArcControlService.props.arc.ISA.SetAssay(nextAssay.Identifier, nextAssay);
        break;
      case InteropTypes.ArcFiles.Study:
        let nextStudy = JsonController.Study.fromJsonString(json);
        let oldStudy : ArcStudy | undefined = ArcControlService.props.arc.ISA.TryGetStudy(nextStudy.Identifier)
        if(oldStudy) {
          nextStudy.StaticHash = oldStudy.StaticHash;
        }
        ArcControlService.props.arc.ISA.SetStudy(nextStudy.Identifier, nextStudy);
        break;
      case InteropTypes.ArcFiles.Investigation:
        let nextInvestigation = JsonController.Investigation.fromJsonString(json);
        let oldInvestigation = ArcControlService.props.arc.ISA
        nextInvestigation.StaticHash = oldInvestigation.StaticHash;
        nextInvestigation.Assays = oldInvestigation.Assays;
        nextInvestigation.Studies = oldInvestigation.Studies;
        ArcControlService.props.arc.ISA = nextInvestigation;
        break;
      case InteropTypes.ArcFiles.Template:
        // Handle template
        new Error(`Template support not implemented: ${type}`);
        break;
      default:
        throw new Error(`Unknown ARCitect file type: ${type}`);
    }
    ArcControlService.saveARC({});
    return;
  },
  Init: async ([]) => {
    iProps.swateReady = true;
    return null;
  },
  RequestPaths: async (selectDictionaries: boolean) => {
    selectPathsAndSend(selectDictionaries); // don't await this, as we want to return `true` asap
    return true;
  },
  RequestFile: async () => {
    selectFileAndSend(); // don't await this, as we want to return `true` asap
    return true
  },
  RequestPersons: async ([]) => {
    const persons: Person[] = ArcControlService.props.arc.ISA.GetAllPersons();
    const personStrings: string[] =
      persons.map((p: Person) =>
        personToJson(p,0)
      );
    return personStrings;
  }
} as const;

const selectFileAndSend = async () => {
  let file: undefined | InteropTypes.ARCitectFileInfo;
  file = await window.ipc.invoke("LocalFileSystemService.selectAndReadFile")
  if (!file) return;
  if(!file.name.startsWith(ArcControlService.props.arc_root)) {
    $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        title: 'Error',
        msg: 'Selected files must be located inside opened ARC.'
      }
    });
    return;
  }
  file.name = file.name.replaceAll(ArcControlService.props.arc_root!, ".")
  let response = await sendMessageWithResponse("ResponseFile", file);
}

const selectPathsAndSend = async (selectDictionaries: boolean) => {
  let selection: null | string[] = null;
  let options: Electron.OpenDialogOptions = {}
  options.defaultPath = ArcControlService.props.arc_root!;
  if (selectDictionaries) {
    selection = await window.ipc.invoke("LocalFileSystemService.selectAnyDirectories")
  } else {
    selection = await window.ipc.invoke("LocalFileSystemService.selectAnyFiles")
  }
  if (selection === null || selection.length < 1) return;
  if (ArcControlService.props.arc_root && selection[0].startsWith(ArcControlService.props.arc_root)) {
    selection = selection.map((p: string) => p.replaceAll(ArcControlService.props.arc_root!, "."))
  }
  let response = await sendMessageWithResponse("ResponsePaths", selection);
}

const serializeArcFile = ()=>{
  let data: [InteropTypes.ArcFiles, string] | undefined;
  switch(SwateControlService.props.type){
    case 0:
      let i = SwateControlService.props.object;
      if (i instanceof ArcInvestigation) {
        // rmv assays and studies. Not displayed in Swate.
        const iCopy: ArcInvestigation =
          new ArcInvestigation(
            i.Identifier,
            i.Title,
            i.Description,
            i.SubmissionDate,
            i.PublicReleaseDate,
            i.OntologySourceReferences,
            i.Publications,
            i.Contacts,
            null,
            null,
            null,
            i.Comments
        );
        const jsonString = JsonController.Investigation.toJsonString(iCopy,0);
        data = [InteropTypes.ArcFiles.Investigation, jsonString];
      }
      break;
    case 1:
      let s = SwateControlService.props.object;
      if (s instanceof ArcStudy) {
        const jsonString = JsonController.Study.toJsonString(s,0);
        data = [InteropTypes.ArcFiles.Study, jsonString];
      }
      break;
    case 2:
      let a = SwateControlService.props.object;
      if (a instanceof ArcAssay) {
        const jsonString = JsonController.Assay.toJsonString(a,0);
        data = [InteropTypes.ArcFiles.Assay, jsonString];
      }
  }
  return data;
};

const sendArcFile = async () => {
  if(!iProps.swateReady) return;
  await sendMessageWithResponse("SetARCFile", serializeArcFile());
};

onMounted(() => {
  window.addEventListener("message", messageListener);
  iProps.swateObjectListener = watch(()=>SwateControlService.props.object, sendArcFile);
  iProps.swateUrlListener = watch(()=>AppProperties.config.swate_url, async (newUrl)=>{
    if(!iframe.value) return;
    console.log("Setting new url")
    iProps.swateReady = false;
    iframe.value.setAttribute("src", `${newUrl}/?is_swatehost=1&random=${SwateControlService.props.cacheNumber}`);
    let swateRdyWatcher = watch(() => iProps.swateReady, (newVal)=> {
      if(newVal) {
        swateRdyWatcher(); // unwatch
        sendArcFile();
      }
    });
  });
  iframe.value.setAttribute("src", `${AppProperties.config.swate_url}/?is_swatehost=1&random=${SwateControlService.props.cacheNumber}`);
});

onUnmounted(() => {
  iProps.swateObjectListener();
  iProps.swateUrlListener();
  window.removeEventListener("message", messageListener);
  SwateControlService.props.object = null;
});

</script>

<template>
  <!-- <button @click="testClick">Test Click</button> -->
  <iframe
    class='fit'
    style="border: 0; overflow: hidden; margin-bottom: -1em"
    ref="iframe"
    allow='clipboard-read;clipboard-write;'
  >
  </iframe>
</template>

<style>
</style>
