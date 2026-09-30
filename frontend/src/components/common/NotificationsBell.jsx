import React, {useEffect, useMemo, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
    FaBell,
    FaBoxOpen,
    FaCircleCheck,
    FaPen,
    FaStore,
    FaTruckFast,
    FaTriangleExclamation,
    FaUserPlus,
} from "react-icons/fa6";
import store from "../../data/store";
import {useAuth} from "../../context/AuthContext";

const ago = (iso) => {
    if (!iso) return "recently";
    const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 2) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    return days <= 1 ? "yesterday" : `${days}d ago`;
};

export default function NotificationsBell() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const role = user?.role || "Guest";
    const readKey = `lumina.notify-read.${role}.${user?.id || "anon"}`;
    const [readIds, setReadIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(readKey) || "[]");
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(readKey, JSON.stringify(readIds));
        } catch {
            /* storage disabled - state still works in-memory */
        }
    }, [readIds, readKey]);

    useEffect(() => {
        const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const items = useMemo(() => {
        const out = [];
        const products = store.getProducts();
        if (role === "Administrator") {
            const sellers = store.getSellers();
            const pendingSellers = sellers.filter((s) => s.approvalStatus === "Pending");
            pendingSellers.forEach((s) =>
                out.push({
                    id: `approval-${s.id}`,
                    icon: <FaUserPlus size={12}/>,
                    tone: "bg-amber-50 text-amber-600",
                    title: "New seller application",
                    body: `${s.storeName} · applied ${ago(s.appliedAt || `${s.joinedAt}T09:00:00Z`)}`,
                    to: `/admin/sellers/${s.id}?review=1`,
                })
            );
            const pendingOrders = store.getAllOrders().filter((o) => o.status === "Pending").slice(0, 2);
            pendingOrders.forEach((o) =>
                out.push({
                    id: `order-${o.id}`,
                    icon: <FaTruckFast size={12}/>,
                    tone: "bg-blue-50 text-blue-600",
                    title: "Order awaiting fulfilment",
                    body: `${o.orderNumber} · ${o.customerName}`,
                    to: `/admin/orders?q=${encodeURIComponent(o.orderNumber)}`,
                })
            );
            const outProducts = products.filter((p) => p.status === "Active" && p.stock === 0);
            const lowProducts = products.filter((p) => p.status === "Active" && p.stock > 0 && p.stock <= (p.lowStockLevel ?? 5));
            if (outProducts.length)
                out.push({
                    id: `out-${outProducts.length}`,
                    icon: <FaTriangleExclamation size={12}/>,
                    tone: "bg-red-50 text-red-500",
                    title: `${outProducts.length} product${outProducts.length > 1 ? "s are" : " is"} out of stock`,
                    body: "Buyers can still view these listings",
                    to: "/admin/inventory/out",
                });
            if (lowProducts.length)
                out.push({
                    id: `low-${lowProducts.length}`,
                    icon: <FaBoxOpen size={12}/>,
                    tone: "bg-amber-50 text-amber-600",
                    title: `${lowProducts.length} product${lowProducts.length > 1 ? "s" : ""} running low`,
                    body: "Consider restock reminders",
                    to: "/admin/inventory/low",
                });
        } else if (role === "Seller") {
            const me = store.getSellerById(user?.sellerId);
            if (me?.approvalStatus === "Pending")
                out.push({
                    id: "approval-self",
                    icon: <FaStore size={12}/>,
                    tone: "bg-amber-50 text-amber-600",
                    title: "Store still awaiting approval",
                    body: "Admins review new applications daily",
                    to: "/seller/profile",
                });
            store
                .getOrdersBySeller(user?.sellerId)
                .filter((o) => o.status === "Pending" || o.status === "Processing")
                .slice(0, 3)
                .forEach((o) =>
                    out.push({
                        id: `so-${o.id}`,
                        icon: <FaTruckFast size={12}/>,
                        tone: "bg-blue-50 text-blue-600",
                        title: o.status === "Pending" ? "New order received" : "Order needs shipping",
                        body: `${o.orderNumber} · ${o.customerName}`,
                        to: `/seller/orders/${o.id}`,
                    })
                );
            const mine = products.filter((p) => p.sellerId === user?.sellerId);
            const low = mine.filter((p) => p.stock > 0 && p.stock <= (p.lowStockLevel ?? 5)).length;
            const outOf = mine.filter((p) => p.stock === 0).length;
            if (low + outOf > 0)
                out.push({
                    id: `inv-${low}-${outOf}`,
                    icon: <FaTriangleExclamation size={12}/>,
                    tone: "bg-red-50 text-red-500",
                    title: `${outOf ? `${outOf} out of stock` : ""}${outOf && low ? " · " : ""}${low ? `${low} low stock` : ""}`,
                    body: "Update levels to keep listings buying",
                    to: "/seller/inventory",
                });
        } else if (role === "Customer") {
            const orders = store.getAllOrders().filter((o) => o.customerId === user?.id);
            orders
                .filter((o) => o.status === "Processing" || o.status === "Shipped" || o.status === "Pending")
                .slice(0, 2)
                .forEach((o) =>
                    out.push({
                        id: `co-${o.id}`,
                        icon: <FaTruckFast size={12}/>,
                        tone: "bg-blue-50 text-blue-600",
                        title: `Order ${o.status.toLowerCase()}`,
                        body: `${o.orderNumber} · placed ${ago(o.placedAt)}`,
                        to: `/account/orders/${o.id}`,
                    })
                );
            const delivered = orders.find((o) => o.status === "Delivered");
            if (delivered) {
                const target = (delivered.items || [])[0];
                if (target)
                    out.push({
                        id: `rev-${delivered.id}`,
                        icon: <FaPen size={12}/>,
                        tone: "bg-primary-50 text-primary-600",
                        title: "How was your order?",
                        body: `Review ${target.name} - verified buyers help others`,
                        to: `/product/${target.productId}`,
                    });
            }
        }
        return out;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, user?.id, user?.sellerId, location.pathname]);

    const unread = items.filter((i) => !readIds.includes(i.id));

    const openItem = (item) => {
        setReadIds((r) => [...r, item.id]);
        setOpen(false);
        navigate(item.to);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={`Notifications${unread.length ? ` (${unread.length} unread)` : ""}`}
                aria-expanded={open}
                className={`relative rounded-lg p-2 transition-colors hover:bg-slate-100 ${open ? "bg-slate-100 text-ink-800" : "text-slate-500"}`}
            >
                <FaBell size={15}/>
                {unread.length > 0 && (
                    <span
                        className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-extrabold text-white ring-2 ring-white">
            {unread.length}
          </span>
                )}
            </button>

            {open && (
                <div
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift sm:w-80">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <p className="text-sm font-extrabold tracking-tight text-ink-900">
                            Notifications {unread.length > 0 &&
                            <span className="text-slate-400">({unread.length} new)</span>}
                        </p>
                        {readIds.length > 0 && (
                            <button type="button" onClick={() => setReadIds([])}
                                    className="text-[11px] font-bold text-primary-600 hover:underline">
                                Reset read
                            </button>
                        )}
                    </div>
                    {items.length === 0 ? (
                        <p className="flex items-center gap-2 px-4 py-6 text-sm text-slate-400">
                            <FaCircleCheck className="text-emerald-400" size={13}/> You&rsquo;re all caught up.
                        </p>
                    ) : (
                        <ul className="max-h-80 divide-y divide-slate-50 overflow-y-auto">
                            {items.map((item) => {
                                const isRead = readIds.includes(item.id);
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onClick={() => openItem(item)}
                                            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${isRead ? "opacity-55" : ""}`}
                                        >
                                            <span
                                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.tone}`}>{item.icon}</span>
                                            <span className="min-w-0">
                        <span className="block text-[13px] font-bold leading-snug text-ink-900">{item.title}</span>
                        <span className="block truncate text-xs text-slate-400">{item.body}</span>
                      </span>
                                            {!isRead && <span
                                                className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400"
                                                aria-label="unread"/>}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <div className="border-t border-slate-100 px-4 py-2.5 text-center">
                        <Link
                            to={role === "Administrator" ? "/admin/sellers?tab=Pending" : role === "Seller" ? "/seller/orders" : "/account/orders"}
                            onClick={() => setOpen(false)}
                            className="text-[11px] font-bold text-primary-600 hover:underline"
                        >
                            View full {role === "Customer" ? "order history" : role === "Seller" ? "orders" : "queue"} →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}