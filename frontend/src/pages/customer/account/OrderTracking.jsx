import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FaBan, FaBoxesPacking, FaTruck, FaHouse, FaCircleCheck} from "react-icons/fa6";
import OrderTimeline from "../../../components/orders/OrderTimeline";
import Button from "../../../components/ui/Button";
import ProductImage from "../../../components/product/ProductImage";
import {EmptyState} from "../../../components/ui/States";
import {PageSpinner} from "../../../components/ui/Spinner";
import {formatPrice, formatDate, deliveryWindow} from "../../../utils/format";
import {getOrder} from "../../../services/orderService";

const BANNERS = {
    Pending: {
        icon: FaBoxesPacking,
        title: "Order Pending",
        note: "We've received your order and the seller will confirm shortly.",
        tone: "from-primary-700 to-primary-600"
    },
    Processing: {
        icon: FaBoxesPacking,
        title: "Processing",
        note: "Your order is being prepared for dispatch",
        tone: "from-primary-700 to-primary-600"
    },
    Shipped: {
        icon: FaTruck,
        title: "Shipped",
        note: "Your order is on its way to you",
        tone: "from-primary-700 to-primary-600"
    },
    Delivered: {
        icon: FaHouse,
        title: "Delivered",
        note: "Order delivered successfully — enjoy!",
        tone: "from-emerald-600 to-emerald-500"
    },
    Cancelled: {
        icon: FaBan,
        title: "Order Cancelled",
        note: "This order has been cancelled and will not be delivered.",
        tone: "from-red-600 to-red-500"
    },
};

export default function OrderTracking() {
    const {orderId} = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        getOrder(orderId).then((o) => {
            if (!alive) return;
            setOrder(o);
            setLoading(false);
        });
        return () => {
            alive = false;
        };
    }, [orderId]);

    if (loading) return <PageSpinner label="Locating your parcel…"/>;
    if (!order) {
        return (
            <EmptyState title="No order found"
                        message="Enter a valid order number from your account to see live tracking."
                        action={{label: "My Orders", onClick: () => navigate("/account/orders")}}/>
        );
    }

    const banner = BANNERS[order.status] || BANNERS.Pending;
    const BannerIcon = banner.icon;
    const cancelled = order.status === "Cancelled";
    const visible = order.items.slice(0, 2);
    const extra = order.items.length - visible.length;

    return (
        <div className="lum-container pb-10 pt-8">
            <div className="flex flex-wrap items-center gap-3.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Track Your Order</h1>
                <span
                    className={`rounded-full px-3.5 py-1 text-sm font-bold ${cancelled ? "bg-red-50 text-red-600 ring-1 ring-red-200" : "bg-white text-primary-700 ring-1 ring-primary-200 shadow-card"}`}>
          {order.orderNumber}
        </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Placed on {formatDate(order.placedAt)}</p>

            {/* Status banner */}
            <div
                className={`mt-6 flex flex-wrap items-center gap-5 rounded-2xl bg-gradient-to-r ${cancelled ? banner.tone : "from-primary-700 to-primary-600"} px-6 py-6 text-white shadow-lift sm:px-8`}>
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
          <BannerIcon size={26}/>
        </span>
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{banner.title}</h2>
                    <p className="mt-1 text-sm text-white/85">{banner.note}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                        {cancelled ? "Cancellation date" : "Estimated delivery"}
                    </p>
                    <p className="mt-1 text-xl font-extrabold">
                        {cancelled ? formatDate(order.cancelledAt) : order.estimatedDelivery ? formatDate(order.estimatedDelivery) : deliveryWindow(order.placedAt)}
                    </p>
                </div>
            </div>

            <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
                <section className="lum-card p-6 sm:p-8">
                    <h2 className="text-lg font-extrabold tracking-tight text-ink-900">Delivery Progress</h2>
                    <div className="mt-6">
                        <OrderTimeline order={order}/>
                    </div>
                </section>

                <aside className="lum-card p-6">
                    <h2 className="border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">Order
                        Summary</h2>
                    <div className="flex items-center gap-3 pt-4">
                        <div className="flex -space-x-3">
                            {visible.map((it, idx) => (
                                <span key={`${it.productId}-${idx}`}
                                      className="h-11 w-11 overflow-hidden rounded-lg bg-white ring-2 ring-white">
                  <ProductImage product={{...it}} className="h-full w-full" iconSize={16}/>
                </span>
                            ))}
                            {extra > 0 && (
                                <span
                                    className="flex h-11 items-center justify-center rounded-lg bg-primary-50 px-2.5 text-xs font-bold text-primary-700 ring-2 ring-white">
                  +{extra}
                </span>
                            )}
                        </div>
                        <p className="text-sm font-bold text-ink-900">
                            {order.items.reduce((s, i) => s + i.qty, 0)} items
                        </p>
                    </div>

                    <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Total Amount</dt>
                            <dd className="text-lg font-extrabold text-primary-700">{formatPrice(order.totalAmount, {decimals: true})}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Payment</dt>
                            <dd className="text-sm font-bold text-ink-900">{cancelled ? "Cancelled" : order.payment.method}</dd>
                        </div>
                    </dl>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Delivery
                            Address</p>
                        <div className="mt-2 text-sm leading-relaxed">
                            <p className="font-bold text-ink-900">{order.address.name}</p>
                            <p className="text-slate-500">{order.address.line1}</p>
                            <p className="text-slate-500">{order.address.city}, {order.address.district} {order.address.postalCode}</p>
                        </div>
                    </div>

                    <Button variant="secondary" fullWidth className="mt-6"
                            onClick={() => navigate(`/account/orders/${order.id}`)}>
                        View Order Details
                    </Button>
                    <div className="mt-4 text-center">
                        <Link to="/account/orders" className="text-sm font-bold text-primary-700 hover:underline">
                            Back to My Orders
                        </Link>
                    </div>
                </aside>
            </div>

            {order.status === "Delivered" && (
                <div
                    className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm font-semibold text-emerald-800">
                    <FaCircleCheck className="text-emerald-500" size={16}/>
                    Delivered on {formatDate(order.timeline?.find((t) => t.key === "delivered")?.at)}. Thanks for
                    shopping with Lumina!
                </div>
            )}
        </div>
    );
}