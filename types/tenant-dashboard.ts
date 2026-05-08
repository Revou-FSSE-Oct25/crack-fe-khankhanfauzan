// ==========================================
// SUB-TYPES (Komponen dari Dashboard)
// ==========================================

export type DashboardFacility = {
    roomId: string;
    facilityId: string;
    facility: {
        id: string;
        name: string;
        description: string;
        iconUrl: string;
        createdAt: string;
        updatedAt: string;
    };
};

export type DashboardRoom = {
    id: string;
    building: string;
    roomNumber: string;
    floor: number;
    roomType: string;
    priceDaily: string | null;
    priceWeekly: string | null;
    priceMonthly: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    length: string;
    width: string;
    area: string;
    unit: string;
    gridRow: number;
    gridColumn: number;
    roomFacilities: DashboardFacility[];
};

export type DashboardBooking = {
    id: string;
    tenantId: string;
    roomId: string;
    rentType: "daily" | "weekly" | "monthly" | "yearly" | string;
    duration: number;
    startDate: string;
    endDate: string;
    pricePerUnit: string;
    totalPrice: string;
    status: "pending_payment" | "active" | "completed" | "cancelled" | string;
    createdAt: string;
    updatedAt: string;
    room: DashboardRoom;
};


export type DashboardStayInfo = {
    daysStayed: number;
    contractDuration: number;
    rentType: string;
};

export type DashboardPaymentReminder = {
    invoiceId: string;
    dueDate: string;
    totalAmount: number;
    countdownDays: number;
};

export type DashboardComplaint = {
    id: string;
    tenantId: string;
    roomId: string;
    category: "plumbing" | "electrical" | "furniture" | "other" | string;
    description: string;
    images: string[];
    status: "open" | "in_progress" | "resolved" | "rejected" | string;
    adminNotes: string | null;
    createdAt: string;
    updatedAt: string;
};

export type DashboardInvoice = {
    id: string;
    bookingId: string;
    totalAmount: string;
    penaltyAmount: string;
    dueDate: string;
    status: "unpaid" | "paid" | "overdue" | string;
    createdAt: string;
    updatedAt: string;
};

export type DashboardTransaction = {
    id: string;
    invoiceId: string;
    amount: string;
    paymentMethod: string;
    proofUrl: string;
    status: "pending" | "verified" | "rejected" | string;
    rejectReason: string | null;
    verifiedById: string | null;
    paidAt: string | null;
    createdAt: string;
    invoice: DashboardInvoice;
};

export type DashboardCalendarEvent = {
    type: "payment_due" | "maintenance_reported" | string;
    title: string;
    date: string;
    amount?: number; // Hanya ada jika type = 'payment_due'
    status?: string; // Hanya ada jika type = 'maintenance_reported'
};

// ==========================================
// TIPE UTAMA (Main Data Model)
// ==========================================

export type TenantDashboardData = {
    activeBooking: DashboardBooking | null;
    stayInfo: DashboardStayInfo | null;
    paymentReminder: DashboardPaymentReminder | null;
    activeComplaints: DashboardComplaint[];
    recentTransactions: DashboardTransaction[];
    calendarEvents: DashboardCalendarEvent[];
};