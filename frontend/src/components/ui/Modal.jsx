import React, {useEffect} from "react";
import {FaTimes} from "react-icons/fa";
import Button from "./Button";

const SIZES = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({open, onClose, title, subtitle, size = "md", footer, children}) {
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === "Escape" && onClose && onClose();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog"
             aria-modal="true">
            <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true"/>
            <div
                className={`relative w-full ${SIZES[size] || SIZES.md} animate-[fadeIn_.15s_ease-out] rounded-t-2xl bg-white shadow-lift sm:rounded-2xl`}>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-ink-900">{title}</h3>
                        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} aria-label="Close dialog"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink-900">
                        <FaTimes size={14}/>
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
                {footer && <div
                    className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">{footer}</div>}
            </div>
        </div>
    );
}

export function ConfirmDialog({
                                  open,
                                  onClose,
                                  onConfirm,
                                  title = "Are you sure?",
                                  message,
                                  confirmLabel = "Confirm",
                                  danger = true,
                                  loading = false,
                                  children,
                              }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            {message && <p className="text-sm leading-relaxed text-slate-600">{message}</p>}
            {children}
        </Modal>
    );
}