import React from "react";
import {Link} from "react-router-dom";
import {FaMoneyBill1Wave, FaRotate} from "react-icons/fa6";
import {OrderStatusBadge} from "../ui/Badge";
import Button from "../ui/Button";
import ProductImage from "../product/ProductImage";
import {formatPrice, formatDate} from "../../utils/format";

export default function OrderCard({order, onTrack, onReorder, onCancel, onDetails}) {
    const canTrack = ["Pending", "Processing", "Shipped"].includes(order.status) || order.status === "Cancelled";
    const canCancel = ["Pending", "Processing"].includes(order.status);
    const canReorder = order.status !== "Cancelled";

    const visible = (order.items || []).slice(0, 2);
    const extra = (order.items || []).length - visible.length;

    return (
        <article className="lum-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-extrabold tracking-tight text-ink-900">
                        <button type="button" onClick={() => onDetails(order)} className="hover:text-primary-700">
                            {order.orderNumber}
                        </button>
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">Placed on {formatDate(order.placedAt)}</p>
                </div>
                <OrderStatusBadge status={order.status}/>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
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
                    <p className="text-sm text-slate-500">
            <span className="font-semibold text-ink-800">
              {(order.items || []).reduce((s, i) => s + i.qty, 0)} {(order.items || []).length > 1 ? "items" : "item"}
            </span>
                        <span className="mx-2 text-slate-200">|</span>
                        Total: <span
                        className="font-extrabold text-primary-700">{formatPrice(order.totalAmount, {decimals: true})}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Button size="sm" onClick={() => onDetails(order)}>View Details</Button>
                    {canTrack && (
                        <Button size="sm" variant="secondary" onClick={() => onTrack(order)}>
                            Track Order
                        </Button>
                    )}
                    {canReorder && !canCancel && (
                        <Button size="sm" variant="secondary" icon={<FaRotate size={10}/>}
                                onClick={() => onReorder(order)}>
                            Reorder
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <FaMoneyBill1Wave size={12} className="text-emerald-500"/> {order.payment.method}
                </p>
                {canCancel && (
                    <button
                        type="button"
                        onClick={() => onCancel(order)}
                        className="text-xs font-bold uppercase tracking-wide text-red-500 transition-colors hover:text-red-600"
                    >
                        Cancel Order
                    </button>
                )}
                {order.status === "Delivered" && (
                    <Link to={`/account/orders/${order.id}`}
                          className="text-xs font-bold text-primary-600 hover:underline">
                        Write a review →
                    </Link>
                )}
            </div>
        </article>
    );
}