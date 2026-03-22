export type RoomStatusApi = "available" | "occupied" | "unavailable" | string;

export type RoomTypeApi = "standard" | "deluxe" | string;

export type Room = {
    id: number;
    roomNumber: string;
    roomType: RoomTypeApi;
    floor: number;
    price: number;
    status: RoomStatusApi;
    facilities: string[];
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