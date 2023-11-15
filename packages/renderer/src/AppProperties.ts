import { reactive } from 'vue'

const AppProperties = reactive({
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

    GIT: 500,
  },
  STATES_I: {},
  state: 100,
  active_study: null,
  active_assay: null,

  user: null,
  path_sep: null,
});

for(let k in AppProperties.STATES){
  AppProperties.STATES_I[AppProperties.STATES[k]] = k;
}

export default AppProperties;
