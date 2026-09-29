import React from "react";
import {
    FaBoxesPacking,
    FaCircleCheck,
    FaGear,
    FaTruck,
    FaHouse,
    FaXmark,
} from "react-icons/fa6";
import {formatDateTime} from "../../utils/format";

const STEP_ICONS = {
    pending: FaBoxesPacking,
    processing: FaGear,
    shipped: FaTruck,
    delivered: FaHouse,
    cancelled: FaXmark,
};

/**
 * Vertical "Delivery Progress" timeline (tracking wireframe).
 * Steps come from order.timeline: {key,title,note,at,done,cancelled}.
 * Trailing future steps (Shipped → Delivered after cancel) render faded.
 */
export default function OrderTimeline({order}) {
    const allKeys = ["pending", "processing", "shipped", "delivered"];
    const reached = new Set((order.timeline || []).map((t) => t.key));
    const cancelled = order.status === "Cancelled";

    const rows = [];
    if (cancelled) {
        const pre = (order.timeline || []).filter((t) => !t.cancelled);
        const cancelStep = (order.timeline || []).find((t) => t.cancelled);
        rows.push(...pre);
        if (cancelStep) rows.push(cancelStep);
        const after = ["shipped", "delivered"].filter((k) => !reached.has(k));
        after.forEach((k) => rows.push({key: k, title: "Shipped".toLowerCase() === k ? "Shipped" : k, faded: true}));
        // nicer labels for the faded tail
        rows.forEach((r) => {
            if (r.faded) {
                r.title = r.key === "shipped" ? "Shipped" : "Delivered";
                r.note = r.key === "shipped" ? "Order dispatched for delivery" : "Order delivered successfully to your address";
            }
        });
    } else {
        const steps = order.timeline || [];
        allKeys.forEach((key, idx) => {
            const done = steps.find((s) => s.key === key);
            const currentIdx = steps.length - 1;
            rows.push(
                done || {
                    key,
                    title: key.charAt(0).toUpperCase() + key.slice(1),
                    note: idx === currentIdx + 1 ? "In progress…" : "Awaiting update",
                    faded: true,
                }
            );
        });
    }

    return (
        <ol className="relative">
            {rows.map((step, idx) => {
                const Icon = STEP_ICONS[step.key] || FaBoxesPacking;
                const isLast = idx === rows.length - 1;
                const state = step.cancelled ? "cancelled" : step.done ? "done" : step.faded ? "todo" : "current";
                return (
                    <li key={`${step.key}-${idx}`} className="relative flex gap-5 pb-9 last:pb-0">
                        {!isLast && (
                            <span
                                aria-hidden="true"
                                className={`absolute left-[21px] top-11 h-[calc(100%-40px)] w-0.5 ${
                                    state === "done" || step.cancelled ? "bg-primary-500" : "bg-slate-200"
                                } ${state === "cancelled" ? "bg-red-300" : ""}`}
                            />
                        )}
                        <span
                            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                state === "done"
                                    ? "bg-primary-600 text-white"
                                    : state === "cancelled"
                                        ? "bg-red-500 text-white ring-4 ring-red-100"
                                        : state === "todo"
                                            ? "border border-slate-200 bg-slate-50 text-slate-300"
                                            : "border border-primary-200 bg-primary-50 text-primary-600"
                            }`}
                        >
              {state === "done" && (
                  <FaCircleCheck size={13} className="absolute -right-1 -top-1 rounded-full bg-white text-emerald-500"/>
              )}
                            <Icon size={16}/>
            </span>
                        <div className="min-w-0 flex-1 pt-1">
                            <p className={`text-base font-extrabold tracking-tight ${state === "cancelled" ? "text-red-600" : state === "todo" ? "text-slate-300" : "text-ink-900"}`}>
                                {step.cancelled ? "CANCELLED" : step.title}
                            </p>
                            <p className={`mt-0.5 text-sm ${state === "todo" ? "text-slate-300" : "text-slate-500"}`}>{step.note}</p>
                            {step.at && (
                                <p className={`mt-1 text-xs font-bold ${state === "cancelled" ? "text-red-500" : "text-primary-700"}`}>
                                    {formatDateTime(step.at)}
                                </p>
                            )}
                            {step.cancelled && order.cancellationReason && (
                                <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-4">
                                    <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-red-600">
                                        <span
                                            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">i</span>
                                        Reason for cancellation:
                                    </p>
                                    <p className="mt-2 text-sm italic leading-relaxed text-red-600/90">“{order.cancellationReason}”</p>
                                </div>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}