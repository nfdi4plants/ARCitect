import { reactive } from 'vue'

const arcProperties = reactive({

  identifier: '',
  title: '',
  description: '',
  submissionDate: '',
  publicReleaseDate: '',
  people: [],
  publications: [],

  studies: [],
});

export default arcProperties;
