import React, {FC, ReactElement} from "react";
import "./oAuthLoginButton.css"

const OAuthLoginButton: FC<{
    ProviderIcon: ReactElement,
    title: string,
    onClick: Function
}> = ({ProviderIcon, title, onClick}) => {
    return <button className="btn oauth__login-btn" onClick={() => onClick()}>
        <div className="oauth__provider-icon">
            {ProviderIcon}
        </div>
        <div className="oauth__provider-title">{title}</div>
    </button>
}

export default OAuthLoginButton