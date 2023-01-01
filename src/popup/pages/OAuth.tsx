import React, {useState} from "react";
import Loader from "../../components/Loader";
import OAuthLoginButton from "../components/OAuthLoginButton/OAuthLoginButton";
import {FcGoogle} from "react-icons/fc";
import PopupLayout from "../components/PopupLayout/PopupLayout";
import {ChromeMessage, ChromeMessageResponse} from "../../types/Chrome";
import {useNavigate} from "react-router-dom";
import "../styles.css"

const OAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        const [event, _] = await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>(["login", {provider: "google"}]);
        if (event === "login_success") {
            navigate("/home")
        } else {
            navigate("/error")
        }
    }

    return <PopupLayout showLogout={false}>
        <div className="oauth">
            <img className="oauth__logo" src="./icons/icon-128.png" alt="Magical.ly"/>
            <div className="oauth__header">
                <div className="oauth__greeting--title">Welcome back!</div>
                <div className="oauth__greeting--sub-title">A magical experience awaits...</div>
            </div>
            {loading
                ? <Loader color={"#ffffff"}/>
                : <OAuthLoginButton
                    ProviderIcon={<FcGoogle/>}
                    title={"Login with Google"}
                    onClick={handleLogin}
                />
            }
        </div>
    </PopupLayout>
}


export default OAuth