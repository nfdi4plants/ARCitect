import AppProperties from './AppProperties';
import ArcControlService from './ArcControlService';
import { iProps } from './App.vue';

export const refreshLocalArc = async () => {
let path = ArcControlService.props.arc_root;
let isOpen = await ArcControlService.readARC(path);
if (!isOpen) {
iProps.error_text = 'Unable to find valid ARC at:<br>' + path;
iProps.error = true;
return;
}
AppProperties.state = AppProperties.STATES.HOME;
};
