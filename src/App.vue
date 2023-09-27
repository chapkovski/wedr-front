<script setup>
 
import ChatContainer from './components/ChatContainer.vue';
import wedrCore from './components/wedrCore.vue';
import { computed } from 'vue';
import { useDisplay } from 'vuetify'

const { smAndDown} = useDisplay()
 

const columnClasses = computed(() => {
  return {
    'scrollable': true,
    'lg6': ! smAndDown.value,
    'sm12':  smAndDown.value
  };
});

const columnStyle = computed(() => {
  return {
    'overflow-y': 'auto',
    'max-height':  smAndDown.value ? '50vh' : '100vh'
  };
});

</script>
<template>
  <v-app app>
    <v-main app full-width class="non-scrollable">
      <v-row :class="{'flex-column': smAndDown}" style="height: 100vh;">
        
        <v-col :class="columnClasses" :style="columnStyle">
          <wedrCore></wedrCore>
        </v-col>
        
        <v-col :class="columnClasses" :style="columnStyle">
          <ChatContainer></ChatContainer>
        </v-col>

      </v-row>
    </v-main>
  </v-app>
</template>


<style scoped>
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
