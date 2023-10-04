<template>
    <div>
        <v-card outlined elevation="3" class="m-3 p-3 my-3">
            <v-card-title>
                Dictionary
            </v-card-title>
            <v-card-text class="m-3 p-3 dictionary-text-card">
                <div>
                    <div class="flex-container">
                        <div v-for="(emoji, letter) in displayedEmojiDict" :key="letter" class="flex-item">
                            <div class="emoji">
                                {{ emoji }}
                            </div>
                            <div class="letter">
                                {{ letter.toUpperCase() }}
                            </div>
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>


        <v-card outlined elevation="3" class="my-3">
            <v-card-title>
                Encoded Sentence
            </v-card-title>
            <v-card-text>
                <!-- Grid container for emojis and input fields -->
                <div class="input-flex-container">
                    <template v-for="(charObj, index) in cleanedSentenceArray" :key="index">
                        <div class="input-flex-item">
                            <div class="emoji" v-html="displayedEmojiDict[charObj.letter.toLowerCase()] || charObj.letter">
                            </div>
                            <div>
                                <input class="input-field" v-if="charObj.input" autocomplete="off"
                                    :name="`input-${charObj.inputIndex}`" v-model="charObj.userInput"
                                    @input="handleInput(charObj.inputIndex)"
                                    @keydown="handleKeydown(charObj.inputIndex, $event)" ref="inputRefs" type="text"
                                    maxlength="1" @focus="handleFocus($event)" />
                            </div>
                        </div>
                    </template>
                </div>





            </v-card-text>
            <v-card-actions>
                <v-btn-group>
                    <v-btn elevation=3 color="danger" @click="handleReset">Reset</v-btn>
                    <v-btn elevation=3 color='success' :flat='false' :disabled="!allInputsFilled"
                        @click="handleSubmit">Submit</v-btn>
                </v-btn-group>
            </v-card-actions>
        </v-card>



    </div>
</template>
  
<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
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

const sentence = ref('democracy');
const lowerCaseSentence = sentence.value.toLowerCase();
const uniqueLettersInSentence = Array.from(new Set(lowerCaseSentence.match(/[a-zA-Z]/g) || []));

const remainingAlphabets = _.difference(alphabets, uniqueLettersInSentence);

// Randomly pick X letters from remainingAlphabets
const extraLetters = _.sampleSize(remainingAlphabets, uniqueLettersInSentence.length);

// Combine and sort
const displayedLetters = [...new Set([...uniqueLettersInSentence, ...extraLetters])].sort();

const displayedEmojiDict = Object.fromEntries(
    displayedLetters.map(letter => [letter, emojiDict[letter]])
);

// Convert it to an array if needed

const cleanedSentenceArray = ref([]);
const inputRefs = ref([]);
const allInputsFilled = computed(() => cleanedSentenceArray.value.every(charObj => charObj.input ? charObj.userInput : true));

const cleanSentence = () => {
    console.debug(js_vars)
    nextTick(() => {
        inputRefs.value[0].focus();
    });
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

const gridStyle = computed(() => {
    const columnCount = Object.keys(displayedEmojiDict).length;
    return {
        'grid-template-columns': `repeat(${columnCount}, minmax(50px, 1fr))`,
        'grid-template-rows': 'repeat(2, auto)',
    };
});

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

const handleReset = () => {
    cleanedSentenceArray.value.forEach(charObj => {
        if (charObj.input) {
            charObj.userInput = '';
        }
    });
    nextTick(() => {
        if (inputRefs.value[0]) {
            inputRefs.value[0].focus();
        }
    });
};

const handleSubmit = () => {
    // Validate the sentence and perform the submission logic here
};



onMounted(cleanSentence);
</script>
  
<style scoped>
@media (max-width: 480px) {
    html {
        font-size: 10px;
        /* Adjust this value as needed */
    }
}

.input-flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    min-height: 50px;
}

.input-flex-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 80px;
    /* Adjust this value to increase the height */
    max-width: 40px;
    /* You can adjust this value */
    width: 100%;
    /* Take up full width up to max-width */
}

.input-flex-item input {
    min-height: 60px;
}

.dictionary-text-card {
    line-height: 2rem !important;
}

.flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    line-height: normal;
}

.flex-item {
    border: 0.5px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.emoji,
.letter {
    font-size: 1.5rem;
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
    min-height: 50px !important;
    text-align: center;
    font-size: 1.5rem;
    border: none;
    border-bottom: 2px solid black;
}


.non-selectable {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}</style>
  