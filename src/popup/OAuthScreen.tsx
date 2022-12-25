import React, {Dispatch, FC, useState} from "react";
import Loading from "../components/Loading";
import OAuthLoginButton from "../components/OAuthLoginButton";
import {FcGoogle} from "react-icons/fc";
import {ChromeMessage, ChromeMessageResponse} from "../types/Chrome";
import {AuthStateAction} from "../types/Magically";

const OAuthScreen: FC<{ dispatch: Dispatch<AuthStateAction> }> = ({dispatch}) => {
    const [loading, setLoading] = useState(false)
    const handleClick = async () => {
        setLoading(true)
        const [status, response] = await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>([
            "login", {provider: "google"}
        ])

        if (status == "login_success") {
            dispatch({type: "login", payload: {accessToken: response.accessToken, error: null}})
        } else if (status == "error") {
            dispatch({type: "login", payload: {accessToken: null, error: response.error}})
        }

        setLoading(false)
    }

    return <div className="oauth">
        <img className="oauth__logo" src="./icons/icon-128.png"/>
        <div className="oauth__header">
            <div className="oauth__greeting--title">Welcome back!</div>
            <div className="oauth__greeting--sub-title">A magical experience awaits...</div>
        </div>
        {loading
            ? <Loading color={"#ffffff"}/>
            : <OAuthLoginButton
                ProviderIcon={<FcGoogle/>}
                title={"Login with Google"}
                action={handleClick}
            />
        }
    </div>
}


export default OAuthScreen