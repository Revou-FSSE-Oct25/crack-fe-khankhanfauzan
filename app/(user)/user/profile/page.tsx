import { cookies } from "next/headers";
import type { Metadata } from "next";
import { getMe } from "@/services/auth";
import type { User } from "@/types/users";
import { ProfileClient } from "@/components/profile/ProfileClient";

export const metadata: Metadata = {
    title: "Profil Pengguna",
    description:
        "Kelola informasi pribadi, dokumen, notifikasi, dan keamanan akun",
};

async function fetchUserFromCookie(): Promise<User | null> {
    const store = await cookies();
    const raw = store.get("session")?.value;
    if (!raw) return null;
    try {
        const parsed = JSON.parse(decodeURIComponent(raw)) as {
            accessToken?: string;
        };
        const token = parsed?.accessToken;
        console.log(token, "accessToken")
        if (!token) return null;
        const res = await getMe(token);
        
        return res?.data ?? null;
    } catch {
        return null;
    }
}

export default async function Page() {
    const user = await fetchUserFromCookie();
    console.log(user, "user");
    return <ProfileClient user={user} />;
}
