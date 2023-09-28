<template>
    <div>
        <p>Sentence: {{ sentence }}</p>
        <div v-for="(charObj, index) in cleanedSentenceArray" :key="index">
            <span v-html="charObj.letter"></span>
            <input v-if="charObj.input" v-model="charObj.userInput" @input="handleInput(charObj.inputIndex)"
                @keydown="handleKeydown(charObj.inputIndex, $event)" ref="inputRefs"
                type="text" maxlength="1"
                 />
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, nextTick } from 'vue';

const sentence = ref('hello, world!');
const cleanedSentenceArray = ref([]);
const inputRefs = ref([]);

const cleanSentence = () => {
    let inputIndex = 0;
    cleanedSentenceArray.value = Array.from(sentence.value).map((letter) => {
        let isInput = /[a-zA-Z]/.test(letter);
        return {
            letter: letter === ' ' ? '&nbsp;' : letter,
            input: isInput,
            userInput: '',
            inputIndex: isInput ? inputIndex++ : null,
        };
    });
};

const handleInput = (inputIndex) => {
    const currentInput = cleanedSentenceArray.value.find(o => o.inputIndex === inputIndex);
    if (currentInput && currentInput.userInput.length === 1) {
        nextTick(() => {
            if (inputRefs.value[inputIndex + 1]) {
                inputRefs.value[inputIndex + 1].focus();
            }
        });
    }
};

const handleKeydown = (inputIndex, event) => {
    const currentInput = cleanedSentenceArray.value.find(o => o.inputIndex === inputIndex);
    if (currentInput && event.key === 'Backspace' && currentInput.userInput.length === 0) {
        nextTick(() => {
            if (inputRefs.value[inputIndex - 1]) {
                inputRefs.value[inputIndex - 1].focus();
            }
        });
    }
};



onMounted(cleanSentence);
</script>
  