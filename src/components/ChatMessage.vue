<template>
       <div
       :ref="rootElement"
        :class="['chat-message', authorClass, { 'first-in-series': firstInSeries, 'last-in-series': lastInSeries }]">
      <div v-if="showAvatar && author === 1" class="avatar" :style="{ backgroundColor: avatarColor }">
        P{{ author }}
      </div>
      <div class="message-box" :class="[{ 'no-avatar': !showAvatar }, messageBoxClass]" >
        <span>{{ message }}</span>
      </div>
      <div v-if="showAvatar && author === 2" class="avatar" :style="{ backgroundColor: avatarColor }">
        P{{ author }}
      </div>
    </div>
  </template>
  
  
  
  <script>
  export default {
    props: ['author', 'message', 'showAvatar', 'firstInSeries', 'lastInSeries'],
    computed: {
        messageBoxClass() {
      if (this.firstInSeries) {
        return this.author === 1 ? 'rounded-top-right' : 'rounded-top-left';
      }
      return '';
    },
      authorClass() {
        return this.author === 1 ? 'author-1' : 'author-2';
      },
      avatarColor() {
        return this.author === 1 ? '#4CAF50' : '#2196F3';
      },
    },
  };
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
  