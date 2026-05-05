export type Facility = {
    id: number;
    name: string;
    description?: string | null;
}

export type FacilitiesResponse = {
    status: number,
    message: string,
    data: Facility[],
}

export type CreateFacilityPayload = {
    name: string,
    description?: string | null;
}

export type UpdateFacilityPayload = Partial<CreateFacilityPayload>