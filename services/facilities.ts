import { http } from "@/lib/http/client";
import { CreateFacilityPayload, Facility, UpdateFacilityPayload } from "@/types/facilities";
import { ApiPaginatedResponse, ApiResponse } from "@/types/types";

export async function fetchFacilities(opts?: { token?: string }) {
    return http.get<ApiPaginatedResponse<Facility[]>>("/facilities", {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function fetchFacilityById(id: number | string, opts?: { token?: string }) {
    return http.get<ApiResponse<Facility>>(`/facilities/${id}`, {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function createFacility(payload: CreateFacilityPayload, opts?: { token?: string }) {
    return http.post<ApiResponse<Facility>>("/facilities", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function updateFacility(id: number | string, payload: UpdateFacilityPayload, opts?: { token?: string }) {
    return http.patch<ApiResponse<Facility>>(`/facilities/${id}`, payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function deleteFacility(id: number | string, opts?: { token?: string }) {
    // Menggunakan null karena proses delete biasanya tidak mengembalikan data
    return http.delete<ApiResponse<null>>(`/facilities/${id}`, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}
