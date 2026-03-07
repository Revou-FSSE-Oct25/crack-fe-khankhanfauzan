import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

type FacilityItem = {
  icon: LucideIcon;
  label: string;
};

function FacilitiesList({
  items,
  className,
}: {
  items: FacilityItem[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-3 mt-2 gap-2", className)}>
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex gap-2 items-center">
          <Icon className="bg-accent p-1 rounded-sm" color="var(--color-primary)" />
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

export { FacilitiesList };
