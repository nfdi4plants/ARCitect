import { reactive, watch } from 'vue'

const AppProperties: {
  STATES: any,
  state: number
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


  datahub_hosts : [],
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
    const config = await window.ipc.invoke('LocalFileSystemService.readConfig');
    for(let key of Object.keys(config)){
      AppProperties.config[key] = config[key];
    }
  }
});

for(let k in AppProperties.STATES){
  AppProperties.STATES_I[AppProperties.STATES[k]] = k;
}

const get_datahubs = async ()=>{
  AppProperties.datahub_hosts = await window.ipc.invoke('DataHubService.getHosts');

  for(let host of AppProperties.datahub_hosts){
    AppProperties.datahub_hosts_msgs[host] = await window.ipc.invoke('InternetService.getWebPageAsJson', {
      host: host,
      path: '/api/v4/broadcast_messages',
      method: 'GET'
    });

    // if server is not reachable
    if(AppProperties.datahub_hosts_msgs[host]===null){
      const temp = [];
      temp.critical = true;
      temp.push({
        message: 'Server Not Reachable',
        critical: true,
        active: true,
        starts_at: new Date().toISOString()
      })
      AppProperties.datahub_hosts_msgs[host] = temp;
    } else {
      let contains_critical = false;
      for(let msg of AppProperties.datahub_hosts_msgs[host]){
        const t = msg.message.toLowerCase();
        msg.critical = t.includes('maintenance') || t.includes('downtime');
        contains_critical = contains_critical || (msg.critical && msg.active);
      }
      AppProperties.datahub_hosts_msgs[host].critical = contains_critical;
    }
  }
};

const init = async ()=>{
  await AppProperties.read_config();
  watch(AppProperties.config, ()=>{
    window.ipc.invoke('LocalFileSystemService.writeConfig', JSON.stringify(AppProperties.config));
  });
  await get_datahubs();
}
init();

export default AppProperties;
