import React, {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {FaCheck, FaEnvelope, FaPlus} from "react-icons/fa6";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import Button from "../../components/ui/Button";
import RatingStars from "../../components/ui/RatingStars";
import Pagination from "../../components/ui/Pagination";
import {Select} from "../../components/ui/Input";
import ProductGrid from "../../components/product/ProductGrid";
import {EmptyState} from "../../components/ui/States";
import {PageSpinner} from "../../components/ui/Spinner";
import {getSeller} from "../../services/accountService";
import {getSellerProducts} from "../../services/productService";
import {formatNumber} from "../../utils/format";
import {useToast} from "../../context/ToastContext";
import {SORT_OPTIONS} from "../../utils/constants";
import {sortProducts} from "../../services/productService";

const PER_PAGE = 9;

export default function StorePage() {
    const {storeId} = useParams();
    const navigate = useNavigate();
    const {notify} = useToast();
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState(null);
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        let alive = true;
        getSeller(storeId).then((s) => {
            if (!alive) return;
            setSeller(s);
            if (s) return getSellerProducts(s.id);
            return [];
        }).then((p) => alive && p !== undefined && setProducts(p))
            .catch(() => alive && setProducts([]));
        return () => {
            alive = false;
        };
    }, [storeId]);

    const filtered = useMemo(() => {
        if (!products) return null;
        let list = category === "all" ? products : products.filter((p) => p.category === category);
        return sortProducts(list, sort);
    }, [products, category, sort]);

    const pages = filtered ? Math.max(1, Math.ceil(filtered.length / PER_PAGE)) : 1;
    const visible = filtered ? filtered.slice((Math.min(page, pages) - 1) * PER_PAGE, Math.min(page, pages) * PER_PAGE) : [];
    const categories = useMemo(() => Array.from(new Set((products || []).map((p) => p.category))), [products]);

    if (!seller && products) {
        return (
            <div className="lum-container py-16">
                <EmptyState
                    title="Store not found"
                    message="This store page may have moved or the seller was deactivated."
                    action={{label: "Browse the marketplace", onClick: () => navigate("/shop")}}
                />
            </div>
        );
    }

    if (!seller) return <div className="py-28"><PageSpinner label="Loading store…"/></div>;

    return (
        <div>
            {/* Cover */}
            <div
                className="relative h-56 w-full overflow-hidden bg-gradient-to-r from-ink-900 via-slate-800 to-ink-900 sm:h-64"
                aria-hidden="true">
                <div
                    className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#14b8a6_0,transparent_40%),radial-gradient(circle_at_80%_60%,#f59e0b_0,transparent_35%)]"/>
                <img src={seller.coverImage} alt="" className="hidden" onError={(e) => {
                    e.currentTarget.remove();
                }}/>
            </div>

            <div className="lum-container pb-16">
                <Breadcrumbs className="pt-4" items={[{label: "Home", to: "/"}, {
                    label: "Stores",
                    to: "/shop"
                }, {label: seller.storeName}]}/>

                <div className="relative -mt-14 flex flex-col gap-6 sm:-mt-16 sm:flex-row sm:items-end">
          <span
              className="flex h-28 w-28 items-center justify-center rounded-3xl text-4xl font-extrabold text-white shadow-lift ring-4 ring-white"
              style={{background: `linear-gradient(135deg, ${seller.accent || "#0d9488"}, #134e4a)`}}
              aria-hidden="true"
          >
            {seller.storeName.charAt(0)}
          </span>
                    <div className="min-w-0 flex-1 pb-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">{seller.storeName}</h1>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <RatingStars rating={seller.rating} size={14}/>
                            <span className="text-xs font-semibold text-slate-500">({seller.rating} store rating)</span>
                        </div>
                        <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-500">{seller.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-2.5 pb-1">
                        <Button
                            size="md"
                            variant={following ? "secondary" : "primary"}
                            icon={following ? <FaCheck size={12}/> : <FaPlus size={12}/>}
                            onClick={() => {
                                setFollowing((f) => !f);
                                notify(following ? "Unfollowed store" : `Following ${seller.storeName}`, "info");
                            }}
                        >
                            {following ? "Following" : "Follow"}
                        </Button>
                        <Button size="md" variant="secondary" icon={<FaEnvelope size={12} className="text-slate-400"/>}
                                onClick={() => notify("Messaging is a future feature — seller email: " + seller.email, "info")}>
                            Contact
                        </Button>
                    </div>
                </div>

                {/* Stats strip */}
                <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {[
                        {label: "Products", value: formatNumber(seller.productsCount)},
                        {label: "Member Since",
                            value: new Date(seller.joinedAt).toLocaleDateString("en-GB", {
                                month: "short",
                                year: "numeric"
                            })
                        },
                        {label: "Response Rate", value: `${seller.responseRate}%`},
                        {
                            label: "Delivery",
                            value: seller.deliveryFee > 0 ? `Rs. ${seller.deliveryFee} / order` : "Free",
                        },
                        {label: "Orders Completed", value: `${formatNumber(seller.ordersCompleted)}+`},
                    ].map((s) => (
                        <div key={s.label} className="lum-card px-5 py-4 text-center">
                            <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{s.label}</dt>
                            <dd className="mt-1 text-xl font-extrabold text-ink-900">{s.value}</dd>
                        </div>
                    ))}
                </dl>

                {/* Products */}
                <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
                        Products by <span className="text-primary-600">{seller.storeName.split(" ")[0]}</span>
                    </h2>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Select name="storeCat" value={category} onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }} className="!h-9 !w-auto !py-1 text-xs font-bold">
                            <option value="all">All Categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </Select>
                        <Select name="storeSort" value={sort} onChange={(e) => setSort(e.target.value)}
                                className="!h-9 !w-auto !py-1 text-xs font-bold">
                            {SORT_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                {!filtered ? (
                    <PageSpinner/>
                ) : visible.length ? (
                    <>
                        <ProductGrid products={visible} columns={4} className="mt-6"/>
                        <Pagination className="mt-12" page={page} pages={pages} onChange={(p) => {
                            setPage(p);
                            window.scrollTo({top: 0, behavior: "smooth"});
                        }}/>
                    </>
                ) : (
                    <div className="mt-6">
                        <EmptyState title="This store has no products yet"
                                    message="Check back soon — new listings are added every week."/>
                    </div>
                )}
            </div>
        </div>
    );
}