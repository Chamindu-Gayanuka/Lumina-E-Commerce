import React from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const AXIS = {tick: {fontSize: 11, fill: "#94a3b8"}, tickLine: false, axisLine: false};
const TOOLTIP_STYLE = {
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 20px -8px rgb(15 23 42 / .2)",
    fontSize: 12,
    fontWeight: 600,
};

export function ChartCard({title, subtitle, actions, children, className = ""}) {
    return (
        <section className={`lum-card p-5 sm:p-6 ${className}`}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-extrabold tracking-tight text-ink-900">{title}</h3>
                    {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
                </div>
                {actions}
            </div>
            {children}
        </section>
    );
}

export function SalesArea({data, color = "#0d9488"}) {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{top: 4, right: 4, left: -14, bottom: 0}}>
                    <defs>
                        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.28}/>
                            <stop offset="100%" stopColor={color} stopOpacity={0.02}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                    <XAxis dataKey="month" {...AXIS} />
                    <YAxis {...AXIS} tickFormatter={(v) => `${Math.round(v / 1000)}k`}/>
                    <Tooltip contentStyle={TOOLTIP_STYLE}
                             formatter={(v, n) => [`Rs. ${Number(v).toLocaleString("en-LK")}`, n === "revenue" ? "Revenue" : "Orders"]}/>
                    <Area type="monotone" dataKey="revenue" stroke={color} strokeWidth={2.5} fill="url(#salesFill)"/>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function OrdersBar({data}) {
    return (
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{top: 4, right: 4, left: -22, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                    <XAxis dataKey="month" {...AXIS} />
                    <YAxis {...AXIS} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{fill: "#f0fdfa"}}/>
                    <Bar dataKey="orders" name="Orders" fill="#14b8a6" radius={[6, 6, 0, 0]} maxBarSize={26}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

const PIE_COLORS = ["#0d9488", "#f59e0b", "#6366f1", "#ec4899", "#10b981", "#0ea5e9"];

export function StatusPie({data, nameKey = "name"}) {
    return (
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey={nameKey} innerRadius={52} outerRadius={82}
                         paddingAngle={3} strokeWidth={0}>
                        {data.map((entry, idx) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Cell key={entry[nameKey] ?? idx} fill={PIE_COLORS[idx % PIE_COLORS.length]}/>
                        ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE}/>
                    <Legend iconType="circle" iconSize={8}
                            formatter={(v) => <span className="text-xs font-semibold text-slate-500">{v}</span>}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function TopProductsBars({data}) {
    return (
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{top: 0, right: 12, left: 8, bottom: 0}}>
                    <XAxis type="number" hide/>
                    <YAxis type="category" dataKey="name" width={150} {...AXIS} tick={{fontSize: 11, fill: "#64748b"}}/>
                    <Tooltip contentStyle={TOOLTIP_STYLE}
                             formatter={(v) => [`Rs. ${Number(v).toLocaleString("en-LK")}`, "Revenue"]}
                             cursor={{fill: "#f8fafc"}}/>
                    <Bar dataKey="revenue" fill="#f59e0b" radius={[0, 6, 6, 0]} maxBarSize={16}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function MiniTrend({data, dataKey = "orders", color = "#0d9488", height = 44}) {
    return (
        <div style={{height, width: "100%"}}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{top: 4, right: 0, left: 0, bottom: 0}}>
                    <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}