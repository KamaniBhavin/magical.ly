type GPTRequestType = "completion" | "edit"

type Model = "text-davinci-003" | "text-davinci-edit-001"


export type GPTRequest = GPTCompletionRequest | GPTEditRequest

export interface GPTCompletionRequest {
    model: Model,
    prompt: string,
    stream: boolean,
    max_tokens: number
}
export interface GPTEditRequest {
    model: Model,
    input: string,
    instruction: string,
    stream: boolean
}


export interface GPTResponse {
    choices: GPTChoice[]
}

export interface GPTChoice {
    text: string
}