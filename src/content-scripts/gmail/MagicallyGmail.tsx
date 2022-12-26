import React, {FC, useEffect, useState} from "react";
import MagicalToolbarGmail from "./MagicalToolbarGmail";
import {EventSourceMessage} from "@microsoft/fetch-event-source";
import {GPTCompletionToken, lengthToCredit, lengthToToken} from "../../utils/constants";
import {GPTRequest, GPTResponse} from "../../types/GPT";
import useFetchEventSource from "../../hooks/useFetchEventSource";
import {MagicalTextOption} from "../../types/Magically";
import "./magically-toolbar-gmail.css"

function createGPTRequestBody(type: MagicalTextOption, prompt: string, mood: string, length: string): GPTRequest {
    let promptForGPT;

    if (type == "write") {
        promptForGPT = `${prompt}. It should sound like ${mood} and keep it ${length} in length. Do not write subject of the mail.`
    } else {
        promptForGPT = `Rephrase ${prompt} to sound like ${mood} and keep it ${length} words long. Also, Fix the spelling mistakes`
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
            const obj = await chrome.storage.sync.get(["accessToken", "credits"]);
            if (!obj["accessToken"]) {
                setError("Login for a magical experience.")
            } else if (!obj["credits"] || obj["credits"] <= 0) {
                setError("Not Enough Credits!")
            }
        })()
    }, [])

    async function setPromptParams(type: MagicalTextOption, mood: string, length: string) {
        setLoading(true)

        if (target.textContent == null) {
            setError("Please add prompt for magically to work with!")
        } else {
            const endpoint = "/completions"
            const body = createGPTRequestBody(type, target.textContent, mood, length)

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
                const current = await chrome.storage.sync.get("credits")
                const count = Number(current["credits"])
                await chrome.storage.sync.set({credits: count - lengthToCredit[length]})
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