import React, {useEffect, useRef, useState} from "react";
import {FaCheck, FaPen, FaXmark, FaRegEnvelope, FaPhone} from "react-icons/fa6";
import Modal from "../../components/ui/Modal";
import {SellerStatusBadge} from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import {formatDate} from "../../utils/format";
import {reviewSellerApplication} from "../../services/accountService";

const MIN_REASON = 20;
const MAX_REASON = 500;

export default function SellerReviewModal({open, seller, onClose, onDecided, initialDecision = "approve"}) {
    const [decision, setDecision] = useState(initialDecision);
    const reasonRef = useRef(null);
    const [reason, setReason] = useState("");
    const [touched, setTouched] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (open) {
            setDecision(initialDecision === "reject" ? "reject" : "approve");
            setReason("");
            setTouched(false);
        }
    }, [open, initialDecision]);

    // when Reject is picked, bring the writing area into view (it sits below the fold on phones)
    useEffect(() => {
        if (open && decision === "reject" && reasonRef.current) {
            const t = setTimeout(() => {
                reasonRef.current.scrollIntoView({block: "center", behavior: "smooth"});
                reasonRef.current.focus({preventScroll: true});
            }, 60);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [open, decision]);

    if (!seller) return null;

    const reasonError =
        decision === "reject" && reason.trim().length < MIN_REASON
            ? `Give the seller at least ${MIN_REASON} characters (${reason.trim().length} so far) so they know exactly what to fix.`
            : null;

    const checks = [
        ["Identity Verified (ID)", seller.verification?.identity],
        ["Business Reg. (BR)", seller.verification?.businessReg],
        ["Bank Account", seller.verification?.bankAccount],
        ["Product Images", seller.verification?.productImages],
    ];
    const initials = seller.storeName.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");

    const submit = async () => {
        setTouched(true);
        if (reasonError) return;
        setBusy(true);
        try {
            await reviewSellerApplication(seller.id, decision === "approve" ? "Approved" : "Rejected", reason.trim() || null);
            onDecided?.(decision === "approve" ? "Approved" : "Rejected");
            onClose();
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="lg"
            title={
                <span className="flex items-center gap-3">
          Review Seller Application <SellerStatusBadge status={seller.approvalStatus}/>
        </span>
            }
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={busy}>
                        Cancel
                    </Button>
                    <Button
                        variant={decision === "approve" ? "primary" : "danger"}
                        onClick={submit}
                        loading={busy}
                        disabled={touched && Boolean(reasonError)}
                    >
                        {decision === "approve" ? "Approve Seller" : "Reject Seller"}
                    </Button>
                </>
            }
        >
            <div className="space-y-5">
                {/* Applicant */}
                <div className="flex items-start gap-4">
          <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold text-white shadow-sm"
              style={{background: seller.accent}}>
            {initials}
          </span>
                    <div className="min-w-0 text-sm">
                        <p className="text-base font-extrabold text-ink-900">{seller.ownerName}</p>
                        <p className="mt-0.5 font-semibold text-slate-600">{seller.businessName}</p>
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <FaRegEnvelope size={11} className="text-slate-400"/> {seller.ownerEmail}
              </span>
                            <span className="inline-flex items-center gap-1.5">
                <FaPhone size={11} className="text-slate-400"/> {seller.phone}
              </span>
                        </p>
                        <p className="mt-1 text-xs text-slate-400">Applied: {formatDate(seller.appliedAt || seller.joinedAt)}</p>
                    </div>
                </div>

                {/* Business details */}
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <h4 className="text-sm font-extrabold text-ink-900">Business Details</h4>
                    <dl className="mt-3 space-y-2 text-sm">
                        {[
                            ["Business Name", seller.businessName],
                            ["Tax / BR No.", seller.taxId],
                            ["Address", seller.address],
                            ["Description", seller.description],
                            ["Business Phone", seller.phone],
                        ].map(([k, v]) => (
                            <div key={k} className="grid gap-1 sm:grid-cols-[130px_1fr]">
                                <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 sm:pt-0.5 sm:text-right sm:normal-case sm:tracking-normal">
                                    {k}
                                </dt>
                                <dd className="leading-relaxed text-slate-700">{v}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Verification chips */}
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {checks.map(([label, ok]) => (
                        <span key={label}
                              className={`inline-flex items-center gap-1.5 text-xs font-bold ${ok ? "text-emerald-600" : "text-red-500"}`}>
              <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white ${ok ? "bg-emerald-500" : "bg-red-400"}`}>
                {ok ? <FaCheck size={8}/> : <FaXmark size={8}/>}
              </span>
                            {label}
            </span>
                    ))}
                </div>

                {/* Decision cards */}
                <div className="grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Decision">
                    {[
                        {
                            key: "approve",
                            title: "Approve Seller",
                            icon: <FaPen size={14}/>,
                            desc: "The store goes live instantly and their Active products appear on the marketplace."
                        },
                        {
                            key: "reject",
                            title: "Reject Seller",
                            icon: <FaXmark size={14}/>,
                            desc: "Rejecting this application will notify the seller with your decision and reason."
                        },
                    ].map((opt) => {
                        const active = decision === opt.key;
                        const reject = opt.key === "reject";
                        return (
                            <button
                                key={opt.key}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => setDecision(opt.key)}
                                className={`rounded-2xl border p-4 text-center transition-colors ${
                                    active
                                        ? reject
                                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                                            : "border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20"
                                        : "border-slate-200 hover:border-slate-300"
                                }`}
                            >
                <span
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${reject ? "bg-red-100 text-red-500" : "bg-slate-100 text-ink-700"}`}>
                  {opt.icon}
                </span>
                                <span className="mt-2 block text-sm font-extrabold text-ink-900">{opt.title}</span>
                                <span className="mt-1 block text-xs leading-relaxed text-slate-500">{opt.desc}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Rejection reason */}
                {decision === "reject" && (
                    <div>
                        <label htmlFor="reject-reason"
                               className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Reason for rejection
                        </label>
                        <textarea
                            id="reject-reason"
                            ref={reasonRef}
                            value={reason}
                            onChange={(e) => setReason(e.target.value.slice(0, MAX_REASON))}
                            onBlur={() => setTouched(true)}
                            rows={3}
                            placeholder="e.g. Business registration document is unreadable - please re-upload a clear scan of the BR certificate."
                            className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                                touched && reasonError ? "border-red-300 ring-2 ring-red-200" : "border-slate-200 focus:border-primary-400 focus:ring-primary-500/20"
                            }`}
                        />
                        <div className="mt-1 flex items-center justify-between">
                            <p className={`text-xs font-semibold ${touched && reasonError ? "text-red-500" : "text-slate-400"}`}>
                                {touched && reasonError ? reasonError : "Shown to the seller in their rejection notice."}
                            </p>
                            <p className="text-xs tabular-nums text-slate-400">
                                {reason.length} / {MAX_REASON}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}