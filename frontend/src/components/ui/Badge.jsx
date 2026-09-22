import React from "react";
import {
    ORDER_STATUS_META,
    PAYMENT_STATUS_META,
    USER_STATUS_META,
    SELLER_STATUS_META,
} from "../../utils/constants";

const TONES = {
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
    teal: "bg-primary-50 text-primary-700 ring-primary-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-red-50 text-red-600 ring-red-200",
    blue: "bg-blue-50 text-blue-600 ring-blue-200",
    purple: "bg-purple-50 text-purple-600 ring-purple-200",
    pink: "bg-pink-50 text-pink-600 ring-pink-200",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-200",
};

export default function Badge({tone = "slate", uppercase = false, dot = false, className = "", children}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
                TONES[tone] || TONES.slate
            } ${uppercase ? "uppercase tracking-wide" : ""} ${className}`}
        >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current"/>}
            {children}
    </span>
    );
}

/** Domain badges — status → tone mapping lives in utils/constants.js */
export function OrderStatusBadge({status}) {
    const meta = ORDER_STATUS_META[status] || {badge: "slate"};
    return (
        <Badge tone={meta.badge} uppercase dot>
            {status}
        </Badge>
    );
}

export function PaymentStatusBadge({status}) {
    return (
        <Badge tone={PAYMENT_STATUS_META[status] || "slate"} uppercase>
            {status}
        </Badge>
    );
}

export function UserStatusBadge({status}) {
    return (
        <Badge tone={USER_STATUS_META[status] || "slate"} dot uppercase>
            {status}
        </Badge>
    );
}

export function SellerStatusBadge({status}) {
    return (
        <Badge tone={SELLER_STATUS_META[status] || "slate"} dot uppercase>
            {status}
        </Badge>
    );
}

export function ProductStatusBadge({status, stock}) {
    let tone = "green";
    let label = status;
    if (status !== "Active") {
        tone = status === "Draft" ? "slate" : "red";
    } else if ((stock ?? 0) === 0) {
        tone = "red";
        label = "Out of Stock";
    } else if (stock !== undefined && stock <= 5) {
        tone = "amber";
        label = `Low stock (${stock})`;
    }
    return (
        <Badge tone={tone} uppercase={status !== "Active" || (stock ?? 0) === 0}>
            {label}
        </Badge>
    );
}
