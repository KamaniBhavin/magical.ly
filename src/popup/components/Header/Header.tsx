import React, {FC, useState} from "react";
import "./header.css"
import {ChromeMessage, ChromeMessageResponse} from "../../../types/Chrome";
import {useNavigate} from "react-router-dom";
import Loader from "../../../components/Loader";
import {AiOutlineLogout} from "react-icons/ai";

const Header: FC<{ showLogout: boolean }> = ({showLogout = false}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        const [event, _] = await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>(["logout", {}]);

        if (event == "logout_success") {
            navigate("/")
        } else {
            navigate("/error")
        }
    }

    return <div className="header">
        <div className="header__logo">
            <img src="./icons/icon-32.png" alt="Magical.ly"/>
        </div>
        <div className="header__title">Magical.ly</div>
        <div className="header__right">
            {loading
                ? <Loader color={"#ffffff"}/>
                : showLogout
                    ? <button className="btn header__logout-btn" onClick={handleLogout}>
                        <AiOutlineLogout/>
                    </button>
                    : null
            }
        </div>
    </div>
}

export default Header