import React, {FC} from "react";
import ReactDOM from "react-dom/client";


const App: FC = () => {
    return <h1>Hello from React</h1>
}

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)