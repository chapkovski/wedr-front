<template>
  <SurveyComponent :model="survey" />
</template>

<script setup>
import { ref } from 'vue';
import { Model } from "survey-core";
import { Converter } from "showdown";

// Assuming that json and themeJson are imported similarly
import { json } from "./json";
import { themeJson } from "./theme";

const survey = new Model(json);

// Apply the theme if you use a customized one
survey.applyTheme(themeJson);
// Instantiate Showdown
const converter = new Converter();
    
// Add an onComplete event listener
survey.onComplete.add((sender, options) => {
  console.log(JSON.stringify(sender.data, null, 3));
});
 
survey.onTextMarkdown.add(function (survey, options) {
    // Convert Markdown to HTML
    let str = converter.makeHtml(options.text);
    // Remove root paragraphs <p></p>
    str = str.substring(3);
    str = str.substring(0, str.length - 4);
    // Set HTML markup to render
    options.html = str;
});
// Pre-fill some data
survey.data = {
  "nps-score": 9,
  "promoter-features": [
      "performance",
      "ui"
  ]
};
</script>
