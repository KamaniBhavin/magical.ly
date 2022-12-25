import {createClient, Provider} from "@supabase/supabase-js";
import {supabaseAnonKey, supabaseAppUrl} from "../utils/constant.supabse";
import {ChromeMessage, ChromeMessageResponse} from "../types/Chrome";
import {Database} from "../types/databse.supabase";
import {UserData} from "../types/Magically";

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
                response = await getUserFromToken(payload.accessToken)
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

    const obj = await chrome.storage.sync.get("credits")

    await chrome.storage.sync.set({accessToken, refreshToken, credits: obj["credits"] ?? 100})

    return ["login_success", {accessToken}]

}

async function getUserFromToken(accessToken: string): Promise<ChromeMessageResponse> {
    const {data: user, error: err} = await supabase.auth.getUser(accessToken)

    if (err || !user) {
        return sendError("Cannot retrieve user at the moment. Try again later!")
    }

    const obj = await chrome.storage.sync.get("credits")

    const userData: UserData = {
        profileImage: user.user?.user_metadata["avatar_url"],
        fullName: user.user?.user_metadata["name"],
        email: user.user?.email ?? "no email",
        credits: obj["credits"] ?? 0,
    }

    return ["fetch_user", {user: userData}]
}

async function OAuthLogout(): Promise<ChromeMessageResponse> {
    await chrome.storage.sync.remove(["accessToken", "refreshToken"])
    const {error} = await supabase.auth.signOut()

    if (error) {
        sendError("We messed up!")
    }

    return ["logout_success", {message: "Successfully logged out!"}]
}

function sendError(message: string): ChromeMessageResponse {
    return ["error", {error: message}]
}