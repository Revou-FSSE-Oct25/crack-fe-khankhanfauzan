import NavBar from "@/components/headers/NavBar";
import React from "react";

export default function MarketingLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main>
            <NavBar />
            {children}
        </main>
    );
}
