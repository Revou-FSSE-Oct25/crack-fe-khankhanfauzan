import React from "react";
import { Input } from "../ui/input";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { BellIcon, MessageCircleMoreIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function AppHeader() {
    return (
        <div className="flex justify-between py-2 px-4 border-b">
            <div className="flex flex-col">
                <h1 className="text-xl font-bold">Hello, John Doe!</h1>
                <p className="text-sm font-medium text-muted-foreground">
                    Explore information and activity about your property
                </p>
            </div>
            <div className="flex gap-2 items-center">
                <ButtonGroup>
                    <Input
                        placeholder="Search..."
                        className="bg-background rounded-full h-10"
                    />
                    <Button
                        variant="outline"
                        aria-label="Search"
                        className="rounded-full"
                        size="icon-lg"
                    >
                        <SearchIcon />
                    </Button>
                </ButtonGroup>
                <Button
                    variant="outline"
                    className="rounded-full"
                    size="icon-lg"
                >
                    <MessageCircleMoreIcon />
                </Button>
                <Button
                    variant="outline"
                    className="rounded-full"
                    size="icon-lg"
                >
                    <BellIcon />
                </Button>
            </div>
        </div>
    );
}

export default AppHeader;
