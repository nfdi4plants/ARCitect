import { reactive } from 'vue'

import AppProperties from './AppProperties.ts';
import ArcControlService from './ArcControlService.ts';

const SwateControlService = {

  props: reactive({
    object: null,
    type: 0,
  }),
  /**
   * This function manages all state changes required to load Swate
   * @param type object type: 0 assay, 1 study
   * @param identifier object identifier
   */
  LoadSwateState: (type: number, identifier: string) => {
    const methods = ['TryGetAssay','TryGetStudy'];
    SwateControlService.props.type = type;
    SwateControlService.props.object = ArcControlService.props.arc.ISA[methods[type]](identifier);
    AppProperties.state = AppProperties.STATES.EDIT_SWATE;
  }
}

export default SwateControlService;
