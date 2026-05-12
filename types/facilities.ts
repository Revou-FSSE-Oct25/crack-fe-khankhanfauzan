import { PaginationParams } from "./common";

export type Facility = {
    id: number;
    name: string;
    description?: string | null;
}

export type CreateFacilityPayload = {
    name: string;
    description?: string | null;
}

export type UpdateFacilityPayload = Partial<CreateFacilityPayload>;

export interface GetFacilitiesParams extends PaginationParams {
    search?: string;
}