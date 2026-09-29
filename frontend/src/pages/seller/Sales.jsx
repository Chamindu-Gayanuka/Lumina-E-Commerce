import React, {useEffect, useMemo, useState} from "react";
import {FaCalculator, FaCoins, FaSackDollar} from "react-icons/fa6";
import StatCard from "../../components/ui/StatCard";
import {ChartCard, OrdersBar, SalesArea, TopProductsBars} from "../../components/charts/Charts";
import {Select} from "../../components/ui/Input";
import DataTable from "../../components/ui/DataTable";
import {PageSpinner} from "../../components/ui/Spinner";
import {formatPrice} from "../../utils/format";
import {getSellerStats} from "../../services/accountService";
import {useAuth} from "../../context/AuthContext";

const RANGES = {"6m": 6, "3m": 3, "12m": 12};

export default function SellerSales() {
    const {user} = useAuth();
    const sellerId = user?.sellerId || "s1";
    const [stats, setStats] = useState(null);
    const [range, setRange] = useState("12m");

    useEffect(() => {
        let alive = true;
        getSellerStats(sellerId).then((s) => {
            if (alive) setStats(s);
        });
        return () => {
            alive = false;
        };
    }, [sellerId]);

    const sliced = useMemo(() => {
        if (!stats) return [];
        const months = stats.sales.slice(-RANGES[range]);
        return months;
    }, [stats, range]);

    if (!stats) return <PageSpinner label="Building your sales report…"/>;

    const revenue = sliced.reduce((s, m) => s + m.revenue, 0);
    const orderCount = sliced.reduce((s, m) => s + m.orders, 0);
    const aov = orderCount ? Math.round(revenue / orderCount) : 0;

    const monthly = sliced.map((m) => ({
        month: m.month,
        revenue: formatPrice(m.revenue),
        orders: m.orders,
        aov: formatPrice(Math.round(m.revenue / (m.orders || 1)))
    }));

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Sales Overview</h1>
                    <p className="mt-1.5 text-sm text-slate-500">Revenue performance across your storefront (mock
                        analytics until the API phase).</p>
                </div>
                <Select name="salesRange" value={range} onChange={(e) => setRange(e.target.value)}
                        className="h-10 w-auto text-sm">
                    <option value="12m">Last 12 months</option>
                    <option value="6m">Last 6 months</option>
                    <option value="3m">Last quarter</option>
                </Select>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-3">
                <StatCard label="Revenue" value={formatPrice(revenue)} icon={<FaSackDollar size={18}/>} tone="teal"
                          trend={8.1}/>
                <StatCard label="Orders" value={orderCount} icon={<FaCoins size={18}/>} tone="blue" trend={4.6}/>
                <StatCard label="Avg. order value" value={formatPrice(aov)} icon={<FaCalculator size={18}/>}
                          tone="purple" trend={-1.8}/>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <ChartCard title="Revenue trend" subtitle={`Rs. collected over ${RANGES[range]} months`}>
                    <SalesArea data={sliced} color="#0d9488"/>
                </ChartCard>
                <ChartCard title="Orders per month" subtitle="Units shipped">
                    <OrdersBar data={sliced}/>
                </ChartCard>
            </div>

            <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_420px]">
                <section className="lum-card">
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h3 className="text-base font-extrabold tracking-tight text-ink-900">Monthly breakdown</h3>
                    </div>
                    <DataTable
                        dense
                        columns={[
                            {
                                key: "month",
                                header: "Month",
                                render: (r) => <span className="font-bold text-ink-900">{r.month}</span>
                            },
                            {
                                key: "revenue",
                                header: "Revenue",
                                render: (r) => <span className="font-semibold text-emerald-600">{r.revenue}</span>
                            },
                            {key: "orders", header: "Orders"},
                            {key: "aov", header: "AOV", render: (r) => <span className="text-slate-500">{r.aov}</span>},
                        ]}
                        rows={[...monthly].reverse()}
                    />
                </section>
                <ChartCard title="Top products" subtitle="Lifetime revenue by SKU">
                    <TopProductsBars data={stats.topProducts}/>
                </ChartCard>
            </div>
        </div>
    );
}