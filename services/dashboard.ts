import { http } from "@/lib/http/client";
import { TenantDashboardData } from "@/types/tenant-dashboard";
import { ApiResponse } from "@/types/types";

export async function fetchTenantDashboard(opts?: { token?: string }) {
    // ApiResponse otomatis mengharapkan { status, message, data }
    return http.get<ApiResponse<TenantDashboardData>>("/dashboard/tenant", {
        cache: "no-store", // Sangat penting agar data dashboard selalu fresh
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}