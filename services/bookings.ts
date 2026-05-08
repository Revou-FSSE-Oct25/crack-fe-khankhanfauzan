import { http } from "@/lib/http/client"
import { Booking, CreateBookingPayload, GetBookingsParams, RentType } from "@/types/bookings"
import { ApiPaginatedResponse, ApiResponse } from "@/types/types"

export async function createBooking(payload: CreateBookingPayload, opts?: { token?: string }) {
    return http.post<ApiResponse<Booking>>("/bookings", payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    })
}

export async function fetchBookings(params?: GetBookingsParams, opts?: { token?: string }) {
    return http.get<ApiPaginatedResponse<Booking[]>>("/bookings", {
        query: params,
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function getBookingById(id: string, opts?: { token?: string }) {
    return http.get<ApiResponse<Booking>>(`/bookings/${id}`, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    })
}
