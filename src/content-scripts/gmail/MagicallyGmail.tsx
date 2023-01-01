import React, {FC, useState} from "react";
import MagicalToolbarGmail from "./MagicalToolbarGmail";
import {EventSourceMessage} from "@microsoft/fetch-event-source";
import {GPTCompletionToken, lengthToToken} from "../../utils/constants";
import {GPTRequest, GPTResponse} from "../../types/GPT";
import useFetchEventSource from "../../hooks/useFetchEventSource";
import {MagicalTextOption} from "../../types/Magically";
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
                    target.append(lineBreak)
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
        <MagicalToolbarGmail loading={loading} error={error} setPromptParams={setPromptParams}/>
    </>
}

export default MagicallyGmail