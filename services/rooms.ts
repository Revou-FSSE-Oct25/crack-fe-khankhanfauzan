import { http } from "@/lib/http/client"
import { CreateRoomPayload, Room, RoomsResponse, RoomStatus } from "@/types/rooms"



export type UpdateRoomPayload = Partial<CreateRoomPayload>

export async function fetchRooms(params?: { status?: RoomStatus }, opts?: { token?: string }) {
  return http.get<RoomsResponse>("/rooms", {
    query: params,
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  })
}

export async function fetchRoomById(id: string, opts?: { token?: string }) {
  return http.get<{ status: number, message: string, data: Room }>(`/rooms/${id}`, {
    cache: "no-store",
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  })
}

export async function createRoom(payload: CreateRoomPayload, opts?: { token?: string }) {
  return http.post<{ status: number, message: string, data: Room }>("/rooms", payload, {
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  })
}

export async function updateRoom(id: string, payload: UpdateRoomPayload, opts?: { token?: string }) {
  return http.patch<{ status: number, message: string, data: Room }>(`/rooms/${id}`, payload, {
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  })
}

export async function deleteRoom(id: string, opts?: { token?: string }) {
  return http.delete<{ status: number, message: string }>(`/rooms/${id}`, {
    headers: opts?.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  })
}

