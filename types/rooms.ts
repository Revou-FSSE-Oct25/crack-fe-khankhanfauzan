import { Facility } from "./facilities";

export type RoomStatus = "available" | "occupied" | "unavailable"

export type RoomType = "standard" | "deluxe" | string;


export type Room = {
    id: number;
    roomNumber: string;
    roomType: RoomType;
    floor: number;
    price: number;
    status: RoomStatus;
    facilities: Facility[];
    dimensions: RoomDimensions;
};

export type RoomDimensions = {
    length: number;
    width: number;
    area?: number;
    unit?: 'm';
};

export type RoomsResponseMeta = {
    totalRooms: number;
    totalAvailable: number;
    totalUnavailable: number;
    totalOccupied: number;
};

export type RoomsResponse = {
    status: number;
    message: string;
    data: Room[];
    meta: RoomsResponseMeta;
};

export type CreateRoomPayload = {
    roomNumber: string
    floor: number
    roomType: RoomType
    price: number
    status: RoomStatus
    facilities: Facility[]
    dimensions: RoomDimensions
}
