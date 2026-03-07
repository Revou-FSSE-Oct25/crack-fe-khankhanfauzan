import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { CreditCardIcon, ChevronRightIcon } from "lucide-react";

function NextPaymentCard({
    title = "Pembayaran Berikutnya",
    dueDateLabel,
    daysRemainingLabel,
    amountLabel,
    buttonLabel = "Bayar Sekarang",
    icon: Icon = CreditCardIcon,
    onAction,
    className,
}: {
    title?: string;
    dueDateLabel: string;
    daysRemainingLabel: string;
    amountLabel: string;
    buttonLabel?: string;
    icon?: LucideIcon;
    onAction?: () => void;
    className?: string;
}) {
    return (
        <Card
            className={cn(
                "shadow-none bg-linear-to-br from-cyan-50 to-emerald-50",
                className,
            )}
        >
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <div className="flex gap-2">
                        <div className="p-2 shadow rounded-lg bg-background">
                            <Icon color="var(--color-primary)" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h2>{title}</h2>
                            <p className="text-xs font-normal text-muted-foreground">
                                {dueDateLabel}
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-900 h-min">
                        {daysRemainingLabel}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
                <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">
                        Total tagihan
                    </p>
                    <p className="text-2xl font-bold">{amountLabel}</p>
                </div>
                <Button size="sm" onClick={onAction}>
                    {buttonLabel} <ChevronRightIcon />
                </Button>
            </CardContent>
        </Card>
    );
}

export { NextPaymentCard };
