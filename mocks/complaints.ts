export type ComplaintStatus = "open" | "in_progress" | "resolved" | "rejected";
export type Complaint = {
    complaint_id: string;
    room_id: string;
    tenant_name: string;
    category: string;
    description: string;
    status: ComplaintStatus;
    created_at: string;
    updated_at: string;
};

export type ComplaintsMeta = {
    current_page: number;
    last_page: number;
    limit: number;
    total_data: number;
    has_next_page: boolean;
    has_prev_page: boolean;
};

export type ComplaintsResponse = {
    status: "success";
    data: Complaint[];
    meta: ComplaintsMeta;
};

export const MOCK_COMPLAINTS: ComplaintsResponse = {
    status: "success",
    meta: {
        current_page: 1,
        last_page: 5,
        limit: 10,
        total_data: 48,
        has_next_page: true,
        has_prev_page: false,
    },
    data: [
        {
            complaint_id: "CMP-88201",
            room_id: "201",
            tenant_name: "Budi Santoso",
            category: "plumbing",
            description: "Kran air patah di kamar mandi, aliran air tidak bisa ditutup.",
            status: "in_progress",
            created_at: "2026-03-12T14:00:00Z",
            updated_at: "2026-03-12T16:30:00Z",
        },
        {
            complaint_id: "CMP-88202",
            room_id: "301",
            tenant_name: "Siti Aisyah",
            category: "electrical",
            description: "Stop kontak longgar dan percikan muncul saat digunakan.",
            status: "open",
            created_at: "2026-03-10T09:15:00Z",
            updated_at: "2026-03-10T09:15:00Z",
        },
        {
            complaint_id: "CMP-88203",
            room_id: "202",
            tenant_name: "Rudi Hartono",
            category: "appliance",
            description: "Kulkas tidak dingin meskipun sudah disetel maksimal.",
            status: "resolved",
            created_at: "2026-03-05T10:00:00Z",
            updated_at: "2026-03-07T12:00:00Z",
        },
        {
            complaint_id: "CMP-88204",
            room_id: "105",
            tenant_name: "Dewi Lestari",
            category: "cleaning",
            description: "Saluran kamar mandi tersumbat, air menggenang.",
            status: "rejected",
            created_at: "2026-03-08T08:45:00Z",
            updated_at: "2026-03-08T10:00:00Z",
        },
        {
            complaint_id: "CMP-88205",
            room_id: "401",
            tenant_name: "Ahmad Fauzi",
            category: "internet",
            description: "Wi-Fi sering putus saat malam hari.",
            status: "in_progress",
            created_at: "2026-03-11T18:20:00Z",
            updated_at: "2026-03-11T19:00:00Z",
        },
        {
            complaint_id: "CMP-88206",
            room_id: "203",
            tenant_name: "Nina Agustina",
            category: "security",
            description: "Kunci pintu rusak dan sulit ditutup rapat.",
            status: "open",
            created_at: "2026-03-09T12:00:00Z",
            updated_at: "2026-03-09T12:00:00Z",
        },
        {
            complaint_id: "CMP-88207",
            room_id: "302",
            tenant_name: "Yusuf Maulana",
            category: "air_conditioning",
            description: "AC bocor dan menetes ke lantai.",
            status: "resolved",
            created_at: "2026-03-06T13:30:00Z",
            updated_at: "2026-03-07T09:00:00Z",
        },
        {
            complaint_id: "CMP-88208",
            room_id: "102",
            tenant_name: "Lina Marlina",
            category: "plumbing",
            description: "Toilet mampet dan tidak bisa disiram.",
            status: "open",
            created_at: "2026-03-12T07:40:00Z",
            updated_at: "2026-03-12T07:40:00Z",
        },
        {
            complaint_id: "CMP-88209",
            room_id: "205",
            tenant_name: "Hendra Gunawan",
            category: "electrical",
            description: "Lampu kedip-kedip saat dinyalakan.",
            status: "open",
            created_at: "2026-03-04T20:10:00Z",
            updated_at: "2026-03-04T20:10:00Z",
        },
        {
            complaint_id: "CMP-88210",
            room_id: "303",
            tenant_name: "Putri Amelia",
            category: "appliance",
            description: "Mesin cuci berisik dan bergetar berlebihan.",
            status: "in_progress",
            created_at: "2026-03-03T15:25:00Z",
            updated_at: "2026-03-03T16:00:00Z",
        },
    ],
};
