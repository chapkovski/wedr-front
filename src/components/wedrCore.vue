<template>
    <div>
        <input type="hidden" name="startTime" :value="startTime">
        <input type="hidden" name="endTime" :value="endTime">
        <input type="hidden" name="timeElapsed" :value="timeElapsed">
        <v-card outlined elevation="3" class="m-3 p-3 my-3">

            <v-card-text class="m-3 p-3 dictionary-text-card non-selectable">
                <v-card-title>
                    Dictionary:
                </v-card-title>
                <div>
                    <div class="flex-container">
                        <div v-for="(emoji, letter) in fullDict" :key="letter" class="flex-item">
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


        <v-card outlined elevation="3" class="m-3 p-3 my-3">
            <v-card-title>
                Encoded Word:
            </v-card-title>
            <v-card-text>
                <!-- Grid container for emojis and input fields -->
                <div class="input-flex-container">
                    <template v-for="(charObj, index) in cleanedSentenceArray" :key="index">
                        <div class="input-flex-item non-selectable">
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
                    <v-btn elevation=3 color='success' :flat='false' :disabled="!allInputsFilled" @click="handleSubmit"
                        v-if="false">Submit</v-btn>

                </v-btn-group>
                <v-alert color="red" class="mx-1" v-if="errorMessage">{{ errorMessage }}</v-alert>
            </v-card-actions>
        </v-card>
        <v-alert color="info" class="m-3 p-3 my-3" v-if="youCompleted">
            You completed the puzzle! Please wait for the other player to finish.
        </v-alert>


    </div>
</template>
  
<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';

import { useWebSocketStore } from '../store';

const wsStore = useWebSocketStore();
import _ from 'lodash';
const youCompleted = ref(false);
const sentence = ref(window.encodedWord);
const displayedEmojiDict = ref(window.groupDict)
const fullDict = window.partialDict;
const startTime = ref(new Date().toISOString());
const lastInputHappensAt = ref(new Date());
const sinceLastInput = ref(0);
const endTime = ref(null);
const timeElapsed = ref(null);
const cleanedSentenceArray = ref([]);
const inputRefs = ref([]);
const allInputsFilled = computed(() => cleanedSentenceArray.value.every(charObj => charObj.input ? charObj.userInput : true));

const cleanSentence = () => {

    nextTick(() => {
        if (inputRefs.value[0]) {
            inputRefs.value[0].focus();
        } else {
            console.debug("No input to focus on.");
        }
    });

    let inputIndex = 0;
    console.debug('sentence.value: ', sentence.value)
    console.debug('sentence length: ', sentence.value.length)
    cleanedSentenceArray.value = Array.from(sentence.value).map((emoji) => {
        // Check if the emoji has a corresponding letter in the dictionary
        let isInput = Object.values(displayedEmojiDict.value).includes(emoji);
        let symbol = isInput ? emoji : (emoji === ' ' ? '&nbsp;' : emoji);


        return {
            letter: symbol,
            input: isInput,
            userInput: '',
            inputIndex: isInput ? inputIndex++ : null,
        };
    });
};




const handleInput = (inputIndex) => {


    errorMessage.value = '';
    const currentInput = cleanedSentenceArray.value.find(o => o.inputIndex === inputIndex);
    if (currentInput && currentInput.userInput.length === 1) {
        nextTick(() => {
            if (inputRefs.value[inputIndex + 1]) {
                inputRefs.value[inputIndex + 1].focus();
            }
        });
    }
    sinceLastInput.value = (new Date() - lastInputHappensAt.value) / 1000;

    lastInputHappensAt.value = new Date();
    wsStore.sendMessage(
        'input',
        {
            input: currentInput.userInput, inputIndex: inputIndex, utcTime: new Date().toISOString(),
            sinceLastInput: sinceLastInput.value
        }
    )
    const allInputsFilled = cleanedSentenceArray.value.every(
        (input) => input.userInput.trim().length > 0
    );

    if (allInputsFilled) {
        const userInputString = cleanedSentenceArray.value
            .map(obj => obj.userInput.toLowerCase())
            .join('');
        const invertedDict = _.invert(window.groupDict);
        const encodedPhraseArray = Array.from(sentence.value);
        const decodedWord = encodedPhraseArray
            .map(emoji => invertedDict[emoji] || emoji)
            .join('');

        if (decodedWord === userInputString) {
            youCompleted.value = true;
            // Send a WebSocket message for successful decoding
            wsStore.sendMessage('completed', {
                decodedWord: userInputString,
                completedAt: new Date().toISOString(),
                timeElapsed: (new Date() - new Date(startTime.value)) / 1000,
                startTime: startTime.value,

            });
        } else {
            errorMessage.value = 'Incorrect decoding. Please try again.';
        }
    }
};




const handleKeydown = (inputIndex, event) => {

    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent form submission
        if (allInputsFilled.value) {
            // handleSubmit();
        } else {
            // Focus on the next input field
            nextTick(() => {
                if (inputRefs.value[inputIndex + 1]) {
                    inputRefs.value[inputIndex + 1].focus();
                }
            });
        }
    }
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
    errorMessage.value = '';
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

const errorMessage = ref('');

const handleSubmit = () => {
    console.debug('we are in handleSubmit')
    let isValid = true;

    // let's first get the decoded value:
    const invertedDict = _.invert(window.groupDict)

    const encodedPhraseArray = Array.from(sentence.value);
    const decodedWord = encodedPhraseArray.map(emoji => invertedDict[emoji] || emoji).join('');


    const userInputString = cleanedSentenceArray.value.map(obj => obj.userInput.toLowerCase()).join('');

    if (decodedWord !== userInputString) {
        isValid = false;
    }

    if (isValid) {
        errorMessage.value = 'Correct!';
        endTime.value = new Date().toISOString();
        timeElapsed.value = (new Date(endTime.value) - new Date(startTime.value)) / 1000;

        nextTick(() => {
            $('#form').submit()
        });
        // Perform any additional logic for correct submission
    } else {
        errorMessage.value = 'Incorrect decoding. Please try again.';
    }
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
}
</style>
  