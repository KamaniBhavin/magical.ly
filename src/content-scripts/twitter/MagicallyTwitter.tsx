import React, {FC, useEffect, useState} from "react";
import {EventSourceMessage} from "@microsoft/fetch-event-source";
import {GPTCompletionToken} from "../../utils/constants";
import {GPTRequest, GPTResponse} from "../../types/GPT";
import useFetchEventSource from "../../hooks/useFetchEventSource";
import {MagicalTextOption} from "../../types/Magically";
import MagicalToolbarTwitter from "./MagicalToolbarTwitter";
import {ChromeMessage, ChromeMessageResponse} from "../../types/Chrome";

function createGPTRequestBody(
    type: MagicalTextOption,
    text: string | null,
    context: string,
    mood: string, length: string
): GPTRequest {
    let promptForGPT;

    console.log("context", context)

    if (context) {
        promptForGPT = `Write a tweet to reply to ${context}. It should sound like ${mood}. It should be ${length}.`;
    } else {
        promptForGPT = `Write a tweet. It should sound like ${mood}. It should be ${length}.`;
    }

    return {
        model: "text-davinci-003",
        prompt: promptForGPT,
        stream: true,
        max_tokens: 256,
    }
}

const MagicallyTwitter: FC<{ target: HTMLElement, context: string }> = ({target, context}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        (async () => {
                const {userId} = await chrome.storage.sync.get(["userId"]);
                if (!userId) {
                    setError("Please login!");
                }
            }
        )()
    })

    async function setPromptParams(type: MagicalTextOption, mood: string) {
        setLoading(true)
        const dataTransfer = new DataTransfer();


        const endpoint = "/completions"
        const body = createGPTRequestBody(type, target.textContent, context, mood, "short")

        function onOpen() {
            setLoading(false);
            target.dispatchEvent(new ClipboardEvent("cut", {clipboardData: dataTransfer}));
        }

        function onMessage(event: EventSourceMessage) {
            if (event.data != GPTCompletionToken) {
                const parsed: GPTResponse = JSON.parse(event.data)
                const token = parsed.choices[0].text

                if (!target.textContent && token == "\n") {
                    return;
                }

                dataTransfer.setData("text/plain", token);

                target.dispatchEvent(new ClipboardEvent("paste", {
                    clipboardData: dataTransfer,
                    bubbles: true,
                    cancelable: true,
                }));

                dataTransfer.clearData();
            }
        }

        async function onClose() {
            target.click()
            target.dispatchEvent(new Event("input", {bubbles: true}))
            await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>(["deductCredits", {}])
        }

        function onError(error: any) {
            setLoading(false)
            setError(error)
        }

        await useFetchEventSource<GPTRequest>(endpoint, body, onOpen, onMessage, onClose, onError)
    }

    return <>
        <MagicalToolbarTwitter loading={loading} error={error} setPromptParams={setPromptParams}/>
    </>
}

export default MagicallyTwitter