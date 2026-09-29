import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
    FaArrowLeftLong,
    FaMoneyBill1Wave,
    FaCircleCheck,
    FaGear,
    FaHouse,
    FaLocationDot,
    FaMap,
    FaBoxesPacking,
    FaPhone,
    FaStore,
    FaTruck,
} from "react-icons/fa6";
import Button from "../../../components/ui/Button";
import Badge, {OrderStatusBadge, PaymentStatusBadge} from "../../../components/ui/Badge";
import ProductImage from "../../../components/product/ProductImage";
import {EmptyState} from "../../../components/ui/States";
import {PageSpinner} from "../../../components/ui/Spinner";
import {ConfirmDialog} from "../../../components/ui/Modal";
import {Textarea} from "../../../components/ui/Input";
import {formatPrice, formatDateTime} from "../../../utils/format";
import {getOrder, cancelOrder} from "../../../services/orderService";
import {useCart} from "../../../context/CartContext";
import {useToast} from "../../../context/ToastContext";

const STEPS = [
    {key: "Pending", label: "Pending", icon: FaBoxesPacking},
    {key: "Processing", label: "Processing", icon: FaGear},
    {key: "Shipped", label: "Shipped", icon: FaTruck},
    {key: "Delivered", label: "Delivered", icon: FaHouse},
];

