import React, {Dispatch, FC, useEffect, useState} from "react";
import {AuthStateAction, UserData} from "../types/Magically";
import {ChromeMessage, ChromeMessageResponse} from "../types/Chrome";
import Loading from "../components/Loading";
import {FcGoogle} from "react-icons/fc";

const HomeScreen: FC<{
    accessToken: string,
    dispatch: Dispatch<AuthStateAction>
}> = ({accessToken, dispatch}) => {
    const [userData, setUserData] = useState<UserData | null>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true);
        (async () => {
            const [status, response] = await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>([
                "fetchUser", {accessToken}
            ])

            if (status == "fetch_user") {
                setUserData(response.user)
                setLoading(false)
            } else if (status == "error") {
                dispatch({type: "login", payload: {accessToken: null, error: response.error}})
            }

        })()
    }, [])

    return <div className="home">
        {loading
            ? <Loading color="#ffffff"/>
            : userData && <div className="popup__background-overlay--container">
            <img className="profile__img" src={userData.profileImage ?? "./icons/icon-128.png"}/>
            <div className="profile__text--lrg">{userData.fullName}</div>
            <h3>Authorized by <span><FcGoogle/></span></h3>
            <div className="home">
                <div className="profile__text--lrg">{userData.email}</div>
                <h3>Credits left:</h3>
                <div className="profile__text--lrg">{userData.credits}</div>
            </div>
        </div>
        }
    </div>
}

export default HomeScreen