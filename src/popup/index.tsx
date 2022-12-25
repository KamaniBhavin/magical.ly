import React, {useEffect, useReducer} from "react";
import ReactDOM from "react-dom/client";
import "./styles.css"
import PopupLayout from "../components/PopupLayout";
import OAuthScreen from "./OAuthScreen";
import {authStateReducer, initialState} from "../reducers/authStateReducer";
import HomeScreen from "./HomeScreen";


const App = () => {
    const [state, dispatch] = useReducer(authStateReducer, initialState);

    useEffect(() => {
        (async () => {
            const object = await chrome.storage.sync.get("accessToken")

            dispatch({
                type: "storage",
                payload: {accessToken: object["accessToken"], error: null}
            })
        })()
    }, [])

    return <PopupLayout state={state} dispatch={dispatch}>
        {
            state.accessToken
                ? <HomeScreen accessToken={state.accessToken} dispatch={dispatch}/>
                : <OAuthScreen dispatch={dispatch}/>
        }
    </PopupLayout>
}

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
    <App/>
)