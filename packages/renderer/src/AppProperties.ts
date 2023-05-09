import { reactive } from 'vue'

const appProperties = reactive({
  STATES: {
    HOME: 0,

    OPEN_ARC: 100,
    OPEN_DATAHUB: 101,
    OPEN_NEW: 102,

    EDIT_INVESTIGATION: 200,
    EDIT_STUDY: 201,
    EDIT_ASSAY: 202,

    ADD_STUDY: 301,
    ADD_ASSAY: 302,

    LOGIN: 400,

  },
  STATES_I: {},
  state: 100,
  active_study: null,
  active_assay: null,

  user: null
});

for(let k in appProperties.STATES){
  appProperties.STATES_I[appProperties.STATES[k]] = k;
}

export default appProperties;
