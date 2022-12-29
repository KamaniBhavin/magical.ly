import React, {FC, useState} from "react";
import "./magically-toolbar-twitter.css"
import Loading from "../../components/Loading";
import {MagicalTextOption} from "../../types/Magically";


const twitterMoods = [
    {emoji: "😂", value: "Laughing"},
    {emoji: "😍", value: "Loving"},
    {emoji: "😮", value: "Surprised"},
    {emoji: "🎉", value: "Celebrating"},
    {emoji: "🤔", value: "Thinking"},
    {emoji: "😕", value: "Confused"},
    {emoji: "👍", value: "Agreeing"},
]

const MagicalToolbarTwitter: FC<{
    loading: boolean,
    error: string,
    setPromptParams: (type: MagicalTextOption, mood: string) => any
}> = ({loading, error, setPromptParams}) => {
    const [selectedMood, setSelectedMood] = useState("Loving")


    return <div className="magical-toolbar">
        <div className="magical-toolbar__section">
            {
                twitterMoods.map((mood) => (
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

        <div className="magical-toolbar__section magical-toolbar__action-section ">
            {error.length
                ? <div className="magical-toolbar__option-container">
                    <span className="magical-toolbar__option-btn--tooltip">{error.substring(0, 32).concat("...")}</span>
                    <button className="magical-toolbar__option-btn magical-toolbar__error-btn">Error</button>
                </div>
                : <button
                    disabled={loading}
                    onClick={() => setPromptParams("write", selectedMood)}
                    className={`magical-toolbar__option-btn magical-toolbar__primary-btn ${loading ? "magical-toolbar__primary-btn--disabled" : ""}`}>
                    Write
                </button>}
        </div>

        <div className="magical-toolbar__section">
            {loading ? <Loading/> : <></>}
        </div>

    </div>
}

export default MagicalToolbarTwitter