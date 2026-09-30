import React, {useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {FaCircleCheck, FaCreditCard, FaLandmark, FaLocationDot, FaMoneyBill1Wave} from "react-icons/fa6";
import CheckoutStepper from "../../components/ui/CheckoutStepper";
import Button from "../../components/ui/Button";
import Input, {Checkbox, Select, Textarea} from "../../components/ui/Input";
import ProductImage from "../../components/product/ProductImage";
import {EmptyState, ValidationSummary} from "../../components/ui/States";
import {formatPrice} from "../../utils/format";
import {DISTRICTS} from "../../utils/constants";
import {
    required,
    isPhone,
    isPostalCode,
    validate,
    hasErrors,
} from "../../utils/validation";
import {placeOrder} from "../../services/orderService";
import {useAuth} from "../../context/AuthContext";
import {useCart} from "../../context/CartContext";
import {useToast} from "../../context/ToastContext";
import {PageSpinner} from "../../components/ui/Spinner";

/* ── Payment method selector (radio cards) ──────────────────────────────── */
function PaymentMethodSelector({value, onChange}) {
    const methods = [
        {
            key: "cod",
            label: "Cash on Delivery (COD)",
            desc: "Pay with cash when your order is delivered to your doorstep.",
            icon: <FaMoneyBill1Wave size={18}/>,
            disabled: false,
        },
        {
            key: "card",
            label: "Credit / Debit Card",
            desc: "Securely pay with your Visa, Mastercard, or Amex.",
            icon: <FaCreditCard size={18}/>,
            disabled: true,
            soon: true,
        },
        {
            key: "bank",
            label: "Online Banking",
            desc: "Pay via instant bank transfer with your online banking.",
            icon: <FaLandmark size={18}/>,
            disabled: true,
            soon: true,
        },
    ];
    return (
        <div className="space-y-3.5">
            {methods.map((m) => {
                const selected = value === m.key;
                return (
                    <button
                        key={m.key}
                        type="button"
                        disabled={m.disabled}
                        onClick={() => onChange(m.key)}
                        className={`flex w-full items-start gap-3.5 rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                            selected && !m.disabled
                                ? "border-primary-600 bg-primary-50/40 ring-2 ring-primary-100"
                                : "border-slate-200 bg-white hover:border-slate-300"
                        } ${m.disabled ? "cursor-not-allowed opacity-60" : ""}`}
                    >
            <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-primary-600 bg-primary-600" : "border-slate-300 bg-white"
                }`}
                aria-hidden="true"
            >
              {selected && <span className="h-2 w-2 rounded-full bg-white"/>}
            </span>
                        <span className="flex-1">
              <span className="flex items-center gap-2.5">
                <span className="text-ink-900">{m.icon}</span>
                <span className="text-sm font-bold text-ink-900">{m.label}</span>
                  {m.soon && (
                      <span
                          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-slate-500">
                    Coming soon
                  </span>
                  )}
              </span>
              <span className="mt-1 block text-xs text-slate-400">{m.desc}</span>
            </span>
                    </button>
                );
            })}
        </div>
    );
}

function SectionTitle({number, title, note}) {
    return (
        <h2 className="flex items-center gap-3 text-lg font-extrabold tracking-tight text-ink-900">
      <span
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-900 text-xs font-extrabold text-white">
        {number}
      </span>
            {title}
            {note && <span className="text-base font-semibold text-slate-400">{note}</span>}
        </h2>
    );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Checkout() {
    const {user, ready} = useAuth();
    const cart = useCart();
    const navigate = useNavigate();
    const {notify} = useToast();

    const [form, setForm] = useState({
        fullName: user?.name || "",
        contact: user?.phone || "",
        address: user?.customer?.address || "",
        city: user?.customer?.city || "",
        district: user?.customer?.district || "",
        postal: user?.customer?.postalCode || "",
        notes: "",
        save: false,
    });
    const [payment, setPayment] = useState("cod");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    if (!ready) return <PageSpinner label="Checking session…"/>;
    if (!user) return <Navigate to="/login" replace state={{from: "/checkout"}}/>;

    if (!cart.items.length) {
        return (
            <div className="lum-container py-10">
                <CheckoutStepper current={1}/>
                <div className="mx-auto mt-10 max-w-xl">
                    <EmptyState
                        title="There's nothing to check out"
                        message="Your cart is empty - add a few premium picks first and the checkout will be waiting."
                        action={{label: "Browse products", onClick: () => navigate("/shop")}}
                    />
                </div>
            </div>
        );
    }

    const set = (key) => (e) =>
        setForm((f) => ({...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value}));

    const submit = async (e) => {
        e.preventDefault();
        const errs = validate(form, {
            fullName: [(v) => required(v, "Full name")],
            contact: [(v) => required(v, "Contact number"), isPhone],
            address: [(v) => required(v, "Delivery address"), (v) => (String(v).length >= 8 ? "" : "Enter a complete street address")],
            city: [(v) => required(v, "City")],
            district: [(v) => required(v, "District")],
            postal: [(v) => required(v, "Postal code"), isPostalCode],
        });
        setErrors(errs);
        if (hasErrors(errs)) {
            window.scrollTo({top: 0, behavior: "smooth"});
            return;
        }

        setSubmitting(true);
        try {
            const order = await placeOrder({
                customerId: user?.id || "guest",
                customerName: form.fullName,
                customerEmail: user?.email || "guest@example.com",
                items: cart.items.map(({product, qty}) => ({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    qty,
                    image: product.image,
                    seller: product.sellerId,
                })),
                subtotal: cart.subtotal,
                deliveryFee: cart.deliveryFee,
                totalAmount: cart.total,
                paymentMethod: "Cash on Delivery",
                address: {
                    name: form.fullName,
                    phone: form.contact,
                    line1: form.address,
                    city: form.city,
                    district: form.district,
                    postalCode: form.postal,
                },
                notes: form.notes,
            });
            cart.clear();
            notify("Order placed successfully!");
            navigate(`/order-confirmation/${order.id}`);
        } catch (err) {
            notify(err.message || "We couldn't place your order. Please try again.", "error");
            setSubmitting(false);
        }
    };

    return (
        <div className="lum-container py-8">
            <CheckoutStepper current={1}/>

            {!user && (
                <div
                    className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 px-5 py-3 text-sm text-primary-900">
                    <FaCircleCheck className="text-primary-600" size={14}/>
                    <span>Reviewing as a guest.</span>
                    <Link to="/login" state={{from: "/checkout"}} className="font-bold underline underline-offset-2">
                        Sign in
                    </Link>
                    <span>to save your addresses & track orders in one place.</span>
                </div>
            )}

            <form onSubmit={submit} className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px]]">
                <div className="min-w-0 space-y-10">
                    {/* 1 - Delivery */}
                    <section>
                        <SectionTitle number="1" title="Delivery Information"/>
                        <ValidationSummary errors={errors}/>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            <Input label="Full Name" name="fullName" placeholder="John Doe" value={form.fullName}
                                   onChange={set("fullName")} error={errors.fullName} required/>
                            <Input label="Contact Number" name="contact" placeholder="+94 76 xxx xxxx"
                                   value={form.contact} onChange={set("contact")} error={errors.contact} required
                                   inputMode="tel"/>
                        </div>
                        <Textarea
                            className="mt-5"
                            label="Delivery Address"
                            name="address"
                            rows={3}
                            placeholder="Street address, Apartment, Suite, etc."
                            value={form.address}
                            onChange={set("address")}
                            error={errors.address}
                            required
                        />
                        <div className="mt-5 grid gap-5 sm:grid-cols-3">
                            <Input label="City" name="city" placeholder="Ampara" value={form.city}
                                   onChange={set("city")} error={errors.city} required/>
                            <Select label="District" name="district" value={form.district} onChange={set("district")}
                                    error={errors.district} required>
                                <option value="">Select District</option>
                                {DISTRICTS.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </Select>
                            <Input label="Postal Code" name="postal" placeholder="32100" value={form.postal}
                                   onChange={set("postal")} error={errors.postal} required inputMode="numeric"
                                   maxLength={5}/>
                        </div>
                        <Checkbox className="mt-5" label="Save this address for future orders" name="save"
                                  checked={form.save} onChange={set("save")}/>
                    </section>

                    {/* 2 - Payment */}
                    <section>
                        <SectionTitle number="2" title="Payment Method"/>
                        <div className="mt-5">
                            <PaymentMethodSelector value={payment} onChange={setPayment}/>
                        </div>
                    </section>

                    {/* 3 - Notes */}
                    <section>
                        <SectionTitle number={3} title="Order Notes" note="(Optional)"/>
                        <Textarea
                            className="mt-5"
                            name="notes"
                            rows={2}
                            placeholder="e.g. Leave at the front desk, special delivery hours, etc."
                            value={form.notes}
                            onChange={set("notes")}
                        />
                    </section>
                </div>

                {/* Order summary */}
                <aside className="lum-card p-6 lg:sticky lg:top-24">
                    <h2 className="text-xl font-extrabold tracking-tight text-ink-900">Your Order</h2>
                    <ul className="mt-5 space-y-4">
                        {cart.items.map(({product, qty}) => (
                            <li key={product.id} className="flex items-center gap-3.5">
                                <ProductImage product={product} className="h-12 w-12 shrink-0 rounded-xl"
                                              iconSize={18}/>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-ink-900">{product.name}</p>
                                    <p className="text-xs text-slate-400">Qty: {qty}</p>
                                </div>
                                <p className="text-sm font-bold text-ink-900">{formatPrice(product.price * qty, {decimals: true})}</p>
                            </li>
                        ))}
                    </ul>
                    <dl className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Subtotal
                                ({cart.count} {cart.count === 1 ? "item" : "items"})
                            </dt>
                            <dd className="font-extrabold text-ink-900">{formatPrice(cart.subtotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Delivery Fee</dt>
                            <dd className={`font-bold ${cart.deliveryFee === 0 ? "text-primary-600" : "text-ink-900"}`}>
                                {cart.deliveryFee === 0 ? "Free" : formatPrice(cart.deliveryFee)}
                            </dd>
                        </div>
                        <p className="-mt-1 text-[11px] leading-relaxed text-slate-400">
                            {cart.deliveryFee > 0
                                ? `Set by the seller${cart.deliveryInfo?.fromStores?.length > 1 ? "s" : ""}: ${cart.deliveryInfo?.fromStores?.join(", ")}. Charged once per order, not per item.`
                                : "All sellers in this order offer free delivery."}
                        </p>
                    </dl>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                        <p className="text-base font-extrabold text-ink-900">Total Amount</p>
                        <p className="text-2xl font-extrabold text-primary-600">{formatPrice(cart.total)}</p>
                    </div>
                    <Button type="submit" size="lg" fullWidth className="mt-6" loading={submitting}>
                        {submitting ? "Placing Order…" : "Place Order"}
                    </Button>
                    <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                        <FaLocationDot size={10}/> Orders are confirmed via email & SMS (demo UI)
                    </p>
                </aside>
            </form>
        </div>
    );
}