import { defineStore } from 'pinia';
import { useWebSocket } from '@vueuse/core';

// wsStore.js

export const useWebSocketStore = defineStore({
  id: 'webSocketStore',
  state: () => ({
    messages: js_vars.messages,
    status: null,
    decodedWord: js_vars.decodedWord,
    encodedWord: js_vars.encodedWord,
    groupDict: js_vars.groupDict,
    partialDict: js_vars.partialDict,
    data: null,
    allowedToProceed: false,
    group_completed: js_vars.group_completed,
    player_completed: js_vars.player_completed,
    send: null,  // Initialize 'send' as null
  }),
  actions: {
    handle_message(newMessage) {
      newMessage['own'] = window.ownCode == newMessage['who'];
      this.messages.push(newMessage); // Add message data to the messages array
    },
    handle_completed(newMessage) {
      console.debug("Completed message received!", newMessage);
      const { player_completed, group_completed } = newMessage;
      this.player_completed = player_completed;
      this.group_completed = group_completed;
    },


    initializeWebSocket() {
      const that = this;
      const { status, data, send } = useWebSocket(window.fullPath, {
        autoReconnect: true,
        onMessage: (e) => {
          const json_data = JSON.parse(data.value);
          console.debug("Message received!", json_data);
          this.data = data.value;

          if (json_data) {
            const newMessage = json_data;
            // Dynamically call the appropriate handler based on the message type
            const handlerName = `handle_${newMessage.type}`;
            if (this[handlerName] && typeof this[handlerName] === 'function') {
              this[handlerName](newMessage);
            } else {
              console.warn(`No handler defined for message type: ${newMessage.type}`);
            }
          }
        },
        onConnected: async () => {
          console.debug("Connected!");
          that.status = 'connected';
        },
      });
      that.status = status;
    },
    async sendMessage(type, data) {
      // Use the 'send' function from the state
      liveSend({
        type, data
      });
    },
  }
});
