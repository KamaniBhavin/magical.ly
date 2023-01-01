import {Provider} from "@supabase/supabase-js";
import {UserDetails} from "./database.magically";

export type ChromeMessage = ["login", { provider: Provider }]
    | ["logout", {}]
    | ["fetchUser", {}]
    | ["deductCredits", {}]


export type ChromeMessageResponse = ["login_success", { accessToken: string }]
    | ["logout_success", { message: string }]
    | ["fetch_user", { user: UserDetails }]
    | ["error", { error: string }]
