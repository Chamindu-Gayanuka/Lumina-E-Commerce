import React, {useEffect, useState} from "react";
import {FaCircleCheck, FaEnvelope, FaPhone, FaStore} from "react-icons/fa6";
import Button from "../../components/ui/Button";
import Input, {Textarea} from "../../components/ui/Input";
import {validate, required, isPhone} from "../../utils/validation";
import {getSeller, updateSellerProfile} from "../../services/accountService";
import {useToast} from "../../context/ToastContext";
import {useAuth} from "../../context/AuthContext";
import {formatNumber} from "../../utils/format";

export default function SellerProfile() {
    const {notify} = useToast();
    const {user} = useAuth();
    const sellerId = user?.sellerId || "s1";
    const [seller, setSeller] = useState(null);
    const [form, setForm] = useState({storeName: "", phone: "", address: "", description: ""});
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getSeller(sellerId).then((s) => {
            setSeller(s);
            if (s) setForm({storeName: s.storeName, phone: s.phone, address: s.address, description: s.description});
        });
    }, [sellerId]);

    if (!seller) return null;

    const set = (key) => (e) => setForm((f) => ({...f, [key]: e.target.value}));

    const submit = async (e) => {
        e.preventDefault();
        const errs = validate(form, {
            storeName: [(v) => required(v, "Store name")],
            phone: [(v) => required(v, "Phone"), isPhone],
            address: [(v) => required(v, "Business address")],
        });
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setSaving(true);
        await updateSellerProfile(sellerId, form);
        setSeller((s) => ({...s, ...form}));
        setSaving(false);
        notify("Store profile updated");
    };

    return (
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Store Profile</h1>
            <p className="mt-1.5 text-sm text-slate-500">This is what buyers see on your public store page.</p>

            <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
                <form onSubmit={submit} className="lum-card space-y-5 p-6 sm:p-8" noValidate>
                    <Input label="Store Name" name="sp-name" icon={FaStore} value={form.storeName}
                           onChange={set("storeName")} error={errors.storeName}/>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Input label="Business Phone" name="sp-phone" icon={FaPhone} value={form.phone}
                               onChange={set("phone")} error={errors.phone}/>
                        <Input label="Business Email" name="sp-email" icon={FaEnvelope} value={seller.email} readOnly
                               hint="Contact support to change the login email."/>
                    </div>
                    <Textarea label="Business Address" name="sp-address" rows={2} value={form.address}
                              onChange={set("address")} error={errors.address}/>
                    <Textarea label="Store Description" name="sp-desc" rows={4} value={form.description}
                              onChange={set("description")} hint="Max 240 characters shown on the store page."/>
                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                        <Button type="button" variant="secondary" onClick={() => setForm({
                            storeName: seller.storeName,
                            phone: seller.phone,
                            address: seller.address,
                            description: seller.description
                        })}>
                            Reset
                        </Button>
                        <Button type="submit" loading={saving}>Save Profile</Button>
                    </div>
                </form>

                <div className="space-y-6">
                    <div className="lum-card p-6">
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Public
                            preview</h3>
                        <div className="mt-4 flex items-center gap-3.5">
              <span
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-xl font-extrabold text-white">
                {form.storeName.charAt(0) || "?"}
              </span>
                            <div>
                                <p className="font-extrabold text-ink-900">{form.storeName || "Your store"}</p>
                                <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                    <FaCircleCheck size={11}/> {seller.approvalStatus} seller
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-slate-500">
                            {form.description || "Add a description so shoppers know what makes your store special…"}
                        </p>
                    </div>

                    <div className="lum-card p-6">
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Performance</h3>
                        <dl className="mt-4 grid grid-cols-2 gap-4 text-center">
                            {[
                                ["Products", formatNumber(seller.productsCount)],
                                ["Orders", `${formatNumber(seller.ordersCompleted)}+`],
                                ["Response", `${seller.responseRate}%`],
                                ["Rating", `${seller.rating}★`],
                            ].map(([l, v]) => (
                                <div key={l} className="rounded-xl bg-slate-50 py-3">
                                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{l}</dt>
                                    <dd className="mt-1 text-lg font-extrabold text-ink-900">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}