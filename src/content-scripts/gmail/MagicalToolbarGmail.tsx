import React, {FC, useState} from "react";
import "./magically-toolbar-gmail.css"
import Loader from "../../components/Loader";
import {contentLengths, moods} from "../../utils/constants";
import {MagicalTextOption, SpeechRecognitionEvent} from "../../types/Magically";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import SpeechRecognitionButton from "../../components/SpeechRecognitionButton";

const MagicalToolbarGmail: FC<{
    loading: boolean,
    error: string,
    setPromptParams: (type: MagicalTextOption, mood: string, length: string) => any
    speechRecognitionEvent: (event: SpeechRecognitionEvent, transcript: string) => any
}> = ({loading, error, setPromptParams, speechRecognitionEvent}) => {
    const [selectedMood, setSelectedMood] = useState("Neutral")
    const [selectedLength, setSelectedLength] = useState("Short & Sweet")
    const {isListening, recognition} = useSpeechRecognition(speechRecognitionEvent);

    function handleSpeechRecognition() {
        speechRecognitionEvent("start", "");
        recognition.start();
    }

    return <div className="magical-toolbar">
        <div className="magical-toolbar__section">
            {
                moods.map((mood) => (
                    <div key={mood.value} className="magical-toolbar__option-container">
                        <span className="magical-toolbar__option-btn--tooltip">{mood.value}</span>
                        <button
                            className={`magical-toolbar__option-btn ${mood.value == selectedMood ? "magical-toolbar__option-btn--selected" : ""}`}
                            onClick={() => setSelectedMood(mood.value)}>
                            {mood.emoji}</button>
                    </div>

                ))
            }
        </div>

        <div className="magical-toolbar__section">
            {
                contentLengths.map((length) => (
                    <div key={length.value} className="magical-toolbar__option-container">
                        <span className="magical-toolbar__option-btn--tooltip">{length.value}</span>
                        <button
                            className={`magical-toolbar__option-btn ${length.value == selectedLength ? "magical-toolbar__option-btn--selected" : ""}`}
                            onClick={() => setSelectedLength(length.value)}>
                            {length.emoji}
                        </button>
                    </div>
                ))
            }
        </div>

        <div className="magical-toolbar__section magical-toolbar__action-section ">
            {error.length
                ? <div className="magical-toolbar__option-container">
                    <span className="magical-toolbar__option-btn--tooltip">{error.substring(0, 32).concat("...")}</span>
                    <button className="magical-toolbar__option-btn magical-toolbar__error-btn">Error</button>
                </div>
                : <>
                    <button
                        disabled={loading}
                        onClick={() => setPromptParams("write", selectedMood, selectedLength)}
                        className={`magical-toolbar__option-btn magical-toolbar__primary-btn ${loading ? "magical-toolbar__primary-btn--disabled" : ""}`}>
                        Write
                    </button>
                    <SpeechRecognitionButton
                        disabled={loading}
                        onClick={handleSpeechRecognition}
                        isListening={isListening}
                    />
                </>}
        </div>

        <div className="magical-toolbar__section">
            {loading ? <Loader/> : <></>}
        </div>

    </div>
}

export default MagicalToolbarGmail