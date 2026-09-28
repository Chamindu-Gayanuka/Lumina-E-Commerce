import React, {useEffect, useState} from "react";
import {FaLocationDot, FaPencil, FaPlus, FaStar, FaTrashCan} from "react-icons/fa6";
import Button from "../../../components/ui/Button";
import Input, {Checkbox, Select} from "../../../components/ui/Input";
import Modal, {ConfirmDialog} from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import {EmptyState} from "../../../components/ui/States";
import {DISTRICTS} from "../../../utils/constants";
import {validate, required, isPostalCode, isPhone} from "../../../utils/validation";
import {useToast} from "../../../context/ToastContext";

const STORAGE_KEY = "lumina.addresses";

const SEED = [
    {
        id: "addr-home",
        label: "Home",
        name: "John Doe",
        line1: "123 Premium Lane, Suite 4B",
        city: "Manhattan",
        district: "Colombo",
        postalCode: "00300",
        phone: "+94 76 123 4567",
        isDefault: true,
    },
    {
        id: "addr-office",
        label: "Office",
        name: "John Doe",
        line1: "Level 6, East Tower, World Trade Center",
        city: "Colombo",
        district: "Colombo",
        postalCode: "01500",
        phone: "+94 11 200 4500",
        isDefault: false,
    },
];

const EMPTY = {label: "", name: "", line1: "", city: "", district: "", postalCode: "", phone: "", isDefault: false};

/** Client-side address book — the future API will persist per user. */
export default function Addresses() {
    const {notify} = useToast();
    const [list, setList] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || SEED;
        } catch {
            return SEED;
        }
    });
    const [editing, setEditing] = useState(null); // object | "new" | null
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }, [list]);

    const openNew = () => {
        setForm(EMPTY);
        setErrors({});
        setEditing("new");
    };
    const openEdit = (addr) => {
        setForm({...addr});
        setErrors({});
        setEditing(addr.id);
    };

    const save = (e) => {
        e.preventDefault();
        const errs = validate(form, {
            label: [(v) => required(v, "Label")],
            name: [(v) => required(v, "Recipient name")],
            line1: [(v) => required(v, "Address")],
            city: [(v) => required(v, "City")],
            district: [(v) => required(v, "District")],
            postalCode: [(v) => required(v, "Postal code"), isPostalCode],
            phone: [(v) => required(v, "Phone"), isPhone],
        });
        setErrors(errs);
        if (Object.keys(errs).length) return;

        const id = editing === "new" ? `addr-${Date.now().toString(36)}` : editing;
        setList((prev) => {
            let next = editing === "new" ? [...prev, {...form, id}] : prev.map((a) => (a.id === editing ? {
                ...form,
                id
            } : a));
            if (form.isDefault) next = next.map((a) => ({...a, isDefault: a.id === id}));
            if (next.length === 1) next = next.map((a) => ({...a, isDefault: true}));
            return next;
        });
        setEditing(null);
        notify("Address saved");
    };

    const remove = (id) => {
        setList((prev) => {
            const next = prev.filter((a) => a.id !== id);
            if (next.length && !next.some((a) => a.isDefault)) next[0] = {...next[0], isDefault: true};
            return next;
        });
        setDeleting(null);
        notify("Address removed", "info");
    };

    const setDefault = (id) => {
        setList((prev) => prev.map((a) => ({...a, isDefault: a.id === id})));
        notify("Default address updated");
    };

    const set = (key) => (e) => setForm((f) => ({
        ...f,
        [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value
    }));

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Addresses</h1>
                    <p className="mt-1.5 text-sm text-slate-500">Save delivery addresses to check out faster on
                        Lumina.</p>
                </div>
                <Button icon={<FaPlus size={11}/>} onClick={openNew}>Add Address</Button>
            </div>

            {list.length === 0 ? (
                <div className="mt-8">
                    <EmptyState
                        icon={<FaLocationDot size={34}/>}
                        title="No saved addresses"
                        message="Add a delivery address now and it will be waiting for you at checkout."
                        action={{label: "Add your first address", onClick: openNew}}
                    />
                </div>
            ) : (
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    {list.map((addr) => (
                        <div key={addr.id}
                             className={`lum-card flex flex-col p-6 ${addr.isDefault ? "ring-2 ring-primary-200" : ""}`}>
                            <div className="flex items-start justify-between gap-3">
                                <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-ink-900">
                                    <FaLocationDot className="text-primary-600" size={14}/> {addr.label}
                                    {addr.isDefault && <Badge tone="teal">Default</Badge>}
                                </p>
                                {!addr.isDefault && (
                                    <button type="button" onClick={() => setDefault(addr.id)}
                                            className="text-xs font-bold text-slate-400 hover:text-primary-700">
                                        <FaStar size={10} className="mr-1"/> Set default
                                    </button>
                                )}
                            </div>
                            <div className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                                <p className="font-bold text-ink-900">{addr.name}</p>
                                <p>{addr.line1}</p>
                                <p>{addr.city}, {addr.district} {addr.postalCode}</p>
                                <p className="mt-1 text-xs">{addr.phone}</p>
                            </div>
                            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                                <Button size="sm" variant="secondary" icon={<FaPencil size={10}/>}
                                        onClick={() => openEdit(addr)}>Edit</Button>
                                <Button size="sm" variant="dangerSoft" icon={<FaTrashCan size={10}/>}
                                        onClick={() => setDeleting(addr)}>Remove</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal open={Boolean(editing)} onClose={() => setEditing(null)}
                   title={editing === "new" ? "Add Address" : "Edit Address"}
                   subtitle="Stored locally for this demo session." size="md">
                <form onSubmit={save} className="space-y-4" noValidate>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="Label" name="addr-label" placeholder="Home / Office" value={form.label}
                               onChange={set("label")} error={errors.label}/>
                        <Input label="Recipient Name" name="addr-name" value={form.name} onChange={set("name")}
                               error={errors.name}/>
                    </div>
                    <Input label="Street Address" name="addr-line" placeholder="No, Street, Apartment, City"
                           value={form.line1} onChange={set("line1")} error={errors.line1}/>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Input label="City" name="addr-city" value={form.city} onChange={set("city")}
                               error={errors.city}/>
                        <Select label="District" name="addr-district" value={form.district} onChange={set("district")}
                                error={errors.district}>
                            <option value="">Select</option>
                            {DISTRICTS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </Select>
                        <Input label="Postal Code" name="addr-postal" maxLength={5} value={form.postalCode}
                               onChange={set("postalCode")} error={errors.postalCode}/>
                    </div>
                    <Input label="Phone Number" name="addr-phone" placeholder="+94 76 xxx xxxx" value={form.phone}
                           onChange={set("phone")} error={errors.phone}/>
                    <Checkbox label="Use as my default delivery address" name="addr-default" checked={form.isDefault}
                              onChange={set("isDefault")}/>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" type="button" onClick={() => setEditing(null)}>Cancel</Button>
                        <Button type="submit">Save Address</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                open={Boolean(deleting)}
                onClose={() => setDeleting(null)}
                onConfirm={() => remove(deleting.id)}
                title="Remove this address?"
                confirmLabel="Remove"
                message={`${deleting?.label || "This address"} will be deleted from your address book.`}
            />
        </div>
    );
}