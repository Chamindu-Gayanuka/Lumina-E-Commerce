import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaFilter, FaRotateLeft } from "react-icons/fa6";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import { Select } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/States";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorMessage } from "../../components/ui/States";
import ProductGrid from "../../components/product/ProductGrid";
import { listProducts } from "../../services/productService";
import { listCategories } from "../../services/accountService";
import { SORT_OPTIONS } from "../../utils/constants";

const PER_PAGE = 12;

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilters, setMobileFilters] = useState(false);

  const query = useMemo(
    () => ({
      search: params.get("search") || "",
      categories: params.getAll("category"),
      min: params.get("min") || "",
      max: params.get("max") || "",
      availability: params.get("availability") || "all",
      sort: params.get("sort") || "newest",
      page: Number(params.get("page") || 1),
    }),
    [params]
  );

  useEffect(() => {
    listCategories().then((c) => setCategories(c.filter((x) => x.status === "Active")));
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    listProducts({ ...query, perPage: PER_PAGE })
      .then(setResult)
      .catch((e) => setError(e.message || "The product service is unavailable right now."))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(fetchProducts, [fetchProducts]);

  const update = (patch, resetPage = true) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined || value === "all" || (key === "page" && value === 1)) next.delete(key);
      else if (Array.isArray(value)) {
        next.delete(key);
        value.forEach((v) => next.append(key, v));
      } else next.set(key, value);
    });
    if (resetPage) next.delete("page");
    setParams(next, { replace: true });
  };

  const toggleCategory = (name) => {
    const selected = query.categories.includes(name);
    update({ category: selected ? query.categories.filter((c) => c !== name) : [...query.categories, name] });
  };

  const [priceDraft, setPriceDraft] = useState({ min: query.min, max: query.max });
  useEffect(() => setPriceDraft({ min: query.min, max: query.max }), [query.min, query.max]);

  const hasFilters = Boolean(query.search || query.categories.length || query.min || query.max || query.availability !== "all");

  const FiltersPanel = (
    <div className="space-y-7">
      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">Categories</h3>
        <div className="mt-3 space-y-2.5">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-ink-900">
              <input
                type="checkbox"
                checked={query.categories.includes(c.name)}
                onChange={() => toggleCategory(c.name)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/40"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ min: priceDraft.min, max: priceDraft.max });
        }}
      >
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">Price Range</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-400">Min</span>
            <input
              type="number"
              min="0"
              placeholder="Rs"
              value={priceDraft.min}
              onChange={(e) => setPriceDraft((p) => ({ ...p, min: e.target.value }))}
              className="lum-input mt-0.5 h-9 px-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-400">Max</span>
            <input
              type="number"
              min="0"
              placeholder="Rs"
              value={priceDraft.max}
              onChange={(e) => setPriceDraft((p) => ({ ...p, max: e.target.value }))}
              className="lum-input mt-0.5 h-9 px-2.5 text-sm"
            />
          </label>
        </div>
        <Button type="submit" size="sm" variant="secondary" className="mt-3 w-full">
          Apply price
        </Button>
      </form>

      <div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink-900">Availability</h3>
        <div className="mt-3 space-y-2.5">
          {[
            { key: "in", label: "In Stock" },
            { key: "out", label: "Out of Stock" },
          ].map((opt) => (
            <label key={opt.key} className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-ink-900">
              <input
                type="checkbox"
                checked={query.availability === opt.key}
                onChange={(e) => update({ availability: e.target.checked ? opt.key : "all" })}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/40"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {hasFilters && (
        <Button size="sm" variant="ghost" icon={<FaRotateLeft size={11} className="text-slate-400" />} onClick={() => setParams(new URLSearchParams(), { replace: true })} className="w-full">
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="lum-container py-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shop" }]} />
      <PageHeader
        className="mt-5"
        title={query.search ? `Results for “${query.search}”` : "All Products"}
        subtitle="Browse the curated Lumina catalogue - filter by category, price and availability."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="lum-card sticky top-24 p-5">{FiltersPanel}</div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card">
            <p className="text-sm text-slate-500">
              Showing <strong className="text-ink-900">{result ? Math.min(result.items.length, PER_PAGE) : "…"}</strong> of{" "}
              <strong className="text-ink-900">{result ? result.total : "…"}</strong> products
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-ink-800 lg:hidden"
              >
                <FaFilter size={11} /> Filters
              </button>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                Sort by:
                <Select
                  name="sort"
                  value={query.sort}
                  onChange={(e) => update({ sort: e.target.value }, false)}
                  className="!h-9 !w-auto !rounded-lg !py-1 !pr-8 text-xs font-bold"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <PageSpinner label="Loading products…" />
            ) : error ? (
              <ErrorMessage title="Couldn't load products" message={error} onRetry={fetchProducts} />
            ) : result && result.items.length ? (
              <>
                <ProductGrid products={result.items} columns={3} className="gap-5 md:gap-6" />
                <Pagination className="mt-12" page={result.page} pages={result.pages} onChange={(p) => update({ page: p }, false)} />
              </>
            ) : (
              <EmptyState
                title="No products match your filters"
                message="Try removing a filter or searching for something else. The catalogue grows every week."
                action={{ label: "Clear filters", onClick: () => setParams(new URLSearchParams(), { replace: true }) }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setMobileFilters(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold">Filters</h2>
              <Button size="sm" variant="secondary" onClick={() => setMobileFilters(false)}>
                Done
              </Button>
            </div>
            {FiltersPanel}
          </div>
        </div>
      )}
    </div>
  );
}
