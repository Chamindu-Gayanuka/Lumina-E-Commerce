import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaArrowRight, FaTruckFast} from "react-icons/fa6";
import Tabs from "../../components/ui/Tabs";
import SearchBar from "../../components/ui/SearchBar";
import Badge, {OrderStatusBadge, PaymentStatusBadge} from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import {PageSpinner} from "../../components/ui/Spinner";
import {EmptyState} from "../../components/ui/States";
import {formatPrice, formatDate, formatDateTime} from "../../utils/format";
import {getSellerOrders, updateOrderStatus} from "../../services/orderService";
import {allowedNext} from "../../utils/orderFlow";
import {useAuth} from "../../context/AuthContext";
import {useToast} from "../../context/ToastContext";
import {ORDER_STATUSES} from "../../utils/constants";

export default function SellerOrders() {
    const navigate = useNavigate();
    const {notify} = useToast();
    const {user} = useAuth();
    const sellerId = user?.sellerId || "s1";

    const [orders, setOrders] = useState(null);
    const [tab, setTab] = useState("All");
    const [search, setSearch] = useState("");
    const [advanceTarget, setAdvanceTarget] = useState(null);

    const load = useCallback(() => getSellerOrders(sellerId).then(setOrders), [sellerId]);
    useEffect(() => {
        load();
    }, [load]);

    const counts = useMemo(() => {
        const map = {All: (orders || []).length};
        ORDER_STATUSES.forEach((s) => {
            map[s] = (orders || []).filter((o) => o.status === s).length;
        });
        return map;
    }, [orders]);

    const filtered = useMemo(() => {
        let list = orders || [];
        if (tab !== "All") list = list.filter((o) => o.status === tab);
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(
                (o) =>
                    o.orderNumber.toLowerCase().includes(q) ||
                    (o.customerName || "").toLowerCase().includes(q)
            );
        }
        return list;
    }, [orders, tab, search]);

    const advance = async (status) => {
        await updateOrderStatus(advanceTarget.id, status);
        notify(`Order ${advanceTarget.orderNumber} → ${status}`);
        setAdvanceTarget(null);
        load();
    };

    if (!orders) return <PageSpinner label="Loading your order queue…"/>;

    const nextOptions = advanceTarget ? allowedNext(advanceTarget.status) : [];

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Orders</h1>
                    <p className="mt-1.5 text-sm text-slate-500">Orders containing your products. Update statuses here —
                        customers track them live.</p>
                </div>
                <Button variant="secondary" icon={<FaTruckFast size={12} className="text-primary-600"/>}
                        onClick={() => notify("Bulk CSV fulfilment lands with the backend phase.", "info")}>
                    Export / bulk fulfil
                </Button>
            </div>

            <Tabs
                className="mt-7 overflow-x-auto"
                items={[{key: "All", label: "All", count: counts.All}, ...ORDER_STATUSES.map((s) => ({
                    key: s,
                    label: s,
                    count: counts[s]
                }))]}
                active={tab}
                onChange={setTab}
            />

            <div className="mt-5 flex items-center justify-between gap-3">
                <SearchBar value={search} onChange={setSearch} placeholder="Search order number or customer…"
                           className="w-full max-w-sm"/>
            </div>

            <div className="lum-card mt-4 p-4 sm:p-5">
                {filtered.length === 0 ? (
                    <EmptyState title="No orders in this view"
                                message="When shoppers check out with your products, the queue fills up here."/>
                ) : (
                    <DataTable
                        columns={[
                            {
                                key: "orderNumber",
                                header: "Order",
                                render: (o) => (
                                    <div>
                                        <p className="font-extrabold text-ink-900">{o.orderNumber}</p>
                                        <p className="text-xs text-slate-400">{formatDate(o.placedAt)}</p>
                                    </div>
                                ),
                            },
                            {
                                key: "customer",
                                header: "Customer",
                                render: (o) => (
                                    <div>
                                        <p className="font-semibold text-ink-800">{o.customerName || "Guest"}</p>
                                        <p className="text-xs text-slate-400">{o.items.length} item{o.items.length > 1 ? "s" : ""}</p>
                                    </div>
                                ),
                            },
                            {
                                key: "total",
                                header: "Total",
                                render: (o) => <p
                                    className="font-bold text-ink-900">{formatPrice(o.totalAmount, {decimals: true})}</p>
                            },
                            {
                                key: "payment",
                                header: "Payment",
                                render: (o) => <PaymentStatusBadge status={o.payment.status}/>
                            },
                            {key: "status", header: "Fulfilment", render: (o) => <OrderStatusBadge status={o.status}/>},
                            {
                                key: "actions",
                                header: "",
                                className: "text-right",
                                render: (o) => (
                                    <div className="inline-flex justify-end gap-2">
                                        {allowedNext(o.status).filter((s) => s !== "Cancelled").length > 0 && (
                                            <Button size="sm" variant="outline" icon={<FaArrowRight size={10}/>}
                                                    onClick={() => setAdvanceTarget(o)}>
                                                Update status
                                            </Button>
                                        )}
                                        <Button size="sm" variant="secondary"
                                                onClick={() => navigate(`/seller/orders/${o.id}`)}>
                                            Details
                                        </Button>
                                    </div>
                                ),
                            },
                        ]}
                        rows={filtered}
                    />
                )}
            </div>

            {/* Status update modal */}
            <Modal
                open={Boolean(advanceTarget)}
                onClose={() => setAdvanceTarget(null)}
                title={`Update ${advanceTarget?.orderNumber}`}
                subtitle={advanceTarget ? `Currently ${advanceTarget.status} · placed ${formatDateTime(advanceTarget.placedAt)}` : ""}
                size="sm"
            >
                <p className="text-sm text-slate-500">Choose the next step in fulfilment. The customer's tracking
                    timeline updates instantly.</p>
                <div className="mt-4 space-y-2.5">
                    {nextOptions.length === 0 &&
                        <EmptyState title="No transitions available" message="This order is finalised."/>}
                    {nextOptions.map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => advance(status)}
                            className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all hover:shadow-sm ${
                                status === "Cancelled" ? "border-red-200 bg-red-50/40 hover:border-red-400" : "border-slate-200 bg-white hover:border-primary-500"
                            }`}
                        >
              <span className="text-sm font-bold text-ink-900">
                {status === "Processing" && "Mark as Processing — pack & label"}
                  {status === "Shipped" && "Mark as Shipped — hand to courier"}
                  {status === "Delivered" && "Mark as Delivered — COD collected"}
                  {status === "Cancelled" && "Cancel this order"}
              </span>
                            <Badge tone={status === "Cancelled" ? "red" : "teal"} uppercase>→ {status}</Badge>
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
}