import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FaArrowLeftLong, FaImage, FaPlus, FaTrashCan} from "react-icons/fa6";
import Button from "../../components/ui/Button";
import Input, {Select, Textarea} from "../../components/ui/Input";
import {ValidationSummary} from "../../components/ui/States";
import {required, requiredAmount, requiredInteger, validate, hasErrors} from "../../utils/validation";
import {saveProduct, getProduct} from "../../services/productService";
import {listCategories} from "../../services/accountService";
import {useAuth} from "../../context/AuthContext";
import {useToast} from "../../context/ToastContext";

const IMAGE_CHOICES = [
    {label: "Headphones", value: "/images/product-headphones.jpg"},
    {label: "Watch", value: "/images/product-watch.jpg"},
    {label: "Lamp", value: "/images/product-lamp.jpg"},
    {label: "Bag", value: "/images/product-bag.jpg"},
    {label: "No image (gradient placeholder)", value: null},
];

export default function ProductForm() {
    const {productId} = useParams();
    const isEdit = Boolean(productId);
    const navigate = useNavigate();
    const {notify} = useToast();
    const {user} = useAuth();
    const sellerId = user?.sellerId || "s1";

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        oldPrice: "",
        stock: "",
        lowStockLevel: "5",
        status: "Active",
        shortDescription: "",
        description: "",
        image: null,
        specs: [{label: "", value: ""}],
    });

    useEffect(() => {
        listCategories().then((c) => setCategories(c.filter((x) => x.status === "Active")));
        if (isEdit) {
            getProduct(productId).then((p) => {
                setForm({
                    name: p.name,
                    category: p.category,
                    price: String(p.price),
                    oldPrice: p.oldPrice ? String(p.oldPrice) : "",
                    stock: String(p.stock),
                    lowStockLevel: String(p.lowStockLevel ?? 5),
                    status: p.status,
                    shortDescription: p.shortDescription || "",
                    description: (p.description || []).join("\n\n"),
                    image: p.image || null,
                    specs: p.specs?.length ? p.specs : [{label: "", value: ""}],
                });
            });
        }
    }, [isEdit, productId]);

    const set = (key) => (e) => setForm((f) => ({...f, [key]: e.target.value}));
    const setSpec = (idx, key, value) =>
        setForm((f) => ({...f, specs: f.specs.map((s, i) => (i === idx ? {...s, [key]: value} : s))}));

    const submit = async (e) => {
        e.preventDefault();
        const errs = validate(form, {
            name: [(v) => required(v, "Product name"), (v) => (String(v).length >= 4 ? "" : "Name should be at least 4 characters")],
            category: [(v) => required(v, "Category")],
            price: [(v) => requiredAmount(v, "Price")],
            stock: [(v) => requiredInteger(v, "Stock quantity", 0)],
            lowStockLevel: [(v) => requiredInteger(v, "Low-stock threshold", 0)],
        });
        if (form.oldPrice && Number(form.oldPrice) <= Number(form.price)) {
            errs.oldPrice = "Compare-at price must be higher than the selling price";
        }
        setErrors(errs);
        if (hasErrors(errs)) return;

        setSaving(true);
        const payload = {
            name: form.name.trim(),
            category: form.category,
            sellerId,
            price: Number(form.price),
            oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
            stock: Number(form.stock),
            lowStockLevel: Number(form.lowStockLevel),
            status: form.status,
            shortDescription: form.shortDescription.trim(),
            description: form.description.split(/\n\n+/).filter(Boolean),
            image: form.image,
            specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
        };
        try {
            const saved = await saveProduct(payload, isEdit ? productId : undefined);
            notify(isEdit ? "Product updated" : "Product published to your store");
            navigate("/seller/products", {state: {justSaved: saved.id}});
        } catch (err) {
            setErrors({name: err.message});
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <Link to="/seller/products"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800">
                <FaArrowLeftLong size={12}/> Back to Products
            </Link>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900">
                {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
                {isEdit ? "Changes go live on the storefront immediately after saving." : "Listings become visible once your seller account is approved."}
            </p>

            <form onSubmit={submit} className="lum-card mt-7 space-y-8 p-6 sm:p-8" noValidate>
                <ValidationSummary errors={errors}/>

                <section>
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Basics</h2>
                    <div className="mt-4 space-y-5">
                        <Input label="Product Name" name="p-name" placeholder="e.g. Pro Wireless Headphones"
                               value={form.name} onChange={set("name")} error={errors.name}/>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Select label="Category" name="p-cat" value={form.category} onChange={set("category")}
                                    error={errors.category}>
                                <option value="">Select a category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </Select>
                            <Select label="Listing Status" name="p-status" value={form.status} onChange={set("status")}>
                                <option value="Active">Active - visible to shoppers</option>
                                <option value="Draft">Draft - hidden</option>
                                <option value="Inactive">Inactive - paused</option>
                            </Select>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Pricing &
                        Inventory</h2>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        <Input label="Price (Rs.)" name="p-price" inputMode="numeric" placeholder="5599"
                               value={form.price} onChange={set("price")} error={errors.price}/>
                        <Input label="Compare-at Price (Rs.)" name="p-old" inputMode="numeric" placeholder="Optional"
                               value={form.oldPrice} onChange={set("oldPrice")} error={errors.oldPrice}
                               hint="Shown struck through on the product page."/>
                        <Input label="Stock Quantity" name="p-stock" inputMode="numeric" placeholder="10"
                               value={form.stock} onChange={set("stock")} error={errors.stock}
                               hint="Order placement automatically reduces this number."/>
                        <Input label="Low Stock Alert Level" name="p-low" inputMode="numeric" value={form.lowStockLevel}
                               onChange={set("lowStockLevel")} error={errors.lowStockLevel}/>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Media & Copy</h2>
                    <Textarea label="Short Description" name="p-short" rows={2}
                              placeholder="One punchy sentence shown on product cards…" value={form.shortDescription}
                              onChange={set("shortDescription")}/>
                    <Textarea label="Full Description" name="p-desc" rows={5}
                              placeholder="Paragraphs separated by a blank line appear as separate blocks."
                              className="mt-5" value={form.description} onChange={set("description")}/>
                    <div className="mt-5">
                        <p className="lum-label"><FaImage className="mr-1.5 inline text-slate-400"/>Product Image</p>
                        <p className="mb-3 text-xs text-slate-400">File uploads connect to the media service in the
                            backend phase — pick a demo asset:</p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                            {IMAGE_CHOICES.map((choice) => (
                                <button
                                    key={choice.label}
                                    type="button"
                                    onClick={() => setForm((f) => ({...f, image: choice.value}))}
                                    className={`rounded-xl border-2 p-1.5 text-left transition-all ${form.image === choice.value ? "border-primary-600 bg-primary-50" : "border-slate-200 hover:border-slate-300"}`}
                                >
                                    {choice.value ? (
                                        <img src={choice.value} alt={choice.label}
                                             className="h-14 w-full rounded-lg bg-slate-100 object-cover"/>
                                    ) : (
                                        <span
                                            className="flex h-14 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-bold text-slate-400">
                      Aa
                    </span>
                                    )}
                                    <span
                                        className="mt-1.5 block truncate text-[10px] font-semibold text-slate-500">{choice.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Specifications</h2>
                        <Button type="button" size="sm" variant="secondary" icon={<FaPlus size={10}/>}
                                onClick={() => setForm((f) => ({...f, specs: [...f.specs, {label: "", value: ""}]}))}>
                            Add row
                        </Button>
                    </div>
                    <div className="mt-4 space-y-3">
                        {form.specs.map((spec, idx) => (
                            <div key={idx} className="flex gap-3">
                                <input className="lum-input h-11" placeholder="Label (e.g. Battery)" value={spec.label}
                                       onChange={(e) => setSpec(idx, "label", e.target.value)}
                                       aria-label={`Spec ${idx + 1} label`}/>
                                <input className="lum-input h-11" placeholder="Value (e.g. 40 hours)" value={spec.value}
                                       onChange={(e) => setSpec(idx, "value", e.target.value)}
                                       aria-label={`Spec ${idx + 1} value`}/>
                                <button
                                    type="button"
                                    onClick={() => setForm((f) => ({...f, specs: f.specs.filter((_, i) => i !== idx)}))}
                                    className="flex w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500"
                                    aria-label="Remove spec row"
                                >
                                    <FaTrashCan size={13}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
                    <Button type="button" variant="secondary"
                            onClick={() => navigate("/seller/products")}>Cancel</Button>
                    <Button type="submit" loading={saving}>{isEdit ? "Save Changes" : "Publish Product"}</Button>
                </div>
            </form>
        </div>
    );
}