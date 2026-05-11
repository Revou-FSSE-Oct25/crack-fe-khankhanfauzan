import { http } from "@/lib/http/client";
import { TenantDashboardData } from "@/types/tenant-dashboard";
import { AdminDashboardData } from "@/types/admin-dashboard";
import { ApiResponse } from "@/types/types";

export async function fetchTenantDashboard(opts?: { token?: string }) {
    // ApiResponse otomatis mengharapkan { status, message, data }
    return http.get<ApiResponse<TenantDashboardData>>("/dashboard/tenant", {
        cache: "no-store", // Sangat penting agar data dashboard selalu fresh
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function fetchAdminDashboardSummary(range?: string, opts?: { token?: string }) {
    const params = new URLSearchParams();
    if (range) {
        params.append("range", range);
    }

    return http.get<ApiResponse<AdminDashboardData>>(`/dashboard/admin/summary?${params.toString()}`, {
        cache: "no-store",
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}