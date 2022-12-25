import React, {Dispatch, FC, ReactNode} from "react";
import Header from "./Header";
import "./common.css"
import "./popupLayout.css"
import {AuthState, AuthStateAction} from "../types/Magically";

const PopupLayout: FC<{
    children: ReactNode | ReactNode[],
    state: AuthState,
    dispatch: Dispatch<AuthStateAction>
}> = ({children, state, dispatch}) => {
    return <div className="popup">
        <Header state={state} dispatch={dispatch}/>
        {children}
    </div>
}

export default PopupLayout