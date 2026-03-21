import { http } from "@/lib/http/client";
import type { UsersResponse, User, UpdateUserPayload, CreateUserPayload } from "@/types/users";

export async function fetchUsers(params?: { page?: number; limit?: number; q?: string }) {
    return http.get<UsersResponse>("/users", {
        cache: "no-store",
        query: {
            page: params?.page,
            limit: params?.limit,
            q: params?.q,
        },
    });
}

export async function fetchUserById(id: string) {
    return http.get<User>(`/users/${id}`, {
        cache: "no-store",
    });
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
    return http.patch<User>(`/users/${id}`, payload);
}

export async function createUser(payload: CreateUserPayload) {
    return http.post<User>("/users", payload);
}
