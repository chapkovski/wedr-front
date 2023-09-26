
<template>
    <v-card class="chat-box">
        <v-card-text>
            <ChatMessage v-for="(msg, index) in augmentedChatProtocol" :key="index" :author="msg.author"
                :message="msg.message" :showAvatar="msg.showAvatar" :firstInSeries="msg.firstInSeries"
                :lastInSeries="msg.lastInSeries" />
        </v-card-text>
    </v-card>
</template>
  
<script>
import ChatMessage from './ChatMessage.vue';
import _ from 'lodash';
export default {
    components: {
        ChatMessage,
    },
    data() {
        // here i want to generate temporarily a lot of messages of format
        // { author: 1, timestamp: 111, message: 'xxx' },
        // using lodash
        const authorMessages = [
            'The unexamined life is not worth living.',
            'I think, therefore I am.',
            'Man is condemned to be free.',
            'To be is to be perceived.',
            'Reality is merely an illusion.',
            'The only thing we have to fear is fear itself.',
            'Happiness is the highest good.',
            'The root of suffering is attachment.',
            'The only constant is change.',
            'Knowledge is power.',
            'Appearances are deceptive.',
            'Necessity is the mother of invention.',
            'The sum of all natural numbers is -1/12.',
            'The Tao that can be told is not the eternal Tao.',
            'One cannot step into the same river twice.',
            'All we are is dust in the wind.',
            'Ignorance is the root of all evil.',
            'Power corrupts; absolute power corrupts absolutely.',
            'Beauty is in the eye of the beholder.',
            'Life is suffering.'
        ];

        let chatProtocol = [];
        let currentAuthor = 1; // Start with author 1
        let remainingMessages = [...authorMessages]; // Clone the array to keep track of remaining messages

        for (let i = 0; i < 100;) {
            const numMessages = _.random(1, 2); // Randomly pick either 1 or 2 messages for this author

            if (remainingMessages.length < numMessages) {
                remainingMessages = [...authorMessages]; // Reset the pool if not enough messages are left
            }

            const messages = _.sampleSize(remainingMessages, numMessages);
            remainingMessages = _.difference(remainingMessages, messages); // Remove selected messages from the pool

            for (const message of messages) {
                chatProtocol.push({
                    author: currentAuthor,
                    timestamp: _.random(100, 200),
                    message: message
                });
                i++; // Increment the loop counter
            }

            currentAuthor = 3 - currentAuthor;// Switch to the other author (1 becomes 2, 2 becomes 1)
        }


        return {
            chatProtocol: chatProtocol,
        };
    },
    computed: {
        augmentedChatProtocol() {
            let lastInSeries = false;
            return this.chatProtocol.map((msg, index, arr) => {
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
        },
    }

};
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
    margin-left: 10px;
    margin-top: 10px;
    padding: 10px;
    /* width: 45%; or whatever percentage you prefer */
    /* additional styles if needed */
}
</style>
  