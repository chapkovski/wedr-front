import './assets/main.css'

import { createApp } from "vue";
import { surveyPlugin } from "survey-vue3-ui";
import App from "./App.vue";
import "survey-core/defaultV2.min.css";
import { useWebSocket } from '@vueuse/core'

import { createPinia } from 'pinia'
const { status, data, close, send } = useWebSocket("ws:\\localhost:8000" + window.socketUrl, {
  autoReconnect: true,
  onMessage: (e) => {
    console.debug("Message received!", data.value);

  },
  onConnected: () => {
    console.debug("Connected!");
    send(
      JSON.stringify({

        type: "user",
        data: "user",
      })
    );
  }
});


const pinia = createPinia()


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

createApp(App)
  .use(pinia)
  .use(surveyPlugin)
  .use(vuetify)
  .mount("#app");