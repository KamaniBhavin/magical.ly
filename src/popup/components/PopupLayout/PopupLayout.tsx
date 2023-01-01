import React, {FC, ReactNode} from "react";
import Header from "../Header/Header";
import "./popupLayout.css"

const PopupLayout: FC<{
    children: ReactNode | ReactNode[],
    showLogout: boolean
}> = ({children, showLogout}) => {
    return <div className="popup">
        <Header showLogout={showLogout}/>
        {children}
    </div>
}

export default PopupLayout