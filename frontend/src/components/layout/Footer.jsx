import React, {useState} from "react";
import {Link} from "react-router-dom";
import {FaInstagram, FaTwitter, FaYoutube} from "react-icons/fa";
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
                    <p className="text-3xl font-extrabold tracking-tight text-primary-400">Lumina</p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                        Your one-stop destination for premium products. Quality, style, and convenience in
                        every order.
                    </p>
                    <div className="mt-5 flex gap-2.5">
                        {[FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <a
                                key={i}
                                href="https://example.com"
                                rel="noreferrer"
                                target="_blank"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-primary-600 hover:text-white"
                                aria-label="Social link"
                            >
                                <Icon size={14}/>
                            </a>
                        ))}
                    </div>
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
                          className="mt-3 flex max-w-sm overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10 focus-within:ring-primary-400">
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
                    <p className="mt-4 text-xs text-slate-500">
                        Payments supported: Cash on Delivery (v1). Online payments coming soon.
                    </p>
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