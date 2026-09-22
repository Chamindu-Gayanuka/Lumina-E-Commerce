export const required = (value, label = "This field") =>
    value === undefined || value === null || String(value).trim() === ""
        ? `${label} is required`
        : "";

export const isEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim())
        ? ""
        : "Enter a valid email address";

export const isPhone = (value) => {
    const v = String(value || "").replace(/[\s()-]/g, "");
    // Sri Lankan formats: +94 7X XXXX XXXX or 07X XXXX XXXX
    return /^(\+94|0094|0)7\d{8}$/.test(v) ? "" : "Enter a valid Sri Lankan mobile number";
};

export const isPostalCode = (value) =>
    /^\d{5}$/.test(String(value || "").trim()) ? "" : "Postal code must be 5 digits";

export const minLength = (value, len, label = "This field") =>
    String(value || "").length >= len ? "" : `${label} must be at least ${len} characters`;

export const matches = (a, b, label = "Values") => (a === b ? "" : `${label} do not match`);

/** Password policy checklist (Reset/Change password screens). */
export function passwordRules(value = "") {
    return {
        length: value.length >= 8,
        number: /\d/.test(value),
        symbol: /[^A-Za-z0-9]/.test(value),
        valid: value.length >= 8 && /\d/.test(value) && /[^A-Za-z0-9]/.test(value),
    };
}

export const requiredAmount = (value, label = "Price") => {
    const n = Number(value);
    if (String(value).trim() === "") return `${label} is required`;
    return Number.isFinite(n) && n > 0 ? "" : `${label} must be greater than 0`;
};

export const requiredInteger = (value, label = "Value", min = 0) => {
    const n = Number(value);
    if (String(value).trim() === "") return `${label} is required`;
    if (!Number.isInteger(n) || n < min) return `${label} must be a whole number ≥ ${min}`;
    return "";
};

/** Collect { field: message } errors from a rules map. */
export function validate(values, rules) {
    const errors = {};
    Object.entries(rules).forEach(([field, fns]) => {
        for (const fn of fns) {
            const msg = typeof fn === "function" ? fn(values[field], field) : "";
            if (msg) {
                errors[field] = msg;
                break;
            }
        }
    });
    return errors;
}

export const hasErrors = (errors) => Object.keys(errors || {}).length > 0;
