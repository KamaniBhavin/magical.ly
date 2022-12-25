import React, {FC, ReactElement} from "react";
import "./oAuthLoginButton.css"
import "./common.css"

const OAuthLoginButton: FC<{
    ProviderIcon: ReactElement,
    title: string,
    action: Function
}> = ({ProviderIcon, title, action}) => {
    return <button className="btn oauth__login-btn" onClick={() => action()}>
        <div className="oauth__provider-icon">
            {ProviderIcon}
        </div>
        <div className="oauth__provider-title">{title}</div>
    </button>
}

export default OAuthLoginButton