import React, {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {FaEnvelope} from "react-icons/fa6";
import {AuthSplit} from "../../layouts/AuthShell";
import Button from "../../components/ui/Button";
import Input, {Checkbox, PasswordInput} from "../../components/ui/Input";
import {ValidationSummary} from "../../components/ui/States";
import {required, isEmail, validate, hasErrors} from "../../utils/validation";
import {useAuth, dashboardPathByRole} from "../../context/AuthContext";


export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const {login} = useAuth();
    const [form, setForm] = useState({email: "", password: ""});
    const [remember, setRemember] = useState(true);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const set = (key) => (e) => setForm((f) => ({...f, [key]: e.target.value}));

    const finish = (user) => {
        const dest = location.state?.from || dashboardPathByRole[user.role] || "/";
        navigate(dest, {replace: true});
    };

    const submit = async (e) => {
        e.preventDefault();
        setFormError("");
        const errs = validate(form, {
            email: [(v) => required(v, "Email"), isEmail],
            password: [(v) => required(v, "Password")],
        });
        setErrors(errs);
        if (hasErrors(errs)) return;
        setSubmitting(true);
        try {
            const user = await login(form.email, form.password);
            finish(user);
        } catch (err) {
            setFormError(err.message || "Login failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthSplit
            image="/images/auth-bag.jpg"
            badge="login"
            title="Welcome Back"
            subtitle="Sign in to continue your premium shopping experience with Lumina"
        >
            <h1 className="text-center text-2xl font-extrabold tracking-tight text-ink-900">Login to Your Account</h1>
            <p className="mt-2 text-center text-sm text-slate-400">Please enter your details to sign in.</p>

            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
                {formError && <ValidationSummary errors={{_: formError}}/>}
                <Input label="Email Address" name="email" type="email" icon={FaEnvelope} placeholder="jane@example.com"
                       value={form.email} onChange={set("email")} error={errors.email} autoComplete="email"/>
                <PasswordInput label="Password" name="password" placeholder="••••••••••••••••" value={form.password}
                               onChange={set("password")} error={errors.password} autoComplete="current-password"/>
                <div className="flex items-center justify-between">
                    <Checkbox label="Remember me" name="remember" checked={remember}
                              onChange={(e) => setRemember(e.target.checked)}/>
                    <Link to="/forgot-password" className="text-sm font-bold text-primary-700 hover:text-primary-800">
                        Forgot Password?
                    </Link>
                </div>
                <Button type="submit" size="lg" fullWidth loading={submitting}>
                    Login
                </Button>
            </form>

            <div className="mt-6 space-y-2 text-center text-sm">
                <p className="text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="font-bold text-primary-700 hover:underline">
                        Register
                    </Link>
                </p>
                <p className="text-slate-400">
                    <Link to="/become-seller"
                          className="font-semibold text-slate-500 hover:text-primary-700 hover:underline">
                        Register as a Seller instead
                    </Link>
                </p>
            </div>
        </AuthSplit>
    );
}