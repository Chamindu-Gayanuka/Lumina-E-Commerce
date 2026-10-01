import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useLocation} from "react-router-dom";
import {
    FaBoxesStacked,
    FaCircleCheck,
    FaTriangleExclamation,
    FaBan,
} from "react-icons/fa6";

import useUrlPage from "../../hooks/useUrlPage";
import StatCard from "../../components/ui/StatCard";
import SearchBar from "../../components/ui/SearchBar";
import {Select} from "../../components/ui/Input";
import DataTable from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import {EmptyState} from "../../components/ui/States";
import {PageSpinner} from "../../components/ui/Spinner";
import ProductImage from "../../components/product/ProductImage";
import {formatDate, formatPrice} from "../../utils/format";
import {getInventory} from "../../services/productService";
import {useToast} from "../../context/ToastContext";

const PER_PAGE = 15;

function levelOf(p) {
    if (!p || p.stock === 0) return "out";
    if (p.stock <= (p.lowStockLevel ?? 5)) return "low";
    return "ok";
}

function LevelBadge({level}) {
    if (level === "out") {
        return (
            <Badge tone="red" uppercase>
                Out of stock
            </Badge>
        );
    }
    if (level === "low") {
        return (
            <Badge tone="amber" uppercase>
                Low
            </Badge>
        );
    }
    return (
        <Badge tone="green" uppercase>
            Healthy
        </Badge>
    );
}

