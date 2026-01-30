import { reactive, watch } from 'vue'
import { ArcTreeViewNode } from './views/ArcTreeView.vue';

interface Config {
  gitDebug: boolean,
  toolbarMinimized: boolean,
  showHelp: boolean,
  showTooltips: boolean,
  swate_url: string | null
}

const SHIPPED_SWATE_URL = 'http://localhost:7891'

const AppProperties: {
  STATES: {
    HOME: number,
    OPEN_DATAHUB: number,
    EDIT_SWATE: number,
    GIT_COMMIT: number,
    GIT_SYNC: number,
    GIT_HISTORY: number,
    EDIT_MARKDOWN: number,
    EDIT_IMAGE: number,
    EDIT_LFS: number,
    EDIT_FALLBACK: number,
    VALIDATION: number,
    STATUS: number,
    BUG_REPORT: number,
    SETTINGS: number,
  },
  STATES_I: {[key: number]: string},
  user: null | {name: string, email: string},
  active_fallback: string,
  active_lfs_file: string,
  active_node: ArcTreeViewNode,
  node_needs_refresh: boolean,
  has_dirty_remote: boolean,
  state: number,
  config: Config,
  read_config: () => Promise<void>,
  git_dialog_state: {
    visible: boolean,
    minimized: boolean,
    title: string,
    ok_title: string,
    cancel_title: string,
    state: number,
    rows: string[],
    globalListener: any
  },
  processGitStreamRows: (data: string, rows: string[]) => void,
  setupGlobalGitListener: () => void,
  updateGitDialogState: (state: number) => void
} = reactive({
  STATES: {
    HOME: 0,

    OPEN_DATAHUB: 101,
    EDIT_SWATE: 203,

    GIT_COMMIT: 501,
    GIT_SYNC: 502,
    GIT_HISTORY: 503,

    EDIT_MARKDOWN: 600,
    EDIT_IMAGE: 601,
    EDIT_LFS: 602,
    EDIT_FALLBACK: 603,

    VALIDATION: 700,
    BUG_REPORT: 750,
    STATUS: 800,
    SETTINGS: 900,
  },
  STATES_I: {},
  state: 0,

  user: null,

  active_fallback: '',
  active_lfs_file: '',
  active_node: null,
  node_needs_refresh: false,
  has_dirty_remote: false,
  datahub_hosts : {},
  datahub_hosts_by_provider: {},
  datahub_hosts_msgs: {},

  load_swate: false,

  force_commit_update: 0,

  wait: time => new Promise(resolve => setTimeout(resolve, time)),

  debounce: (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, wait);
    };
  },

  processGitStreamRows: (data: string, rows: string[]) => {
    const newRows = data.split('\n').filter((row: string) => row !== '');

    const progressPrefixes = [
      'POST ',
      'Filtering content:',
      'Receiving objects:',
      'Resolving deltas:',
      'Enumerating objects:',
      'Counting objects:',
      'Compressing objects:',
      'Writing objects:',
      'Uploading LFS objects:',
      'Downloading LFS objects:',
    ];

    for (let row of newRows) {
      if (row === '') continue;

      const last_row = rows[rows.length - 1];
      const shouldReplace = progressPrefixes.some(p =>
        last_row.includes(p) && row.includes(p)
      );

      if (shouldReplace)
        rows[rows.length - 1] = row;
      else
        rows.push(row);
    }
  },

  setupGlobalGitListener: () => {
    if (AppProperties.git_dialog_state.globalListener) return;

    AppProperties.git_dialog_state.globalListener = window.ipc.on('GitService.MSG', (data: string) => {
      if (!AppProperties.git_dialog_state.visible) return;
      AppProperties.processGitStreamRows(data, AppProperties.git_dialog_state.rows);
    });
  },

  updateGitDialogState: (state: number) => {
    AppProperties.git_dialog_state.state = state;
  },

  config: {
    gitDebug: false,
    toolbarMinimized: false,
    showHelp: false,
    showTooltips: false,
    swate_url: ''
  },

  read_config: async ()=>{
    const config = await window.ipc.invoke('LocalFileSystemService.readConfig') as Partial<Config>;
    Object.assign(AppProperties.config, config);
  },

  git_dialog_state: {
    visible: false,
    minimized: false,
    title: '',
    ok_title: '',
    cancel_title: '',
    state: 0,
    rows: [''],
    globalListener: null
  }
});

