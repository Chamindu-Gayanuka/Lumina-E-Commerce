import React from "react";
import {FaCheck} from "react-icons/fa";

const STEPS = [
    {key: "cart", label: "Cart"},
    {key: "checkout", label: "Checkout"},
    {key: "confirmation", label: "Confirmation"},
];

/** Three-step progress bar exactly as in the checkout / confirmation wireframes. */
export default function CheckoutStepper({current = 1, allDone = false}) {
    return (
        <ol className="mx-auto flex w-full max-w-2xl items-start">
            {STEPS.map((step, idx) => {
                const done = allDone || idx < current;
                const active = !allDone && idx === current;
                return (
                    <li key={step.key} className="relative flex flex-1 flex-col items-center">
                        {idx < STEPS.length - 1 && (
                            <span
                                aria-hidden="true"
                                className={`absolute left-1/2 top-5 h-0.5 w-full ${done ? "bg-primary-600" : "bg-slate-300"}`}
                            />
                        )}
                        <span
                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                                done
                                    ? "bg-primary-600 text-white"
                                    : active
                                        ? "bg-primary-600 text-white ring-4 ring-primary-100"
                                        : "border-2 border-slate-300 bg-white text-ink-900"
                            }`}
                        >
              {done ? <FaCheck size={14}/> : idx + 1}
            </span>
                        <span
                            className={`mt-2 text-[11px] font-bold uppercase tracking-widest sm:text-xs ${
                                done || active ? "text-primary-700" : "text-slate-400"
                            }`}
                        >
              {step.label}
            </span>
                    </li>
                );
            })}
        </ol>
    );
}