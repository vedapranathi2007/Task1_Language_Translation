// ==========================================
// AI LANGUAGE TRANSLATOR - JAVASCRIPT
// ==========================================


// Get HTML elements
const inputText = document.getElementById("inputText");

const sourceLanguage = document.getElementById("sourceLanguage");

const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");

const translateButtonText =
    document.getElementById("translateButtonText");

const loadingText =
    document.getElementById("loadingText");

const outputText =
    document.getElementById("outputText");

const copyButton =
    document.getElementById("copyButton");

const speakButton =
    document.getElementById("speakButton");

const clearButton =
    document.getElementById("clearButton");

const swapButton =
    document.getElementById("swapButton");

const characterCount =
    document.getElementById("characterCount");

const translationStatus =
    document.getElementById("translationStatus");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");


// ==========================================
// CHARACTER COUNTER
// ==========================================

inputText.addEventListener("input", function () {

    const count = inputText.value.length;

    characterCount.textContent =
        count + " / 5000";

});


// ==========================================
// SHOW ERROR MESSAGE
// ==========================================

function showError(message) {

    errorText.textContent = message;

    errorMessage.style.display = "block";

}


// ==========================================
// HIDE ERROR MESSAGE
// ==========================================

function hideError() {

    errorMessage.style.display = "none";

}


// ==========================================
// TRANSLATE BUTTON
// ==========================================

translateButton.addEventListener("click", async function () {

    hideError();

    const text = inputText.value.trim();

    const source = sourceLanguage.value;

    const target = targetLanguage.value;


    // Check if user entered text
    if (text === "") {

        showError("Please enter some text to translate.");

        return;
    }


    // Check if source and target are same
    if (source !== "auto" && source === target) {

        showError(
            "Source and target languages cannot be the same."
        );

        return;
    }


    // Show loading
    translateButtonText.style.display = "none";

    loadingText.style.display = "inline";

    translateButton.disabled = true;

    translationStatus.textContent =
        "Translating...";


    try {

        /*
         * IMPORTANT:
         * We will connect the Google Translation API
         * through a backend in the next step.
         *
         * For now, this code sends the request to:
         *
         * /translate
         */

        const response = await fetch("/translate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                text: text,

                source: source,

                target: target

            })

        });


        // Check whether request was successful
        if (!response.ok) {

            throw new Error(
                "Translation request failed."
            );

        }


        const data = await response.json();


        // Display translated text
        outputText.textContent =
            data.translation;


        translationStatus.textContent =
            "Translation completed";


    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to translate right now. Please try again."
        );

        translationStatus.textContent =
            "Translation failed";

    }


    // Hide loading
    translateButtonText.style.display = "inline";

    loadingText.style.display = "none";

    translateButton.disabled = false;

});


// ==========================================
// COPY BUTTON
// ==========================================

copyButton.addEventListener("click", async function () {

    const translatedText =
        outputText.textContent.trim();


    // Check if translation exists
    if (
        translatedText === "" ||
        translatedText ===
        "Your translated text will appear here..."
    ) {

        showError(
            "There is no translated text to copy."
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(
            translatedText
        );


        const originalText =
            copyButton.textContent;


        copyButton.textContent =
            "✅ Copied!";


        setTimeout(function () {

            copyButton.textContent =
                originalText;

        }, 2000);

    }

    catch (error) {

        showError(
            "Unable to copy the text."
        );

    }

});


// ==========================================
// TEXT TO SPEECH
// ==========================================

speakButton.addEventListener("click", function () {

    const text = outputText.textContent.trim();

    if (!text) {
        alert("There is no translated text to speak.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = targetLanguage.value;
    speech.rate = 0.8;
    speech.pitch = 1;

    speech.onstart = function () {
        console.log("Speech started");
    };

    speech.onerror = function (event) {
        console.log("Speech error:", event.error);
        alert("Voice could not be played. Please check your browser audio.");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
});

// ==========================================
// CLEAR BUTTON
// ==========================================

clearButton.addEventListener("click", function () {

    // Clear input
    inputText.value = "";


    // Reset character counter
    characterCount.textContent =
        "0 / 5000";


    // Reset output
    outputText.innerHTML =
        '<span class="placeholder-text">' +
        'Your translated text will appear here...' +
        '</span>';


    // Reset status
    translationStatus.textContent =
    "Ready";


    // Hide errors
    hideError();

});


// ==========================================
// SWAP LANGUAGES
// ==========================================

swapButton.addEventListener("click", function () {

    const source =
        sourceLanguage.value;

    const target =
        targetLanguage.value;


    // Don't swap if target is empty
    if (!target) {

        return;

    }


    // Change source language
    if (source === "auto") {

        sourceLanguage.value =
            target;

    }

    else {

        sourceLanguage.value =
            target;

        targetLanguage.value =
            source;

    }


    // If source was auto, keep target
    if (source === "auto") {

        targetLanguage.value =
            target;

    }


    hideError();

});