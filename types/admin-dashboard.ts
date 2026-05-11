export interface AdminDashboardData {
    statistics: {
        totalTenants: { value: number; subtitle: string };
        occupancy: { value: string; subtitle: string };
        activeMaintenances: { value: number; subtitle: string };
        outstandingInvoices: { value: number; subtitle: string };
    };
    salesReport: { label: string; value: number }[];
    costBreakdown: any[];
    recentActivities: {
        id: string;
        type: string;
        title: string;
        subtitle: string;
        date: string;
    }[];
    recentMaintenances: {
        id: string;
        category: string;
        room: string;
        description: string;
        priority: string;
    }[];
    agenda: {
        checkIn: number;
        checkOut: number;
        maintenance: number;
        tour: number;
    };
    roomStatus: {
        occupied: number;
        empty: number;
        maintenance: number;
    };
}
