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
                        <div v-for="(emoji, letter) in partialDict" :key="letter" class="flex-item">
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

        <v-alert color="info" class="m-3 p-3 my-3" v-if="player_completed" style="opacity: 1; z-index: 10000;">
            You completed the puzzle! Please wait for the other player to finish.
        </v-alert>
        <v-card outlined elevation="3" class="m-3 p-3 my-3" :class="{ 'is-disabled': player_completed }">
            <v-card-title>
                Encoded Word:
            </v-card-title>
            <v-card-text>
                <!-- Grid container for emojis and input fields -->
                <div class="input-flex-container">
                    <template v-for="(charObj, index) in decodedWordForInput" :key="index">
                        <div class="input-flex-item non-selectable">
                            <div class="emoji" v-html="charObj.letter"></div>
                            <div>
                                <input class="input-field" autocomplete="off" :name="`input-${charObj.inputIndex}`"
                                    v-model="userInputData[charObj.inputIndex]"
                                    @input="handleInput(charObj.inputIndex, $event.target.value)"
                                    @keydown="handleKeydown(charObj.inputIndex, $event)" ref="inputRefs" type="text"
                                    maxlength="1" @focus="handleFocus($event)" />
                            </div>
                        </div>
                    </template>

                </div>
                <div class="text-secondary font-weight-light text-blue-grey-darken-2">
                    You can use uppercase or lowercase letters—it doesn't matter
                </div>
            </v-card-text>
            <v-card-actions>

                <v-btn-group>
                    <v-btn elevation=3 color="danger" @click="handleReset">Reset</v-btn>
                    <v-btn elevation=3 color='success' :flat='false' :disabled="!allCorrect"
                        @click="">Submit</v-btn>

                </v-btn-group>
                <v-alert color="red" class="mx-1" v-if="isWrongDecoded">
                    The word is incorrect. Please try again.
                </v-alert>
                <v-alert color="primary" class="mx-1" v-if="allCorrect">
                    Correct, now you can click 'Submit' button or hit 'Enter'.
                </v-alert>
            </v-card-actions>
        </v-card>



    </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, watch, nextTick, computed } from 'vue';
import { useWebSocketStore } from '../store';
import { storeToRefs } from "pinia";

const wsStore = useWebSocketStore();
const { encodedWord, partialDict, group_completed, decodedWord, player_completed } = storeToRefs(wsStore);
// lets watch group_completed:
watch(group_completed, (newVal) => {
    if (newVal === true) {
        $('#form').submit()
    }

})

const showModal = ref(false)

const startTime = ref(new Date().toISOString());

const endTime = ref(null);
const timeElapsed = ref(null);
const errorMessage = ref("The word is incorrect. Please try again.");
const userInputData = ref({});
const inputRefs = ref([]);

const allInputsFilled = computed(() => {
    return decodedWordForInput.value.every(item => {
        return userInputData.value[item.inputIndex] && userInputData.value[item.inputIndex].trim() !== '';
    });
});



const allCorrect = computed(() => {
    // Collect user inputs in the order of their indices and join them into a single string
    const userInputString = Object.keys(userInputData.value)
        .sort((a, b) => a - b) // Sort keys to ensure they are in the correct order
        .reduce((acc, key) => acc + userInputData.value[key], '').toLowerCase();;

    // Compare the formed string with the decodedWord from the store
    return userInputString === decodedWord.value.toLowerCase();;
});
const decodedWordForInput = computed(() => encodedWord.value.map((emoji, index) => {
    return {
        letter: emoji,
        userInput: userInputData.value[index] || '',
        inputIndex: index
    }
}))

const isWrongDecoded = computed(() => {
    return allInputsFilled.value && !allCorrect.value;
});

 

const handleInput = (inputIndex, value) => {

    errorMessage.value = '';
    if (value && value.length === 1) {
        nextTick(() => {
            if (inputRefs.value[inputIndex + 1]) {
                inputRefs.value[inputIndex + 1].focus();
            }
        });
    }
    userInputData.value[inputIndex] = value;

};






const handleKeydown = (inputIndex, event) => {
    console.debug('event', event.key)
    // Handle "Enter" key to navigate to the next input or submit the form
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent form submission
        if (allInputsFilled.value) {
            if (allCorrect.value) {
                handleSubmit();
            } else {
                errorMessage.value = 'The word is incorrect. Please try again.';
            }
        } else {

            // Focus on the next input field
            nextTick(() => {
                const nextInputIndex = inputIndex + 1;
                if (inputRefs.value[nextInputIndex]) {
                    inputRefs.value[nextInputIndex].focus();
                }
            });
        }
    }
    if (event.key === 'Backspace') { console.debug('backspace', inputIndex, userInputData.value) }
    // Handle "Backspace" key to delete and move to the previous input if the current is empty
    if (event.key === 'Backspace') {
        const inputIsEmptyOrUndefined = userInputData.value[inputIndex] === '' || userInputData.value[inputIndex] === undefined;
        if (inputIsEmptyOrUndefined) {
            // Optionally, prevent default to stop any further backspace actions
            event.preventDefault();
            const previousInputIndex = inputIndex - 1;
            if (previousInputIndex >= 0 && inputRefs.value[previousInputIndex]) {
                inputRefs.value[previousInputIndex].focus();
            }
        }
    }
    if (event.key === 'ArrowLeft') {
        const previousInputIndex = inputIndex - 1;
        if (previousInputIndex >= 0 && inputRefs.value[previousInputIndex]) {
            event.preventDefault();
            inputRefs.value[previousInputIndex].focus();
        }
    }

    // Handle right arrow key for navigation to the next input
    if (event.key === 'ArrowRight') {
        const nextInputIndex = inputIndex + 1;
        if (nextInputIndex < inputRefs.value.length && inputRefs.value[nextInputIndex]) {
            event.preventDefault();
            inputRefs.value[nextInputIndex].focus();
        }
    }
};


const handleFocus = (event) => {
    event.target.select();
};

const handleReset = () => {
    // Clear the error message
    errorMessage.value = '';

    // Reset all user inputs
    Object.keys(userInputData.value).forEach(key => {
        userInputData.value[key] = '';
    });

    // Trigger reactivity update in Vue
    userInputData.value = { ...userInputData.value };

    // Focus the first input element after Vue updates the DOM
    nextTick(() => {
        if (inputRefs.value[0]) {
            inputRefs.value[0].focus();
        }
    });
};



const handleSubmit = () => {

    errorMessage.value = 'Correct!';
    endTime.value = new Date().toISOString();
    timeElapsed.value = (new Date(endTime.value) - new Date(startTime.value)) / 1000;

    wsStore.sendMessage(
                'answer',
                {
                    completedAt: new Date().toISOString(),
                    startTime: startTime.value,
                    endTime: endTime.value,
                    timeElapsed: timeElapsed.value,

                }
            )

};



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
    font-size: 2.5rem;
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

.is-disabled {
    pointer-events: none;
    /* Prevents clicking and interactions */
    opacity: 0.5;
    /* Greys out the content visually */
}
</style>