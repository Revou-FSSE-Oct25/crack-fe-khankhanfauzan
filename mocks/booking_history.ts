export type BookingStatus = "completed" | "cancelled" | "expired";

export type BookingRoom = {
    room_id: string;
    room_type: string;
    floor: number;
};

export type BookingPeriod = {
    start_date: string; // ISO date (yyyy-mm-dd)
    end_date: string;   // ISO date (yyyy-mm-dd)
    rent_type: "monthly" | "daily";
    duration: number; // months or days
};

export type BookingHistoryItem = {
    booking_id: string;
    room: BookingRoom;
    period: BookingPeriod;
    status: BookingStatus;
    total_paid?: number;
    checkout_at?: string;
    reason?: string;
    cancelled_at?: string;
};

export type BookingHistoryMeta = {
    current_page: number;
    last_page: number;
    limit: number;
    total_data: number;
    has_next_page: boolean;
    has_prev_page: boolean;
};

export type BookingHistoryResponse = {
    status: "success";
    data: BookingHistoryItem[];
    meta: BookingHistoryMeta;
};

export const MOCK_BOOKING_HISTORY: BookingHistoryResponse = {
    status: "success",
    meta: {
        current_page: 1,
        last_page: 2,
        limit: 10,
        total_data: 15,
        has_next_page: true,
        has_prev_page: false,
    },
    data: [
        {
            booking_id: "BK-2025-001",
            room: { room_id: "102", room_type: "Standard", floor: 1 },
            period: {
                start_date: "2025-01-01",
                end_date: "2025-06-01",
                rent_type: "monthly",
                duration: 5,
            },
            status: "completed",
            total_paid: 7500000,
            checkout_at: "2025-06-01T09:00:00Z",
        },
        {
            booking_id: "BK-2024-099",
            room: { room_id: "205", room_type: "Deluxe", floor: 2 },
            period: {
                start_date: "2024-12-01",
                end_date: "2024-12-05",
                rent_type: "daily",
                duration: 4,
            },
            status: "cancelled",
            reason: "User did not upload payment proof within 2 hours",
            cancelled_at: "2024-11-30T10:05:00Z",
        },
        {
            booking_id: "BK-2026-010",
            room: { room_id: "301", room_type: "Deluxe", floor: 3 },
            period: {
                start_date: "2026-03-01",
                end_date: "2026-09-01",
                rent_type: "monthly",
                duration: 6,
            },
            status: "expired",
            total_paid: 18000000,
            checkout_at: "2026-09-01T10:00:00Z",
        },
        {
            booking_id: "BK-2026-011",
            room: { room_id: "401", room_type: "Suite", floor: 4 },
            period: {
                start_date: "2026-01-15",
                end_date: "2026-07-15",
                rent_type: "monthly",
                duration: 6,
            },
            status: "completed",
            total_paid: 21600000,
            checkout_at: "2026-07-15T10:00:00Z",
        },
        {
            booking_id: "BK-2025-020",
            room: { room_id: "303", room_type: "Standard", floor: 3 },
            period: {
                start_date: "2025-09-10",
                end_date: "2026-03-10",
                rent_type: "monthly",
                duration: 6,
            },
            status: "expired",
            total_paid: 9000000,
            checkout_at: "2026-03-10T08:00:00Z",
        },
        {
            booking_id: "BK-2025-045",
            room: { room_id: "115", room_type: "Standard", floor: 1 },
            period: {
                start_date: "2025-03-01",
                end_date: "2025-03-10",
                rent_type: "daily",
                duration: 9,
            },
            status: "cancelled",
            reason: "Payment failed",
            cancelled_at: "2025-02-28T22:15:00Z",
        },
        {
            booking_id: "BK-2024-120",
            room: { room_id: "208", room_type: "Deluxe", floor: 2 },
            period: {
                start_date: "2024-08-01",
                end_date: "2025-02-01",
                rent_type: "monthly",
                duration: 6,
            },
            status: "completed",
            total_paid: 15000000,
            checkout_at: "2025-02-01T09:00:00Z",
        },
        {
            booking_id: "BK-2026-030",
            room: { room_id: "502", room_type: "Suite", floor: 5 },
            period: {
                start_date: "2026-02-01",
                end_date: "2026-12-01",
                rent_type: "monthly",
                duration: 10,
            },
            status: "expired",
            total_paid: 30000000,
            checkout_at: "2026-12-01T09:00:00Z",
        },
        {
            booking_id: "BK-2025-070",
            room: { room_id: "109", room_type: "Standard", floor: 1 },
            period: {
                start_date: "2025-11-01",
                end_date: "2025-11-03",
                rent_type: "daily",
                duration: 2,
            },
            status: "cancelled",
            reason: "No show",
            cancelled_at: "2025-10-30T19:00:00Z",
        },
        {
            booking_id: "BK-2025-090",
            room: { room_id: "210", room_type: "Deluxe", floor: 2 },
            period: {
                start_date: "2025-04-01",
                end_date: "2025-10-01",
                rent_type: "monthly",
                duration: 6,
            },
            status: "completed",
            total_paid: 18000000,
            checkout_at: "2025-10-01T09:30:00Z",
        },
    ],
};