for(let k in AppProperties.STATES){
  AppProperties.STATES_I[AppProperties.STATES[k]] = k;
}

const enum DATAHUB_STATUS {
  OK,
  MAINTENANCE,
  DOWNTIME,
  ERROR,
  PROBING
}

interface StatusMessage{
  message: string,
  critical: boolean,
  active: boolean,
  starts_at: string
  status: DATAHUB_STATUS
}

const get_datahubs = async ()=>{
  AppProperties.datahub_hosts_by_provider = await window.ipc.invoke('DataHubService.getHosts');
  AppProperties.datahub_hosts = AppProperties.datahub_hosts_by_provider.dataplant.concat(AppProperties.datahub_hosts_by_provider.additional);

  // setup hosts
  // each will be assigned a default status message connecting
  // once the server is checked, the status will be updated asynchronously
  // and will be reflected in the StatusView
  // Additionally, this prevents the UI from freezing if a connection
  // to a server takes a bit longer, produces an unprocessed error
  for (let host of AppProperties.datahub_hosts) {

    // default status - connecting to server
    AppProperties.datahub_hosts_msgs[host] = [{
      message: 'connecting to server',
      critical: false,
      active: true,
      starts_at: new Date().toISOString(),
      status: DATAHUB_STATUS.PROBING
    } as StatusMessage];

    // async server check update status when finished
    window.ipc.invoke('InternetService.getWebPageAsJson', {
         host: host,
         path: '/api/v4/broadcast_messages',
         method: 'GET'})
      .then((response) => {
        let messages: StatusMessage[] = []
        if (response === null) {
          messages.push({
            message: 'Server Not Reachable',
            critical: true,
            active: true,
            starts_at: new Date().toISOString(),
            status: DATAHUB_STATUS.ERROR
          })
        }

        else {
          for (let msg of response) {
            const t = msg.message.toLowerCase();
            msg.critical = t.includes('maintenance') || t.includes('downtime');
            if (t.includes('downtime')) {
              msg.status = DATAHUB_STATUS.DOWNTIME;
            }else if (t.includes('maintenance')) {
              msg.status = DATAHUB_STATUS.MAINTENANCE;
            } else {
              msg.status = DATAHUB_STATUS.OK;
            }
            messages.push(msg);
          }
        }

        let contains_critical = messages.filter((msg) => msg.critical && msg.active).length > 0;
        AppProperties.datahub_hosts_msgs[host] = messages;
        // this is bad, but I left it for now for sake of functionality
        AppProperties.datahub_hosts_msgs[host].critical = contains_critical;
      })};
};

const addDataHub = async (host: string, cred: any)=>{
  try{
    await window.ipc.invoke('DataHubService.addHost', [host, cred]);
  }catch(e){
    // not sure where to put this error?
    // inform user with toast?
    console.log(e);
  }finally{
    get_datahubs();
  }
}

const deleteDataHub = async (host: string)=>{
  try{
    await window.ipc.invoke('DataHubService.deleteHost', host);
  }catch(e){
    // same as above
    console.log(e);
  }finally{
    get_datahubs();
  }
}

const init = async ()=>{
  await AppProperties.read_config();
  watch(AppProperties.config, ()=>{
    window.ipc.invoke('LocalFileSystemService.writeConfig', JSON.stringify(AppProperties.config));
  });
  await get_datahubs();
  AppProperties.load_swate = true;
  AppProperties.setupGlobalGitListener();
}
init();

export default AppProperties;
export { addDataHub, deleteDataHub, DATAHUB_STATUS, SHIPPED_SWATE_URL };
