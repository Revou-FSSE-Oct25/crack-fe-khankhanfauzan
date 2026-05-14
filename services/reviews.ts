import { http } from "@/lib/http/client";
import { CreateReviewPayload, Review } from "@/types/reviews";
import { ApiPaginatedResponse, ApiResponse } from "@/types/types";
import { PaginationParams } from "@/types/common";

export interface GetReviewsParams extends PaginationParams {
    roomId?: string;
}

export async function createReview(payload: CreateReviewPayload, opts?: { token?: string }) {
    return http.post<ApiResponse<Review>>("/reviews", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function fetchReviews(params?: GetReviewsParams, opts?: { token?: string }) {
    const cleanParams: any = { ...params };
    if (cleanParams.roomId === "") delete cleanParams.roomId;

    return http.get<ApiPaginatedResponse<Review[]>>("/reviews", {
        query: cleanParams,
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}