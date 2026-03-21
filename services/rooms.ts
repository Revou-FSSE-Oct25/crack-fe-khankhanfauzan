import { http } from "@/lib/http/client"

export type RoomStatus = "available" | "occupied" | "maintenance"

export type Room = {
  id: string
  name: string
  price: number
  status: RoomStatus
}

export type CreateRoomPayload = {
  name: string
  price: number
  status?: RoomStatus
}

export type UpdateRoomPayload = Partial<CreateRoomPayload>

export async function fetchRooms(params?: { status?: RoomStatus }) {
  return http.get<Room[]>("/rooms", { query: params })
}

export async function fetchRoomById(id: string) {
  return http.get<Room>(`/rooms/${id}`)
}

export async function createRoom(payload: CreateRoomPayload) {
  return http.post<Room>("/rooms", payload)
}

export async function updateRoom(id: string, payload: UpdateRoomPayload) {
  return http.patch<Room>(`/rooms/${id}`, payload)
}

export async function deleteRoom(id: string) {
  return http.delete<void>(`/rooms/${id}`)
}

