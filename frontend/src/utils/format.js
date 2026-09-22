const LKR = new Intl.NumberFormat("en-LK", {minimumFractionDigits: 0, maximumFractionDigits: 0});
const LKR2 = new Intl.NumberFormat("en-LK", {minimumFractionDigits: 2, maximumFractionDigits: 2});

export function formatPrice(value, {decimals = false} = {}) {
    const n = Number(value) || 0;
    return `Rs. ${(decimals ? LKR2 : LKR).format(n)}`;
}

export function formatNumber(value) {
    const n = Number(value) || 0;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
    return LKR.format(n);
}

export function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"});
}

export function formatDateTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    const date = d.toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric"});
    const time = d.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"});
    return `${date}, ${time}`;
}

export function formatMonthDay(value) {
    const d = new Date(value);
    return d.toLocaleDateString("en-GB", {day: "2-digit", month: "short"});
}

export function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString();
}

export function deliveryWindow(placedAt) {
    const from = new Date(addDays(placedAt, 4));
    const to = new Date(addDays(placedAt, 6));
    const fmt = (d) =>
        d.toLocaleDateString("en-GB", {month: "short", day: "2-digit"}).toUpperCase();
    return `${fmt(from)} - ${fmt(to)}, ${to.getFullYear()}`;
}
