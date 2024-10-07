import { reactive } from 'vue'

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
  },
  STATES_I: {},
  state: 0,

  user: null,

  datahub_hosts : [],
  datahub_hosts_msgs: {},

  force_commit_update: 0,
  force_lfs_update: 0,

  showHelp: false,
  showTooltips: false
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
    let contains_critical = false;
    for(let msg of AppProperties.datahub_hosts_msgs[host]){
      const t = msg.message.toLowerCase();
      msg.critical = t.includes('maintenance') || t.includes('downtime');
      contains_critical = contains_critical || (msg.critical && msg.active);
    }
    AppProperties.datahub_hosts_msgs[host].critical = contains_critical;
  }
};

get_datahubs();

export default AppProperties;
