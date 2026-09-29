import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FaBoxesStacked, FaSackDollar, FaStore, FaTruckFast, FaUsers} from "react-icons/fa6";
import StatCard from "../../components/ui/StatCard";
import Badge, {OrderStatusBadge, SellerStatusBadge} from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import {ChartCard, SalesArea, StatusPie} from "../../components/charts/Charts";
import {PageSpinner} from "../../components/ui/Spinner";
import {formatNumber, formatPrice, formatDate} from "../../utils/format";
import {getPlatformStats, listSellers, setSellerApproval} from "../../services/accountService";
import {getAllOrders} from "../../services/orderService";
import {useToast} from "../../context/ToastContext";

export default function AdminDashboard() {
    const {notify} = useToast();
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState(null);
    const [sellers, setSellers] = useState(null);

    useEffect(() => {
        let alive = true;
        Promise.all([getPlatformStats(), getAllOrders(), listSellers()]).then(([s, o, se]) => {
            if (!alive) return;
            setStats(s);
            setOrders(o);
            setSellers(se);
        });
        return () => {
            alive = false;
        };
    }, []);

    if (!stats || !orders || !sellers) return <PageSpinner label="Aggregating platform data…"/>;

    const snapshot = stats.snapshot;
    const pendingSellers = sellers.filter((s) => s.approvalStatus === "Pending");

    const approve = async (id, status) => {
        await setSellerApproval(id, status);
        notify(status === "Approved" ? "Seller approved - store is live" : "Seller rejected", status === "Approved" ? "success" : "info");
        setSellers(null);
        Promise.all([listSellers()]).then(([se]) => setSellers(se));
    };

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Platform Dashboard</h1>
                    <p className="mt-1.5 text-sm text-slate-500">Marketplace health at a glance - all data is frontend
                        mock until the API lands.</p>
                </div>
                <Badge tone="amber" uppercase dot>
                    {pendingSellers.length} seller application{pendingSellers.length === 1 ? "" : "s"} waiting
                </Badge>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total revenue (12 mo)" value={formatPrice(snapshot.revenue)}
                          icon={<FaSackDollar size={18}/>} tone="teal" trend={9.4}/>
                <StatCard label="Orders" value={snapshot.totalOrders} icon={<FaTruckFast size={18}/>} tone="blue"
                          trend={6.1}/>
                <StatCard label="Customers" value={formatNumber(snapshot.totalCustomers)} icon={<FaUsers size={18}/>}
                          tone="purple" trend={2.8}/>
                <StatCard label="Sellers" value={snapshot.totalSellers} icon={<FaStore size={18}/>} tone="amber"
                          trendLabel={`${snapshot.pendingSellers} pending approval`}/>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <ChartCard
                    title="Marketplace revenue"
                    subtitle="Gross value of all placed orders"
                    actions={
                        <Link to="/admin/orders" className="text-xs font-bold text-primary-600 hover:underline">View
                            orders →</Link>
                    }
                >
                    <SalesArea data={stats.sales}/>
                </ChartCard>
                <div className="space-y-6">
                    <ChartCard title="Orders by status">
                        <StatusPie data={snapshot.ordersByStatus}/>
                    </ChartCard>
                    <div className="lum-card p-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Stock
                                watch</h3>
                            <Link to="/admin/inventory" className="text-xs font-bold text-primary-600 hover:underline">Monitor
                                →</Link>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                            <div className="rounded-xl bg-amber-50 py-3">
                                <p className="text-2xl font-extrabold text-amber-600">{snapshot.lowStock}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700/70">Low
                                    stock</p>
                            </div>
                            <div className="rounded-xl bg-red-50 py-3">
                                <p className="text-2xl font-extrabold text-red-500">{snapshot.outOfStock}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-red-600/70">Out of
                                    stock</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]">
                <section className="lum-card">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="text-base font-extrabold tracking-tight text-ink-900">Latest orders</h3>
                        <Link to="/admin/orders" className="text-xs font-bold text-primary-600 hover:underline">All
                            orders →</Link>
                    </div>
                    <DataTable
                        dense
                        columns={[
                            {
                                key: "orderNumber",
                                header: "Order",
                                render: (o) => <span className="font-bold text-ink-900">{o.orderNumber}</span>
                            },
                            {key: "customerName", header: "Customer"},
                            {
                                key: "placedAt",
                                header: "Placed",
                                render: (o) => <span className="text-xs text-slate-400">{formatDate(o.placedAt)}</span>
                            },
                            {
                                key: "totalAmount",
                                header: "Total",
                                render: (o) => <span className="font-bold">{formatPrice(o.totalAmount)}</span>
                            },
                            {key: "status", header: "Status", render: (o) => <OrderStatusBadge status={o.status}/>},
                        ]}
                        rows={orders.slice(0, 6)}
                    />
                </section>

                <section className="lum-card p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold tracking-tight text-ink-900">Seller approvals</h3>
                        <FaBoxesStacked className="text-slate-300" size={16}/>
                    </div>
                    {pendingSellers.length === 0 ? (
                        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Queue
                            clear 🎉</p>
                    ) : (
                        <ul className="mt-4 space-y-4">
                            {pendingSellers.map((s) => (
                                <li key={s.id} className="rounded-2xl border border-slate-100 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-extrabold text-ink-900">{s.storeName}</p>
                                            <p className="mt-0.5 text-xs text-slate-400">{s.ownerEmail} ·
                                                applied {formatDate(s.joinedAt)}</p>
                                        </div>
                                        <SellerStatusBadge status={s.approvalStatus}/>
                                    </div>
                                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{s.description}</p>
                                    <div className="mt-3 flex gap-2">
                                        <button type="button" onClick={() => approve(s.id, "Approved")}
                                                className="flex-1 rounded-lg bg-primary-600 py-1.5 text-xs font-bold text-white hover:bg-primary-700">Approve
                                        </button>
                                        <button type="button" onClick={() => approve(s.id, "Rejected")}
                                                className="flex-1 rounded-lg border border-red-200 bg-red-50 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100">Reject
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}