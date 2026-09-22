import React from "react";
import Spinner from "./Spinner";

const VARIANTS = {
    primary: "bg-primary-600 text-white shadow-sm hover:bg-primary-700 focus-visible:ring-primary-500/40",
    secondary: "bg-white text-ink-800 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400/30",
    outline: "border border-primary-600 text-primary-700 bg-transparent hover:bg-primary-50 focus-visible:ring-primary-500/30",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40",
    dangerSoft: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500/30",
    ghost: "bg-transparent text-ink-700 hover:bg-slate-100 focus-visible:ring-slate-400/30",
    dark: "bg-ink-900 text-white hover:bg-ink-800 focus-visible:ring-ink-900/30",
    amber: "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500/40",
};

const SIZES = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
    xl: "px-8 py-4 text-lg gap-3",
};

export default function Button({
                                   as: Tag = "button",
                                   variant = "primary",
                                   size = "md",
                                   loading = false,
                                   disabled = false,
                                   fullWidth = false,
                                   icon = null,
                                   className = "",
                                   children,
                                   ...rest
                               }) {
    return (
        <Tag
            disabled={Tag === "button" ? disabled || loading : undefined}
            className={[
                "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150",
                "focus:outline-none focus-visible:ring-2",
                SIZES[size] || SIZES.md,
                VARIANTS[variant] || VARIANTS.primary,
                fullWidth && "w-full",
                (disabled || loading) && "pointer-events-none opacity-60",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        >
            {loading ? <Spinner size={size === "lg" || size === "xl" ? 18 : 14}/> : icon}
            {children}
        </Tag>
    );
}
