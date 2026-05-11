import RoomDetailsForm from "@/components/rooms/RoomDetailsForm";
import { fetchRoomById } from "@/services/rooms";
import { cookies } from "next/headers";

type Props = {
    params: Promise<{ id: string }>;
};

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
