import { reactive, watch } from 'vue'
import App from './App.vue';

interface Config {
  gitDebug: boolean,
  toolbarMinimized: boolean,
  showHelp: boolean,
  showTooltips: boolean,
  swate_url: string
}

const AppProperties: {
  STATES: any,
  state: number,
  config: Config,
  read_config: () => Promise<void>
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

    VALIDATION: 700,
    STATUS: 800,
    SETTINGS: 900,
  },
  STATES_I: {},
  state: 0,

  user: null,
  

  datahub_hosts : {},
  datahub_hosts_by_provider: {},
  datahub_hosts_msgs: {},

  force_commit_update: 0,

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
}
init();

export default AppProperties;
export { addDataHub, deleteDataHub, DATAHUB_STATUS };
