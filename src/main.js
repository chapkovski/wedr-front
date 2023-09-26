import './assets/main.css'

import { createApp } from "vue";
import { surveyPlugin } from "survey-vue3-ui";
import App from "./App.vue";
import "survey-core/defaultV2.min.css";


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
    .use(surveyPlugin)
    .use(vuetify)
    .mount("#app");