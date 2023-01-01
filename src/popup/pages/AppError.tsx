import React from "react";
import PopupLayout from "../components/PopupLayout/PopupLayout";
import {useAsyncError} from "react-router-dom";
import "../styles.css"

const AppError = () => {
    const error = useAsyncError() as Error;
    return <PopupLayout showLogout={false}>
        <div className="error">
            <div className="error__text">{error.message || "Something went wrong. Please try again later."}</div>
        </div>
    </PopupLayout>
}

export default AppError