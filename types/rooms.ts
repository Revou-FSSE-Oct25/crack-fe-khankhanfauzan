import { PaginationParams } from "./common";
import { Facility } from "./facilities";
import { BasePaginationMeta } from "./types";

export type RoomStatus = "available" | "occupied" | "unavailable";
export type RoomType = "standard" | "deluxe" | string;

export interface RoomDimensions {
    length: number;
    width: number;
    area?: number;
    unit?: 'm';
}

export interface Room {
    id: number;
    roomNumber: string;
    roomType: RoomType;
    floor: number;
    price: number;
    priceDaily?: number;
    priceWeekly?: number;
    priceMonthly: number;
    priceYearly?: number;
    status: RoomStatus;
    facilities: Facility[];
    dimensions: RoomDimensions;
}

export interface RoomMeta extends BasePaginationMeta {
    totalRooms: number;
    totalAvailable: number;
    totalUnavailable: number;
    totalOccupied: number;
}

export interface CreateRoomPayload {
    roomNumber: string;
    floor: number;
    roomType: RoomType;
    price: number;
    status: RoomStatus;
    facilities: Facility[];
    dimensions: RoomDimensions;
}

export interface GetRoomsParams extends PaginationParams {
    floor?: number;
    status?: string;
    roomType?: string;
    price?: 'asc' | 'desc';
}

export type UpdateRoomPayload = Partial<CreateRoomPayload>
