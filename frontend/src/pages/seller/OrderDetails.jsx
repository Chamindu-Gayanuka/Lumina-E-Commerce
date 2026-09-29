import React, {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {FaArrowLeftLong, FaMapLocationDot, FaPhone, FaUser} from "react-icons/fa6";
import Button from "../../components/ui/Button";
import {OrderStatusBadge, PaymentStatusBadge} from "../../components/ui/Badge";
import ProductImage from "../../components/product/ProductImage";
import OrderTimeline from "../../components/orders/OrderTimeline";
import {PageSpinner} from "../../components/ui/Spinner";
import {formatPrice, formatDateTime} from "../../utils/format";
import {getOrder, updateOrderStatus} from "../../services/orderService";
import {allowedNext} from "../../utils/orderFlow";
import {useToast} from "../../context/ToastContext";

export default function SellerOrderDetails() {
    const {orderId} = useParams();
    const {notify} = useToast();
    const [order, setOrder] = useState(null);
    const [busy, setBusy] = useState(false);

    const load = useCallback(() => getOrder(orderId).then(setOrder), [orderId]);
    useEffect(() => {
        load();
    }, [load]);

    if (!order) return <PageSpinner label="Opening order…"/>;

    const advance = async (status) => {
        setBusy(true);
        await updateOrderStatus(order.id, status);
        setBusy(false);
        notify(`${order.orderNumber} marked as ${status}`);
        load();
    };

    const next = allowedNext(order.status);

    return (
        <div>
            <Link to="/seller/orders"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800">
                <FaArrowLeftLong size={12}/> Back to Orders
            </Link>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Order {order.orderNumber}</h1>
                    <p className="mt-1 text-sm text-slate-500">Placed {formatDateTime(order.placedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status}/>
                    <PaymentStatusBadge status={order.payment.status}/>
                </div>
            </div>

            {next.length > 0 && (
                <div
                    className="mt-5 flex flex-wrap items-center gap-2.5 rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-4">
                    <p className="mr-auto text-sm font-bold text-primary-900">Next action:</p>
                    {next.map((status) => (
                        <Button key={status} size="sm" variant={status === "Cancelled" ? "dangerSoft" : "primary"}
                                loading={busy} onClick={() => advance(status)}>
                            {status === "Cancelled" ? "Cancel order" : `Mark ${status}`}
                        </Button>
                    ))}
                </div>
            )}

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
                <section className="lum-card p-6">
                    <h2 className="border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">Items
                        ({order.items.length})</h2>
                    <ul className="divide-y divide-slate-100">
                        {order.items.map((it, idx) => (
                            <li key={`${it.productId}-${idx}`}
                                className="flex items-center gap-4 py-3.5 first:pt-2 last:pb-0">
                                <ProductImage product={{...it}} className="h-12 w-12 rounded-lg" iconSize={16}/>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-ink-900">{it.name}</p>
                                    <p className="text-xs text-slate-400">SKU {it.productId.toUpperCase()} · {it.seller || "SoundMaster Official"}</p>
                                </div>
                                <p className="text-sm font-bold text-ink-900">
                                    {it.qty} × {formatPrice(it.price, {decimals: true})}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Subtotal</dt>
                            <dd className="font-bold">{formatPrice(order.subtotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Delivery</dt>
                            <dd className="font-bold uppercase text-primary-600">{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                            <dt className="text-base font-extrabold text-ink-900">Collect at door (COD)</dt>
                            <dd className="text-xl font-extrabold text-primary-600">{formatPrice(order.totalAmount)}</dd>
                        </div>
                    </dl>

                    {order.notes && (
                        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            <strong>Customer note: </strong>{order.notes}
                        </p>
                    )}
                </section>

                <div className="space-y-6">
                    <section className="lum-card p-6">
                        <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Ship to</h2>
                        <div className="mt-3 space-y-2 text-sm">
                            <p className="flex items-center gap-2 font-bold text-ink-900"><FaUser
                                className="text-primary-600" size={12}/> {order.address?.name}</p>
                            <p className="flex items-start gap-2 text-slate-500"><FaMapLocationDot
                                className="mt-0.5 text-primary-600"
                                size={12}/> {order.address?.line1}, {order.address?.city}, {order.address?.district} {order.address?.postalCode}
                            </p>
                            <p className="flex items-center gap-2 text-slate-500"><FaPhone className="text-primary-600"
                                                                                           size={12}/> {order.address?.phone}
                            </p>
                        </div>
                    </section>

                    <section className="lum-card p-6">
                        <h2 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-slate-400">Progress</h2>
                        <OrderTimeline order={order}/>
                    </section>
                </div>
            </div>
        </div>
    );
}