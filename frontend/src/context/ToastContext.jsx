import React, {createContext, useCallback, useContext, useMemo, useRef, useState} from "react";
import {FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes} from "react-icons/fa";

const ToastContext = createContext(null);

const ICONS = {
    success: <FaCheckCircle className="text-emerald-500"/>,
    error: <FaExclamationTriangle className="text-red-500"/>,
    info: <FaInfoCircle className="text-primary-600"/>,
};

export function ToastProvider({children}) {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const notify = useCallback((message, type = "success") => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, {id, message, type}]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

    const dismiss = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

    const value = useMemo(() => ({notify}), [notify]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lift"
                    >
                        <span className="mt-0.5 shrink-0 text-lg">{ICONS[t.type] || ICONS.info}</span>
                        <p className="flex-1 text-sm font-medium text-ink-800">{t.message}</p>
                        <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-ink-800"
                                aria-label="Dismiss">
                            <FaTimes size={12}/>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}