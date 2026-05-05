import { http } from "@/lib/http/client"
import type { User } from "@/types/users"

export type RegisterPayload = {
    fullname: string
    email: string
    whatsappNumber: string
    password: string
    confirmPassword: string
}

export type LoginPayload = {
    email: string
    password: string
}

export type RefreshPayload = {
    refreshToken: string
}

export type ForgotPayload = {
    email: string
}

export type ResetPayload = {
    token: string
    password: string
    confirmPassword: string
}

export type AuthResponseBase = {
    status: number | string
    message: string
}

export type AuthRegisterResponse = AuthResponseBase & {
    data?: { userId?: string | number }
}

export type AuthLoginResponse = AuthResponseBase & {
    data: {
        user: {
            id: number | string
            fullname: string
            email: string
            whatsappNumber?: string
            role: string
        }
        accessToken: string
        refreshToken: string
    }
}

export type AuthMeResponse = AuthResponseBase & {
    data: User
}

export type AuthRefreshResponse = AuthResponseBase & {
    data: { accessToken: string; refreshToken?: string }
}

export type AuthForgotResponse = AuthResponseBase
export type AuthResetResponse = AuthResponseBase

export async function register(payload: RegisterPayload) {
    return http.post<AuthRegisterResponse>("/auth/register", payload)
}

export async function login(payload: LoginPayload) {
    return http.post<AuthLoginResponse>("/auth/login", payload)
}

export async function getMe(token: string) {
    return http.get<AuthMeResponse>("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    })
}

export async function refresh(payload: RefreshPayload) {
    return http.post<AuthRefreshResponse>("/auth/refresh", payload)
}

export async function forgot(payload: ForgotPayload) {
    return http.post<AuthForgotResponse>("/auth/forgot", payload)
}

export async function reset(payload: ResetPayload) {
    return http.post<AuthResetResponse>("/auth/reset", payload)
}
