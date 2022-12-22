import React, {FC, useState} from "react";
import "../styles.css"
import Loading from "./Loading";
import {contentLengths, moods} from "../utils/constants";
import {MagicalTextOption} from "../types/Magically";

const MagicalToolbar: FC<{
    loading: boolean,
    error: string,
    setPromptParams: (type: MagicalTextOption, mood: string, length: string) => any
}> = ({loading, error, setPromptParams}) => {
    const [selectedMood, setSelectedMood] = useState("Neutral")
    const [selectedLength, setSelectedLength] = useState("Short & Sweet")


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
                    <button
                        disabled={loading}
                        onClick={() => setPromptParams("rephrase", selectedMood, selectedLength)}
                        className={`magical-toolbar__option-btn magical-toolbar__secondary-btn ${loading ? "magical-toolbar__secondary-btn--disabled" : ""}`}>
                        Rephrase
                    </button>
                </>}
        </div>

        <div className="magical-toolbar__section">
            {loading ? <Loading/> : <></>}
        </div>

    </div>
}

export default MagicalToolbar