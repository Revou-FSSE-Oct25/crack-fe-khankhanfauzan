import { http } from "@/lib/http/client";
import { LandingPageData } from "@/types/landing-page";
import { ApiResponse } from "@/types/types";

export async function fetchLandingPageSummary() {
    return http.get<ApiResponse<LandingPageData>>('/public/landing-page');
}