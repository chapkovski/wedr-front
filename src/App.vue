<script setup>
import _ from 'lodash';

// Now you can use Lodash functions
const items = _.times(150, _.uniqueId.bind(null, 'item_'));
import ChatContainer from './components/ChatContainer.vue';
import SurveyWrapper from './components/SurveyWrapper.vue';

</script>

<template>
  
<v-app app  >
  
  <v-main app full-width style="height: 100vh;" class="non-scrollable" >
  <v-row style="height: 100vh;">
    <v-col cols="6" class="scrollable">
    <ChatContainer></ChatContainer>
    </v-col>
    <v-col cols="6" class="scrollable">
    <SurveyWrapper></SurveyWrapper>
  </v-col>
  </v-row>
</v-main>
</v-app>
</template>

<style scoped>
 
 .scrollable {
  height: 100vh; /* Full viewport height */
  overflow-y: auto; /* Enable vertical scroll */
}
.non-scrollable{
  height: 100vh; /* Full viewport height */
  overflow-y: hidden; /* Enable vertical scroll */
}
 
</style>
