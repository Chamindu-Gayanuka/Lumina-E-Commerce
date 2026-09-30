import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaKey, FaCircleCheck} from "react-icons/fa6";
import {AuthShell, BackToLogin} from "../../layouts/AuthShell";
import Button from "../../components/ui/Button";
import {PasswordInput} from "../../components/ui/Input";
import PasswordRules from "../../components/forms/PasswordRules";
import {passwordRules, matches} from "../../utils/validation";
import {resetPassword} from "../../services/authService";
import {useToast} from "../../context/ToastContext";

export default function ResetPassword() {
    const navigate = useNavigate();
    const {notify} = useToast();
    const [form, setForm] = useState({password: "", confirm: ""});
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!passwordRules(form.password).valid) errs.password = "Password does not meet the requirements";
        const match = matches(form.confirm, form.password, "Passwords");
        if (match) errs.confirm = match;
        setErrors(errs);
        if (Object.keys(errs).length) return;
        setSubmitting(true);
        await resetPassword();
        setSubmitting(false);
        setDone(true);
        notify("Password updated - you can sign in now.");
        setTimeout(() => navigate("/login"), 1600);
    };

    return (
        <AuthShell>
            <div className="lum-card p-8 text-center sm:p-10">
                {done ? (
                    <div className="py-8">
            <span
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              <FaCircleCheck/>
            </span>
                        <h1 className="mt-6 text-2xl font-extrabold text-ink-900">Password Reset!</h1>
                        <p className="mt-2 text-sm text-slate-400">Redirecting you to sign in…</p>
                    </div>
                ) : (
                    <>
            <span
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-xl text-primary-600">
              <FaKey/>
            </span>
                        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink-900">Reset Your
                            Password</h1>
                        <p className="mt-3 text-sm text-slate-400">Enter a new password for your account below.</p>

                        <form onSubmit={submit} className="mt-8 space-y-5 text-left" noValidate>
                            <PasswordInput
                                label="New Password"
                                name="new-password"
                                placeholder="••••••••••••••••"
                                value={form.password}
                                onChange={(e) => setForm((f) => ({...f, password: e.target.value}))}
                                error={errors.password}
                                autoComplete="new-password"
                            />
                            <PasswordInput
                                label="Confirm New Password"
                                name="confirm-password"
                                placeholder="••••••••••••••••"
                                value={form.confirm}
                                onChange={(e) => setForm((f) => ({...f, confirm: e.target.value}))}
                                error={errors.confirm}
                                autoComplete="new-password"
                            />
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <PasswordRules value={form.password}/>
                            </div>
                            <Button type="submit" size="lg" fullWidth loading={submitting}>
                                Reset Password
                            </Button>
                        </form>
                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <BackToLogin/>
                        </div>
                    </>
                )}
            </div>
        </AuthShell>
    );
}