export interface CreateReviewPayload {
    bookingId: string;
    rating: number;
    comment?: string;
}

export interface Review {
    id: string;
    createdAt: string;
    bookingId: string;
    rating: number;
    comment?: string;
    booking?: {
        id: string;
        room?: {
            id: string;
            roomNumber: string;
            images?: string[] | { imageUrl: string }[];
        };
        tenant?: {
            profile?: {
                fullName: string;
                fotoProfileUrl: string;
            };
        };
    };
}
