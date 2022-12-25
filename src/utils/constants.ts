
export const GPTCompletionToken = "[DONE]"

export const contentLengths = [
    {emoji: "🤏", value: "Short & Sweet"},
    {emoji: "👌", value: "Medium"},
    {emoji: "💪", value: "Long"}
]
export const lengthToToken: { [k: string]: number } = {
    "Short & Sweet": 64,
    "Medium": 96,
    "Long": 160
}

export const lengthToCredit: { [k: string]: number } = {
    "Short & Sweet": 1,
    "Medium": 3,
    "Long": 5
}


export const moods = [
    {emoji: "😀", value: "Grinning"},
    {emoji: "🙏", value: "Thankful"},
    {emoji: "😑", value: "Neutral"},
    {emoji: "🙌", value: "Nicely done"},
    {emoji: "🥺", value: "Pleading"}
]