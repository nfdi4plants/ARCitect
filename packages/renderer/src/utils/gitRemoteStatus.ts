import ArcControlService from '../ArcControlService.ts';
import AppProperties from '../AppProperties.ts';
import GitService from '../GitService.ts';

export async function checkRemoteDirtyStatus() {
  if (
    ArcControlService.props.arc_root &&
    AppProperties.user
  ) {
    try {
      await GitService.parse_status();
      await GitService.get_remotes();
      await GitService.check_remotes();
      let dirty = false;
      const remotes = GitService._.remotes || {};
      for (const id in remotes) {
        if (remotes[id].dirty) {
          dirty = true;
          break;
        }
      }
      AppProperties.has_dirty_remote = dirty;
    } catch (e) {
      // Optionally handle error
    }
  }
}