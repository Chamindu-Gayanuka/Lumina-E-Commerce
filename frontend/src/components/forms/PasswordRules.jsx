import React from "react";
import {FaCircleCheck, FaCircle} from "react-icons/fa6";
import {passwordRules} from "../../utils/validation";

const RULES = [
    {key: "length", label: "At least 8 characters"},
    {key: "number", label: "Include a number"},
    {key: "symbol", label: "Include a symbol"},
];

/** Live policy checklist used on Reset / Change password screens (wireframe). */
export default function PasswordRules({value = ""}) {
    const state = passwordRules(value);
    return (
        <ul className="space-y-1.5" aria-label="Password requirements">
            {RULES.map((r) => (
                <li key={r.key}
                    className={`flex items-center gap-2 text-sm font-semibold ${state[r.key] ? "text-primary-700" : "text-slate-400"}`}>
                    {state[r.key] ? <FaCircleCheck size={14}/> : <FaCircle size={12} className="text-slate-300"/>}
                    {r.label}
                </li>
            ))}
        </ul>
    );
}