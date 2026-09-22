import store from "../data/store";

const delay = (ms = 160) => new Promise((res) => setTimeout(res, ms));

/* Users (admin) */
export async function listUsers(role) {
    await delay();
    return store.getUsers(role);
}

export async function setUserStatus(id, status) {
    await delay(140);
    return store.updateUser(id, {status});
}

/* Sellers (admin) */
export async function listSellers() {
    await delay();
    return store.getSellers();
}

export async function getSeller(id) {
    await delay(120);
    return store.getSellerById(id);
}

export async function setSellerApproval(id, approvalStatus) {
    await delay(200);
    return store.updateSeller(id, {approvalStatus});
}

export async function updateSellerProfile(id, patch) {
    await delay(220);
    return store.updateSeller(id, patch);
}

/* Categories (admin + shop nav) */
export async function listCategories() {
    await delay(80);
    return store.getCategories();
}

export async function saveCategory(data, id) {
    await delay(180);
    return id ? store.updateCategory(id, data) : store.addCategory(data);
}

export async function deleteCategory(id) {
    await delay(180);
    return store.removeCategory(id);
}

/* Customer profile */
export async function getProfile(userId) {
    await delay(100);
    return store.getUserById(userId);
}

export async function updateProfile(userId, patch) {
    await delay(240);
    return store.updateUser(userId, patch);
}

/* Stats */
export async function getPlatformStats() {
    await delay(200);
    return {
        snapshot: store.platformSnapshot(),
        sales: store.monthlySales(),
        categorySplit: store.categorySplit(),
        activity: store.activity(),
    };
}

export async function getSellerStats(sellerId) {
    await delay(200);
    const products = store.getProducts().filter((p) => p.sellerId === sellerId);
    const orders = store.getOrdersBySeller(sellerId);
    const sales = store.monthlySales();
    const scale = 0.26; // deterministic demo scaling for the seller slice
    return {
        sales: sales.map((m) => ({
            month: m.month,
            revenue: Math.round(m.revenue * scale),
            orders: Math.round(m.orders * scale),
        })),
        topProducts: store.topProducts(),
        snapshot: {
            revenue: Math.round(sales.reduce((s, m) => s + m.revenue, 0) * scale),
            orders: orders.length,
            products: products.length,
            lowStock: products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockLevel ?? 5)).length,
            outOfStock: products.filter((p) => p.stock === 0).length,
        },
    };
}
