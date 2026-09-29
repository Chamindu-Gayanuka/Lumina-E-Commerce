import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaEye, FaPencil, FaPlus, FaPowerOff} from "react-icons/fa6";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/ui/SearchBar";
import {Select} from "../../components/ui/Input";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import {ProductStatusBadge} from "../../components/ui/Badge";
import {ConfirmDialog} from "../../components/ui/Modal";
import {EmptyState} from "../../components/ui/States";
import {PageSpinner} from "../../components/ui/Spinner";
import ProductImage from "../../components/product/ProductImage";
import {formatPrice} from "../../utils/format";
import {getSellerProducts, deleteProduct, toggleProductStatus} from "../../services/productService";
import {rankBySearch} from "../../utils/search";
import {useAuth} from "../../context/AuthContext";
import {useToast} from "../../context/ToastContext";

const PER_PAGE = 8;

export default function SellerProducts() {
    const navigate = useNavigate();
    const {notify} = useToast();
    const {user} = useAuth();
    const sellerId = user?.sellerId || "s1";

    const [items, setItems] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [deleting, setDeleting] = useState(null);

    const load = useCallback(() => getSellerProducts(sellerId).then(setItems), [sellerId]);
    useEffect(() => {
        load();
    }, [load]);

    const filtered = useMemo(() => {
        let list = items || [];
        if (search.trim()) list = rankBySearch(list, search.trim());
        if (status) list = list.filter((p) => p.status === status);
        return list;
    }, [items, search, status]);

    const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const visible = filtered.slice((Math.min(page, pages) - 1) * PER_PAGE, Math.min(page, pages) * PER_PAGE);

    const doDelete = async () => {
        await deleteProduct(deleting.id);
        notify("Product deleted", "info");
        setDeleting(null);
        load();
    };

    const toggle = async (p) => {
        await toggleProductStatus(p.id);
        notify(p.status === "Active" ? "Product deactivated" : "Product activated", "info");
        load();
    };

    if (!items) return <PageSpinner label="Loading your catalogue…"/>;

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">My Products</h1>
                    <p className="mt-1.5 text-sm text-slate-500">{items.length} listings · price, stock & status updates
                        sync with the marketplace.</p>
                </div>
                <Button as={Link} to="/seller/products/new" icon={<FaPlus size={11}/>}>Add Product</Button>
            </div>

            <div className="lum-card mt-7 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                    <SearchBar value={search} onChange={(v) => {
                        setSearch(v);
                        setPage(1);
                    }} placeholder="Search my products…" className="w-full sm:max-w-xs"/>
                    <Select name="prodStatus" value={status} onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }} className="h-10 w-auto min-w-36 text-sm">
                        <option value="">All statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                    </Select>
                    {(search || status) && (
                        <button type="button"
                                className="text-xs font-bold text-slate-400 underline-offset-2 hover:text-primary-700 hover:underline"
                                onClick={() => {
                                    setSearch("");
                                    setStatus("");
                                }}>
                            Clear filters
                        </button>
                    )}
                </div>

                <div className="mt-4">
                    {filtered.length === 0 ? (
                        <EmptyState title={search || status ? "No products match your filters" : "No products yet"}
                                    message={search || status ? "Try clearing the filters above." : "Add your first product and it will appear here instantly."}
                                    action={{label: "Add product", onClick: () => navigate("/seller/products/new")}}/>
                    ) : (
                        <>
                            <DataTable
                                columns={[
                                    {
                                        key: "product",
                                        header: "Product",
                                        render: (p) => (
                                            <div className="flex items-center gap-3">
                                                <ProductImage product={p} className="h-11 w-11 shrink-0 rounded-lg"
                                                              iconSize={16}/>
                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-ink-900">{p.name}</p>
                                                    <p className="text-xs text-slate-400">{p.category}</p>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "price",
                                        header: "Price",
                                        render: (p) => (
                                            <div>
                                                <p className="font-bold text-ink-900">{formatPrice(p.price, {decimals: true})}</p>
                                                {p.oldPrice &&
                                                    <p className="text-xs text-slate-400 line-through">{formatPrice(p.oldPrice)}</p>}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "stock",
                                        header: "Stock",
                                        render: (p) => <span
                                            className={`font-bold ${p.stock === 0 ? "text-red-500" : p.stock <= (p.lowStockLevel ?? 5) ? "text-amber-600" : "text-ink-900"}`}>{p.stock} units</span>,
                                    },
                                    {
                                        key: "rating",
                                        header: "Rating",
                                        render: (p) => <span
                                            className="text-sm font-semibold text-slate-500">{p.rating ? `★ ${p.rating} (${p.reviewCount})` : "—"}</span>
                                    },
                                    {
                                        key: "status",
                                        header: "Status",
                                        render: (p) => <ProductStatusBadge status={p.status} stock={p.stock}/>
                                    },
                                    {
                                        key: "actions",
                                        header: "Actions",
                                        thClassName: "text-right",
                                        className: "text-right",
                                        render: (p) => (
                                            <div className="inline-flex gap-1.5">
                                                <button type="button" onClick={() => navigate(`/product/${p.id}`)}
                                                        title="Preview"
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:border-primary-300 hover:text-primary-700">
                                                    <FaEye size={12}/>
                                                </button>
                                                <button type="button"
                                                        onClick={() => navigate(`/seller/products/${p.id}/edit`)}
                                                        title="Edit"
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:border-primary-300 hover:text-primary-700">
                                                    <FaPencil size={12}/>
                                                </button>
                                                <button type="button" onClick={() => toggle(p)}
                                                        title={p.status === "Active" ? "Deactivate" : "Activate"}
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:border-amber-300 hover:text-amber-600">
                                                    <FaPowerOff size={12}/>
                                                </button>
                                                <button type="button" onClick={() => setDeleting(p)} title="Delete"
                                                        className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:border-red-300 hover:text-red-500">
                                                    <span className="block text-xs font-bold">✕</span>
                                                </button>
                                            </div>
                                        ),
                                    },
                                ]}
                                rows={visible}
                            />
                            {pages > 1 && <Pagination className="mt-5" page={Math.min(page, pages)} pages={pages}
                                                      onChange={setPage}/>}
                        </>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={Boolean(deleting)}
                onClose={() => setDeleting(null)}
                onConfirm={doDelete}
                title="Delete this product?"
                confirmLabel="Delete permanently"
                message={`"${deleting?.name}" will be removed from your catalogue and the storefront. Customers with it in their cart will see it as unavailable.`}
            />
        </div>
    );
}