import React from "react";

export default function Spinner({size = 16, className = ""}) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
            style={{width: size, height: size}}
        />
    );
}

export function PageSpinner({label = "Loading…"}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <Spinner size={28} className="text-primary-600"/>
            {label && <p className="text-sm font-medium">{label}</p>}
        </div>
    );
}
