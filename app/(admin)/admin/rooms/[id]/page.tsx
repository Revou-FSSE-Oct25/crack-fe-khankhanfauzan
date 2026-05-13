import RoomDetailsForm from "@/components/rooms/RoomDetailsForm";
import { fetchRoomById } from "@/services/rooms";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    let room = null;
    try {
        const res = await fetchRoomById(id, { token });
        room = "data" in res ? res.data : res;
    } catch (e: any) {
        console.error("Error fetching room details", e);
        if (e.status === 401) {
            redirect("/login");
        }
    }

    return <RoomDetailsForm room={room as any} />;
}
