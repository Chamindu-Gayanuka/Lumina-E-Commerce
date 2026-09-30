import React, {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {
    FaArrowLeftLong,
    FaMapLocationDot,
    FaPhone,
    FaUser,
} from "react-icons/fa6";
import Button from "../../components/ui/Button";
import {OrderStatusBadge, PaymentStatusBadge} from "../../components/ui/Badge";
import ProductImage from "../../components/product/ProductImage";
import OrderTimeline from "../../components/orders/OrderTimeline";
import {PageSpinner} from "../../components/ui/Spinner";
import {EmptyState} from "../../components/ui/States";
import {formatPrice, formatDateTime} from "../../utils/format";
import {getOrder, updateOrderStatus} from "../../services/orderService";
import {allowedNext} from "../../utils/orderFlow";
import {useToast} from "../../context/ToastContext";

export default function SellerOrderDetails() {
    const {orderId} = useParams();
    const {notify} = useToast();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await getOrder(orderId);
            if (!result) {
                setOrder(null);
                setError("Order not found.");
            } else {
                setOrder(result);
            }
        } catch (err) {
            setOrder(null);
            setError(err?.message || "Unable to load this order.");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        load();
    }, [load]);

    const advance = async (status) => {
        if (!order || busy) return;

        setBusy(true);
        try {
            await updateOrderStatus(order.id, status);
            notify(`${order.orderNumber} marked as ${status}`);
            await load();
        } catch (err) {
            notify(err?.message || "Could not update order status", "error");
        } finally {
            setBusy(false);
        }
    };

    if (loading && !order) {
        return <PageSpinner label="Opening order…"/>;
    }

    if (error || !order) {
        return (
            <div className="lum-card p-6">
                <EmptyState
                    title="Could not open order"
                    message={error || "Order not found."}
                    action={{label: "Try again", onClick: load}}
                />
                <div className="mt-4 text-center">
                    <Link
                        to="/seller/orders"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                    >
                        <FaArrowLeftLong size={12}/> Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const next = allowedNext(order.status);
    const items = order.items || [];

    return (
        <div>
            <Link
                to="/seller/orders"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
            >
                <FaArrowLeftLong size={12}/> Back to Orders
            </Link>

            {/* Header */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl [overflow-wrap:anywhere]">
                        Order {order.orderNumber}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Placed {formatDateTime(order.placedAt)}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <OrderStatusBadge status={order.status}/>
                    {order.payment?.status ? (
                        <PaymentStatusBadge status={order.payment.status}/>
                    ) : null}
                </div>
            </div>

            {/* Next actions */}
            {next.length > 0 && (
                <div
                    className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary-100 bg-primary-50/60 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:px-5">
                    <p className="text-sm font-bold text-primary-900 sm:mr-auto">
                        Next action:
                    </p>
                    <div className="flex w-full flex-col gap-2 xs:flex-row xs:flex-wrap sm:w-auto">
                        {next.map((status) => (
                            <Button
                                key={status}
                                size="sm"
                                className="w-full xs:w-auto"
                                variant={
                                    status === "Cancelled"
                                        ? "dangerSoft"
                                        : "primary"
                                }
                                loading={busy}
                                onClick={() => advance(status)}
                            >
                                {status === "Cancelled"
                                    ? "Cancel order"
                                    : `Mark ${status}`}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main grid */}
            <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_340px] lg:gap-6">
                {/* Items */}
                <section className="lum-card p-4 sm:p-6">
                    <h2 className="border-b border-slate-100 pb-3 text-base font-extrabold tracking-tight text-ink-900 sm:pb-4">
                        Items ({items.length})
                    </h2>

                    <ul className="divide-y divide-slate-100">
                        {items.map((it, idx) => (
                            <li
                                key={`${it.productId}-${idx}`}
                                className="flex flex-col gap-3 py-3.5 first:pt-2 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
                            >
                                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                                    <ProductImage
                                        product={{...it}}
                                        className="h-12 w-12 shrink-0 rounded-lg"
                                        iconSize={16}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-ink-900 [overflow-wrap:anywhere]">
                                            {it.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            SKU{" "}
                                            {String(
                                                it.productId || ""
                                            ).toUpperCase()}{" "}
                                            ·{" "}
                                            {it.seller ||
                                                "SoundMaster Official"}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm font-bold text-ink-900 sm:shrink-0 sm:text-right">
                                    {it.qty} ×{" "}
                                    {formatPrice(it.price, {decimals: true})}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <dt className="text-slate-500">Subtotal</dt>
                            <dd className="font-bold">
                                {formatPrice(order.subtotal ?? 0)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <dt className="text-slate-500">Delivery</dt>
                            <dd className="font-bold uppercase text-primary-600">
                                {order.deliveryFee === 0
                                    ? "Free"
                                    : formatPrice(order.deliveryFee || 0)}
                            </dd>
                        </div>
                        <div
                            className="flex flex-col gap-1 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-2">
                            <dt className="text-base font-extrabold text-ink-900">
                                Collect at door (COD)
                            </dt>
                            <dd className="text-xl font-extrabold text-primary-600">
                                {formatPrice(order.totalAmount ?? 0)}
                            </dd>
                        </div>
                    </dl>

                    {order.notes ? (
                        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                            <strong>Customer note: </strong>
                            {order.notes}
                        </p>
                    ) : null}
                </section>

                {/* Sidebar */}
                <div className="space-y-5 sm:space-y-6">
                    <section className="lum-card p-4 sm:p-6">
                        <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
                            Ship to
                        </h2>
                        <div className="mt-3 space-y-3 text-sm">
                            <p className="flex items-start gap-2 font-bold text-ink-900">
                                <FaUser
                                    className="mt-0.5 shrink-0 text-primary-600"
                                    size={12}
                                />
                                <span className="min-w-0 [overflow-wrap:anywhere]">
                                    {order.address?.name || "—"}
                                </span>
                            </p>
                            <p className="flex items-start gap-2 text-slate-500">
                                <FaMapLocationDot
                                    className="mt-0.5 shrink-0 text-primary-600"
                                    size={12}
                                />
                                <span className="min-w-0 leading-relaxed [overflow-wrap:anywhere]">
                                    {[
                                        order.address?.line1,
                                        order.address?.city,
                                        order.address?.district,
                                        order.address?.postalCode,
                                    ]
                                        .filter(Boolean)
                                        .join(", ") || "No address provided"}
                                </span>
                            </p>
                            <p className="flex items-start gap-2 text-slate-500">
                                <FaPhone
                                    className="mt-0.5 shrink-0 text-primary-600"
                                    size={12}
                                />
                                <span className="min-w-0 [overflow-wrap:anywhere]">
                                    {order.address?.phone || "—"}
                                </span>
                            </p>
                        </div>
                    </section>

                    <section className="lum-card p-4 sm:p-6">
                        <h2 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-slate-400">
                            Progress
                        </h2>
                        <OrderTimeline order={order}/>
                    </section>
                </div>
            </div>
        </div>
    );
}