export default function AdminInventory({view = "all"}) {
    const {notify} = useToast();
    const location = useLocation();

    const [rows, setRows] = useState(null);
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState(
        view === "low" ? "low" : view === "out" ? "out" : ""
    );
    const [seller, setSeller] = useState("");
    const [page, setPage] = useUrlPage();

    // Sync route view with level state
    useEffect(() => {
        setLevel(view === "low" ? "low" : view === "out" ? "out" : "");
    }, [view, location.pathname]);

    const load = useCallback(() => getInventory().then(setRows), []);

    useEffect(() => {
        load();
    }, [load]);

    const withLevel = useMemo(
        () =>
            (rows || [])
                .filter((r) => r.product)
                .map((r) => ({...r, level: levelOf(r.product)})),
        [rows]
    );

    const sellers = useMemo(() => {
        const map = new Map();
        withLevel.forEach((r) => {
            if (r.seller) map.set(r.seller.id, r.seller.storeName);
        });
        return Array.from(map.entries());
    }, [withLevel]);

    const filtered = useMemo(() => {
        let list = withLevel;
        if (level) list = list.filter((r) => r.level === level);
        if (seller) list = list.filter((r) => r.seller?.id === seller);
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((r) =>
                r.product.name.toLowerCase().includes(q)
            );
        }
        return list.sort(
            (a, b) =>
                (a.level === "out" ? -1 : 0) - (b.level === "out" ? -1 : 0)
        );
    }, [withLevel, level, seller, search]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, pages);
    const visible = filtered.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE
    );

    if (!rows) {
        return <PageSpinner label="Scanning inventory…"/>;
    }

    const counts = {
        total: withLevel.length,
        low: withLevel.filter((r) => r.level === "low").length,
        out: withLevel.filter((r) => r.level === "out").length,
    };

    const title =
        view === "low"
            ? "Low Stock"
            : view === "out"
                ? "Out of Stock"
                : "Overall Inventory";

    const LevelChips = (
        <div className="flex flex-wrap gap-1.5">
            {[
                {key: "", label: "All"},
                {key: "low", label: "Low"},
                {key: "out", label: "Out"},
            ].map((f) => (
                <button
                    key={f.key || "all"}
                    type="button"
                    onClick={() => {
                        setLevel(f.key);
                        setPage(1);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                        level === f.key
                            ? "bg-ink-900 text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="w-full min-w-0">
            <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                    {title}
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    Read-only view across all sellers - stock decrements
                    automatically as orders are placed.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-3 sm:gap-5">
                <StatCard
                    label="Tracked SKUs"
                    value={counts.total}
                    icon={<FaBoxesStacked size={18}/>}
                    tone="teal"
                />
                <StatCard
                    label="Low stock"
                    value={counts.low}
                    icon={<FaTriangleExclamation size={18}/>}
                    tone="amber"
                />
                <StatCard
                    label="Out of stock"
                    value={counts.out}
                    icon={<FaBan size={18}/>}
                    tone="red"
                />
            </div>

            <div className="lum-card mt-6 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <SearchBar
                        value={search}
                        onChange={(v) => {
                            setSearch(v);
                            setPage(1);
                        }}
                        placeholder="Search product…"
                        className="w-full sm:max-w-xs"
                    />

                    <Select
                        name="invSeller"
                        value={seller}
                        onChange={(e) => {
                            setSeller(e.target.value);
                            setPage(1);
                        }}
                        className="!box-border h-11 w-auto min-w-0 !pr-10 text-sm sm:!w-auto sm:min-w-44"
                    >
                        <option value="">All sellers</option>
                        {sellers.map(([id, name]) => (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        ))}
                    </Select>

                    <div className="sm:ml-auto">{LevelChips}</div>
                </div>

                <div className="mt-4">
                    {filtered.length === 0 ? (
                        <EmptyState
                            icon={<FaCircleCheck size={30}/>}
                            title="All clear"
                            message="No stock lines match this view."
                        />
                    ) : (
                        <>
                            {/* Mobile cards */}
                            <ul className="space-y-3 md:hidden">
                                {visible.map((r) => (
                                    <li
                                        key={r.productId || r.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <ProductImage
                                                product={r.product}
                                                className="h-12 w-12 shrink-0 rounded-xl"
                                                iconSize={15}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold leading-snug text-ink-900 [overflow-wrap:anywhere]">
                                                    {r.product.name}
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    {r.product.category}
                                                </p>
                                                <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                                                    {r.seller?.storeName || "-"}
                                                </p>
                                            </div>
                                            <div className="shrink-0">
                                                <LevelBadge level={r.level}/>
                                            </div>
                                        </div>

                                        <div
                                            className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                                            <div className="rounded-xl bg-slate-50 px-2 py-2">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                    Qty
                                                </p>
                                                <p
                                                    className={`mt-0.5 text-sm font-extrabold ${
                                                        r.level === "out"
                                                            ? "text-red-500"
                                                            : r.level === "low"
                                                                ? "text-amber-600"
                                                                : "text-ink-900"
                                                    }`}
                                                >
                                                    {r.quantity}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-slate-50 px-2 py-2">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                    Reserved
                                                </p>
                                                <p className="mt-0.5 text-sm font-extrabold text-ink-900">
                                                    {r.reservedQuantity}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-slate-50 px-2 py-2">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                                    Price
                                                </p>
                                                <p className="mt-0.5 text-sm font-extrabold text-ink-900">
                                                    {formatPrice(r.product.price)}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Updated {formatDate(r.lastUpdated)}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    notify(
                                                        `Nudge sent to ${
                                                            r.seller?.storeName ||
                                                            "seller"
                                                        } about ${r.product.name}`,
                                                        "info"
                                                    )
                                                }
                                            >
                                                {r.level === "ok"
                                                    ? "Inspect"
                                                    : "Nudge seller"}
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Desktop table */}
                            <div className="hidden overflow-x-auto md:block">
                                <div className="min-w-[900px]">
                                    <DataTable
                                        dense
                                        columns={[
                                            {
                                                key: "product",
                                                header: "Product",
                                                render: (r) => (
                                                    <div className="flex items-center gap-3">
                                                        <ProductImage
                                                            product={r.product}
                                                            className="h-9 w-9 shrink-0 rounded-lg"
                                                            iconSize={14}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="truncate font-bold text-ink-900">
                                                                {r.product.name}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                {r.product.category}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            },
                                            {
                                                key: "seller",
                                                header: "Seller",
                                                render: (r) => (
                                                    <span className="text-sm font-semibold text-slate-600">
                                                        {r.seller?.storeName || "-"}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: "quantity",
                                                header: "Quantity",
                                                render: (r) => (
                                                    <span
                                                        className={`text-base font-extrabold ${
                                                            r.level === "out"
                                                                ? "text-red-500"
                                                                : r.level === "low"
                                                                    ? "text-amber-600"
                                                                    : "text-ink-900"
                                                        }`}
                                                    >
                                                        {r.quantity}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: "reserved",
                                                header: "Reserved",
                                                render: (r) => (
                                                    <span className="text-slate-500">
                                                        {r.reservedQuantity}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: "price",
                                                header: "Unit price",
                                                render: (r) => (
                                                    <span className="text-sm">
                                                        {formatPrice(
                                                            r.product.price
                                                        )}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: "level",
                                                header: "Level",
                                                render: (r) => (
                                                    <LevelBadge level={r.level}/>
                                                ),
                                            },
                                            {
                                                key: "lastUpdated",
                                                header: "Updated",
                                                render: (r) => (
                                                    <span className="text-xs text-slate-400">
                                                        {formatDate(r.lastUpdated)}
                                                    </span>
                                                ),
                                            },
                                            {
                                                key: "act",
                                                header: "",
                                                className: "text-right",
                                                render: (r) => (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            notify(
                                                                `Nudge sent to ${
                                                                    r.seller
                                                                        ?.storeName ||
                                                                    "seller"
                                                                } about ${
                                                                    r.product.name
                                                                }`,
                                                                "info"
                                                            )
                                                        }
                                                    >
                                                        {r.level === "ok"
                                                            ? "Inspect"
                                                            : "Nudge seller"}
                                                    </Button>
                                                ),
                                            },
                                        ]}
                                        rows={visible}
                                    />
                                </div>
                            </div>

                            {/* Pagination footer */}
                            <div
                                className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Showing{" "}
                                    {filtered.length === 0
                                        ? 0
                                        : (currentPage - 1) * PER_PAGE + 1}
                                    –
                                    {Math.min(
                                        currentPage * PER_PAGE,
                                        filtered.length
                                    )}{" "}
                                    of {filtered.length}
                                </p>

                                {pages > 1 && (
                                    <Pagination
                                        page={currentPage}
                                        pages={pages}
                                        onChange={(p) => {
                                            setPage(p);
                                            window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                            });
                                        }}
                                        className="w-full justify-center sm:w-auto"
                                    />
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}