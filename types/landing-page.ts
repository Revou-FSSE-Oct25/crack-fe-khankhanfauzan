import { RoomType } from "./rooms";

export type LandingPageCheapestRoom = {
    priceMonthly: string;
    roomType: RoomType;
    length: string;
    width: string;
    unit: string;
}

export type LandingpageFacility = {
    name: string;
    iconUrl: string | null;
}

export type LandingPageReviewStats = {
    _avg: {
        rating: number | null;
    }
    _count: {
        id: number;
    }
}

export type LandingPageFeaturedReview = {
    rating: number;
    comment: string | null;
    booking: {
        tenant: {
            profile: {
                fullName: string | null;
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

export type LandingPageResponse = {
    status: number;
    message: string;
    data: LandingPageData;
}