import { createApp } from 'vue';
import App from '/@/App.vue';

const app = createApp(App);

import { Quasar,Dialog,Loading } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
app.use(Quasar, {
  plugins: {Dialog,Loading}, // import Quasar plugins and add here
});

app.mount('#app');

