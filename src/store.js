// wsStore.js
import { defineStore } from 'pinia';
import { useWebSocket } from '@vueuse/core';

export const useWebSocketStore = defineStore({
  id: 'webSocketStore',
  state: () => ({
    messages: js_vars.messages,
    status: null,
    data: null,
    allowedToProceed: false,
    send: null  // Initialize 'send' as null
  }),
  actions: {
    handle_message(newMessage) {
      newMessage['own'] = window.ownCode == newMessage['who'];
      this.messages.push(newMessage); // Add message data to the messages array
    },
    handle_completed(newMessage) {
      const {group_completed, who} = newMessage;
      if (group_completed) {
        this.allowedToProceed = true;
        // submit a #form
        document.getElementById('form').submit();
      }
    },
    initializeWebSocket() {
      const that=this;
      const { status, data, send } = useWebSocket(window.fullPath, {
        autoReconnect: true,
        onMessage: (e) => {
          const json_data = JSON.parse(data.value);
          console.debug("Message received!", json_data);
          this.data = data.value;
          
          if (json_data ) {
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
    })
    },
  },
});
