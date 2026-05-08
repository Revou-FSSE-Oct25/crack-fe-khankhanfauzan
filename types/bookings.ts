import { PaginationParams } from "./common";

export const RentType = {
    daily: 'daily',
    weekly: 'weekly',
    monthly: 'monthly',
    yearly: 'yearly'
} as const;

export type RentType = typeof RentType[keyof typeof RentType];

export const RentTypeLabel: Record<RentType, string> = {
    [RentType.daily]: 'Harian',
    [RentType.weekly]: 'Mingguan',
    [RentType.monthly]: 'Bulanan',
    [RentType.yearly]: 'Tahunan',
};


export interface CreateBookingPayload {
    roomId: string
    rentType: RentType
    duration: number
    startDate: string
}

export interface Booking {
    id: string
    tenantId: string
    roomId: string
    rentType: string
    duration: number
    startDate: string
    endDate: string
    pricePerUnit: number
    totalPrice: number
    status: string
    createdAt: string
    updatedAt: string
    room?: {
        id: string
        roomNumber: string
        floor: number
        priceDaily: number
        priceWeekly: number
        priceMonthly: number
        priceYearly: number
    }
    invoices?: {
        id: string
        totalAmount: number
        dueDate: string
        status: string
    }[]
}

export interface GetBookingsParams extends PaginationParams {
    statis?: string;
}