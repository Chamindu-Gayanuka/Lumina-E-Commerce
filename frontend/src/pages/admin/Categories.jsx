import React, {useCallback, useEffect, useState} from "react";
import {FaPencil, FaPlus, FaTags, FaTrashCan} from "react-icons/fa6";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input, {Textarea, Select} from "../../components/ui/Input";
import Modal, {ConfirmDialog} from "../../components/ui/Modal";
import {EmptyState} from "../../components/ui/States";
import {PageSpinner} from "../../components/ui/Spinner";
import CategoryIcon from "../../components/ui/CategoryIcon";
import {validate, required} from "../../utils/validation";
import {
    listCategories,
    saveCategory,
    deleteCategory,
} from "../../services/accountService";
import {useToast} from "../../context/ToastContext";

const ICON_KEYS = [
    {key: "laptop", label: "Laptop / Electronics"},
    {key: "shirt", label: "T-shirt / Fashion"},
    {key: "couch", label: "Couch / Home"},
    {key: "beauty", label: "Spray / Beauty"},
    {key: "toys", label: "Puzzle / Toys"},
    {key: "grocery", label: "Basket / Groceries"},
];

const EMPTY = {
    name: "",
    description: "",
    iconKey: "laptop",
    status: "Active",
};

export default function AdminCategories() {
    const {notify} = useToast();
    const [categories, setCategories] = useState(null);
    const [editing, setEditing] = useState(null); // object | "new"
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [deleting, setDeleting] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => listCategories().then(setCategories), []);

    useEffect(() => {
        load();
    }, [load]);

    const openNew = () => {
        setForm(EMPTY);
        setErrors({});
        setEditing("new");
    };

    const openEdit = (c) => {
        setForm({
            name: c.name,
            description: c.description,
            iconKey: c.iconKey,
            status: c.status,
        });
        setErrors({});
        setEditing(c);
    };

    const save = async (e) => {
        e.preventDefault();
        const errs = validate(form, {
            name: [
                (v) => required(v, "Name"),
                (v) => (v.length <= 24 ? "" : "Keep names under 24 characters"),
            ],
        });
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setSaving(true);
        try {
            await saveCategory(
                form,
                editing === "new" ? undefined : editing.id
            );
            notify(editing === "new" ? "Category added" : "Category updated");
            setEditing(null);
            load();
        } catch (err) {
            setErrors({name: err.message});
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        setDeleteError("");
        try {
            await deleteCategory(deleting.id);
            notify(`Deleted “${deleting.name}”`, "info");
            setDeleting(null);
            load();
        } catch (err) {
            setDeleteError(err.message);
        }
    };

    const toggleStatus = async (c) => {
        await saveCategory(
            {status: c.status === "Active" ? "Inactive" : "Active"},
            c.id
        );
        notify(
            `${c.name} marked ${c.status === "Active" ? "inactive" : "active"}`,
            "info"
        );
        load();
    };

    if (!categories) {
        return <PageSpinner label="Loading categories…"/>;
    }

    return (
        <div className="w-full min-w-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                        Category Management
                    </h1>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                        Shoppers browse by these buckets - inactive ones
                        disappear from menus but keep their data.
                    </p>
                </div>
                <Button
                    icon={<FaPlus size={11}/>}
                    onClick={openNew}
                    className="w-full shrink-0 sm:w-auto"
                >
                    Add Category
                </Button>
            </div>

            {categories.length === 0 ? (
                <div className="mt-8">
                    <EmptyState
                        icon={<FaTags size={30}/>}
                        title="No categories yet"
                        message="Create your first category to organise the catalogue."
                        action={{label: "Add category", onClick: openNew}}
                    />
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-2 xl:grid-cols-3">
                    {categories.map((c) => (
                        <article
                            key={c.id}
                            className="lum-card flex h-full flex-col p-4 sm:p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                                    <CategoryIcon
                                        iconKey={c.iconKey}
                                        size={20}
                                    />
                                </span>
                                <div className="flex min-w-0 flex-col items-end gap-2">
                                    <Badge
                                        tone={
                                            c.status === "Active"
                                                ? "green"
                                                : "slate"
                                        }
                                        uppercase
                                    >
                                        {c.status}
                                    </Badge>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {c.productCount} products
                                    </span>
                                </div>
                            </div>

                            <h3 className="mt-4 text-base font-extrabold tracking-tight text-ink-900 [overflow-wrap:anywhere]">
                                {c.name}
                            </h3>
                            <p className="mt-1 min-h-10 flex-1 text-xs leading-relaxed text-slate-500 [overflow-wrap:anywhere]">
                                {c.description || "No description yet."}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    icon={<FaPencil size={10}/>}
                                    onClick={() => openEdit(c)}
                                    className="min-w-0"
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toggleStatus(c)}
                                    className="min-w-0"
                                >
                                    {c.status === "Active"
                                        ? "Deactivate"
                                        : "Activate"}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleting(c);
                                        setDeleteError("");
                                    }}
                                    className="ml-auto rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                                    aria-label={`Delete ${c.name}`}
                                >
                                    <FaTrashCan size={13}/>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Add / edit modal */}
            <Modal
                open={Boolean(editing)}
                onClose={() => !saving && setEditing(null)}
                title={
                    editing === "new"
                        ? "Add Category"
                        : `Edit “${editing?.name || ""}”`
                }
                subtitle="Changes apply to the storefront navigation instantly (demo)."
            >
                <form onSubmit={save} className="space-y-5" noValidate>
                    <Input
                        label="Name"
                        name="cat-name"
                        placeholder="e.g. Outdoor Gear"
                        value={form.name}
                        onChange={(e) =>
                            setForm((f) => ({...f, name: e.target.value}))
                        }
                        error={errors.name}
                    />
                    <Textarea
                        label="Description"
                        name="cat-desc"
                        rows={2}
                        placeholder="One sentence shown under the category on shop pages."
                        value={form.description}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                description: e.target.value,
                            }))
                        }
                    />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Select
                            label="Icon"
                            name="cat-icon"
                            value={form.iconKey}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    iconKey: e.target.value,
                                }))
                            }
                        >
                            {ICON_KEYS.map((i) => (
                                <option key={i.key} value={i.key}>
                                    {i.label}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label="Status"
                            name="cat-status"
                            value={form.status}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    status: e.target.value,
                                }))
                            }
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Select>
                    </div>

                    {/* Live icon preview */}
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                        <span
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                            <CategoryIcon iconKey={form.iconKey} size={18}/>
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-ink-900">
                                {form.name || "Category name"}
                            </p>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                Preview
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full sm:w-auto"
                            disabled={saving}
                            onClick={() => setEditing(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                            className="w-full sm:w-auto"
                        >
                            {editing === "new"
                                ? "Create Category"
                                : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                open={Boolean(deleting)}
                onClose={() => setDeleting(null)}
                onConfirm={remove}
                title={`Delete “${deleting?.name}”?`}
                confirmLabel="Delete category"
                message={
                    deleteError ||
                    "Categories can only be deleted when no products use them. Deleting is permanent in the future API phase."
                }
            />
        </div>
    );
}