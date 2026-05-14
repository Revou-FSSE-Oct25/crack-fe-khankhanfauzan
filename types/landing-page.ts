import { RoomType } from "./rooms";

// Hanya menyimpan Data Model, tidak perlu 'LandingPageResponse' lagi
export type LandingPageCheapestRoom = {
    priceMonthly: string;
    roomType: string;
    length: string;
    width: string;
    unit: string;
}

export type LandingpageFacility = {
    id: string,
    name: string;
    iconUrl: string | null;
}

export type LandingPageReviewStats = {
    _avg: { rating: number | null; }
    _count: { id: number; }
}

export type LandingPageFeaturedReview = {
    id: string,
    rating: number;
    comment: string | null;
    booking: {
        tenant: {
            profile: {
                fullName: string | null;
                fotoProfileUrl: string | null;
            } | null;
        } | null;
    } | null;
}

export type LandingPageData = {
    cheapestRoom: LandingPageCheapestRoom;
    facilities: LandingpageFacility[];
    reviewStats: LandingPageReviewStats;
    featuredReviews: LandingPageFeaturedReview[];
}