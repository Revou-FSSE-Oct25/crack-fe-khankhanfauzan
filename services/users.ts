import { http } from "@/lib/http/client";
import { ApiPaginatedResponse, ApiResponse } from "@/types/types";
import type { User, UpdateUserPayload, CreateUserPayload, GetUsersParams } from "@/types/users";

export async function fetchUsers(params?: GetUsersParams, opts?: { token?: string }) {
    const cleanParams: any = { ...params };
    if (cleanParams.search === "") delete cleanParams.search;
    if (cleanParams.role === "semua" || cleanParams.role === "") delete cleanParams.role;

    return http.get<ApiPaginatedResponse<User[]>>("/users", {
        cache: "no-store",
        query: cleanParams,
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function fetchUserById(id: string, opts?: { token?: string }) {
    return http.get<ApiResponse<User>>(`/users/${id}`, {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function createUser(payload: CreateUserPayload, opts?: { token?: string }) {
    return http.post<ApiResponse<User>>("/users", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function updateUser(id: string, payload: UpdateUserPayload, opts?: { token?: string }) {
    return http.patch<ApiResponse<User>>(`/users/${id}`, payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function updateProfile(id: string, payload: FormData, opts?: { token?: string }) {
    return http.patch<ApiResponse<User>>(`/users/${id}/profile`, payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function deleteUser(id: string, opts?: { token?: string }) {
    return http.delete<ApiResponse<null>>(`/users/${id}`, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}
