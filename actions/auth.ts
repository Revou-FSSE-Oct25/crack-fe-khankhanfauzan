import { isValidEmail } from "@/lib/utils";
import { login as loginApi } from "@/services/auth";

type Session = {
    userId?: string | number;
    role?: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt: string;
};

const SESSION_COOKIE_NAME = "session";

function setCookie(name: string, value: string, opts?: { expires?: Date | string; maxAge?: number; path?: string; sameSite?: "Lax" | "Strict" | "None" }) {
    const path = opts?.path ?? "/";
    const sameSite = opts?.sameSite ?? "Lax";
    let cookie = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;
    if (opts?.maxAge !== undefined) {
        cookie += `; Max-Age=${opts.maxAge}`;
    }
    if (opts?.expires) {
        const exp = typeof opts.expires === "string" ? opts.expires : opts.expires.toUTCString();
        cookie += `; Expires=${exp}`;
    }
    document.cookie = cookie;
}

function getCookie(name: string): string | null {
    if (typeof document === "undefined") {
        return null; // Don't try to access document on the server
    }
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const c of cookies) {
        const [k, ...rest] = c.split("=");
        if (k === name) {
            return decodeURIComponent(rest.join("="));
        }
    }
    return null;
}

export function createSession(session: Session, remember?: boolean) {
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    const expiresAt = new Date(Date.now() + maxAge * 1000);
    const payload = JSON.stringify({ ...session, expiresAt: expiresAt.toISOString() });
    setCookie(SESSION_COOKIE_NAME, payload, { maxAge, path: "/", sameSite: "Lax" });
}

export function deleteSession() {
    setCookie(SESSION_COOKIE_NAME, "", { expires: new Date(0), path: "/", sameSite: "Lax" });
}

export function getSession(): Session | null {
    const raw = getCookie(SESSION_COOKIE_NAME);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as Session;
        return parsed;
    } catch {
        return null;
    }
}

export type LoginActionResult = {
    success?: boolean;
    errors?: { email?: string; password?: string };
    message?: string;
};

export async function login(formData: FormData): Promise<LoginActionResult> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const remember = (formData.get("remember") as string) === "on";
    const errors: { email?: string; password?: string } = {};
    if (!email || !isValidEmail(email)) {
        errors.email = "Please enter a valid email address.";
    }
    if (!password || password.trim().length === 0) {
        errors.password = "Password is required.";
    }
    if (Object.keys(errors).length > 0) {
        return { errors };
    }
    try {
        const res = await loginApi({ email, password });
        if (!res) {
            return { message: "Invalid email or password. Please try again." };
        }
        const accessToken = res.data?.accessToken;
        const refreshToken = res.data?.refreshToken;
        if (!accessToken) {
            return { message: "Login failed." };
        }
        const userId = res.data?.user?.id as string | number | undefined;
        const role = res.data?.user?.role as string | undefined;
        createSession({ userId, role, accessToken, refreshToken, expiresAt: new Date(Date.now()).toISOString() }, remember);
        return { success: true };
    } catch {
        return { message: "Login failed." };
    }
}

export async function logout() {
    deleteSession();
    return { success: true };
}
