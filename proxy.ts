import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/room", "/login", "/register", "/forgot-password", "/rooms"];

export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const isAuthRoute = path === "/login" || path === "/register";

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

    // Redirect authenticated users away from auth pages based on their role
    if (isAuthRoute && session?.userId) {
        if (session.role === "admin") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        } else {
            return NextResponse.redirect(new URL("/user/dashboard", req.url));
        }
    }

    if (path.startsWith("/admin")) {
        if (session?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    if (path.startsWith("/user")) {
        if (session?.role !== "tenant") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    if (!isPublicRoute && !session?.userId && !path.startsWith("/rooms")) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};