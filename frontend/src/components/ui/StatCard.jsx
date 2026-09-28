import React from "react";
import {FaArrowTrendDown, FaArrowTrendUp} from "react-icons/fa6";

export default function StatCard({icon, label, value, trend, trendLabel, tone = "teal", className = ""}) {
    const tones = {
        teal: "bg-primary-50 text-primary-600",
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-amber-600",
        red: "bg-red-50 text-red-500",
        green: "bg-emerald-50 text-emerald-600",
        purple: "bg-purple-50 text-purple-600",
        pink: "bg-pink-50 text-pink-600",
        slate: "bg-slate-100 text-slate-500",
    };
    const up = typeof trend === "number" ? trend >= 0 : null;
    return (
        <div className={`lum-card p-5 ${className}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">{value}</p>
                </div>
                {icon && <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${tones[tone] || tones.teal}`}>{icon}</div>}
            </div>
            {(trend !== undefined || trendLabel) && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium">
                    {up !== null && (
                        <span
                            className={`inline-flex items-center gap-1 font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
              {up ? <FaArrowTrendUp size={11}/> : <FaArrowTrendDown size={11}/>}
                            {Math.abs(trend)}%
            </span>
                    )}
                    <span className="text-slate-400">{trendLabel || "vs last month"}</span>
                </p>
            )}
        </div>
    );
}