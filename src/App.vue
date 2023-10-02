<script setup>

import ChatContainer from './components/ChatContainer.vue';
import wedrCore from './components/wedrCore.vue';
import { computed } from 'vue';
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay();

const wedrCoreCols = computed(() => (smAndDown.value ? 12 : 8));
const chatContainerCols = computed(() => (smAndDown.value ? 12 : 4));

const columnStyle = computed(() => {
  return {
    'overflow-y': 'auto',
    'max-height': smAndDown.value ? '50vh' : '100vh'
  };
});
</script>
<template>
  <v-app app>
    <v-main app full-width class="non-scrollable">
      <v-row :class="{ 'flex-column': smAndDown }" style="height: 100vh;">

        <v-col :cols="wedrCoreCols" :style="columnStyle">
          <wedrCore></wedrCore>
        </v-col>

        <v-col :cols="chatContainerCols" :style="columnStyle" class="chat-container-col">
          <ChatContainer></ChatContainer>
        </v-col>

      </v-row>
    </v-main>
  </v-app>
</template>



<style scoped>
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
