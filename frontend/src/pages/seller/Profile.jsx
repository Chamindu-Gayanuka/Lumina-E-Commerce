import React, {useEffect, useState} from "react";
import {FaCircleCheck, FaEnvelope, FaPhone, FaStore, FaTrash, FaUpload} from "react-icons/fa6";
import Button from "../../components/ui/Button";
import Input, {Textarea} from "../../components/ui/Input";
import {PageSpinner} from "../../components/ui/Spinner";
import {isPhone, required, validate} from "../../utils/validation";
import {deleteAvatar, getProfile, updateProfile, updateSellerProfile} from "../../services/accountService";
import {useToast} from "../../context/ToastContext";
import {useAuth} from "../../context/AuthContext";
import {formatNumber} from "../../utils/format";

export default function SellerProfile() {
    const {notify} = useToast();
    const {user, updateUser} = useAuth();
    const sellerId = user?._id || user?.id;

    const [seller, setSeller] = useState(null);
    const [form, setForm] = useState({storeName: "", phone: "", address: "", description: ""});
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [avatarSaving, setAvatarSaving] = useState(false);

    const uploadAvatar = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            notify('Please choose a JPG, PNG, or WEBP image.', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            notify('Avatar must be 5 MB or smaller.', 'error');
            return;
        }
        setAvatarSaving(true);
        try {
            const updated = await updateProfile(sellerId, {avatar: file});
            const next = updated?.user || updated;
            const avatarUrl = next?.avatar || seller?.avatar;
            if (!avatarUrl) throw new Error('Avatar URL was not returned by the server');
            setSeller(s => ({
                ...(s || {}),
                avatar: avatarUrl,
                avatarPublicId: next?.avatarPublicId || s?.avatarPublicId || ''
            }));
            try {
                updateUser({avatar: avatarUrl, avatarPublicId: next?.avatarPublicId || ''});
            } catch (sessionError) {
                console.error('Session avatar sync failed:', sessionError);
            }
            notify('Store avatar updated.', 'success');
        } catch (error) {
            console.error('Seller avatar upload failed:', error?.response?.data || error);
            notify(error?.response?.data?.message || 'Unable to upload avatar.', 'error');
        } finally {
            setAvatarSaving(false);
            event.target.value = '';
        }
    };

    const removeAvatar = async () => {
        setAvatarSaving(true);
        try {
            await deleteAvatar();
            setSeller(s => ({...s, avatar: ''}));
            updateUser({avatar: '', avatarPublicId: ''});
            notify('Store avatar removed.', 'success');
        } catch {
            notify('Unable to remove avatar.', 'error');
        } finally {
            setAvatarSaving(false);
        }
    };

    useEffect(() => {
        getProfile().then((response) => {
            const s = response?.user || response;
            setSeller({responseRate: 0, rating: 0, ...s});
            if (s) {
                setForm({
                    storeName: s.storeName || "",
                    phone: s.phone || "",
                    address: s.address || s.businessAddress || "",
                    description: s.description || ""
                });
            }
        });
    }, [sellerId]);

    if (!seller) return <PageSpinner label="Loading store profile…"/>;

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
        await updateSellerProfile(sellerId, {...form, businessAddress: form.address});
        setSeller((s) => ({...s, ...form}));
        setSaving(false);
        notify("Store profile updated");
    };

    return (
        <div>
            {/* Header */}
            <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                    Store Profile
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    This is what buyers see on your public store page.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-7 lg:grid-cols-[1fr_340px]">
                {/* Form Card */}
                <form
                    onSubmit={submit}
                    className="lum-card space-y-5 p-4 sm:p-6 md:p-8"
                    noValidate
                >
                    <Input
                        label="Store Name"
                        name="sp-name"
                        icon={FaStore}
                        value={form.storeName}
                        onChange={set("storeName")}
                        error={errors.storeName}
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Input
                            label="Business Phone"
                            name="sp-phone"
                            icon={FaPhone}
                            value={form.phone}
                            onChange={set("phone")}
                            error={errors.phone}
                        />
                        <Input
                            label="Business Email"
                            name="sp-email"
                            icon={FaEnvelope}
                            value={seller.email}
                            readOnly
                            hint="Contact support to change the login email."
                        />
                    </div>

                    <Textarea
                        label="Business Address"
                        name="sp-address"
                        rows={2}
                        value={form.address}
                        onChange={set("address")}
                        error={errors.address}
                    />

                    <Textarea
                        label="Store Description"
                        name="sp-desc"
                        rows={4}
                        value={form.description}
                        onChange={set("description")}
                        hint="Max 240 characters shown on the store page."
                    />

                    {/* Footer Actions */}
                    <div
                        className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full sm:w-auto"
                            onClick={() => setForm({
                                storeName: seller.storeName || "",
                                phone: seller.phone || "",
                                address: seller.address || "",
                                description: seller.description || ""
                            })}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                            className="w-full sm:w-auto"
                        >
                            Save Profile
                        </Button>
                    </div>
                </form>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    {/* Public Preview Card */}
                    <div className="lum-card p-4 sm:p-6">
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
                            Public preview
                        </h3>
                        <div className="mt-4 flex items-center gap-3.5">
                            <span
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-xl font-extrabold text-white sm:h-14 sm:w-14"
                                style={{
                                    background: `linear-gradient(135deg, ${seller.accent || "#0d9488"}, #134e4a)`,
                                }}
                            >
                                {seller.avatar ? <img src={seller.avatar} alt={form.storeName}
                                                      className="h-full w-full rounded-2xl object-cover"/> : (form.storeName.charAt(0) || "?")}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="mb-2 flex flex-wrap gap-2">
                                    <label
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-primary-700 hover:bg-primary-50">
                                        <FaUpload size={11}/> {avatarSaving ? 'Uploading…' : 'Upload avatar'}
                                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                                               onChange={uploadAvatar} disabled={avatarSaving}/>
                                    </label>
                                    {seller.avatar &&
                                        <button type="button" onClick={removeAvatar} disabled={avatarSaving}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                                            <FaTrash size={11}/> Remove</button>}
                                </div>
                                <p className="font-extrabold text-ink-900 [overflow-wrap:anywhere]">
                                    {form.storeName || "Your store"}
                                </p>
                                <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                    <FaCircleCheck size={11}/> {seller.approvalStatus} seller
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-slate-500 [overflow-wrap:anywhere]">
                            {form.description || "Add a description so shoppers know what makes your store special…"}
                        </p>
                    </div>

                    {/* Performance Metrics Card */}
                    <div className="lum-card p-4 sm:p-6">
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
                            Performance
                        </h3>
                        <dl className="mt-4 grid grid-cols-2 gap-3 text-center sm:gap-4">
                            {[
                                ["Products", formatNumber(seller.productsCount)],
                                ["Orders", `${formatNumber(seller.ordersCompleted)}+`],
                                ["Response", `${seller.responseRate}%`],
                                ["Rating", `${seller.rating}★`],
                            ].map(([l, v]) => (
                                <div key={l} className="rounded-xl bg-slate-50 py-3 px-2">
                                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        {l}
                                    </dt>
                                    <dd className="mt-1 text-base font-extrabold text-ink-900 sm:text-lg">
                                        {v}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}