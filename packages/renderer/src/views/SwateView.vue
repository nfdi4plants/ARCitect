
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

      iProps.pendingRequests.set(requestId, { resolve, reject });
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
        const { resolve } = iProps.pendingRequests.get(requestId)!;
        iProps.pendingRequests.delete(requestId);
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
  
  export enum SwatePathsTargets {
    FilePicker = "filePicker",
    DataAnnotator = "dataAnnotator"
  }

  export interface RequestPathsPojo { 
    target: SwatePathsTargets, 
    dictionaries: boolean
  }

  export interface ResponsePathsPojo { 
    target: SwatePathsTargets, 
    paths: string []
  }
}

interface Props {
  loading: boolean;
  showTimeout: boolean;
  pendingRequests: PendingRequests;
}

const iProps: Props = reactive({
  loading: false,
  showTimeout: false,
  pendingRequests: new Map()
});

/// Update this to add more ARCitect initiated messages
type OutgoingMsg = {
  TestHello: { request: string; response: string };
  ResponsePaths: {request: InteropTypes.ResponsePathsPojo; response: boolean}
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
        } else {
          throw new Error('Invalid data type for SwateControlService');
        }
        break;
      case 1:
        let s = SwateControlService.props.object;
        if (s instanceof ArcStudy) {
          const jsonString = JsonController.Study.toJsonString(s,0);
          data = [InteropTypes.ArcFiles.Study, jsonString];
        } else {
          throw new Error('Invalid data type for SwateControlService');
        }
        break;
      case 2:
        let a = SwateControlService.props.object;
        if (a instanceof ArcAssay) {
          const jsonString = JsonController.Assay.toJsonString(a,0);
          data = [InteropTypes.ArcFiles.Assay, jsonString];
        } else {
          throw new Error('Invalid data type for SwateControlService');
        }
        break;
      default:
        throw new Error(`Unknown SwateControlService type: ${SwateControlService.props.type}`);
    }
    iProps.loading = false;
    if (!data) {
      throw new Error('Invalid data type for SwateControlService');
    }
    return data;
  },
  RequestPaths: async ({ target, dictionaries }: InteropTypes.RequestPathsPojo) => {
    selectPathsAndSend(target, dictionaries); // don't await this, as we want to return `true` asap
    return true; 
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

const testClick = async () => {
  let response = await sendMessageWithResponse("TestHello", "Kevin");
  console.log("[ARCitect]", response);
}

const selectPathsAndSend = async (target: InteropTypes.SwatePathsTargets, dictionaries: boolean) => {
  let selection: null | string[] = null;
  let options: Electron.OpenDialogOptions = {}
  options.defaultPath = ArcControlService.props.arc_root!;
  if (dictionaries) {
    selection = await window.ipc.invoke("LocalFileSystemService.selectAnyDirectories")
  } else {
    selection = await window.ipc.invoke("LocalFileSystemService.selectAnyFiles")
  }
  if (selection === null || selection.length < 1) return;
  if (ArcControlService.props.arc_root && selection[0].startsWith(ArcControlService.props.arc_root)) {
    selection = selection.map((p: string) => p.replaceAll(ArcControlService.props.arc_root!, "."))
  }
  let response = await sendMessageWithResponse("ResponsePaths", {target, paths: selection});
}

const init = async () => {
  // iProps.loading = true;
  iProps.showTimeout = false;
  setTimeout(()=>iProps.showTimeout=true,4000);

  if(!SwateControlService.props.object) return;
  iframe.value.setAttribute("src", `${AppProperties.config.swate_url}?is_swatehost=1&random=${SwateControlService.props.cacheNumber}`);
};

onMounted(() => {
  window.addEventListener("message", messageListener);
  watch(()=>SwateControlService.props.object, init);
  init();
});

onUnmounted(() => {
  window.removeEventListener("message", messageListener);
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
  <!-- <button @click="testClick">Test Click</button> -->
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
