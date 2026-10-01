import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {FaEye, FaFilter} from "react-icons/fa6";

import useUrlPage from "../../hooks/useUrlPage";
import SearchBar from "../../components/ui/SearchBar";
import {Select} from "../../components/ui/Input";
import Tabs from "../../components/ui/Tabs";
import DataTable from "../../components/ui/DataTable";
import Badge, {OrderStatusBadge, PaymentStatusBadge} from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import {EmptyState} from "../../components/ui/States";
import {PageSpinner} from "../../components/ui/Spinner";
import {formatPrice, formatDate, formatDateTime} from "../../utils/format";
import {getAllOrders, updateOrderStatus} from "../../services/orderService";
import {allowedNext} from "../../utils/orderFlow";
import {ORDER_STATUSES} from "../../utils/constants";
import {useToast} from "../../context/ToastContext";

const PER_PAGE = 10;

export default function AdminOrders() {
    const {notify} = useToast();
    const [params] = useSearchParams();

    const [orders, setOrders] = useState(null);
    const [tab, setTab] = useState("All");
    const [search, setSearch] = useState(params.get("q") || "");
    const [payment, setPayment] = useState("");
    const [range, setRange] = useState("all");
    const [page, setPage] = useUrlPage();
    const [viewing, setViewing] = useState(null);
    const [busy, setBusy] = useState(false);

    const load = useCallback(() => getAllOrders().then(setOrders), []);

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

        if (payment) {
            list = list.filter((o) => o.payment?.status === payment);
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(
                (o) =>
                    o.orderNumber.toLowerCase().includes(q) ||
                    (o.customerName || "").toLowerCase().includes(q) ||
                    (o.address?.district || "").toLowerCase().includes(q)
            );
        }

        if (range !== "all") {
            const cutoff = Date.now() - Number(range) * 86400000;
            list = list.filter(
                (o) => new Date(o.placedAt).getTime() >= cutoff
            );
        }

        return list;
    }, [orders, tab, payment, search, range]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, pages);
    const visible = filtered.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE
    );

    const clearFilters = () => {
        setSearch("");
        setPayment("");
        setRange("all");
        setTab("All");
        setPage(1);
    };

    const advance = async (status) => {
        if (!viewing || busy) return;
        setBusy(true);
        try {
            await updateOrderStatus(viewing.id, status);
            notify(`${viewing.orderNumber} → ${status}`);
            const fresh = await getAllOrders();
            setOrders(fresh);
            setViewing(fresh.find((o) => o.id === viewing.id) || null);
        } catch (err) {
            notify(err?.message || "Could not update order", "error");
        } finally {
            setBusy(false);
        }
    };

    if (!orders) {
        return <PageSpinner label="Loading order board…"/>;
    }

    const itemCount = (o) =>
        (o.items || []).reduce((sum, item) => sum + (item.qty || 0), 0);

    return (
        <div className="w-full min-w-0">
            <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                    Order Management
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    Monitor every order across sellers, intervene when fulfilment
                    stalls, and manage cancellations.
                </p>
            </div>

            <Tabs
                className="mt-6 overflow-x-auto"
                items={[
                    {key: "All", label: "All Orders", count: counts.All},
                    ...ORDER_STATUSES.map((s) => ({
                        key: s,
                        label: s,
                        count: counts[s],
                    })),
                ]}
                active={tab}
                onChange={(k) => {
                    setTab(k);
                    setPage(1);
                }}
            />

            {/* Filters */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <SearchBar
                    value={search}
                    onChange={(v) => {
                        setSearch(v);
                        setPage(1);
                    }}
                    placeholder="Search order, customer, district…"
                    className="w-full sm:max-w-xs"
                />

                <Select
                    name="oPayment"
                    value={payment}
                    onChange={(e) => {
                        setPayment(e.target.value);
                        setPage(1);
                    }}
                    className="h-11 w-auto text-sm sm:w-auto"
                >
                    <option value="">All payments</option>
                    <option value="Pending">COD Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Cancelled">Cancelled</option>
                </Select>

                <Select
                    name="oRange"
                    value={range}
                    onChange={(e) => {
                        setRange(e.target.value);
                        setPage(1);
                    }}
                    className="h-11 w-auto text-sm sm:w-auto"
                >
                    <option value="all">All time</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last quarter</option>
                </Select>

                {(search || payment || range !== "all" || tab !== "All") && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="text-left text-xs font-bold text-primary-600 hover:underline sm:text-center"
                    >
                        Clear filters
                    </button>
                )}

                <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 sm:ml-auto">
                    <FaFilter size={10}/> {filtered.length} shown
                </span>
            </div>

            <div className="lum-card mt-4 p-4 sm:p-5">
                {visible.length === 0 ? (
                    <EmptyState
                        title="No orders in this view"
                        message="Adjust the filters or check the cancelled tab for refunds."
                    />
                ) : (
                    <>
                        {/* Mobile cards */}
                        <ul className="space-y-3 md:hidden">
                            {visible.map((o) => (
                                <li
                                    key={o.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-extrabold text-ink-900">
                                                {o.orderNumber}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {formatDateTime(o.placedAt)}
                                            </p>
                                        </div>
                                        <OrderStatusBadge status={o.status}/>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Customer
                                            </p>
                                            <p className="truncate text-sm font-semibold text-slate-700">
                                                {o.customerName || "Guest"}
                                            </p>
                                            <p className="truncate text-xs text-slate-400">
                                                {o.address?.district || "-"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                Total
                                            </p>
                                            <p className="text-sm font-extrabold text-ink-900">
                                                {formatPrice(o.totalAmount, {
                                                    decimals: true,
                                                })}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {itemCount(o)} item
                                                {itemCount(o) === 1 ? "" : "s"}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                        {o.payment?.status ? (
                                            <PaymentStatusBadge
                                                status={o.payment.status}
                                            />
                                        ) : (
                                            <span className="text-xs text-slate-400">
                                                -
                                            </span>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            icon={<FaEye size={10}/>}
                                            onClick={() => setViewing(o)}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto md:block">
                            <div className="min-w-[900px]">
                                <DataTable
                                    columns={[
                                        {
                                            key: "orderNumber",
                                            header: "Order",
                                            render: (o) => (
                                                <div>
                                                    <p className="font-extrabold text-ink-900">
                                                        {o.orderNumber}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {formatDateTime(
                                                            o.placedAt
                                                        )}
                                                    </p>
                                                </div>
                                            ),
                                        },
                                        {
                                            key: "customerName",
                                            header: "Customer",
                                            render: (o) => (
                                                <span className="font-semibold text-slate-600">
                                                    {o.customerName || "Guest"}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "district",
                                            header: "District",
                                            render: (o) => (
                                                <span className="text-sm text-slate-500">
                                                    {o.address?.district || "-"}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "items",
                                            header: "Items",
                                            render: (o) => (
                                                <span className="text-sm">
                                                    {itemCount(o)}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "totalAmount",
                                            header: "Total",
                                            render: (o) => (
                                                <span className="font-bold">
                                                    {formatPrice(
                                                        o.totalAmount,
                                                        {decimals: true}
                                                    )}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "payment",
                                            header: "Payment",
                                            render: (o) =>
                                                o.payment?.status ? (
                                                    <PaymentStatusBadge
                                                        status={
                                                            o.payment.status
                                                        }
                                                    />
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        -
                                                    </span>
                                                ),
                                        },
                                        {
                                            key: "status",
                                            header: "Status",
                                            render: (o) => (
                                                <OrderStatusBadge
                                                    status={o.status}
                                                />
                                            ),
                                        },
                                        {
                                            key: "actions",
                                            header: "",
                                            className: "text-right",
                                            render: (o) => (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    icon={<FaEye size={10}/>}
                                                    onClick={() =>
                                                        setViewing(o)
                                                    }
                                                >
                                                    Review
                                                </Button>
                                            ),
                                        },
                                    ]}
                                    rows={visible}
                                    dense
                                />
                            </div>
                        </div>

                        {pages > 1 && (
                            <Pagination
                                className="mt-4"
                                page={currentPage}
                                pages={pages}
                                onChange={(p) => {
                                    setPage(p);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Review modal */}
            <Modal
                open={Boolean(viewing)}
                onClose={() => !busy && setViewing(null)}
                title={viewing?.orderNumber}
                subtitle={
                    viewing
                        ? `${viewing.customerName || "Guest"} · ${formatDate(
                            viewing.placedAt
                        )}`
                        : ""
                }
                size="lg"
            >
                {viewing && (
                    <div className="space-y-5 text-sm">
                        <div className="flex flex-wrap gap-2">
                            <OrderStatusBadge status={viewing.status}/>
                            {viewing.payment?.status && (
                                <PaymentStatusBadge
                                    status={viewing.payment.status}
                                />
                            )}
                            {viewing.payment?.method && (
                                <Badge tone="slate">
                                    {viewing.payment.method}
                                </Badge>
                            )}
                            <Badge tone="teal">
                                {formatPrice(viewing.totalAmount, {
                                    decimals: true,
                                })}
                            </Badge>
                        </div>

                        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                            {(viewing.items || []).map((it, idx) => (
                                <li
                                    key={`${it.productId}-${idx}`}
                                    className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <span className="min-w-0 font-semibold text-ink-800 [overflow-wrap:anywhere]">
                                        {it.name}
                                    </span>
                                    <span className="shrink-0 text-slate-500">
                                        {it.qty} × {formatPrice(it.price)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Ship to
                                </p>
                                <p className="mt-1.5 font-semibold text-ink-900 [overflow-wrap:anywhere]">
                                    {viewing.address?.name || "-"}
                                </p>
                                <p className="text-slate-500 [overflow-wrap:anywhere]">
                                    {viewing.address?.line1}
                                </p>
                                <p className="text-slate-500 [overflow-wrap:anywhere]">
                                    {[
                                        viewing.address?.city,
                                        viewing.address?.district,
                                        viewing.address?.postalCode,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                                <p className="mt-1 text-slate-400">
                                    {viewing.address?.phone}
                                </p>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Progress
                                </p>
                                <ol className="mt-1.5 space-y-1">
                                    {(viewing.timeline || [])
                                        .slice(-4)
                                        .map((t, i) => (
                                            <li
                                                key={i}
                                                className="flex flex-col gap-0.5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <span
                                                    className={`font-bold ${
                                                        t.cancelled
                                                            ? "text-red-500"
                                                            : "text-ink-800"
                                                    }`}
                                                >
                                                    {t.title}
                                                </span>
                                                <span>
                                                    {t.at
                                                        ? formatDateTime(t.at)
                                                        : ""}
                                                </span>
                                            </li>
                                        ))}
                                </ol>
                                {viewing.cancellationReason && (
                                    <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs italic leading-relaxed text-red-600">
                                        “{viewing.cancellationReason}”
                                    </p>
                                )}
                            </div>
                        </div>

                        {allowedNext(viewing.status).length > 0 && (
                            <div
                                className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 sm:mr-auto">
                                    Admin override
                                </p>
                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                                    {allowedNext(viewing.status).map((s) => (
                                        <Button
                                            key={s}
                                            size="sm"
                                            className="w-full sm:w-auto"
                                            variant={
                                                s === "Cancelled"
                                                    ? "dangerSoft"
                                                    : "outline"
                                            }
                                            loading={busy}
                                            onClick={() => advance(s)}
                                        >
                                            Mark {s}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}