import React from "react";
import {Link} from "react-router-dom";
import {FaExclamationTriangle, FaInbox} from "react-icons/fa";
import Button from "./Button";

export function EmptyState({icon = <FaInbox size={34}/>, title, message, action, children}) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
            <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">{icon}</div>
            <h3 className="mt-5 text-lg font-bold text-ink-900">{title}</h3>
            {message && <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">{message}</p>}
            {children}
            {action && (
                <div className="mt-6">
                    {action.to ? (
                        action.to.startsWith("/") ? (
                            <Button as={Link} to={action.to}>{action.label}</Button>
                        ) : (
                            <Button as="a" href={action.to}>{action.label}</Button>
                        )
                    ) : (
                        <Button onClick={action.onClick}>{action.label}</Button>
                    )}
                </div>
            )}
        </div>
    );
}

export function ErrorMessage({title = "Something went wrong", message, onRetry}) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center"
            role="alert">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
                <FaExclamationTriangle size={24}/>
            </div>
            <h3 className="mt-4 text-base font-bold text-red-700">{title}</h3>
            {message && <p className="mt-1 max-w-md text-sm text-red-600/80">{message}</p>}
            {onRetry && (
                <div className="mt-5">
                    <Button variant="dangerSoft" onClick={onRetry}>
                        Try again
                    </Button>
                </div>
            )}
        </div>
    );
}

/** Inline form-level validation summary */
export function ValidationSummary({errors}) {
    const list = Object.values(errors || {}).filter(Boolean);
    if (!list.length) return null;
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            <p className="font-semibold">Please fix the following:</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
                {list.map((msg, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={i}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}
