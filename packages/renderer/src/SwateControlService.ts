import { reactive } from 'vue'

import AppProperties from './AppProperties.ts';
import ArcControlService from './ArcControlService.ts';

const SwateControlService = {

  props: reactive({
    cacheNumber: Math.random()*1000,
    object: null,
    type: 0,
  }),
  /**
   * This function manages all state changes required to load Swate
   * @param type object type: 0 investigation, 1 study, 2 assay
   * @param identifier object identifier
   */
  LoadSwateState: (type: number, identifier: string) => {
    const methods = [null,'TryGetStudy','TryGetAssay'];
    SwateControlService.props.type = type;
    if(type===0){
      SwateControlService.props.object = ArcControlService.props.arc.ISA;
    } else {
      SwateControlService.props.object = ArcControlService.props.arc.ISA[methods[type]](identifier);
    }
    AppProperties.state = AppProperties.STATES.EDIT_SWATE;
  }
}

export default SwateControlService;
