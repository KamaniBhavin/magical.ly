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
    const [selectedLength, setSelectedLength] = useState("short")


    return <div className="magical-toolbar">
        <div className="magical-toolbar__section">
            {
                moods.map((mood) => (
                    <button
                        key={mood.value}
                        className={`magical-toolbar__option-btn ${mood.value == selectedMood ? "magical-toolbar__option-btn--selected" : ""}`}
                        onClick={() => setSelectedMood(mood.value)}>
                        {mood.emoji}</button>
                ))
            }
        </div>

        <div className="magical-toolbar__section">
            {
                contentLengths.map((length) => (
                    <button
                        key={length.value}
                        className={`magical-toolbar__option-btn ${length.value == selectedLength ? "magical-toolbar__option-btn--selected" : ""}`}
                        onClick={() => setSelectedLength(length.value)}>
                        {length.emoji}
                    </button>
                ))
            }
        </div>

        <div className="magical-toolbar__section magical-toolbar__write-section ">
            <button
                onClick={() => setPromptParams("write", selectedMood, selectedLength)}
                className="magical-toolbar__option-btn magical-toolbar__write-btn">
                Write
            </button>
            <button
                onClick={() => setPromptParams("rephrase", selectedMood, selectedLength)}
                className="magical-toolbar__option-btn magical-toolbar__rephrase-btn">
                Rephrase
            </button>
        </div>

        <div className="magical-toolbar__section">
            {loading ? <Loading/> : <></>}
            {error.length
                ? <button className="magical-toolbar__option-btn magical-toolbar__error-btn">Error</button>
                : <></>}
        </div>

    </div>
}

export default MagicalToolbar