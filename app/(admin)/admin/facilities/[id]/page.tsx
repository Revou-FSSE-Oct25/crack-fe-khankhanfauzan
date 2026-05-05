import FacilityDetailsForm from "@/components/facilities/FacilityDetailsForm";
import { fetchFacilityById } from "@/services/facilities";
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
    const res = await fetchFacilityById(id, { token });
    const facility = "data" in res ? res.data : res;

    return <FacilityDetailsForm facility={facility as any} />;
}
