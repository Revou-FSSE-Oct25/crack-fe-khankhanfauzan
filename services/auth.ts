import { http } from "@/lib/http/client"
import { AuthLoginData, AuthRefreshData, AuthRegisterData, ForgotPayload, LoginPayload, RefreshPayload, RegisterPayload, ResetPayload } from "@/types/auth"
import { ApiResponse } from "@/types/types";
import type { User } from "@/types/users"

export async function register(payload: RegisterPayload) {
    return http.post<ApiResponse<AuthRegisterData>>("/auth/register", payload);
}

export async function login(payload: LoginPayload) {
    return http.post<ApiResponse<AuthLoginData>>("/auth/login", payload);
}

export async function getMe(token: string) {
    return http.get<ApiResponse<User>>("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
}

export async function refresh(payload: RefreshPayload) {
    return http.post<ApiResponse<AuthRefreshData>>("/auth/refresh", payload);
}

export async function forgot(payload: ForgotPayload) {
    return http.post<ApiResponse<null>>("/auth/forgot", payload);
}

export async function reset(payload: ResetPayload) {
    return http.post<ApiResponse<null>>("/auth/reset", payload);
}
