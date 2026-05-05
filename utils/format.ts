export function formatRupiah(amount: number | string | undefined | null): string {
    // handle empty data
    if (amount === undefined || amount === null) return "Rp0";

    // ensure value formatted to 
    const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount;

    // handle if the input value not a valid number (NaN)
    if (isNaN(numericValue)) return "Rp0";

    // format uses international standards
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Set 0 so there is no ,00 at the back
        maximumFractionDigits: 0,
    }).format(numericValue);
}