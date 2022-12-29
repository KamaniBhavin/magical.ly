export type MagicalTextOption = "write" | "rephrase" | "reply"

export interface UserData {
    profileImage: string | null,
    fullName: string,
    email: string,
    credits: number,
}

export interface AuthState {
    accessToken: string | null,
    error: string | null,
}

type AuthStateActionType = "login" | "logout" | "storage"

interface AuthStateAction {
    type: AuthStateActionType,
    payload: AuthState
}