"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { HomeIcon } from "lucide-react";
import { Button } from "../ui/button";

type AdminSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AdminSidebarProps) {
    const { toggleSidebar } = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Button size="icon-sm" onClick={toggleSidebar}>
                                <HomeIcon color="white" />
                            </Button>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />

                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
