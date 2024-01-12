import { reactive } from 'vue'

import AppProperties from './AppProperties.ts';

const init : { SourceState: number } = {
  SourceState: 0
}

const SwateControlService = {

  props: reactive(init),
  /**
   * This function manages all state changes required to load Swate
   * @param sourceState The number representing the state from which Swate was triggered.
   */
  LoadSwateState: (sourceState: number) => {
    SwateControlService.props.SourceState = sourceState;
    AppProperties.state = AppProperties.STATES.EDIT_SWATE;
  },
  Reset: () => {
    SwateControlService.props = init
  }
}

export default SwateControlService;