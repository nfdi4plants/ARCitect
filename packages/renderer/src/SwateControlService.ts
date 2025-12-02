import { reactive, nextTick } from 'vue'

import AppProperties from './AppProperties.ts';
import ArcControlService from './ArcControlService.ts';
import {ArcInvestigation, ArcAssay, ArcStudy, ArcRun, ArcWorkflow, DataMap, ARC} from "@nfdi4plants/arctrl";

const parents = ["Assay", "Study", "Run", "Workflow"] as const;

export type Parent = typeof parents[number];

export enum Type {
  ArcInvestigation = 0,
  ArcStudy = 1,
  ArcAssay = 2,
  ArcRun = 3,
  ArcWorkflow = 4,
  Datamap = 5,
}

export interface DatamapParentInfo {
  Parent: Parent,
  ParentId: string,
}
interface Props {
  cacheNumber: number,
  object: null | ArcInvestigation | ArcAssay | ArcStudy | ArcRun | ArcWorkflow | DataMap,
  datamapParent?: Parent,
  identifier?: string,
  type: Type,
}

const init : Props = {
  cacheNumber: Math.random()*1000,
  object: null,
  type: 0,
}

export function getDatamapParentByInfo(arc: ARC, identifier: string, datamapParent: Parent): ArcAssay | ArcStudy | ArcRun | ArcWorkflow | null {

    let parentObject: ArcAssay | ArcStudy | ArcRun | ArcWorkflow | null = null;
    switch (datamapParent) {
        case "Assay":
          parentObject = arc.TryGetAssay(identifier) as ArcAssay | null;
          break;
        case "Study":
          parentObject = arc.TryGetStudy(identifier) as ArcStudy | null;
          break;
        case "Run":
          parentObject = arc.TryGetRun(identifier) as ArcRun | null;
          break;
        case "Workflow":
          parentObject = arc.TryGetWorkflow(identifier) as ArcWorkflow | null;
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
  LoadSwateState: async (type: number, identifier?: string, datamapParent?: Parent) => {
    AppProperties.state = AppProperties.STATES.EDIT_SWATE;
    await nextTick();
    SwateControlService.props.identifier = undefined;
    SwateControlService.props.datamapParent = undefined;
    SwateControlService.props.type = type;
    if(type===Type.ArcInvestigation){
      SwateControlService.props.object = ArcControlService.props.arc;
    } else {
      if (!identifier) throw new Error("Identifier is required for loading non-investigation Swate objects.");
      if (!ArcControlService.props.arc) throw new Error("ARC object is not loaded in ArcControlService.");
      if (type===Type.Datamap) {
        if (!datamapParent) throw new Error("Datamap parent type is required for loading datamap Swate objects.");
        const parentObject: ArcAssay | ArcStudy | ArcRun | ArcWorkflow | null = getDatamapParentByInfo(ArcControlService.props.arc, identifier, datamapParent)
        if (!parentObject?.Identifier) throw new Error(`Parent object of type ${datamapParent} with ID ${identifier} not found in ARC.`);
        const datamap = parentObject?.DataMap
        if (!datamap) throw new Error(`Datamap for parent object of type ${datamapParent} with ID ${identifier} not found.`);
        SwateControlService.props.object = datamap;
        SwateControlService.props.identifier = identifier;
        SwateControlService.props.datamapParent = datamapParent;
      } 
      else {
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
        SwateControlService.props.identifier = identifier;
        SwateControlService.props.datamapParent = undefined;
      }
    } 
  }
}

export default SwateControlService;
