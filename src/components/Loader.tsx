import React, {FC} from "react";
import {MoonLoader} from "react-spinners";


const Loader: FC<{ color?: string }> = ({color}) => {
    const override = {
        display: 'flex',
    }

    return <MoonLoader color={color || "#9c67ff"} size="22px" cssOverride={override}/>
}

export default Loader;