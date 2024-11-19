import { reactive, nextTick } from 'vue'

import AppProperties from './AppProperties.ts';
import ArcControlService from './ArcControlService.ts';
import {ArcInvestigation, ArcAssay, ArcStudy} from "@nfdi4plants/arctrl";

interface Props {
  cacheNumber: number,
  object: null | ArcInvestigation | ArcAssay | ArcStudy,
  type: number,
}

const init : Props = {
  cacheNumber: Math.random()*1000,
  object: null,
  type: 0,
}

const SwateControlService = {

  props: reactive(init),
  /**
   * This function manages all state changes required to load Swate
   * @param type object type: 0 investigation, 1 study, 2 assay
   * @param identifier object identifier
   */
  LoadSwateState: async (type: number, identifier: string) => {
    SwateControlService.props.object = null;
    AppProperties.state = AppProperties.STATES.EDIT_SWATE;
    await nextTick();

    const methods = [null,'TryGetStudy','TryGetAssay'];
    SwateControlService.props.type = type;
    if(type===0){
      SwateControlService.props.object = ArcControlService.props.arc.ISA;
    } else {
      SwateControlService.props.object = ArcControlService.props.arc.ISA[methods[type]](identifier);
    }
  }
}

export default SwateControlService;
