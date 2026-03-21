import { PageHeader } from "@/components/layout/PageHeader";
import { AdminSidebar } from "@/components/sidebars/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset className="overflow-hidden">
                <main>
                    <PageHeader></PageHeader>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
