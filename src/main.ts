import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/index.css';

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import VueSocketIO from 'vue-3-socket.io'
import * as Buffer from 'buffer'
globalThis.Buffer = Buffer.Buffer

const app = createApp(App)

app.use(router)
app.use(PrimeVue);

app.use(new VueSocketIO({
    debug: false,
    connection: 'http://188.208.143.130:3030/'
}));


app.mount('#app')
