import RoomDetailsForm from "@/components/rooms/RoomDetailsForm";
import { fetchRoomById } from "@/services/rooms";
import { Props } from "@/types/param";
import { cookies } from "next/headers";

async function getTokenFromCookie(): Promise<string | undefined> {
    const store = await cookies();
    const raw = store.get("session")?.value;
    if (!raw) return undefined;
    try {
        const parsed = JSON.parse(decodeURIComponent(raw)) as {
            accessToken?: string;
        };
        return parsed?.accessToken;
    } catch {
        return undefined;
    }
}

export default async function Page(props: Props) {
    const { id } = await props.params;

    const token = await getTokenFromCookie();
    const res = await fetchRoomById(id, { token });
    const room = "data" in res ? res.data : res;

    return <RoomDetailsForm room={room as any} />;
}
