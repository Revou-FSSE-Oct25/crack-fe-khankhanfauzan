import { http } from "@/lib/http/client";
import {
    GetMaintenancesParams,
    Maintenance,
    CreateMaintenancePayload,
    UpdateMaintenancePayload
} from "@/types/maintenances";
import { ApiPaginatedResponse, ApiResponse } from "@/types/types";

export async function fetchMaintenances(params?: GetMaintenancesParams, opts?: { token?: string }) {
    return http.get<ApiPaginatedResponse<Maintenance[]>>("/maintenances", {
        cache: "no-store",
        query: params,
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function getMaintenanceById(id: string, opts?: { token?: string }) {
    return http.get<ApiResponse<Maintenance>>(`/maintenances/${id}`, {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function createMaintenance(payload: FormData, opts?: { token?: string }) {
    return http.post<ApiResponse<Maintenance>>("/maintenances", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function updateMaintenanceStatus(id: string, payload: UpdateMaintenancePayload | FormData, opts?: { token?: string }) {
    return http.patch<ApiResponse<Maintenance>>(`/maintenances/${id}/status`, payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function deleteMaintenance(id: string, opts?: { token?: string }) {
    return http.delete<ApiResponse<any>>(`/maintenances/${id}`, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}