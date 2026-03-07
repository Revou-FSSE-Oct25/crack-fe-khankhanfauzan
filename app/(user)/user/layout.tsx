import { AppSidebar } from "@/components/sidebars/AppSidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

export default function UserLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        // <SidebarProvider>
        //     <AppSidebar variant="inset" />
        //     <SidebarInset className="overflow-hidden">{children}</SidebarInset>
        // </SidebarProvider>
        <main>{children}</main>
    );
}
