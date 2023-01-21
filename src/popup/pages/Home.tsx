import React, {FC, Suspense} from "react";
import {Await, useLoaderData} from "react-router-dom";
import {UserDetails} from "../../types/database.magically";
import {FcGoogle} from "react-icons/fc";
import PopupLayout from "../components/PopupLayout/PopupLayout";
import Loading from "../components/Loading/Loading";
import AppError from "./AppError";
import "../styles.css"


const Home: FC = () => {
    const data = useLoaderData() as Record<string, UserDetails>

    return <Suspense fallback={<Loading/>}>
        <Await
            resolve={data.user}
            errorElement={<AppError/>}
        >
            {(user) =>
                <PopupLayout showLogout={true}>
                    <div className="home">
                        <div className="popup__background-overlay--container">
                            <img className="profile__img" src={user.picture} alt={user.full_name}/>
                            <div className="profile__text--lrg">{user.full_name}</div>
                            <h3>Authorized by <span><FcGoogle/></span></h3>
                            <div className="home">
                                <div className="profile__text--lrg">{user.email}</div>
                            </div>
                        </div>
                    </div>
                </PopupLayout>
            }
        </Await>
    </Suspense>
}

export default Home