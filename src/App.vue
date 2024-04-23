<script setup>

import ChatContainer from './components/ChatContainer.vue';
import wedrCore from './components/wedrCore.vue';
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay();
const drawer = ref(false);
const timerDone = () => {
  $('#form').submit();
};
const instructionsHtml = document.getElementById('instructions').innerHTML;
const wedrCoreCols = computed(() => (smAndDown.value ? 12 : 8)); //should be changed to 8
const chatContainerCols = computed(() => (smAndDown.value ? 12 : 4));

const columnStyle = computed(() => {
  return {
    'overflow-y': 'auto',
    // 'max-height': smAndDown.value ? '100vh' : '100vh'
    'max-height': smAndDown.value ? 'calc(50vh - 50px)' : '100vh'
  };
});
const chatColumnStyle = computed(() => {
  return {
    'overflow-y': 'auto',
    'border': '1px solid black',
    'max-height': smAndDown.value ? 'calc(50vh - 50px)' : '100vh',
    'position': smAndDown.value ? 'absolute' : 'relative',
    'bottom': smAndDown.value ? '0px' : '0px',

  };
});
</script>
<template>
  <v-app app style="padding: 0px;">
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
      <v-alert elevation="3" bordered outlined height="40" class="mx-1">
        <vue-countdown :time="10 * 1000" v-slot="{ days, hours, minutes, seconds }" @end="timerDone">
          <span>Remaining&nbsp;time:&nbsp;{{ minutes }}:{{ seconds }}</span>
        </vue-countdown>
      </v-alert>
      Remember: if your partner leaves the chat, you can submit any code on Prolific and we'll pay you for your time!
      <v-spacer></v-spacer> <!-- This pushes the menu items to the right -->

      <v-btn outlined elevation="3" @click="drawer = !drawer">
        Instructions
      </v-btn>



    </v-app-bar>
    <v-main app full-width class="non-scrollable">

      <v-row :class="{ 'flex-column': smAndDown }" style="height: calc(100vh - 50px);">

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
