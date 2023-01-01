import {createClient, Provider} from "@supabase/supabase-js";
import {supabaseAnonKey, supabaseAppUrl} from "../utils/constant.supabse";
import {ChromeMessage, ChromeMessageResponse} from "../types/Chrome";
import {Database} from "../types/databse.supabase";

const supabase = createClient<Database>(supabaseAppUrl, supabaseAnonKey);

chrome.runtime.onMessage.addListener(([type, payload]: ChromeMessage, sender, sendResponse) => {
    let response;
    (async () => {
            if (type == "login") {
                response = await OAuthLogin(payload.provider)
                sendResponse(response)
            } else if (type == "logout") {
                response = await OAuthLogout()
                sendResponse(response)
            } else if (type == "fetchUser") {
                response = await fetchUser()
                sendResponse(response)
            } else if (type == "deductCredits") {
                response = await deductCredits()
                sendResponse(response)
            } else {
                response = sendError("Invalid message!")
                sendResponse(response)
            }
        }
    )()
    return true;
})

async function OAuthLogin(provider: Provider): Promise<ChromeMessageResponse> {
    const {data, error} = await supabase.auth.signInWithOAuth({provider});

    if (error) {
        return sendError(error.message)
    }

    if (!data.url) {
        return sendError("Cannot connect to Google at the moment. Try again later!")
    }

    const redirectUrl = await chrome.identity.launchWebAuthFlow({url: data.url, interactive: true});

    if (!redirectUrl) {
        return sendError("No response from provider. Try again later!")
    }

    const params = new URLSearchParams(redirectUrl.split("#")[1]);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
        return sendError("Cannot verify identity. Try again later!")
    }

    const {data: {user}, error: err} = await supabase.auth.getUser(accessToken);

    if (err || !user) {
        return sendError("Cannot retrieve user at the moment. Try again later!")
    }

    await chrome.storage.sync.set({accessToken, refreshToken, userId: user.id, tokens: 0})

    return ["login_success", {accessToken}]

}

async function fetchUser(): Promise<ChromeMessageResponse> {
    const {userId} = await chrome.storage.sync.get("userId")

    const {data, error} = await supabase.rpc("get_user_data", {user_id: userId})

    if (error) {
        return sendError(error.message)
    }

    await chrome.storage.sync.set({tokens: data[0].tokens})

    return ["fetch_user", {user: data[0]}]
}

async function OAuthLogout(): Promise<ChromeMessageResponse> {
    await chrome.storage.sync.remove(["accessToken", "refreshToken", "userId"])
    const {error} = await supabase.auth.signOut()

    if (error) {
        sendError("We messed up!")
    }

    return ["logout_success", {message: "Successfully logged out!"}]
}

async function deductCredits() {
    const {userId} = await chrome.storage.sync.get("userId");

    if (!userId) {
        sendError("You are not logged in!")
    }

    const {data, error} = await supabase.rpc("deduct_credits", {user_id: userId, amount: 1})

    if (error) {
        console.error("[ERROR] tokens", error)
        return sendError(error.message)
    }

    await chrome.storage.sync.set({tokens: data})

    return ["updated_credits", {credits: data}]
}

function sendError(message: string): ChromeMessageResponse {
    return ["error", {error: message}]
}