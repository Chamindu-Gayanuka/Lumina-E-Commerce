import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FaClipboard, FaTruckFast} from "react-icons/fa6";
import CheckoutStepper from "../../components/ui/CheckoutStepper";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import ProductImage from "../../components/product/ProductImage";
import {EmptyState} from "../../components/ui/States";
import {formatPrice, deliveryWindow} from "../../utils/format";
import {getOrder} from "../../services/orderService";
import {useToast} from "../../context/ToastContext";

export default function OrderConfirmation() {
    const {orderId} = useParams();
    const navigate = useNavigate();
    const {notify} = useToast();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        let alive = true;
        getOrder(orderId).then((o) => alive && setOrder(o));
        return () => {
            alive = false;
        };
    }, [orderId]);

    if (!order) {
        return (
            <div className="lum-container py-16">
                <EmptyState
                    title="Order not found"
                    message="We couldn't locate this confirmation. It may have been placed in another demo session."
                    action={{label: "View my orders", onClick: () => navigate("/account/orders")}}
                />
            </div>
        );
    }

    const copyOrderNumber = () => {
        const write = async () => {
            try {
                await navigator.clipboard.writeText(order.orderNumber);
                notify("Order number copied");
            } catch {
                const ta = document.createElement("textarea");
                ta.value = order.orderNumber;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                ta.remove();
                notify("Order number copied");
            }
        };
        write();
    };

    return (
        <div className="lum-container py-8 pb-16">
            <CheckoutStepper current={2} allDone/>

            <div className="mx-auto mt-12 max-w-2xl text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-emerald-600" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                  strokeLinejoin="round"/>
          </svg>
        </span>
                <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Order Placed
                    Successfully!</h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Thank you for your purchase. A confirmation has been sent to your email
                    <span className="font-semibold text-ink-800"> ({order.customerEmail})</span>.
                </p>

                <button
                    type="button"
                    onClick={copyOrderNumber}
                    className="group mt-6 inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-2 pl-5 pr-3.5 text-sm font-extrabold text-ink-900 shadow-card transition-all hover:border-primary-300"
                    aria-label="Copy order number"
                >
                    Order {order.orderNumber}
                    <span
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-700 group-hover:bg-primary-600 group-hover:text-white">
            <FaClipboard size={12}/>
          </span>
                </button>

                <p className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary-700">
                    <FaTruckFast size={13}/> Estimated delivery: {deliveryWindow(order.placedAt)}
                </p>
            </div>

            {/* Summary card */}
            <div className="mx-auto mt-10 max-w-2xl">
                <div className="lum-card p-7">
                    <h2 className="text-lg font-extrabold tracking-tight text-ink-900">Order Summary</h2>
                    <ul className="mt-5 divide-y divide-slate-100">
                        {order.items.map((it, idx) => (
                            <li key={`${it.productId}-${idx}`}
                                className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                                <ProductImage product={{...it, category: "Electronics"}}
                                              className="h-12 w-12 shrink-0 rounded-lg" iconSize={16}/>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-ink-900">{it.name}</p>
                                    <p className="text-xs text-slate-400">Quantity: {it.qty}</p>
                                </div>
                                <p className="text-sm font-bold text-ink-900">{formatPrice(it.price * it.qty, {decimals: true})}</p>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Subtotal</dt>
                            <dd className="font-bold text-ink-900">{formatPrice(order.subtotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Delivery Fee</dt>
                            <dd className="font-bold uppercase text-primary-600">{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd>
                        </div>
                    </dl>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <p className="text-base font-extrabold text-ink-900">Total Amount</p>
                        <p className="text-2xl font-extrabold text-primary-600">{formatPrice(order.totalAmount)}</p>
                    </div>

                    <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Payment
                                Method</p>
                            <div className="mt-1.5 flex items-center gap-2">
                                <p className="text-sm font-bold text-ink-900">{order.payment.method}</p>
                                <Badge tone="amber" uppercase>{order.payment.status}</Badge>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order
                                Status</p>
                            <div className="mt-1.5">
                                <Badge tone="amber" uppercase>{order.status}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Delivery
                            Address</p>
                        <div className="mt-2 text-sm leading-relaxed">
                            <p className="font-bold text-ink-900">{order.address.name}</p>
                            <p className="text-slate-500">{order.address.line1}</p>
                            <p className="text-slate-500">
                                {order.address.city}, {order.address.district} {order.address.postalCode}
                            </p>
                            <p className="mt-1 text-slate-500">Contact: {order.address.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Button as={Link} to="/shop" size="lg">
                        Continue Shopping
                    </Button>
                    <Button as={Link} to={`/account/orders/${order.id}`} size="lg" variant="secondary">
                        View Order Details
                    </Button>
                </div>
            </div>
        </div>
    );
}