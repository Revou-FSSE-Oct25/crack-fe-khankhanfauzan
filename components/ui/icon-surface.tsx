"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

function IconSurface({
  children,
  bgClass,
  className,
  rounded = "rounded-lg",
  padding = "p-2",
}: {
  children: React.ReactNode;
  bgClass: string;
  className?: string;
  rounded?: string;
  padding?: string;
}) {
  return (
    <div className={cn(padding, rounded, bgClass, className)}>
      {children}
    </div>
  );
}

export { IconSurface };
