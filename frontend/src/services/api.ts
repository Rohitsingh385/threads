import axios, { type InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./authService";
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

let accessToken: string | null = null

export function setApiAccessToken(token: string | null) {
    accessToken = token
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status !== 401) {
            return Promise.reject(error)
        }
        const originalRequest = error.config as RetryableRequestConfig

        if (originalRequest._retry) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        try {
            const response = await refreshAccessToken()
            const newAccessToken = response.data.accessToken

            setApiAccessToken(newAccessToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return api(originalRequest)
        } catch (refreshError) {
            return Promise.reject(refreshError)
        }
        return Promise.reject(error)
    }
)
