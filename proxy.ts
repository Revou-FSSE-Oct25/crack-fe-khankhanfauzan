import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/room", "/login", "/register", "/forgot-password", "/rooms"];

export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = req.cookies.get("session")?.value;
    let session:
        | { userId?: number | string; role?: string; expiresAt?: string }
        | null = null;

    if (cookie) {
        try {
            session = JSON.parse(cookie);
            if (
                session &&
                session.expiresAt &&
                new Date(session.expiresAt) < new Date()
            ) {
                session = null;
            }
        } catch {
            session = null;
        }
    }

    if (path.startsWith("/admin")) {
        if (session?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    if (!isPublicRoute && !session?.userId) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};