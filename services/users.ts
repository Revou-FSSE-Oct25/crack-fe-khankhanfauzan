import { http } from "@/lib/http/client";
import type { UsersResponse, User, UpdateUserPayload, CreateUserPayload } from "@/types/users";

export async function fetchUsers(params?: { page?: number; limit?: number; q?: string }, opts?: { token?: string }) {
    return http.get<UsersResponse>("/users", {
        cache: "no-store",
        query: {
            page: params?.page,
            limit: params?.limit,
            q: params?.q,
        },
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function fetchUserById(id: string, opts?: { token?: string }) {
    return http.get<{ status: number, message: string, data: User }>(`/users/${id}`, {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function updateUser(id: string, payload: UpdateUserPayload, opts?: { token?: string }) {
    return http.patch<{ status: number, message: string, data: User }>(`/users/${id}`, payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function createUser(payload: CreateUserPayload, opts?: { token?: string }) {
    return http.post<{ status: number, message: string, data: User }>("/users", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}
