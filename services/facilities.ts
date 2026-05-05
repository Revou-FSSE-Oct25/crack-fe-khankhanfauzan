import { http } from "@/lib/http/client";
import { CreateFacilityPayload, FacilitiesResponse, Facility, UpdateFacilityPayload } from "@/types/facilities";

export async function fetchFacilities(opts?: { token?: string }) {
    return http.get<FacilitiesResponse>("/facilities", {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function fetchFacilityById(id: number | string, opts?: { token?: string }) {
    return http.get<{ status: number, message: string, data: Facility }>(`/facilities/${id}`, {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function createFacility(payload: CreateFacilityPayload, opts?: { token?: string }) {
    return http.post<{ status: number, message: string, data: Facility }>("/facilities", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function updateFacility(id: number | string, payload: UpdateFacilityPayload, opts?: { token?: string }) {
    return http.patch<{ status: number, message: string, data: Facility }>(`/facilities/${id}`, payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function deleteFacility(id: number | string, opts?: { token?: string }) {
    return http.delete<{ status: number, message: string }>(`/facilities/${id}`, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}
