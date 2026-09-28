import React, {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {FaBoxOpen, FaCircleExclamation, FaPlus, FaTruckFast, FaWallet} from "react-icons/fa6";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import {OrderStatusBadge, ProductStatusBadge} from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import {ChartCard, SalesArea, OrdersBar} from "../../components/charts/Charts";
import ProductImage from "../../components/product/ProductImage";
import {PageSpinner} from "../../components/ui/Spinner";
import {formatPrice, formatDate} from "../../utils/format";
import {getSellerStats} from "../../services/accountService";
import {getSellerProducts} from "../../services/productService";
import {getSellerOrders} from "../../services/orderService";
import {useAuth} from "../../context/AuthContext";

export default function SellerDashboard() {
    const {user} = useAuth();
    const sellerId = user?.sellerId || "s1";
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState(null);
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        let alive = true;
        Promise.all([getSellerStats(sellerId), getSellerProducts(sellerId), getSellerOrders(sellerId)]).then(
            ([s, p, o]) => {
                if (!alive) return;
                setStats(s);
                setProducts(p);
                setOrders(o);
            }
        );
        return () => {
            alive = false;
        };
    }, [sellerId]);

    const lowStock = useMemo(() => (products || []).filter((p) => p.stock <= (p.lowStockLevel ?? 5)).slice(0, 5), [products]);

    if (!stats || !products || !orders) return <PageSpinner label="Crunching your store numbers…"/>;

    const openOrders = orders.filter((o) => ["Pending", "Processing"].includes(o.status));

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">
                        Welcome back, {user?.name?.split(" ")[0] || "Seller"} 👋
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        {user?.seller?.storeName || "SoundMaster Official"} ·{" "}
                        <span className="font-semibold text-emerald-600">Store approved & trading</span>
                    </p>
                </div>
                <div className="flex gap-2.5">
                    <Button as={Link} to="/seller/products/new" icon={<FaPlus size={11}/>}>Add Product</Button>
                    <Button as={Link} to="/store/s1" variant="secondary">View Storefront</Button>
                </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Revenue (12 mo)" value={formatPrice(stats.snapshot.revenue)} trend={12.4}
                          icon={<FaWallet size={18}/>} tone="teal"/>
                <StatCard label="Orders this month" value={orders.length}
                          trendLabel={`${openOrders.length} need action`} icon={<FaTruckFast size={18}/>} tone="blue"/>
                <StatCard label="Active products" value={products.length} icon={<FaBoxOpen size={18}/>} tone="purple"
                          trendLabel="across all categories"/>
                <StatCard label="Inventory alerts" value={stats.snapshot.lowStock + stats.snapshot.outOfStock}
                          icon={<FaCircleExclamation size={18}/>} tone="amber"
                          trendLabel={`${stats.snapshot.outOfStock} out of stock`}/>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <ChartCard title="Revenue Trend" subtitle="Rolling 12 months, all channels">
                    <SalesArea data={stats.sales}/>
                </ChartCard>
                <ChartCard title="Monthly Orders" subtitle="Paid + delivered orders">
                    <OrdersBar data={stats.sales}/>
                </ChartCard>
            </div>

            <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]">
                <section className="lum-card">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="text-base font-extrabold tracking-tight text-ink-900">Recent Orders</h3>
                        <Link to="/seller/orders" className="text-xs font-bold text-primary-600 hover:underline">Manage
                            all →</Link>
                    </div>
                    <DataTable
                        keyField="id"
                        columns={[
                            {
                                key: "orderNumber",
                                header: "Order",
                                render: (r) => (
                                    <div>
                                        <p className="font-bold text-ink-900">{r.orderNumber}</p>
                                        <p className="text-xs text-slate-400">{formatDate(r.placedAt)}</p>
                                    </div>
                                ),
                            },
                            {
                                key: "customer",
                                header: "Customer",
                                render: (r) => <p className="text-sm font-semibold text-slate-600">{r.customerName}</p>
                            },
                            {
                                key: "total",
                                header: "Total",
                                render: (r) => <p className="font-bold text-ink-900">{formatPrice(r.totalAmount)}</p>
                            },
                            {key: "status", header: "Status", render: (r) => <OrderStatusBadge status={r.status}/>},
                        ]}
                        rows={orders.slice(0, 5)}
                        emptyMessage="No orders yet — they'll show up here the moment a customer checks out."
                    />
                </section>

                <section className="lum-card p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold tracking-tight text-ink-900">Low / Out of Stock</h3>
                        <Link to="/seller/inventory" className="text-xs font-bold text-primary-600 hover:underline">Restock
                            →</Link>
                    </div>
                    <ul className="mt-4 space-y-3">
                        {lowStock.length === 0 && (
                            <li className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                🎉 Every product is comfortably in stock.
                            </li>
                        )}
                        {lowStock.map((p) => (
                            <li key={p.id} className="flex items-center gap-3">
                                <ProductImage product={p} className="h-11 w-11 shrink-0 rounded-lg" iconSize={15}/>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-ink-900">{p.name}</p>
                                    <p className="text-xs text-slate-400">{p.stock} units left</p>
                                </div>
                                <ProductStatusBadge status={p.status} stock={p.stock}/>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}