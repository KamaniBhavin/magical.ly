import {AuthState, AuthStateAction} from "../types/Magically";

export const initialState: AuthState = {
    accessToken: null,
    error: null,
}

export function authStateReducer(state: AuthState, action: AuthStateAction): AuthState {
    switch (action.type) {
        case "login":
            return {...state, ...action.payload}
        case "logout":
            return {...state, ...action.payload}
        case "storage":
            return {...state, ...action.payload}
        default:
            return state
    }
}
