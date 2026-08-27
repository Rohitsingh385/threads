import { api } from "./api";

export interface SignupInput {
    username: string
    email: string
    password: string
}

export interface SignupResponse {
    success: boolean
    message: string
    result: {
        id: string
        username: string
        email: string
    }
}

export interface LoginInput {
    email: string
    password: string
}
export interface LoginResponse {
    success: boolean
    message: string
    data: {
        accessToken: string
    }

}

export interface MeResponse {
    success: boolean
    message: string
    data: {
        username: string
        email: string
        role: string
        emailVerified: boolean
        bio: string | null
        avatarUrl: string | null
        avatarPublicId: string | null
    }
}
export async function signup(input: SignupInput): Promise<SignupResponse> {
    const response = await api.post<SignupResponse>('/users/signup', input)

    return response.data
}

export async function login(input: LoginInput): Promise<LoginResponse> {

    const response = await api.post<LoginResponse>('/users/login', input)

    return response.data
}

export async function me(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/users/me")
    return response.data
}

export async function logout() {
    const response = await api.get('/users/logout')
    return response.data
}

export async function refreshAccessToken(){
    const response = await api.post('/users/refresh')
    return response.data
}