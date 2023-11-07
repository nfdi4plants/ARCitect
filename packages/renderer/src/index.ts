import { createApp } from 'vue';
import App from '/@/App.vue';

const app = createApp(App);

import { Quasar,Dialog,Loading } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
app.use(Quasar, {
  plugins: {Dialog,Loading}, // import Quasar plugins and add here
});

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
app.use(ContextMenu);

app.mount('#app');

