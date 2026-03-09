"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    CalendarIcon,
    CreditCardIcon,
    WrenchIcon,
    StarIcon,
    UserIcon,
    HomeIcon,
    LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";

type AdminSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AdminSidebarProps) {
    const { toggleSidebar, open } = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex gap-2 items-center">
                            <Button size="icon-sm" onClick={toggleSidebar}>
                                <HomeIcon color="white" />
                            </Button>
                            {open ? (
                                <span className="text-lg font-bold">
                                    Emerald House
                                </span>
                            ) : (
                                <></>
                            )}
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/user/">
                                    <HomeIcon />
                                    <span>Home</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/user/bookings">
                                    <CalendarIcon />
                                    <span>Booking</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/user/transactions">
                                    <CreditCardIcon />
                                    <span>Transaksi</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/user/complaints">
                                    <WrenchIcon />
                                    <span>Komplain</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/user/reviews">
                                    <StarIcon />
                                    <span>Review</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/user/profile">
                                    <UserIcon />
                                    <span>Profile</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Button
                                variant="ghostDestructive"
                                className="justify-start"
                            >
                                <LogOutIcon />
                                Logout
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
