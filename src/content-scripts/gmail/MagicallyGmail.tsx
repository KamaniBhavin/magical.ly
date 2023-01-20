import React, {FC, useEffect, useState} from "react";
import MagicalToolbarGmail from "./MagicalToolbarGmail";
import {EventSourceMessage} from "@microsoft/fetch-event-source";
import {GPTCompletionToken, lengthToToken} from "../../utils/constants";
import {GPTRequest, GPTResponse} from "../../types/GPT";
import useFetchEventSource from "../../hooks/useFetchEventSource";
import {MagicalTextOption, SpeechRecognitionEvent} from "../../types/Magically";
import "./magically-toolbar-gmail.css"
import {ChromeMessage, ChromeMessageResponse} from "../../types/Chrome";

function createGPTRequestBody(type: MagicalTextOption, target: Element, mood: string, length: string): GPTRequest {
    let promptForGPT;

    const quote = target.querySelector(".gmail_quote")?.getElementsByTagName("blockquote")?.[0]?.firstChild?.textContent;

    if (quote) {
        promptForGPT = `Write a response to the following email: ${quote}`;
    } else if (type == "write") {
        promptForGPT = `${target.textContent}. It should sound like ${mood} and keep it ${length} in length. Do not write subject of the mail.`
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

const MagicallyGmail: FC<{ target: Element }> = ({target}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        (async () => {
                const {userId, tokens} = await chrome.storage.sync.get(["userId", "tokens"]);

                if (!userId) {
                    setError("Please login!");
                } else if (!tokens || tokens < 1) {
                    setError("Not enough tokens!");
                } else {
                    setError("");
                }
            }
        )()
    })

    function speechRecognitionEvent(event: SpeechRecognitionEvent, transcript: string) {
        switch (event) {
            case "start":
                target.textContent = "";
                break;
            case "result":
                target.textContent = "";
                target.textContent += transcript;
                break;
            case "final":
                target.textContent = "";
                target.textContent += transcript;
                break;
            default:
                break;
        }
    }

    async function setPromptParams(type: MagicalTextOption, mood: string, length: string) {
        setLoading(true)

        if (target.textContent == null) {
            setError("Please add prompt for magically to work with!")
        } else {
            const endpoint = "/completions"
            const body = createGPTRequestBody(type, target, mood, length)

            function onOpen() {
                target.textContent = ""
                setLoading(false)
            }

            function onMessage(event: EventSourceMessage) {
                const lineBreak = document.createElement("br")

                if (event.data != GPTCompletionToken) {
                    const parsed: GPTResponse = JSON.parse(event.data)
                    const token = parsed.choices[0].text

                    if (token == "\n") {
                        target.append(lineBreak)
                    } else {
                        target.append(token)
                    }

                } else {
                    const div = document.createElement("div")
                    div.className = "magical-whitespace"
                    div.append(lineBreak)
                    target.append(div)
                }
            }

            async function onClose() {
                await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>(["deductCredits", {}])
            }

            function onError(error: any) {
                setLoading(false)
                setError(error)
            }

            await useFetchEventSource<GPTRequest>(endpoint, body, onOpen, onMessage, onClose, onError)
        }
    }

    return <>
        <MagicalToolbarGmail
            loading={loading}
            error={error}
            setPromptParams={setPromptParams}
            speechRecognitionEvent={speechRecognitionEvent}
        />
    </>
}

export default MagicallyGmail