import React, {useState} from "react";
import {Link} from "react-router-dom";
import Button from "../ui/Button";
import {useToast} from "../../context/ToastContext";

const COLS = [
    {
        title: "About",
        links: [
            {label: "Our Story", to: "/"},
            {label: "Careers", to: "/"},
            {label: "Press", to: "/"},
            {label: "Blog", to: "/"},
        ],
    },
    {
        title: "Help",
        links: [
            {label: "Customer Service", to: "/"},
            {label: "Returns", to: "/"},
            {label: "Shipping Info", to: "/"},
            {label: "Privacy Policy", to: "/"},
        ],
    },
];

export default function Footer() {
    const [email, setEmail] = useState("");
    const {notify} = useToast();

    const subscribe = (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            notify("Enter a valid email address", "error");
            return;
        }
        notify("Subscribed! Exclusive offers are on their way.");
        setEmail("");
    };

    return (
        <footer className="mt-20 bg-ink-900 text-slate-300">
            <div className="lum-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
                <div>
                    <p className="text-3xl font-extrabold tracking-tight text-teal-700">Lumina</p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                        Your one-stop destination for premium products. Quality, style, and convenience in
                        every order.
                    </p>
                </div>

                {COLS.map((col) => (
                    <nav key={col.title} aria-label={col.title}>
                        <h3 className="text-base font-bold text-white">{col.title}</h3>
                        <ul className="mt-4 space-y-3">
                            {col.links.map((l) => (
                                <li key={l.label}>
                                    <Link to={l.to}
                                          className="text-sm text-slate-400 transition-colors hover:text-primary-300">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}

                <div>
                    <h3 className="text-base font-bold text-white">Stay Connected</h3>
                    <p className="mt-4 text-sm text-slate-400">Subscribe for exclusive offers</p>
                    <form onSubmit={subscribe}
                          className="mt-3 flex max-w-sm overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10 focus-within:bg-cyan-700">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            aria-label="Email address"
                            className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                        <Button type="submit" className="h-auto rounded-none px-5 py-3">
                            Join
                        </Button>
                    </form>
                </div>
            </div>

            <div className="border-t border-white/10">
                <p className="lum-container py-6 text-center text-sm text-slate-500">
                    2026 Lumina Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}