import { http } from "@/lib/http/client"
import { Booking, CreateBookingPayload, GetBookingsParams, RentType, UpdateBookingPayload } from "@/types/bookings"
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

export async function updateBooking(id: string, payload: UpdateBookingPayload, opts?: { token?: string }) {
    return http.patch<ApiResponse<Booking>>(`/bookings/${id}`, payload, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function approveBooking(id: string, opts?: { token?: string }) {
    return http.patch<ApiResponse<Booking>>(`/bookings/${id}/approve`, {}, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}

export async function rejectBooking(id: string, opts?: { token?: string }) {
    return http.patch<ApiResponse<Booking>>(`/bookings/${id}/reject`, {}, {
        headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
    });
}
