import { http } from "@/lib/http/client";
import { LandingPageResponse } from "@/types/landing-page";

export async function fetchLandingPageSummary() {
    return http.get<LandingPageResponse>('/public/landing-page');
}