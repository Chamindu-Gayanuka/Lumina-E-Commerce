import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";

export default function SearchBar({
                                      value,
                                      defaultValue = "",
                                      onChange,
                                      onSubmit,
                                      placeholder = "Search…",
                                      className = ""
                                  }) {
    const [inner, setInner] = useState(defaultValue);
    const controlled = value !== undefined;
    const current = controlled ? value : inner;
    const set = (v) => {
        if (!controlled) setInner(v);
        if (onChange) onChange(v);
    };
    return (
        <form
            role="search"
            className={`relative ${className}`}
            onSubmit={(e) => {
                e.preventDefault();
                if (onSubmit) onSubmit(current.trim());
            }}
        >
            <input
                type="search"
                value={current}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="lum-input h-11 pl-10 pr-11"
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <FaSearch size={13}/>
      </span>
            <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-700"
            >
                <FaSearch size={13}/>
            </button>
        </form>
    );
}