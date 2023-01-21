import {SpeechRecognitionEvent} from "../types/Magically";
import {useState} from "react";

function useSpeechRecognition(
    speechRecognitionEvent: (event: SpeechRecognitionEvent, transcript: string) => void
) {
    const [isListening, setIsListening] = useState(false);

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onaudiostart = () => {
        setIsListening(true);
    }

    recognition.onresult = (event) => {
        const results = event.results;
        const transcript = results[results.length - 1][0].transcript;

        if (results[results.length - 1].isFinal) {
            recognition.stop();
            speechRecognitionEvent("final", transcript);
        } else {
            speechRecognitionEvent("result", transcript);
        }
    }

    recognition.onspeechend = function () {
        recognition.stop();
        setIsListening(false);
        speechRecognitionEvent("end", "");
    }

    recognition.onnomatch = function () {
        recognition.stop();
        console.error("Speech recognition could not understand what you said.")
    }

    recognition.onerror = function (event) {
        recognition.stop();
        console.error(`Speech recognition error occurred: ${event.error}`)
    }

    return {isListening, recognition};
}

export default useSpeechRecognition