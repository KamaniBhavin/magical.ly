import React, {Dispatch, FC, useState} from "react";
import "./header.css"
import "./common.css"
import {AiOutlineLogout} from "react-icons/ai";
import Loading from "./Loading";
import {ChromeMessage, ChromeMessageResponse} from "../types/Chrome";
import {AuthState, AuthStateAction} from "../types/Magically";
import {MdError} from "react-icons/md";

const Header: FC<{ state: AuthState, dispatch: Dispatch<AuthStateAction> }> = ({state, dispatch}) => {
    const [loading, setLoading] = useState(false)
    const handleClick = async () => {
        setLoading(true)
        const [status, response] = await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>([
            "logout",
            {}
        ])

        if (status == "logout_success") {
            dispatch({type: "logout", payload: {accessToken: null, error: null}})
        } else if (status == "error") {
            dispatch({type: "logout", payload: {accessToken: null, error: response.error}})
        }

        setLoading(false)
    }

    return <div className="header">
        <div className="header__logo">
            <img src="./icons/icon-32.png"/>
        </div>
        <div className="header__title">Magically</div>
        <div className="header__right">
            {loading && <Loading/>}
            {state.accessToken
                && <button className="btn header__logout-btn" onClick={() => handleClick()}>
                    <AiOutlineLogout/>
                </button>}
            {state.error && <MdError/>}
        </div>
    </div>
}

export default Header