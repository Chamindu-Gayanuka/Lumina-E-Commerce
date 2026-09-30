import React, {useEffect, useState} from "react";
import {FaBell, FaToggleOff, FaToggleOn, FaTruck} from "react-icons/fa6";
import Button from "../../components/ui/Button";
import {useToast} from "../../context/ToastContext";
import {useAuth} from "../../context/AuthContext";
import {getSeller, updateSellerProfile} from "../../services/accountService";
import {DELIVERY_FEE} from "../../utils/constants";

function Toggle({on, onChange, label, desc, icon}) {
    return (
        <div
            className="flex items-start justify-between gap-3 border-b border-slate-100 py-3.5 sm:gap-4 sm:py-4 last:border-0">
            <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3.5">
                {icon && (
                    <span className="mt-0.5 shrink-0 text-base text-slate-400 sm:text-lg">
                        {icon}
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink-900 leading-snug">{label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400 [overflow-wrap:anywhere]">
                        {desc}
                    </p>
                </div>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => onChange(!on)}
                className={`-mr-1 shrink-0 p-1 text-2xl transition-colors ${
                    on ? "text-primary-600" : "text-slate-300 hover:text-slate-400"
                }`}
            >
                {on ? <FaToggleOn/> : <FaToggleOff/>}
            </button>
        </div>
    );
}

export default function SellerSettings() {
    const {notify} = useToast();
    const {user} = useAuth();
    const [deliveryMode, setDeliveryMode] = useState("free"); // free | charge (Rs. 450)
    const [savingDelivery, setSavingDelivery] = useState(false);

    useEffect(() => {
        let alive = true;
        if (!user?.sellerId) return undefined;
        getSeller(user.sellerId)
            .then((sr) => {
                if (alive && sr) setDeliveryMode(sr.deliveryFee > 0 ? "charge" : "free");
            })
            .catch(() => {
            });
        return () => {
            alive = false;
        };
    }, [user?.sellerId]);

    const saveDelivery = async () => {
        if (!user?.sellerId) {
            notify("Seller profile not found for this session.", "error");
            return;
        }
        setSavingDelivery(true);
        try {
            await updateSellerProfile(user.sellerId, {
                deliveryFee: deliveryMode === "charge" ? DELIVERY_FEE : 0,
            });
            notify(
                deliveryMode === "charge"
                    ? `Buyers now see a Rs. ${DELIVERY_FEE} delivery charge on your store & listings.`
                    : "Your store now shows Free delivery everywhere buyers shop."
            );
        } finally {
            setSavingDelivery(false);
        }
    };

    const [prefs, setPrefs] = useState({
        emailOrders: true,
        stockAlerts: true,
        weeklyDigest: false,
        autoAccept: false,
        holiday: false,
    });
    const set = (key) => (v) => setPrefs((p) => ({...p, [key]: v}));

    return (
        <div className="mx-auto w-full max-w-3xl">
            {/* Header */}
            <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                    Settings
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    Notification preferences &amp; store operations for your shop.
                </p>
            </div>

            {/* Notifications */}
            <section className="lum-card mt-6 p-4 sm:mt-7 sm:p-6 md:p-8">
                <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-extrabold tracking-tight text-ink-900 sm:pb-4">
                    <FaBell className="text-primary-600" size={14}/> Notifications
                </h2>
                <div className="mt-1 sm:mt-2">
                    <Toggle
                        on={prefs.emailOrders}
                        onChange={set("emailOrders")}
                        label="Email me on new orders"
                        desc="Instant alert with the shipping details you need."
                        icon="📬"
                    />
                    <Toggle
                        on={prefs.stockAlerts}
                        onChange={set("stockAlerts")}
                        label="Low-stock alerts"
                        desc="Notify when a product reaches its alert level."
                        icon="📦"
                    />
                    <Toggle
                        on={prefs.weeklyDigest}
                        onChange={set("weeklyDigest")}
                        label="Weekly performance digest"
                        desc="Revenue, best sellers and rating changes every Monday."
                        icon="📈"
                    />
                </div>
            </section>

            {/* Store Operations */}
            <section className="lum-card mt-5 p-4 sm:mt-6 sm:p-6 md:p-8">
                <h2 className="border-b border-slate-100 pb-3 text-base font-extrabold tracking-tight text-ink-900 sm:pb-4">
                    Store operations
                </h2>
                <div className="mt-1 sm:mt-2">
                    <Toggle
                        on={prefs.autoAccept}
                        onChange={set("autoAccept")}
                        label="Auto-accept COD orders"
                        desc="Skip manual confirmation — orders jump straight to Processing."
                    />
                    <Toggle
                        on={prefs.holiday}
                        onChange={set("holiday")}
                        label="Holiday mode"
                        desc="Pause the storefront. Buyers see an “on hold” banner on your store page."
                    />
                </div>
            </section>

            {/* Delivery Charges */}
            <section className="lum-card mt-5 p-4 sm:mt-6 sm:p-6 md:p-8">
                <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-extrabold tracking-tight text-ink-900 sm:pb-4">
                    <FaTruck className="text-primary-600" size={14}/> Delivery charges
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    You decide whether buyers pay for delivery. When charged, a flat Rs. {DELIVERY_FEE} is added{" "}
                    <span className="font-bold text-ink-700">once per order</span> containing your products — never
                    stacked per item — and shown in the cart and checkout before payment.
                </p>

                <div
                    role="radiogroup"
                    aria-label="Delivery charges"
                    className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                    {[
                        {
                            key: "free",
                            title: "Free delivery",
                            desc: "Buyers see a “Free delivery” badge on your store and listings — great for conversion.",
                        },
                        {
                            key: "charge",
                            title: `Charge Rs. ${DELIVERY_FEE} per order`,
                            desc: "A flat delivery fee is added once to orders that include your products.",
                        },
                    ].map((opt) => {
                        const active = deliveryMode === opt.key;
                        return (
                            <button
                                key={opt.key}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => setDeliveryMode(opt.key)}
                                className={`rounded-2xl border p-4 text-left transition-colors ${
                                    active
                                        ? "border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                <span className="flex items-center gap-2 text-sm font-bold text-ink-900">
                                    <span
                                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                            active ? "border-primary-600" : "border-slate-300"
                                        }`}
                                    >
                                        {active && (
                                            <span className="h-2 w-2 rounded-full bg-primary-600"/>
                                        )}
                                    </span>
                                    {opt.title}
                                </span>
                                <span className="mt-1.5 block text-xs leading-relaxed text-slate-500">
                                    {opt.desc}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-slate-400">
                        Applies to new carts immediately — already-placed orders are never re-priced.
                    </p>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={saveDelivery}
                        loading={savingDelivery}
                        className="w-full shrink-0 sm:w-auto"
                    >
                        Save policy
                    </Button>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="lum-card mt-5 border-red-100 p-4 sm:mt-6 sm:p-6 md:p-8">
                <h2 className="border-b border-red-100 pb-3 text-base font-extrabold tracking-tight text-red-600 sm:pb-4">
                    Danger zone
                </h2>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-slate-500">
                        Temporarily close your store. Existing orders are fulfilled as usual.
                    </p>
                    <Button
                        variant="dangerSoft"
                        className="w-full shrink-0 sm:w-auto"
                        onClick={() =>
                            notify(
                                "Store pause is enforced by the backend in the next phase.",
                                "info"
                            )
                        }
                    >
                        Close store
                    </Button>
                </div>
            </section>

            {/* Main Save Action */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end">
                <Button
                    className="w-full sm:w-auto"
                    onClick={() => notify("Preferences saved to this browser (demo)")}
                >
                    Save Settings
                </Button>
            </div>
        </div>
    );
}