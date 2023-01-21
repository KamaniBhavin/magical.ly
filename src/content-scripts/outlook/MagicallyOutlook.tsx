import React, {FC, useEffect, useState} from "react";
import MagicalToolbarOutlook from "./MagicalToolbarOutlook";
import {EventSourceMessage} from "@microsoft/fetch-event-source";
import {GPTCompletionToken, lengthToToken} from "../../utils/constants";
import {GPTRequest, GPTResponse} from "../../types/GPT";
import useFetchEventSource from "../../hooks/useFetchEventSource";
import {MagicalTextOption, SpeechRecognitionEvent} from "../../types/Magically";
import "./magically-toolbar-outlook.css"
import {ChromeMessage, ChromeMessageResponse} from "../../types/Chrome";

function createGPTRequestBody(type: MagicalTextOption, target: Element, mood: string, length: string): GPTRequest {
    let promptForGPT, promptPrefix;

    /**
     * Similar to `gmail-quote` but for Outlook.
     * This is a bit hacky but it works.
     **/
    if (target.nextElementSibling) {
        promptPrefix = `Write an reply for ${target.nextElementSibling.textContent}`;
    } else {
        promptPrefix = target.textContent;
    }

    if (type == "write") {
        promptForGPT = `${promptPrefix}. It should sound like ${mood} and keep it ${length} in length. Do not write subject of the mail.`
    } else {
        promptForGPT = `Rephrase ${target.textContent} to sound like ${mood} and keep it ${length} words long. Also, Fix the spelling mistakes`
    }

    return {
        model: "text-davinci-003",
        prompt: promptForGPT,
        stream: true,
        max_tokens: promptForGPT.length + lengthToToken[length]
    }
}

const MagicallyOutlook: FC<{ target: Element }> = ({target}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const dataTransfer = new DataTransfer();

    function speechRecognitionEvent(event: SpeechRecognitionEvent, transcript: string) {
        switch (event) {
            case "start":
                target.firstElementChild!.textContent = ""
                break;
            case "result":
                target.firstElementChild!.textContent = ""
                dataTransfer.setData("text/plain", transcript);
                target.firstElementChild!.dispatchEvent(new ClipboardEvent("paste", {
                    clipboardData: dataTransfer,
                    bubbles: true,
                    cancelable: true,
                }));
                dataTransfer.clearData()
                break;
            case "final":
                target.firstElementChild!.textContent = ""
                dataTransfer.setData("text/plain", transcript);
                target.firstElementChild!.dispatchEvent(new ClipboardEvent("paste", {
                    clipboardData: dataTransfer,
                    bubbles: true,
                    cancelable: true,
                }));
                dataTransfer.clearData()
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        (async () => {
                const {userId} = await chrome.storage.sync.get(["userId"]);

                if (!userId) {
                    setError("Please login!");
                }
            }
        )()
    }, [])

    async function setPromptParams(type: MagicalTextOption, mood: string, length: string) {
        setLoading(true)

        const endpoint = "/completions"
        const body = createGPTRequestBody(type, target, mood, length)

        function onOpen() {
            target.firstElementChild!.textContent = ""
            setLoading(false)
        }

        function onMessage(event: EventSourceMessage) {
            if (event.data != GPTCompletionToken) {
                const parsed: GPTResponse = JSON.parse(event.data)
                const token = parsed.choices[0].text

                dataTransfer.setData("text/plain", token);
            } else {
                dataTransfer.setData("text/plain", "\n\n\n");
            }

            target.firstElementChild!.dispatchEvent(new ClipboardEvent("paste", {
                clipboardData: dataTransfer,
                bubbles: true,
                cancelable: true,
            }));

            dataTransfer.clearData();
        }

        async function onClose() {
            await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>(["deductCredits", {}])
        }

        function onError(error: any) {
            setLoading(false)
            setError(error)
        }

        await useFetchEventSource<GPTRequest>(endpoint, body, onOpen, onMessage, onClose, onError);
    }

    return <>
        <MagicalToolbarOutlook
            loading={loading}
            error={error}
            setPromptParams={setPromptParams}
            speechRecognitionEvent={speechRecognitionEvent}
        />
    </>
}

export default MagicallyOutlook