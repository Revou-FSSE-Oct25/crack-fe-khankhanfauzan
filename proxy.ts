import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/admin"];
const publicRoutes = ["/login", "/"];

export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) =>
        path.startsWith(route),
    );
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = req.cookies.get("session")?.value;
    let session:
        | { userId?: number; role?: string; expiresAt?: string }
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

    if (isProtectedRoute && !session?.userId) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    if (isPublicRoute && path === "/login" && session?.userId) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/admin") && session?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (path.startsWith("/dashboard") && session?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
