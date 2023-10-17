// store.js or store/index.js
import { defineStore } from 'pinia'

export const useMyStore = defineStore({
  id: 'main',
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
})
