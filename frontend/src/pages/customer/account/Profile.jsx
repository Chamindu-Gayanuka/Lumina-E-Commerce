import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaEnvelope, FaPhone, FaShieldHalved, FaUser} from "react-icons/fa6";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import {validate, required, isEmail, isPhone} from "../../../utils/validation";
import {updateProfile} from "../../../services/accountService";
import {useAuth} from "../../../context/AuthContext";
import {useToast} from "../../../context/ToastContext";
import {formatDate} from "../../../utils/format";

export default function Profile() {
    const {user, updateUser} = useAuth();
    const navigate = useNavigate();
    const {notify} = useToast();
    const [form, setForm] = useState({name: "", email: "", phone: ""});
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) setForm({name: user.name || "", email: user.email || "", phone: user.phone || ""});
    }, [user]);

    if (!user) return null;

    const submit = async (e) => {
        e.preventDefault();
        const errs = validate(form, {
            name: [(v) => required(v, "Full name")],
            email: [(v) => required(v, "Email"), isEmail],
            phone: [(v) => required(v, "Phone"), isPhone],
        });
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setSaving(true);
        await updateProfile(user.id, {name: form.name.trim(), phone: form.phone});
        updateUser({name: form.name.trim(), phone: form.phone, avatarLetter: form.name.trim().charAt(0).toUpperCase()});
        setSaving(false);
        notify("Profile updated");
    };

    return (
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">My Profile</h1>
            <p className="mt-1.5 text-sm text-slate-500">Manage your personal information and how Lumina reaches
                you.</p>

            <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
                <form onSubmit={submit} className="lum-card p-6 sm:p-8" noValidate>
                    <h2 className="border-b border-slate-100 pb-4 text-base font-extrabold tracking-tight text-ink-900">Personal
                        Information</h2>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <Input label="Full Name" name="profile-name" icon={FaUser} value={form.name}
                               onChange={(e) => setForm((f) => ({...f, name: e.target.value}))} error={errors.name}/>
                        <Input label="Phone Number" name="profile-phone" icon={FaPhone} placeholder="+94 76 xxx xxxx"
                               value={form.phone} onChange={(e) => setForm((f) => ({...f, phone: e.target.value}))}
                               error={errors.phone}/>
                    </div>
                    <Input
                        className="mt-5 max-w-md"
                        label="Email Address"
                        name="profile-email"
                        icon={FaEnvelope}
                        value={form.email}
                        readOnly
                        hint="Email changes require backend verification (future phase)."
                    />
                    <div className="mt-7 flex justify-end gap-3">
                        <Button variant="secondary" type="button"
                                onClick={() => setForm({name: user.name, email: user.email, phone: user.phone})}>
                            Reset
                        </Button>
                        <Button type="submit" loading={saving}>Save Changes</Button>
                    </div>
                </form>

                <div className="space-y-6">
                    <div className="lum-card p-6 text-center">
            <span
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-extrabold text-primary-700 ring-4 ring-primary-50">
              {user.avatarLetter || user.name.charAt(0)}
            </span>
                        <p className="mt-4 text-lg font-extrabold text-ink-900">{user.name}</p>
                        <p className="text-xs font-semibold text-slate-400">{user.email}</p>
                        <div className="mt-3 flex justify-center gap-2">
                            <Badge tone="teal">{user.memberTier || user.role}</Badge>
                            <Badge tone={user.status === "Active" ? "green" : "slate"}>{user.status}</Badge>
                        </div>
                        <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
                            Member since {formatDate(user.joinedAt)}
                        </p>
                    </div>

                    <div className="lum-card p-6">
                        <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
                            <FaShieldHalved className="text-primary-600"/> Security
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                            Passwords are hashed with bcrypt.js and sessions secured with JWTs once the API phase lands.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4 w-full"
                                onClick={() => navigate("/account/change-password")}>
                            Change Password
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}