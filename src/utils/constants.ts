
export const GPTCompletionToken = "[DONE]"

export const lengthToToken: { [k: string]: number} = {
    "short": 64,
    "medium": 128,
    "long": 160
}

export const moods = [
    {emoji: "😍", value: "Happy"},
    {emoji: "🙏", value: "Thankful"},
    {emoji: "😀", value: "Neutral"},
    {emoji: "🙌", value: "Nicely done"}
]

export const contentLengths = [
    {emoji: "🤏", value: "short"},
    {emoji: "👌", value: "medium"},
    {emoji: "💪", value: "long"}
]