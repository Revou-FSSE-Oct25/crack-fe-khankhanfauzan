import { http } from "@/lib/http/client"
import { CreateRoomPayload, GetRoomsParams, Room, RoomMeta, UpdateRoomPayload } from "@/types/rooms"
import { ApiPaginatedResponse, ApiResponse } from "@/types/types"


export async function fetchRooms(params?: GetRoomsParams, opts?: { token?: string }) {
  // Clean up params by removing empty search string or undefined values
  const cleanParams: any = { ...params };
  if (cleanParams.search === "") {
    delete cleanParams.search;
  }
  if (cleanParams.status === undefined) {
    delete cleanParams.status;
  }

  // Memasukkan RoomMeta khusus sebagai Generic ke-2
  return http.get<ApiPaginatedResponse<Room[], RoomMeta>>("/rooms", {
    query: cleanParams,
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  });
}

export async function fetchRoomById(id: string, opts?: { token?: string }) {
  return http.get<ApiResponse<Room>>(`/rooms/${id}`, {
    cache: "no-store",
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  });
}

export async function createRoom(payload: CreateRoomPayload, opts?: { token?: string }) {
  return http.post<ApiResponse<Room>>("/rooms", payload, {
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  });
}

export async function updateRoom(id: string, payload: UpdateRoomPayload, opts?: { token?: string }) {
  return http.patch<ApiResponse<Room>>(`/rooms/${id}`, payload, {
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  });
}

export async function deleteRoom(id: string, opts?: { token?: string }) {
  return http.delete<ApiResponse<null>>(`/rooms/${id}`, {
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  });
}

