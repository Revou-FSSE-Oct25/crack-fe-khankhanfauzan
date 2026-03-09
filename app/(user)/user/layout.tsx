import { PageHeader } from "@/components/layout/PageHeader";
import { AppSidebar } from "@/components/sidebars/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function UserLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                <main>
                    <PageHeader></PageHeader>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
