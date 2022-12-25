import {Provider} from "@supabase/supabase-js";
import {UserData} from "./Magically";

type ChromeMessageResponseStatus = "success" | "error"

export interface ChromeLoginMessage {
    provider: Provider
}

export interface ChromeGetUserMessage {
    accessToken: string
}

export type ChromeMessage = ["login", ChromeLoginMessage] | ["logout", {}] | ["fetchUser", ChromeGetUserMessage]


export interface ChromeLoginResponse {
    accessToken: string
}

export interface ChromeLogoutResponse {
    message: string
}

export interface ChromeFetchUserResponse {
    user: UserData
}

export interface ChromeErrorResponse {
    error: string
}

export type ChromeMessageResponse =
    ["login_success", ChromeLoginResponse] |
    ["logout_success", ChromeLogoutResponse] |
    ["fetch_user", ChromeFetchUserResponse] |
    ["error", ChromeErrorResponse]
