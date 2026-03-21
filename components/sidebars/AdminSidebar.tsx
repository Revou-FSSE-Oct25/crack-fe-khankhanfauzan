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
     HomeIcon,
     UsersIcon,
     DoorClosedIcon,
     CalendarIcon,
     WrenchIcon,
     CreditCardIcon,
     ReceiptIcon,
     Grid2x2Icon,
     LogOutIcon,
 } from "lucide-react";
 import Link from "next/link";
 import { Button } from "../ui/button";
 
 type AdminSidebarProps = React.ComponentProps<typeof Sidebar>;
 
 export function AdminSidebar({ ...props }: AdminSidebarProps) {
     const { toggleSidebar, open } = useSidebar();
 
     return (
         <Sidebar collapsible="icon" {...props}>
             <SidebarHeader>
                 <SidebarContent>
                     <SidebarMenu>
                         <SidebarMenuItem className="flex gap-2 items-center">
                             <Button size="icon-sm" onClick={toggleSidebar}>
                                 <Grid2x2Icon color="white" />
                             </Button>
                             {open ? <span className="text-lg font-bold">Admin Panel</span> : <></>}
                         </SidebarMenuItem>
                     </SidebarMenu>
                 </SidebarContent>
             </SidebarHeader>
             <SidebarContent>
                 <SidebarGroup>
                     <SidebarMenu>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild>
                                 <Link href="/admin">
                                     <HomeIcon />
                                     <span>Overview</span>
                                 </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild>
                                 <Link href="/admin/dashboard">
                                     <Grid2x2Icon />
                                     <span>Dashboard</span>
                                 </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild>
                                 <Link href="/admin/users">
                                     <UsersIcon />
                                     <span>Users</span>
                                 </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild>
                                 <Link href="/admin/rooms">
                                     <DoorClosedIcon />
                                     <span>Rooms</span>
                                 </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild>
                                 <Link href="/admin/bookings">
                                     <CalendarIcon />
                                     <span>Bookings</span>
                                 </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild>
                                 <Link href="/admin/maintenances">
                                     <WrenchIcon />
                                     <span>Maintenances</span>
                                 </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild>
                                 <Link href="/admin/invoices">
                                     <ReceiptIcon />
                                     <span>Invoices</span>
                                 </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                         <SidebarMenuItem>
                             <SidebarMenuButton asChild>
                                 <Link href="/admin/transactions">
                                     <CreditCardIcon />
                                     <span>Transactions</span>
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
                             <Button variant="ghostDestructive" className="justify-start">
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
