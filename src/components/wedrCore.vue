<template>
    <v-container>
        <v-row>
            <v-col>

                <v-card elevation="3" outlined>
                    <v-card-text>

                        <v-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th v-for="letter in lettersRef" :key="letter">{{ letter }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td v-for="letter in letters" :key="letter">{{ letterNumberMapRef[letter] }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-table>

                    </v-card-text>
                </v-card>
                <!-- Card displaying the encoded word and input for decoded word -->
                <v-card>
                    <v-card-title>
                        Encoded Sentence
                    </v-card-title>
                    <v-card-text>
                        <!-- Grid container for emojis and input fields -->
                        <div class="grid-container">
                            <!-- Display all emojis -->
                            <template v-for="(emoji, index) in encodedSentenceRef" :key="'emoji-' + index">
                                <div class="grid-item emoji non-selectable" :style="{ gridRow: 1, gridColumn: index + 1 }">{{ emoji }}
                                </div>
                            </template>
                            <!-- Display all input fields or spaces -->
                            <template v-for="(emoji, index) in encodedSentenceRef" :key="'input-' + index">
                                <div class="grid-item" :style="{ gridRow: 2, gridColumn: index + 1 }">
                                    <input v-if="emoji !== ' ' && emoji !== ','" :name="`input-${index}`" type="text"
                                        maxlength="1" autocomplete="off" ref="inputFields" class="letter-input"
                                        @input="handleInput(cleanedIndex++, $event)" />
                                    <span v-else>&nbsp;</span>
                                </div>
                            </template>

                        </div>
                        <!-- Submit button -->
                        <v-btn v-if="isAllFilled" @click="validateWord">Submit</v-btn>
                        <v-btn @click="resetInputs">Reset</v-btn>
                        <!-- Validation message -->
                        <div>{{ validationMessage }}</div>
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>
  
<script setup>
import _ from 'lodash';
import { ref, computed } from 'vue';
const sentence = "hello world";  // Replace with the sentence you want to encode
const uniqueLetters = Array.from(new Set(sentence.replace(/\s/g, '')));
const uniqueLettersLength = uniqueLetters.length;

// Generate an emoji list of length (uniqueLettersLength * 2)
// You should replace this with the emojis you want to use.
const emojis = [
    "◾️", "🔞", "➕", "⏰", "💄", "🙋", "🔇", "❔", "🐦", "🐁",
    "⤴️", "📥", "🛐", "🍤", "🆙", "🌩", "↗️", "🐒", "🔺", "✖️",
    "📩", "🍱", "☀️", "😈", "🔻", "❣", "⛑", "🍰", "😳", "🎣",
    "😾", "🕧", "🔱", "💤", "🏰", "🆒", "🐃", "🐏", "👛", "🙍",
    "🚤", "🕵", "🌏", "🔷", "🎛", "🔽", "✅", "😮", "💸", "🎡"
].slice(0, uniqueLettersLength * 2);
// Shuffle the emojis
const shuffledEmojis = _.shuffle(emojis);

// Create mapping and encoded sentence
const letterEmojiMap = Object.fromEntries(uniqueLetters.map((letter, index) => [letter, shuffledEmojis[index]]));


// Create mapping and encoded sentence

const encodedSentence = sentence.split('').map(letter => {
    return (letter === ' ' || letter === ',') ? letter : letterEmojiMap[letter];
});


// Reactive refs

const encodedSentenceRef = ref(encodedSentence);


const cleanedSentence = sentence.replace(/[^\w\s]|_/g, "").replace(/\s+/g, "");
const cleanedSentenceArray = Array.from(cleanedSentence);

// Reactive refs
const cleanedSentenceRef = ref(cleanedSentenceArray);
const decodedSentence = ref(Array(cleanedSentence.length).fill(''));

const inputFields = ref(null);  // Create a ref to store the input elements
let cleanedIndex = 0;  // Initialize a separate index for actual input fields



const handleInput = (index, event) => {
    decodedSentence.value[index] = event.target.value;

    // Move focus to the next input field
    const nextIndex = index + 1;
    if (nextIndex < decodedSentence.value.length) {
        inputFields.value[nextIndex].focus();
    }
};
const resetInputs = () => {
    // Manually clear all input fields
    for (let i = 0; i < inputFields.value.length; i++) {
        inputFields.value[i].value = '';
    }

    // Reset decodedSentence to an array of empty strings
    decodedSentence.value = Array(cleanedSentence.length).fill('');

    // Reset separate index for actual input fields
    cleanedIndex = 0;

    // Set focus to the first input field
    if (inputFields.value.length > 0) {
        inputFields.value[0].focus();
    }
};



const isAllFilled = computed(() => {
    return !decodedSentence.value.includes('');
});

const validationMessage = ref("");

const validateWord = () => {
    const decodedWord = decodedSentence.value.join('');
    if (decodedWord === cleanedSentence) {
        validationMessage.value = "Correct!";
    } else {
        validationMessage.value = "Wrong, try again.";
    }
};


</script>

<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    /* Adjusted size */
    gap: 0px 4px;
}

.grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    /* Explicitly set the height */
    width: 50px;
    /* Explicitly set the width */
}

.emoji {
    font-size: 3em;
    /* Increased size */
}

.letter-input {
    width: 100%;
    font-size: 1.5em;
    /* Increased size */
    border: none;
    border-bottom: 2px solid black;
    text-align: center;
}

.non-selectable {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>
  