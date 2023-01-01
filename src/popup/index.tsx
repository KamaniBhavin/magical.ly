import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css"
import OAuth from "./pages/OAuth";
import Home from "./pages/Home";
import {createMemoryRouter, defer, json, redirect, RouterProvider} from "react-router-dom";
import {ChromeMessage, ChromeMessageResponse} from "../types/Chrome";
import AppError from "./pages/AppError";
import {UserDetails} from "../types/database.magically";

const router = createMemoryRouter([
    {
        path: "/home",
        element: <Home/>,
        loader: async () => {
            return defer({
                user: new Promise<UserDetails>(async (resolve, reject) => {
                    const [event, message] = await chrome.runtime.sendMessage<ChromeMessage, ChromeMessageResponse>(["fetchUser", {}])

                    if (event === "fetch_user") {
                        resolve(message.user)
                    } else if (event === "error") {
                        reject(message.error)
                    } else {
                        reject("Unknown error")
                    }
                })
            })
        },
        errorElement: <AppError/>
    },
    {
        path: "/",
        element: <OAuth/>,
        loader: async () => {
            const {userId} = await chrome.storage.sync.get(["userId"])
            if (userId) {
                return redirect("/home")
            }
            return json({})
        },
        errorElement: <AppError/>
    },
    {
        path: "/error",
        element: <AppError/>
    }
])

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
    <RouterProvider router={router}/>
)