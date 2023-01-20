import _ from "lodash";
import React, {FC} from "react";
import "./speech-recognition-button.css";


const SpeechRecognitionButton: FC<{
    isListening: Boolean,
    disabled: boolean,
    onClick: Function
}> = ({isListening, disabled, onClick}) => {
    return <button
        disabled={disabled}
        onClick={() => onClick()}
        className="speech-recognition-button">
        {
            isListening
                ? _.times(Math.max(Math.random() * 20, 15), (i) => {
                    return <div
                        key={i}
                        className="speech-recognition-button__strip"
                        style={{
                            animationDuration: `${Math.round(Math.random() * 2)}s`,
                        }}
                    />
                })
                : "Listen"
        }
    </button>
}

export default SpeechRecognitionButton;