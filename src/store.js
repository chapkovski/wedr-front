// wsStore.js
import { defineStore } from 'pinia';
import { useWebSocket } from '@vueuse/core';

export const useWebSocketStore = defineStore({
  id: 'webSocketStore',
  state: () => ({
    messages: [],
    status: null,
    data: null,
    send: null  // Initialize 'send' as null
  }),
  actions: {
    initializeWebSocket() {
      const that=this;
      const { status, data, send } = useWebSocket(window.fullPath, {
        autoReconnect: true,
        onMessage: (e) => {
          
          // let's convert to json
          
          const json_data = JSON.parse(data.value);
          console.debug("Message received!", json_data);
          that.data = data.value;
          if (json_data && json_data['0']) {
            this.messages.push(json_data['0']);  // Add message data to the messages array
          }
          console.debug('messages', this.messages)
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
