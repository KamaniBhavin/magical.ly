import {fetchEventSource} from "@microsoft/fetch-event-source";


const openAPIBaseUrl = "https://api.openai.com/v1"
const GPTToken = "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"

async function useFetchEventSource<T>(endpoint: string, body:T, onOpen: Function, onMessage: Function, onError: Function) {
    await fetchEventSource(`${openAPIBaseUrl}${endpoint}`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPTToken}`
            },
            body: JSON.stringify(body),
            async onopen(res) {
                if (!res.ok || res.status !== 200) {
                    console.error(res)
                    onError("Could not established connection to server.")
                } else {
                    onOpen()
                }
            },
            onmessage(event) {
                onMessage(event)
            },
            onclose() {
                console.info("Successfully closed connection.")
            },
            onerror(error) {
                console.error(error)
                onError("I dunno, but I think we messed up 😰")
            }
        })
}

export default useFetchEventSource