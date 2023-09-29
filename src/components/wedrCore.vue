<template>
    <div class="dict-grid-container">
        <div class="dict-grid-item" v-for="key in displayedLetters" :key="key + '-letter'">
            {{ key }}
        </div>
        
        <div class="dict-grid-item" v-for="jey in displayedEmojis" :key="jey + '-emoji'">
            {{ jey }}
        </div>
    </div>

    <v-card>
        <v-card-title>
            Encoded Sentence
        </v-card-title>
        <v-card-text>
            <!-- Grid container for emojis and input fields -->
            <div class="grid-container">
                <template v-for="(charObj, index) in cleanedSentenceArray" :key="index">
                    <div class="grid-item emoji non-selectable" :style="{ gridRow: 1, gridColumn: index + 1 }"
                        v-html="charObj.letter">
                    </div>
                </template>


                <template v-for="(charObj, index) in cleanedSentenceArray" :key="index">
                    <div class="grid-item" :style="{ gridRow: 2, gridColumn: index + 1 }">
                        <input class="input-field" v-if="charObj.input" autocomplete="off"
                            :name="`input-${charObj.inputIndex}`" v-model="charObj.userInput"
                            @input="handleInput(charObj.inputIndex)" @keydown="handleKeydown(charObj.inputIndex, $event)"
                            ref="inputRefs" type="text" maxlength="1" @focus="handleFocus($event)" />


                    </div>
                </template>



            </div>
        </v-card-text>
    </v-card>
</template>
  
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import _ from 'lodash';

const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('');
const emojis = [
    '📃', '🐨', '🔓', '🎚', '🏑', '💮', '💱', '🎐', '🍛', '🚱',
    '💈', '🎲', '⛵️', '4️⃣', '🔀', '⚽️', '⚜', '😄', '😢', '🆘',
    '🏔', '🚶', '💁', '🉑', '📐', '🔨', '🐪', '🔡', '🐂', '🚄',
    '😈', '🔤', '📄', '⏸', '💟', '♐️', '🍖', '📮', '💍', '*⃣',
    '⏫', '⛸', '😗', '🍦', '✂️', '🏓', '🚼', '👠', '⛅️', '⏺',
    '🕙', '🌴', '🔼', '🐤', '🔠', '🛐', '🏤', '👀', '☑️', '🍬',
    '🎫', '☮', '💻', '🐉', '🚈', '✔️', '📧', '🈶', '🙃', '😴',
    '🍥', '🏐', '🍎', '👟', '🕉', '🌉', '〰️', '🖱', '🚹', '🐺',
    '💆', '🗺', '🐠', '🔯', '📡', '🐩', '🚢', '🚉', '🐍', '🍨',
    '🕡', '🚂', '💣', '🔅', '💊', '🍉', '😔', '🎎', '👱', '🛁'
];

// Shuffle the emojis and take as many as there are alphabets
const shuffledEmojis = _.shuffle(emojis).slice(0, alphabets.length);

// Zip the alphabets and shuffled emojis to create an emoji dictionary
const emojiDict = _.zipObject(alphabets, shuffledEmojis);
// Find the remaining alphabets that are not in uniqueLettersInSentence

const sentence = ref('hello, world!');
const uniqueLettersInSentence = Array.from(new Set(sentence.value.match(/[a-zA-Z]/g) || []));
const remainingAlphabets = _.difference(alphabets, uniqueLettersInSentence);

// Randomly pick X letters from remainingAlphabets
const extraLetters = _.sampleSize(remainingAlphabets, uniqueLettersInSentence.length);

console.debug('uniqueLettersInSentence', uniqueLettersInSentence);
console.debug('remainingAlphabets', remainingAlphabets);
console.debug('extraLetters', extraLetters);
// Combine and sort
const displayedLetters = [...new Set([...uniqueLettersInSentence, ...extraLetters])].sort();
console.debug('displayedLetters', displayedLetters);
const displayedEmojiDict = Object.fromEntries(
  displayedLetters.map(letter => [letter, emojiDict[letter]])
);

// Convert it to an array if needed
const displayedEmojis = displayedLetters.map(letter => emojiDict[letter]);
const cleanedSentenceArray = ref([]);
const inputRefs = ref([]);

const cleanSentence = () => {
    let inputIndex = 0;
    cleanedSentenceArray.value = Array.from(sentence.value).map((letter) => {
        let isInput = /[a-zA-Z]/.test(letter);
        let symbol = isInput ? (emojiDict[letter.toLowerCase()] || letter) : letter;
        symbol = symbol === ' ' ? '&nbsp;' : symbol;

        return {
            letter: symbol,
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
const handleFocus = (event) => {
    event.target.select();
};



onMounted(cleanSentence);
</script>
  
<style scoped>

.dict-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
    grid-template-rows: repeat(2, 30px);
    /* Create two rows of 50px height each */
    gap: 0px 4px;
}

.dict-grid-item {
  text-align: center;
  padding: 5px;
  border: 1px solid #ccc;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    grid-template-rows: repeat(2, 50px);
    /* Create two rows of 50px height each */
    gap: 0px 4px;
}

.grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px;
}

.input-field {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 1.5em;
    border: none;
    border-bottom: 2px solid black;
}

.emoji {
    font-size: 3em;
}

.non-selectable {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>
  