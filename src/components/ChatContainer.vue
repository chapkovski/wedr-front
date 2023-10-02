
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


import ChatMessage from './ChatMessage.vue';
// Data
const authorMessages = ref(
    [
        {
            "author": 1,
            "timestamp": 101,
            "message": "Hey, let's decode the next word. I have the emojis for D, M, C, and Y."
        },
        {
            "author": 2,
            "timestamp": 102,
            "message": "Alright, I have the rest. E is represented by a ballot box."
        },
        {
            "author": 1,
            "timestamp": 103,
            "message": "Great, D is like a government building."
        },
        {
            "author": 2,
            "timestamp": 104,
            "message": "For O, it's a woman doing some kind of gesture."
        },
        {
            "author": 1,
            "timestamp": 105,
            "message": "M is represented by a hockey stick ."
        },
        {
            "author": 2,
            "timestamp": 106,
            "message": "For C, it's a poodle."
        },
        {
            "author": 1,
            "timestamp": 107,
            "message": "Ah, okay. R is an ice cream cone ."
        },
        {
            "author": 2,
            "timestamp": 108,
            "message": "A is an SOS sign."
        },
        {
            "author": 1,
            "timestamp": 109,
            "message": "And Y is a wolf ."
        },
        {
            "author": 2,
            "timestamp": 110,
            "message": "Great, so we have: D-E-M-O-C-R-A-C-Y, right?"
        },
        {
            "author": 1,
            "timestamp": 111,
            "message": "Yes, that's correct. The word is DEMOCRACY."
        }
    ]
);
const allMessagesRef = ref([]);
const lastMSG = ref();
const scrollToLastMessage = () => {
    lastMSG.value.scrollIntoView({ behavior: "smooth" });
};

// This should work now
watch(() => authorMessages.value, () => {
    scrollToLastMessage();
});
// Scroll to the bottom when the component mounts




const newMessage = ref(""); // For the input field

// Function to add a new message
const addMessage = () => {
    if (newMessage.value.trim() === "") return;
    authorMessages.value.push({
        // using lodash to  random choice betweeen 1 and 2
        author: _.random(1, 2),
        timestamp: Date.now(),
        message: newMessage.value
    });
    newMessage.value = "";
    scrollToLastMessage();

};


// Computed
const augmentedChatProtocol = computed(() => {
    let lastInSeries = false;
    return authorMessages.value.map((msg, index, arr) => {
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
  