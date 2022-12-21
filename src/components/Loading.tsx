import React from "react";
import {MoonLoader} from "react-spinners";


const Loading = () => {
    const override = {
        display: 'flex',
    }

    return <MoonLoader color="#9c67ff" size="22px" cssOverride={override} />
}

export default Loading;