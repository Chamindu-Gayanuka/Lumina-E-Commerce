import store from "../data/store";

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

export async function login(email, password) {
    await delay();
    const user = store.findUserByEmail(email);
    if (!user || user.password !== password) {
        const err = new Error("Invalid email or password. Try a demo account below.");
        err.code = "INVALID_CREDENTIALS";
        throw err;
    }
    if (user.status === "Suspended") {
        const err = new Error("This account is suspended. Please contact support.");
        err.code = "ACCOUNT_SUSPENDED";
        throw err;
    }
    const seller = user.sellerId ? store.getSellers().find((s) => s.id === user.sellerId) : null;
    const {password: _pw, ...safe} = user;
    /* Fake token — decodable shape only. Do NOT trust this for authorization. */
    const token = `demo-jwt.${btoa(JSON.stringify({sub: safe.id, role: safe.role}))}.mock`;
    return {user: {...safe, seller}, token};
}

export async function registerCustomer(data) {
    await delay();
    if (store.findUserByEmail(data.email)) {
        const err = new Error("An account with this email already exists.");
        err.code = "EMAIL_TAKEN";
        throw err;
    }
    const user = store.registerUser({...data, role: "Customer"});
    const token = `demo-jwt.${btoa(JSON.stringify({sub: user.id, role: "Customer"}))}.mock`;
    return {user, token};
}

export async function registerSeller(data) {
    await delay();
    if (store.findUserByEmail(data.email)) {
        const err = new Error("An account with this email already exists.");
        err.code = "EMAIL_TAKEN";
        throw err;
    }
    return {applicationId: `app-${Date.now().toString(36)}`, status: "Pending"};
}

export async function requestPasswordReset(email) {
    await delay();
    /* Always resolve — never leak which emails exist. */
    return {sent: true, email};
}

export async function resetPassword() {
    await delay();
    return {updated: true};
}
