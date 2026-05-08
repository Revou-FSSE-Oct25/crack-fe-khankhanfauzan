import { PaginationParams } from './common';

// ==========================================
// STATUS ENUMS (Sinkron dengan Prisma)
// ==========================================
export type InvoiceStatus = 'unpaid' | 'partially_paid' | 'paid' | 'expired';

export type TransactionStatus = 'pending' | 'verified' | 'rejected';

export type BookingStatus = 'confirmed' | 'cancelled' | 'pending_payment' | 'active' | 'completed' | string;

// ==========================================
// SUB-MODELS
// ==========================================
export type InvoiceTransaction = {
    id: string;
    invoiceId: string;
    amount: string;
    paymentMethod: string | null;
    proofUrl: string | null;
    status: TransactionStatus;
    rejectReason: string | null;
    verifiedById: string | null;
    paidAt: string | null;
    createdAt: string;
};

export type InvoiceRoom = {
    id: string;
    building: string;
    roomNumber: string;
    floor: number;
    roomType: string;
    priceDaily: string | null;
    priceWeekly: string | null;
    priceMonthly: string | null;
    status: string;
    length: string;
    width: string;
    area: string;
    unit: string;
    gridRow: number;
    gridColumn: number;
    createdAt: string;
    updatedAt: string;
};

export type InvoiceBooking = {
    id: string;
    tenantId: string;
    roomId: string;
    rentType: string;
    duration: number;
    startDate: string;
    endDate: string;
    pricePerUnit: string;
    totalPrice: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    room: InvoiceRoom;
};

// ==========================================
// MAIN MODEL
// ==========================================
export type Invoice = {
    id: string;
    bookingId: string;
    totalAmount: string;
    penaltyAmount: string | null;
    dueDate: string;
    status: InvoiceStatus;
    createdAt: string;
    updatedAt: string;
    booking: InvoiceBooking;
    transactions: InvoiceTransaction[];
};

// ==========================================
// PARAMS REQUEST
// ==========================================
export interface GetInvoicesParams extends PaginationParams {
    status?: InvoiceStatus;
}