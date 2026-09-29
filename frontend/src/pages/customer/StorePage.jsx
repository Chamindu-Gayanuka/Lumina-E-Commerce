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
import {getSellerProducts, sortProducts} from "../../services/productService";
import {formatNumber} from "../../utils/format";
import {useToast} from "../../context/ToastContext";
import {SORT_OPTIONS} from "../../utils/constants";

const PER_PAGE = 9;

export default function StorePage() {
    const {storeId} = useParams();
    const navigate = useNavigate();
    const {notify} = useToast();

    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        let alive = true;

        setSeller(null);
        setProducts(null);
        setLoading(true);
        setCategory("all");
        setPage(1);
        setFollowing(false);

        async function loadStore() {
            try {
                const store = await getSeller(storeId);
                if (!alive) return;

                if (!store) {
                    setProducts([]);
                    return;
                }

                setSeller(store);

                const storeProducts = await getSellerProducts(store.id);
                if (alive) {
                    setProducts(storeProducts || []);
                }
            } catch {
                if (alive) {
                    setProducts([]);
                }
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        }

        loadStore();

        return () => {
            alive = false;
        };
    }, [storeId]);

    const categories = useMemo(
        () =>
            Array.from(
                new Set((products || []).map((product) => product.category))
            ),
        [products]
    );

    const filtered = useMemo(() => {
        if (!products) return null;

        const list =
            category === "all"
                ? products
                : products.filter(
                    (product) => product.category === category
                );

        return sortProducts([...list], sort);
    }, [products, category, sort]);

    const pages = filtered
        ? Math.max(1, Math.ceil(filtered.length / PER_PAGE))
        : 1;

    const currentPage = Math.min(page, pages);

    const visible = filtered
        ? filtered.slice(
            (currentPage - 1) * PER_PAGE,
            currentPage * PER_PAGE
        )
        : [];

    if (loading && !seller) {
        return (
            <div className="py-28">
                <PageSpinner label="Loading store…"/>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="lum-container py-16">
                <EmptyState
                    title="Store not found"
                    message="This store page may have moved or the seller was deactivated."
                    action={{
                        label: "Browse the marketplace",
                        onClick: () => navigate("/shop"),
                    }}
                />
            </div>
        );
    }

    const storeName = seller.storeName || "Store";

    const stats = [
        {
            label: "Products",
            value: formatNumber(seller.productsCount),
        },
        {
            label: "Member Since",
            value: seller.joinedAt
                ? new Date(seller.joinedAt).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                })
                : "—",
        },
        {
            label: "Response Rate",
            value: `${seller.responseRate}%`,
        },
        {
            label: "Delivery",
            value:
                seller.deliveryFee > 0
                    ? `Rs. ${seller.deliveryFee} / order`
                    : "Free",
        },
        {
            label: "Orders Completed",
            value: `${formatNumber(seller.ordersCompleted)}+`,
        },
    ];

    return (
        <div>
            {/* Full-width store cover */}
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-r from-ink-900 via-slate-800 to-ink-900 sm:h-72">
                {seller.coverImage ? (
                    <img
                        src={seller.coverImage}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,#14b8a6_0,transparent_40%),radial-gradient(circle_at_80%_60%,#f59e0b_0,transparent_35%)]"/>
                )}

                {/* Subtle tint at the bottom of the photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent"/>
            </div>

            <div className="lum-container pb-16">
                {/* Store card overlaps the cover, but text stays on white */}
                <section
                    className="relative -mt-8 rounded-2xl border border-slate-200 bg-white px-5 pb-6 pt-20 shadow-lift sm:px-7 sm:pb-7 sm:pl-40 sm:pt-6"
                    aria-labelledby="store-name"
                >
                    {/* Avatar overlaps the cover */}
                    <div
                        className="absolute -top-14 left-5 flex h-28 w-28 items-center justify-center rounded-3xl text-4xl font-extrabold text-white shadow-lift ring-4 ring-white sm:left-7"
                        style={{
                            background: `linear-gradient(135deg, ${seller.accent || "#0d9488"}, #134e4a)`,
                        }}
                        aria-hidden="true"
                    >
                        {storeName.charAt(0)}
                    </div>

                    <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <h1
                                id="store-name"
                                className="text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl [overflow-wrap:anywhere]"
                            >
                                {storeName}
                            </h1>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                <RatingStars
                                    rating={seller.rating}
                                    size={14}
                                />
                                <span className="text-xs font-semibold text-slate-500">
                                    ({seller.rating} store rating)
                                </span>
                            </div>

                            {seller.description && (
                                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                                    {seller.description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2.5 lg:shrink-0">
                            <Button
                                size="md"
                                variant={
                                    following ? "secondary" : "primary"
                                }
                                icon={
                                    following
                                        ? <FaCheck size={12}/>
                                        : <FaPlus size={12}/>
                                }
                                onClick={() => {
                                    const nextFollowing = !following;
                                    setFollowing(nextFollowing);

                                    notify(
                                        nextFollowing
                                            ? `Following ${storeName}`
                                            : "Unfollowed store",
                                        "info"
                                    );
                                }}
                            >
                                {following ? "Following" : "Follow"}
                            </Button>

                            <Button
                                size="md"
                                variant="secondary"
                                icon={
                                    <FaEnvelope
                                        size={12}
                                        className="text-slate-400"
                                    />
                                }
                                onClick={() =>
                                    notify(
                                        `Messaging is a future feature — seller email: ${seller.email}`,
                                        "info"
                                    )
                                }
                            >
                                Contact
                            </Button>
                        </div>
                    </div>
                </section>

                <Breadcrumbs
                    className="mt-6"
                    items={[
                        {label: "Home", to: "/"},
                        {label: "Stores", to: "/shop"},
                        {label: storeName},
                    ]}
                />

                {/* Stats */}
                <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="lum-card px-5 py-4 text-center"
                        >
                            <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                {stat.label}
                            </dt>
                            <dd className="mt-1 text-xl font-extrabold text-ink-900">
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                {/* Products */}
                <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="min-w-0 text-xl font-extrabold tracking-tight text-ink-900">
                        Products by{" "}
                        <span className="text-primary-600 [overflow-wrap:anywhere]">
                            {storeName}
                        </span>
                    </h2>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <Select
                            name="storeCat"
                            value={category}
                            onChange={(event) => {
                                setCategory(event.target.value);
                                setPage(1);
                            }}
                            className="!h-9 !w-auto !py-1 text-xs font-bold"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </Select>

                        <Select
                            name="storeSort"
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value)
                            }
                            className="!h-9 !w-auto !py-1 text-xs font-bold"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                {!filtered ? (
                    <PageSpinner/>
                ) : visible.length ? (
                    <>
                        <ProductGrid
                            products={visible}
                            columns={4}
                            className="mt-6"
                        />

                        <Pagination
                            className="mt-12"
                            page={currentPage}
                            pages={pages}
                            onChange={(nextPage) => {
                                setPage(nextPage);
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }}
                        />
                    </>
                ) : (
                    <div className="mt-6">
                        <EmptyState
                            title="This store has no products yet"
                            message="Check back soon — new listings are added every week."
                        />
                    </div>
                )}
            </div>
        </div>
    );
}