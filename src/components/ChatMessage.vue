<template>
       <div
       :ref="rootElement"
        :class="['chat-message', authorClass, { 'first-in-series': firstInSeries, 'last-in-series': lastInSeries }]">
      <div v-if="showAvatar && !own" class="avatar" :style="{ backgroundColor: avatarColor }">
        P2
      </div>
      <div class="message-box" :class="[{ 'no-avatar': !showAvatar }, messageBoxClass]" >
        <span>{{ message }}</span>
      </div>
      <div v-if="showAvatar && own" class="avatar" :style="{ backgroundColor: avatarColor }">
        Me
      </div>
    </div>
  </template>
  
  <script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  author: Number,
  own: Boolean,
  message: String,
  showAvatar: Boolean,
  firstInSeries: Boolean,
  lastInSeries: Boolean
});

const messageBoxClass = computed(() => {
  if (props.firstInSeries) {
    return props.own ? 'rounded-top-right' : 'rounded-top-left';
  }
  return '';
});

const authorClass = computed(() => {
  return props.own ? 'author-2' : 'author-1';
});

const avatarColor = computed(() => {
  return props.own ? '#2196F3' : '#4CAF50';  // Assuming the own player has a different color
});
</script>

  
  <style>
 .chat-message {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 3px;
  width: 100%;
  margin-top: 0;  
}

.chat-message.author-2 {
  justify-content: flex-end;
}
.first-in-series {
  margin-top: 10px!important;
  
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-top: 5px;
  margin-right: 0px; /* Default for author 1 */
  z-index: 1;
}

.chat-message.author-2 .avatar {
  margin-right: 0;
  margin-left: 5px; /* Push it to the right for author 2 */
}
.message-box.no-avatar {
    margin-left: 35px;
    margin-right: 35px;
}
  .message-box {
    background-color: inherit;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    flex: 1;
    margin-left: 5px;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    max-width: 70%; /* Limit the width of individual messages */
  }
  
  .author-1 .message-box {
    background-color: #e0e0e0;
  }
  
  .author-2 .message-box {
    background-color: #c0c0c0;
  }
  .rounded-top-left.message-box {
  border-top-left-radius: 12px;
}

.rounded-top-right.message-box {
  border-top-right-radius: 12px;
}

.last-in-series .message-box {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
  
  </style>
  