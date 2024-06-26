<script setup>
import { useWebSocketStore } from './store';
import { storeToRefs } from "pinia";

import ChatContainer from './components/ChatContainer.vue';
import wedrCore from './components/wedrCore.vue';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';

const wsStore = useWebSocketStore();
const { remainingTime } = storeToRefs(wsStore);

const num_decoded_words = ref(js_vars.num_decoded_words);
const dialogVisible = ref(js_vars.num_decoded_words > 0);
const { smAndDown } = useDisplay();
const drawer = ref(false);
const timerDone = () => {
  $('#form').submit();
};
const instructionsHtml = document.getElementById('instructions').innerHTML;
const wedrCoreCols = 8
const chatContainerCols = 4

const columnStyle = computed(() => {
  return {
    'overflow-y': 'auto',

    'max-height': '100vh'
  };
});
const chatColumnStyle = computed(() => {
  return {
    'overflow-y': 'auto',
    'border': '1px solid black',
    'max-height': '100vh',
    'position': 'relative',
    'bottom': '0px',

  };
});
</script>
<template>
  <v-app app style="padding: 0px;">
    <v-dialog v-model="dialogVisible" max-width="590">
      <v-card class="bg-green text-white">
        <v-card-title>You have successfully decoded one more word!</v-card-title>
        <v-card-text>
          Total number of decoded words is: <b> {{ num_decoded_words }}</b>
          <div>Close this dialog to decode a new word.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="text-white" text @click="dialogVisible = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-navigation-drawer v-model="drawer" app location="right" temporary :width="500">
      <v-card>
        <v-card-title>
          Instructions
          <v-spacer></v-spacer>
          <v-btn icon @click="drawer = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-html="instructionsHtml"></div>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-toolbar-title>Decoding task</v-toolbar-title>
      <v-alert elevation="3" bordered outlined class="mx-1" prominent color="info">
        Number of words decoded: <span class="font-weight-bold">{{ num_decoded_words }}</span>
      </v-alert>
      <v-alert elevation="3" bordered outlined prominent color="primary" class="mx-1">
        <vue-countdown :time="remainingTime * 1000" v-slot="{ days, hours, minutes, seconds }" @end="timerDone">
          <span>
            Remaining&nbsp;time:&nbsp;{{ String(minutes).padStart(2, '0') }}:{{ String(seconds).padStart(2, '0') }}
          </span>
        </vue-countdown>
      </v-alert>

      <v-spacer></v-spacer> <!-- This pushes the menu items to the right -->

      <v-btn outlined elevation="3" @click="drawer = !drawer">
        Instructions
      </v-btn>



    </v-app-bar>
    <v-main app full-width class="non-scrollable">

      <v-row style="height: calc(100vh - 50px);">

        <v-col :cols="wedrCoreCols" :style="columnStyle">
          <wedrCore></wedrCore>
        </v-col>

        <v-col v-if="true" :cols="chatContainerCols" :style="chatColumnStyle" class="chat-container-col">
          <ChatContainer></ChatContainer>
        </v-col>

      </v-row>
    </v-main>
  </v-app>
</template>



<style>
.custom-dialog {
  background-color: rgba(0, 0, 0, 0.5);
  /* Darkens the background more, adjust opacity as needed */
}

.green-dialog {
  background-color: #4CAF50;
  /* A shade of green, adjust the color code as needed */
  border: 1px solid #388E3C;
  /* Darker green border, thin and small */
}

div#app {
  padding: 0px !important;
}

/* Mobile screens */
@media (max-width: 480px) {
  html {
    font-size: 12px;
    /* or whatever size you want */
  }
}

/* Tablet screens */
@media (min-width: 481px) and (max-width: 1024px) {
  html {
    font-size: 14px;
    /* or whatever size you want */
  }
}

/* Desktop screens */
@media (min-width: 1025px) {
  html {
    font-size: 16px;
    /* or whatever size you want */
  }
}

.chat-container-col {
  display: flex;
  flex-direction: column;
}

.scrollable {
  height: 100vh;
  /* Full viewport height */
  overflow-y: auto;
  /* Enable vertical scroll */
}

.non-scrollable {
  height: 100vh;
  /* Full viewport height */
  overflow-y: hidden;
  /* Enable vertical scroll */
}
</style>
