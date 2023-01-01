import React from "react";
import PopupLayout from "../PopupLayout/PopupLayout";
import Loader from "../../../components/Loader";
import "./loading.css"


const Loading = () => {
    return <PopupLayout showLogout={false}>
        <div className="loading">
            <Loader color={"#ffffff"}/>
        </div>
    </PopupLayout>
}

export default Loading