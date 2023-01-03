import {fetchEventSource} from "@microsoft/fetch-event-source";


const openAPIBaseUrl = "https://api.openai.com/v1"

async function useFetchEventSource<T>(
    endpoint: string,
    body: T,
    onOpen: Function,
    onMessage: Function,
    onClose: Function,
    onError: Function
) {
    const {uniqueMagicalId} = await chrome.storage.sync.get("uniqueMagicalId");

    await fetchEventSource(`${openAPIBaseUrl}${endpoint}`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${uniqueMagicalId}`
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
                onClose()
            },
            onerror(error) {
                console.error(error)
                onError("I dunno, but I think we messed up 😰")
            }
        })
}

export default useFetchEventSource