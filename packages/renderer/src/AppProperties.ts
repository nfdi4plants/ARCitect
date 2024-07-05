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
  },
  STATES_I: {},
  state: 0,

  user: null,

  datahub_hosts: [
    'git.nfdi4plants.org',
    'gitlab.nfdi4plants.de',
    'gitlab.plantmicrobe.de'
  ],

  force_commit_update: 0
});

for(let k in AppProperties.STATES){
  AppProperties.STATES_I[AppProperties.STATES[k]] = k;
}

export default AppProperties;
