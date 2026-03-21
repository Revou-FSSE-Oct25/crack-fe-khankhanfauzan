import NavBar from "@/components/headers/NavBar";
import React from "react";

export default function MarketingLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main>
            <NavBar />
            {children}
            <div className="text-center text-sm text-muted-foreground mt-4 px-4 py-4 bg-background mx-auto">
                © 2026 Emerald Kos. All rights reserved.
            </div>
        </main>
    );
}
