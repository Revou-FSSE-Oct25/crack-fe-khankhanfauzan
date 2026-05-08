export function formatRupiah(
    amount: number | string | undefined | null,
    options?: Intl.NumberFormatOptions,
): string {
    // handle empty data
    if (amount === undefined || amount === null) return "Rp0";

    // ensure value formatted to 
    const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount;

    // handle if the input value not a valid number (NaN)
    if (isNaN(numericValue)) return "Rp0";

    // format uses international standards
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Set 0 so there is no ,00 at the back
        maximumFractionDigits: options?.notation === 'compact' ? 1 : 0,
        ...options
    }).format(numericValue);

    // Menghilangkan spasi setelah "Rp" yang sering muncul di format id-ID (terutama saat compact)
    return formatted.replace(/^Rp\s+/, 'Rp');
}

export function formatDate(
    dateStr: string | null | undefined,
    options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" },
) {
    if (!dateStr) return "-";

    const formatted = new Date(dateStr).toLocaleDateString("id-ID", options);

    return formatted;
}

export function formatDurationUnit(
    rentType: "daily" | "weekly" | "monthly" | "yearly" | string,
    lang: "id" | "en" = "id"
) {
    const units = {
        daily: { id: "Hari", en: "Days" },
        weekly: { id: "Minggu", en: "Weeks" },
        monthly: { id: "Bulan", en: "Months" },
        yearly: { id: "Tahun", en: "Years" },
    };

    const type = rentType.toLowerCase() as keyof typeof units;

    return units[type]?.[lang] || rentType;
}

