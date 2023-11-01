
<template>
    <v-card class="chat-box">
        <v-card-text class="chat-messages">
            
            <ChatMessage v-for="(msg, index) in augmentedChatProtocol" :key="index" :author="msg.author"
                :message="msg.message" :showAvatar="msg.showAvatar" :firstInSeries="msg.firstInSeries"
                :lastInSeries="msg.lastInSeries" :ref="allMessagesRef" />
                <div ref="lastMSG" style="height: 50px;">&nbsp;<br>&nbsp<br></div>
        </v-card-text>

        <div class="chat-input">
            <v-text-field multiple label="Type your message" v-model="newMessage" @keyup.enter="addMessage" outlined
                single-line clearable>
                <template v-slot:append>
                    <v-btn @click="addMessage" icon>
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </div>

    </v-card>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, nextTick, onMounted, watch } from 'vue';

import { useWebSocketStore } from '../store';

const wsStore = useWebSocketStore();
import ChatMessage from './ChatMessage.vue';
// Data

const allMessagesRef = ref([]);
const lastMSG = ref();
const scrollToLastMessage = () => {
    lastMSG.value.scrollIntoView({ behavior: "smooth" });
};

watch(() => wsStore.messages, () => {
  scrollToLastMessage();
});
// Scroll to the bottom when the component mounts




const newMessage = ref(""); // For the input field

// Function to add a new message
const addMessage = () => {
    if (newMessage.value.trim() === "") return;
    wsStore.sendMessage(
        'message',
        {
              utcTime: new Date().toISOString(),
             message: newMessage.value
        }
    )
   
    newMessage.value = "";
   

};


// Computed

const augmentedChatProtocol = computed(() => {
  let lastInSeries = false;
  return wsStore.messages.map((msg, index, arr) => {
    const nextMsg = arr[index + 1];
    if (!nextMsg || nextMsg.author !== msg.author) {
      lastInSeries = true;
    } else {
      lastInSeries = false;
    }
    const firstInSeries = !arr[index - 1] || arr[index - 1].author !== msg.author;
    const showAvatar = firstInSeries;
    return { ...msg, showAvatar, firstInSeries, lastInSeries };
  });
});

</script>

 

<style >
/* Formatting the fieldset within the div class sd-rating */
.sd-rating.sd-scrollable-container.sd-rating.sd-rating--wrappable fieldset {
    width: 100% !important;
    flex-wrap: nowrap !important;
    justify-content: space-between !important;
    display: flex;
    /* This enables justify-content */
    align-items: stretch !important;
    ;
}

/* Formatting for span.sd_rating__min-text */
span.sd-rating__min-text {
    position: absolute !important;
    ;
    bottom: 0px !important;
}

/* Formatting for span.sd_rating__max-text */
span.sd-rating__max-text {
    position: absolute;
    bottom: 0px;
    right: 0px;
}

.chat-box {
    height: 100%;
    margin-left: 10px;
    margin-top: 10px;
    padding: 10px;
    display: flex !important;
    ;
    flex-direction: column;
    flex: 1;
}



.chat-messages {
    display: flex;
    flex-direction: column;
    ;
    flex: 1;
    overflow-y: auto;
}

.chat-input {
    padding: 10px;
}
</style>
  