function StatusFlow({status}) {
    const cancelled = status === "Cancelled";
    const reachedIdx = cancelled ? -1 : STEPS.findIndex((s) => s.key === status);
    return (
        <div className="overflow-x-auto">
            <div className="flex min-w-[560px] items-start">
                {STEPS.map((step, idx) => {
                    const done = !cancelled && idx <= reachedIdx;
                    const current = !cancelled && idx === reachedIdx;
                    return (
                        <React.Fragment key={step.key}>
                            {idx > 0 && (
                                <div
                                    className={`mt-[21px] h-0.5 flex-1 ${done || cancelled ? "bg-primary-600" : "bg-slate-200"} ${cancelled && idx === 2 ? "!bg-red-300" : ""}`}/>
                            )}
                            <div className="flex w-32 flex-col items-center text-center">
                <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        done ? "bg-primary-600 text-white" : current ? "bg-primary-600 text-white ring-4 ring-primary-100" : "border border-slate-200 bg-slate-50 text-slate-300"
                    }`}
                >
                  {done && !current ? <FaCircleCheck size={16}/> : <step.icon size={16}/>}
                </span>
                                <p className={`mt-2 text-[11px] font-extrabold uppercase tracking-widest ${done ? "text-primary-700" : "text-slate-400"}`}>
                                    {step.label}
                                </p>
                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    {done ? "Done" : step.key === "Shipped" ? "Expected soon" : step.key === "Delivered" ? "Estimated Oct 24" : "—"}
                                </p>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

export default function OrderDetails() {
    const {orderId} = useParams();
    const navigate = useNavigate();
    const cart = useCart();
    const {notify} = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        let alive = true;
        getOrder(orderId).then((o) => alive && (setOrder(o), setLoading(false)));
        return () => {
            alive = false;
        };
    }, [orderId]);

    if (loading) return <PageSpinner label="Loading order…"/>;
    if (!order) {
        return (
            <EmptyState
                title="Order not found"
                message="This order may belong to another account or the link is out of date."
                action={{label: "Back to My Orders", onClick: () => navigate("/account/orders")}}
            />
        );
    }

    const canCancel = ["Pending", "Processing"].includes(order.status);

    const buyAgain = (item) => {
        cart.add(item.productId, item.qty);
        notify(`${item.name} added to cart`);
    };

    const doCancel = async () => {
        try {
            const updated = await cancelOrder(order.id, reason.trim());
            setOrder(updated);
            setCancelOpen(false);
            setReason("");
            notify("Order cancelled.", "info");
        } catch (err) {
            notify(err.message, "error");
        }
    };

    return (
        <div>
            <Link to="/account/orders"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800">
                <FaArrowLeftLong size={12}/> Back to My Orders
            </Link>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Order {order.orderNumber}</h1>
                    <p className="mt-1 text-sm text-slate-500">Placed on {formatDateTime(order.placedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                    {order.status === "Cancelled" ? (
                        <Badge tone="red" uppercase dot>Cancelled</Badge>
                    ) : (
                        <OrderStatusBadge status={order.status}/>
                    )}
                    {canCancel && (
                        <Button size="sm" variant="dangerSoft" onClick={() => setCancelOpen(true)}>
                            Cancel Order
                        </Button>
                    )}
                </div>
            </div>

            <div className="lum-card mt-6 p-6 sm:p-7">
                <StatusFlow status={order.status}/>
            </div>

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    {/* Items */}
                    <section className="lum-card p-6">
                        <h2 className="border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">Ordered
                            Products</h2>
                        <ul className="divide-y divide-slate-100">
                            {order.items.map((it, idx) => (
                                <li key={`${it.productId}-${idx}`}
                                    className="flex items-center gap-4 py-4 first:pt-2 last:pb-0">
                                    <Link to={`/product/${it.productId}`} className="shrink-0">
                                        <ProductImage product={{...it}} className="h-16 w-16 rounded-xl" iconSize={22}/>
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <Link to={`/product/${it.productId}`}
                                              className="text-sm font-bold text-ink-900 hover:text-primary-700">
                                            {it.name}
                                        </Link>
                                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                                            <FaStore size={10}/> {it.seller}
                                        </p>
                                        <p className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                                            <span>Qty: <strong className="text-ink-800">{it.qty}</strong></span>
                                            {order.status !== "Cancelled" && (
                                                <button type="button" onClick={() => buyAgain(it)}
                                                        className="font-bold text-primary-700 hover:underline">
                                                    Buy Again
                                                </button>
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Price</p>
                                        <p className="text-sm font-extrabold text-ink-900">{formatPrice(it.price * it.qty, {decimals: true})}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Address */}
                    <section className="lum-card p-6">
                        <h2 className="flex items-center gap-2 border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">
                            <FaLocationDot className="text-primary-600" size={14}/> Delivery Address
                        </h2>
                        <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_200px]">
                            <div className="text-sm leading-relaxed">
                                <p className="font-bold text-ink-900">{order.address.name}</p>
                                <p className="mt-1 text-slate-500">{order.address.line1}</p>
                                <p className="text-slate-500">{order.address.city}, {order.address.district} {order.address.postalCode}</p>
                                <p className="mt-2.5 flex items-center gap-2 text-slate-500">
                                    <FaPhone size={11} className="text-primary-600"/> {order.address.phone}
                                </p>
                                {order.notes && (
                                    <p className="mt-3 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
                                        <strong className="text-ink-800">Note: </strong>{order.notes}
                                    </p>
                                )}
                            </div>
                            <div
                                className="flex h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs font-medium italic text-slate-400 sm:h-auto">
                <span className="flex flex-col items-center gap-2">
                  <FaMap size={18}/> Map view coming soon
                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Side column */}
                <div className="space-y-6">
                    <section className="lum-card p-6">
                        <h2 className="border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">Payment
                            Information</h2>
                        <div className="space-y-4 pt-2 text-sm">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Method</p>
                                <p className="mt-1 flex items-center gap-2 font-bold text-ink-900">
                                    <FaMoneyBill1Wave className="text-emerald-500" size={15}/> {order.payment.method}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</p>
                                <div className="mt-1.5">
                                    <PaymentStatusBadge status={order.payment.status}/>
                                </div>
                            </div>
                            {order.payment.payableAtDoor > 0 && (
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">Payable at door:</p>
                                    <p className="mt-0.5 text-2xl font-extrabold text-ink-900">{formatPrice(order.payment.payableAtDoor, {decimals: true})}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="lum-card p-6">
                        <h2 className="border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">Order
                            Summary</h2>
                        <dl className="space-y-2.5 pt-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Subtotal</dt>
                                <dd className="font-bold text-ink-900">{formatPrice(order.subtotal)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Delivery Fee</dt>
                                <dd className="font-bold uppercase text-primary-600">{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <dt className="text-base font-extrabold text-ink-900">Total Amount</dt>
                                <dd className="text-2xl font-extrabold text-primary-600">{formatPrice(order.totalAmount)}</dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white">
                        <h2 className="text-base font-extrabold">Need Help?</h2>
                        <p className="mt-2 text-sm leading-relaxed text-primary-100">
                            If you have any questions regarding your order, our support team is available 24/7.
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-4 w-full border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                            onClick={() => notify("Support chat opens in the future backend phase.", "info")}
                        >
                            Contact Support
                        </Button>
                    </section>
                </div>
            </div>

            <ConfirmDialog
                open={cancelOpen}
                onClose={() => setCancelOpen(false)}
                onConfirm={doCancel}
                title="Cancel this order?"
                confirmLabel="Yes, cancel order"
                message="Cancelling stops fulfilment immediately and returns the items to stock."
            >
                <Textarea label="Reason (optional)" rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
                          placeholder="Tell us why you're cancelling…"/>
            </ConfirmDialog>
        </div>
    );
}