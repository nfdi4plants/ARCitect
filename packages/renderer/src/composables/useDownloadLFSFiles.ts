import { reactive } from 'vue';
import ArcControlService from '../ArcControlService';
import AppProperties from '../AppProperties';
import GitService from '../GitService';
import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import GitDialog from '../dialogs/GitDialog.vue';
import { ArcTreeViewNode } from '../views/ArcTreeView.vue';

function recUpdateNodes(fn: (n: ArcTreeViewNode)=>void, nodes: ArcTreeViewNode[]) {
  for(const n of nodes) {
    fn(n);
    if(n.children)
      recUpdateNodes(fn,n.children);
  }
}

/**
 * Composable for downloading LFS files from the frontend.
 * Handles authentication, dialogs, and updates node states if provided.
 *
 * @param paths Array of file paths to download via LFS
 * @param recUpdateNodes Optional function to update nodes after download
 * @param updateNodes Optional array of nodes to update, will be filtered.
 */
export async function useDownloadLFSFiles(
  $q: any,
  paths: string[],
  updateNodes?: any[]
) {

  if (!AppProperties.user) {
    return $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        title: 'Authentication Error',
        msg: 'You need to be logged in to download LFS files.',
      },
    });
  }

  let response = null;

  // get remote name and url
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`],
    cwd: ArcControlService.props.arc_root,
  });
  if (!response[0])
    return $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        title: 'Error',
        msg: 'Unable to determine remote name',
      },
    });
  const remote_name = response[1].split('\n')[0];
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`, `get-url`, remote_name],
    cwd: ArcControlService.props.arc_root,
  });
  if (!response[0])
    return $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
        title: 'Error',
        msg: 'Unable to determine remote url',
      },
    });
  const remote_url = response[1].split('\n')[0];

  // patch remote
  const patched_remote_url = GitService.patch_remote(remote_url);

  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`, `set-url`, remote_name, patched_remote_url],
    cwd: ArcControlService.props.arc_root,
  });
  if (!response[0]) return;

  const dialogProps = reactive({
    title: 'Pulling Individual LFS Files',
    ok_title: 'Ok',
    cancel_title: null,
    state: 0,
  });

  $q.dialog({
    component: GitDialog,
    componentProps: dialogProps,
  });

  for (let path of paths)
    await window.ipc.invoke('GitService.run', {
      args: ['lfs', 'pull', '--include', `"${path}"`],
      cwd: ArcControlService.props.arc_root,
    });

  if (updateNodes) {
    recUpdateNodes((n: any) => {
      const cleanedPaths = paths.map(p => p.replace(/\*\*$/, ''));
      if (n.isLFS && cleanedPaths.some(p => n.id_rel.includes(p))) {
        n.downloaded = true;
        n.isLFSPointer = false;
      }
    }, updateNodes);
    AppProperties.node_needs_refresh = true; // in case a newly downloaded file is currently selected
  }

  // unpatch
  response = await window.ipc.invoke('GitService.run', {
    args: [`remote`, `set-url`, remote_name, remote_url],
    cwd: ArcControlService.props.arc_root,
  });

  dialogProps.state = 1;
  AppProperties.updateGitDialogState(1);
}
