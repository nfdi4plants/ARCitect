import { reactive, nextTick } from 'vue'

import AppProperties from './AppProperties.ts';
import ArcControlService from './ArcControlService.ts';
import {ArcInvestigation, ArcAssay, ArcStudy, ArcRun, ArcWorkflow, DataMap, ARC} from "@nfdi4plants/arctrl";

const parents = ["Assay", "Study", "Run", "Workflow"] as const;

export type Parent = typeof parents[number];
export interface DatamapParentInfo {
  Parent: Parent,
  ParentId: string
}

export enum Type {
  ArcInvestigation = 0,
  ArcStudy = 1,
  ArcAssay = 2,
  ArcRun = 3,
  ArcWorkflow = 4,
  Datamap = 5,
}
interface Props {
  cacheNumber: number,
  object: null | ArcInvestigation | ArcAssay | ArcStudy | ArcRun | ArcWorkflow | DataMap,
  datamapParentInfo?: DatamapParentInfo,
  type: Type,
}

const init : Props = {
  cacheNumber: Math.random()*1000,
  object: null,
  type: 0,
}

export function getDatamapParentByInfo(arc: ARC, info: DatamapParentInfo): ArcAssay | ArcStudy | ArcRun | ArcWorkflow | null {

    let parentObject: ArcAssay | ArcStudy | ArcRun | ArcWorkflow | null = null;
    switch (info.Parent) {
        case "Assay":
          parentObject = arc.TryGetAssay(info.ParentId) as ArcAssay | null;
          break;
        case "Study":
          parentObject = arc.TryGetStudy(info.ParentId) as ArcStudy | null;
          break;
        case "Run":
          parentObject = arc.TryGetRun(info.ParentId) as ArcRun | null;
          break;
        case "Workflow":
          parentObject = arc.TryGetWorkflow(info.ParentId) as ArcWorkflow | null;
          break;
    }
    return parentObject
}

const SwateControlService = {

  props: reactive(init),
  /**
   * This function manages all state changes required to load Swate
   * @param type object type: 0 investigation, 1 study, 2 assay
   * @param identifier object identifier
   */
  LoadSwateState: async (type: number, identifier?: string | DatamapParentInfo) => {
    AppProperties.state = AppProperties.STATES.EDIT_SWATE;
    await nextTick();
    SwateControlService.props.datamapParentInfo = undefined;
    SwateControlService.props.type = type;
    if(type===Type.ArcInvestigation){
      SwateControlService.props.object = ArcControlService.props.arc;
    } else if (type===Type.Datamap) {
      if (!identifier || typeof identifier === 'string') throw new Error("Datamap loading requires DatamapParentInfo as identifier.");
      if (!ArcControlService.props.arc) throw new Error("ARC object is not loaded in ArcControlService.");
      const parentObject: ArcAssay | ArcStudy | ArcRun | ArcWorkflow | null = getDatamapParentByInfo(ArcControlService.props.arc, identifier)
      if (!parentObject?.Identifier) throw new Error(`Parent object of type ${identifier.Parent} with ID ${identifier.ParentId} not found in ARC.`);
      const datamap = parentObject?.DataMap
      if (!datamap) throw new Error(`Datamap for parent object of type ${identifier.Parent} with ID ${identifier.ParentId} not found.`);
      SwateControlService.props.object = datamap;
      SwateControlService.props.datamapParentInfo = identifier;
    } 
    else {
      if (!identifier) throw new Error("Identifier is required for loading non-investigation Swate objects.");
      if (typeof identifier !== 'string') throw new Error("Identifier must be a string for non-datamap Swate objects.");
      if (!ArcControlService.props.arc) throw new Error("ARC object is not loaded in ArcControlService.");
      if (type === Type.ArcInvestigation || type === Type.Datamap)
          throw new Error("Invalid type provided to LoadSwateState.");
      let nextObj: ArcStudy | ArcAssay | ArcRun | ArcWorkflow | null = null;
      switch (type) {
        case Type.ArcStudy:
          nextObj = ArcControlService.props.arc.TryGetStudy(identifier) as ArcStudy | null;
          break;
        case Type.ArcAssay:
          nextObj = ArcControlService.props.arc.TryGetAssay(identifier) as ArcAssay | null;
          break;
        case Type.ArcRun:
          nextObj = ArcControlService.props.arc.TryGetRun(identifier) as ArcRun | null;
          break;
        case Type.ArcWorkflow:
          nextObj = ArcControlService.props.arc.TryGetWorkflow(identifier) as ArcWorkflow | null;
          break;
      }
      if (!nextObj) throw new Error(`Object of type ${Type[type]} with ID ${identifier} not found in ARC.`);
      SwateControlService.props.object = nextObj;
    }
  }
}

export default SwateControlService;
