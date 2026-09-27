import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaEnvelope, FaPhone} from "react-icons/fa6";
import {AuthSplit} from "../../layouts/AuthShell";
import Button from "../../components/ui/Button";
import Input, {Checkbox, PasswordInput} from "../../components/ui/Input";
import {ValidationSummary} from "../../components/ui/States";
import {
    required,
    isEmail,
    isPhone,
    minLength,
    matches,
    passwordRules,
    validate,
    hasErrors
} from "../../utils/validation";
import {useAuth} from "../../context/AuthContext";
import {useToast} from "../../context/ToastContext";

export default function Register() {
    const navigate = useNavigate();
    const {registerCustomer} = useAuth();
    const {notify} = useToast();
    const [form, setForm] = useState({name: "", email: "", phone: "", password: "", confirm: "", terms: false});
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const set = (key) => (e) => setForm((f) => ({
        ...f,
        [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value
    }));

    const submit = async (e) => {
        e.preventDefault();
        setFormError("");
        const errs = validate(form, {
            name: [(v) => required(v, "Full name"), (v) => minLength(v, 2, "Full name")],
            email: [(v) => required(v, "Email"), isEmail],
            phone: [(v) => required(v, "Phone number"), isPhone],
            password: [(v) => required(v, "Password"), (v) => (passwordRules(v).valid ? "" : "Min 8 chars incl. a number & a symbol")],
            confirm: [(v) => matches(v, form.password, "Passwords")],
        });
        if (!form.terms) errs.terms = "You must accept the Terms & Privacy Policy";
        setErrors(errs);
        if (hasErrors(errs)) return;

        setSubmitting(true);
        try {
            await registerCustomer({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone,
                password: form.password
            });
            notify("Welcome to Lumina! Your account is ready.");
            navigate("/");
        } catch (err) {
            setFormError(err.message || "Registration failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthSplit
            image="/images/auth-bag.jpg"
            badge="registration"
            title="Join Lumina"
            subtitle="Create an account and start shopping today for premium curated products."
        >
            <h1 className="text-center text-2xl font-extrabold tracking-tight text-ink-900">Create Your Account</h1>
            <p className="mt-2 text-center text-sm text-slate-400">Join our community of premium shoppers.</p>

            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
                {formError && <ValidationSummary errors={{_: formError}}/>}
                <Input label="Full Name" name="name" placeholder="John Doe" value={form.name} onChange={set("name")}
                       error={errors.name}/>
                <Input label="Email Address" name="email" type="email" icon={FaEnvelope} placeholder="jane@example.com"
                       value={form.email} onChange={set("email")} error={errors.email}/>
                <Input label="Phone Number" name="phone" icon={FaPhone} placeholder="+94 76 xxx xxxx" value={form.phone}
                       onChange={set("phone")} error={errors.phone} inputMode="tel"/>
                <PasswordInput label="Password" name="password" placeholder="••••••••••••••••" value={form.password}
                               onChange={set("password")} error={errors.password}/>
                <PasswordInput label="Confirm Password" name="confirm" placeholder="••••••••••••••••"
                               value={form.confirm} onChange={set("confirm")} error={errors.confirm}/>

                <div>
                    <Checkbox
                        name="terms"
                        checked={form.terms}
                        onChange={set("terms")}
                        label={
                            <span className="text-sm leading-relaxed text-slate-500">
                I agree to the{" "}
                                <Link to="/"
                                      className="font-semibold text-primary-700 hover:underline">Terms &amp; Conditions</Link> and{" "}
                                <Link to="/"
                                      className="font-semibold text-primary-700 hover:underline">Privacy Policy</Link>
              </span>
                        }
                    />
                    {errors.terms && <p className="ml-7 mt-1 text-xs font-medium text-red-600">{errors.terms}</p>}
                </div>

                <Button type="submit" size="lg" fullWidth loading={submitting}>
                    Register
                </Button>
            </form>

            <div className="mt-6 space-y-2 text-center text-sm">
                <p className="text-slate-400">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-primary-700 hover:underline">
                        Login
                    </Link>
                </p>
                <p className="text-slate-400">
                    Want to sell instead?{" "}
                    <Link to="/become-seller"
                          className="font-semibold text-slate-500 underline-offset-2 hover:text-primary-700 hover:underline">
                        Register as a Seller
                    </Link>
                </p>
            </div>
        </AuthSplit>
    );
}