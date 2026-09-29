import React, {useCallback, useEffect, useMemo, useState} from "react";
import {FaCircleCheck, FaTriangleExclamation, FaBan, FaBoxOpen} from "react-icons/fa6";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import DataTable from "../../components/ui/DataTable";
import QuantityStepper from "../../components/ui/QuantityStepper";
import SearchBar from "../../components/ui/SearchBar";
import {Select} from "../../components/ui/Input";
import {PageSpinner} from "../../components/ui/Spinner";
import ProductImage from "../../components/product/ProductImage";
import {EmptyState} from "../../components/ui/States";
import {formatDate} from "../../utils/format";
import {getInventory} from "../../services/productService";
import {updateStock} from "../../services/productService";
import {useAuth} from "../../context/AuthContext";
import {useToast} from "../../context/ToastContext";

export default function SellerInventory() {
    const {notify} = useToast();
    const {user} = useAuth();
    const sellerId = user?.sellerId || "s1";
    const [rows, setRows] = useState(null);
    const [search, setSearch] = useState("");
    const [level, setLevel] = useState("");

    const load = useCallback(() => getInventory().then(setRows), []);
    useEffect(() => {
        load();
    }, [load]);

    const mine = useMemo(() => (rows || []).filter((r) => r.product && r.product.sellerId === sellerId), [rows, sellerId]);

    const filtered = useMemo(() => {
        let list = mine;
        if (search.trim()) list = list.filter((r) => r.product.name.toLowerCase().includes(search.trim().toLowerCase()));
        if (level === "low") list = list.filter((r) => r.product.stock > 0 && r.product.stock <= (r.product.lowStockLevel ?? 5));
        if (level === "out") list = list.filter((r) => r.product.stock === 0);
        return list;
    }, [mine, search, level]);

    const setQty = async (r, next) => {
        await updateStock(r.productId, next);
        setRows((prev) =>
            prev.map((row) =>
                row.productId === r.productId
                    ? {...row, quantity: next, product: {...row.product, stock: next}}
                    : row
            )
        );
        notify(`Stock set to ${next} for ${r.product.name}`);
    };

    if (!rows) return <PageSpinner label="Reading your stock levels…"/>;

    const lowCount = mine.filter((r) => r.product.stock > 0 && r.product.stock <= (r.product.lowStockLevel ?? 5)).length;
    const outCount = mine.filter((r) => r.product.stock === 0).length;

    return (
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Inventory</h1>
            <p className="mt-1.5 text-sm text-slate-500">Live stock levels. Orders automatically decrement availability
                and lock overselling.</p>

            <div className="mt-7 grid gap-5 sm:grid-cols-3">
                <StatCard label="Total SKUs" value={mine.length} icon={<FaBoxOpen size={18}/>} tone="teal"/>
                <StatCard label="Low stock" value={lowCount} icon={<FaTriangleExclamation size={18}/>} tone="amber"
                          trendLabel="at or below alert level"/>
                <StatCard label="Out of stock" value={outCount} icon={<FaBan size={18}/>} tone="red"
                          trendLabel="hidden from add-to-cart"/>
            </div>

            <div className="lum-card mt-6 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search inventory…"
                               className="w-full sm:max-w-xs"/>
                    <Select name="invLevel" value={level} onChange={(e) => setLevel(e.target.value)}
                            className="h-10 w-auto min-w-40 text-sm">
                        <option value="">All stock levels</option>
                        <option value="low">Low stock only</option>
                        <option value="out">Out of stock only</option>
                    </Select>
                    {lowCount > 0 && (
                        <span
                            className="ml-auto inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
              <FaTriangleExclamation size={11}/> {lowCount} product{lowCount > 1 ? "s" : ""} need restocking
            </span>
                    )}
                    {lowCount === 0 && outCount === 0 && (
                        <span
                            className="ml-auto inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
              <FaCircleCheck size={11}/> Everything is healthy
            </span>
                    )}
                </div>

                <div className="mt-4">
                    {filtered.length === 0 ? (
                        <EmptyState title="Nothing here"
                                    message={search || level ? "No inventory matches this view." : "Add products to start tracking stock."}/>
                    ) : (
                        <DataTable
                            columns={[
                                {
                                    key: "product",
                                    header: "Product",
                                    render: (r) => (
                                        <div className="flex items-center gap-3">
                                            <ProductImage product={r.product} className="h-10 w-10 shrink-0 rounded-lg"
                                                          iconSize={15}/>
                                            <div>
                                                <p className="font-bold text-ink-900">{r.product.name}</p>
                                                <p className="text-xs text-slate-400">{r.product.category}</p>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    key: "quantity",
                                    header: "Available",
                                    render: (r) => (
                                        <div className="flex items-center gap-3">
                                            <QuantityStepper value={r.quantity} min={0} max={999}
                                                             onChange={(v) => setQty(r, v)} size="sm"/>
                                            <span className="text-xs text-slate-400">units</span>
                                        </div>
                                    ),
                                },
                                {
                                    key: "reserved",
                                    header: "Reserved",
                                    render: (r) => <span
                                        className="text-sm font-semibold text-slate-500">{r.reservedQuantity}</span>
                                },
                                {
                                    key: "lowStockLevel",
                                    header: "Alert level",
                                    render: (r) => <span className="text-sm text-slate-500">≤ {r.lowStockLevel}</span>
                                },
                                {
                                    key: "status",
                                    header: "Status",
                                    render: (r) =>
                                        r.product.stock === 0 ? (
                                            <Badge tone="red" uppercase>Out of stock</Badge>
                                        ) : r.product.stock <= (r.product.lowStockLevel ?? 5) ? (
                                            <Badge tone="amber" uppercase>Low stock</Badge>
                                        ) : (
                                            <Badge tone="green" uppercase>In stock</Badge>
                                        ),
                                },
                                {
                                    key: "lastUpdated",
                                    header: "Updated",
                                    render: (r) => <span
                                        className="text-xs text-slate-400">{formatDate(r.lastUpdated)}</span>
                                },
                            ]}
                            rows={filtered}
                            dense
                        />
                    )}
                </div>
            </div>
        </div>
    );
}