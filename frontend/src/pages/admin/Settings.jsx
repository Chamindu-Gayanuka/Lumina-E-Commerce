import React, {useState} from "react";
import Button from "../../components/ui/Button";
import Input, {Select, Textarea} from "../../components/ui/Input";
import {useToast} from "../../context/ToastContext";

export default function AdminSettings() {
    const {notify} = useToast();
    const [general, setGeneral] = useState({
        storeName: "Lumina Marketplace",
        supportEmail: "chamindugayanuka2002@gmail.com",
        currency: "LKR",
        minOrder: "0",
    });
    const [policies, setPolicies] = useState({
        deliveryFee: "450",
        cancellationWindow: "Until dispatch",
        sellerAutoApprove: "false",
    });

    const setG = (k) => (e) => setGeneral((f) => ({...f, [k]: e.target.value}));
    const setP = (k) => (e) => setPolicies((f) => ({
        ...f,
        [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value
    }));

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Platform Settings</h1>
            <p className="mt-1.5 text-sm text-slate-500">Store-wide defaults. In production these persist to a settings
                document in MongoDB.</p>

            <section className="lum-card mt-7 space-y-5 p-6 sm:p-8">
                <h2 className="border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">General</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Marketplace Name" name="set-name" value={general.storeName}
                           onChange={setG("storeName")}/>
                    <Input label="Support Email" name="set-email" type="email" value={general.supportEmail}
                           onChange={setG("supportEmail")}/>
                    <Select label="Currency" name="set-cur" value={general.currency} onChange={setG("currency")}>
                        <option value="LKR">LKR - Sri Lankan Rupee</option>
                        <option value="USD">USD (future)</option>
                    </Select>
                    <Input label="Minimum Order (Rs.)" name="set-min" value={general.minOrder}
                           onChange={setG("minOrder")} inputMode="numeric"/>
                </div>
            </section>

            <section className="lum-card mt-6 space-y-5 p-6 sm:p-8">
                <h2 className="border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">Commerce
                    rules</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Standard Delivery Fee (Rs.)" name="set-fee" value={policies.deliveryFee}
                           onChange={setP("deliveryFee")} inputMode="numeric"
                           hint="Applied once per order when a seller opts to charge - sellers-controlled, not platform-forced."/>
                    <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-200 self-end">
                        <span className="font-bold text-ink-700">Delivery is seller-controlled:</span> each seller
                        chooses free or the
                        standard fee in their Settings. Some orders carry the Rs. 450 fee, some ship free - that's
                        expected.
                    </p>
                </div>
                <Textarea label="Cancellation policy note" name="set-cancel" rows={2}
                          value={policies.cancellationWindow} onChange={setP("cancellationWindow")}/>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600">
                    <input type="checkbox" checked={policies.sellerAutoApprove} onChange={setP("sellerAutoApprove")}
                           className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500/40"/>
                    Auto-approve new seller applications (skip manual review)
                </label>
            </section>

            <div className="mt-6 flex justify-end">
                <Button onClick={() => notify("Settings saved for this demo session")}>Save Changes</Button>
            </div>
        </div>
    );
}