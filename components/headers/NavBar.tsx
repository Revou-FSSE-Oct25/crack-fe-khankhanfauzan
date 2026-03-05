"use client";

import * as React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    CircleAlertIcon,
    CircleCheckIcon,
    CircleDashedIcon,
    HouseIcon,
} from "lucide-react";
import { Button } from "../ui/button";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
];

export default function NavBar() {
    return (
        <NavigationMenu className="max-w-7xl mx-auto flex justify-between p-4">
            <Link href="/">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-sm shadow-md">
                        <HouseIcon color="white" />
                    </div>
                    <p className="text-xl font-bold">Emerald House</p>
                </div>
            </Link>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        Getting started
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="w-96">
                            <ListItem href="/docs" title="Introduction">
                                Re-usable components built with Tailwind CSS.
                            </ListItem>
                            <ListItem
                                href="/docs/installation"
                                title="Installation"
                            >
                                How to install dependencies and structure your
                                app.
                            </ListItem>
                            <ListItem
                                href="/docs/primitives/typography"
                                title="Typography"
                            >
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem className="hidden md:flex">
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-50">
                            <li>
                                <NavigationMenuLink>
                                    <Link
                                        href="#"
                                        className="flex-row items-center gap-2"
                                    >
                                        <CircleAlertIcon />
                                        Backlog
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink>
                                    <Link
                                        href="#"
                                        className="flex-row items-center gap-2"
                                    >
                                        <CircleDashedIcon />
                                        To Do
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink>
                                    <Link
                                        href="#"
                                        className="flex-row items-center gap-2"
                                    >
                                        <CircleCheckIcon />
                                        Done
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                    >
                        <Link href="/docs">Docs</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            <Link href="/login">
                <Button className="rounded-2xl" size="lg">
                    SIGN IN
                </Button>
            </Link>
        </NavigationMenu>
    );
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink>
                <Link href={href}>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="leading-none font-medium">{title}</div>
                        <div className="text-muted-foreground line-clamp-2">
                            {children}
                        </div>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
