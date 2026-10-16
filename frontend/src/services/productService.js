import api from './api';

export function sortProducts(list, sort = 'newest') {
    const a = [...list];
    return a.sort((x, y) => sort === 'price-asc' ? x.price - y.price : sort === 'price-desc' ? y.price - x.price : sort === 'rating' ? y.rating - x.rating : sort === 'popular' ? y.soldCount - x.soldCount : new Date(y.createdAt) - new Date(x.createdAt))
}

const normalize = p => ({
    ...p,
    stock: Number(p.stock ?? p.quantity ?? p.inventory ?? 0),
    _id: p._id || p.id,
    id: p.id || p._id,
    seller: p.seller || ((p.sellerId && typeof p.sellerId === 'object') ? {
        ...p.sellerId,
        id: p.sellerId.id || p.sellerId._id,
        rating: p.sellerId.rating ?? p.rating ?? 0
    } : null)
});

export async function listProducts(query = {}) {
    const params = {...query};
    if (Array.isArray(params.categories)) params.categories = params.categories.join(',');
    const x = (await api.get('/products', {params})).data;
    return {...x, items: x.items.map(normalize)}
}

export async function getProduct(id) {
    return normalize((await api.get(`/products/${id}`)).data)
}

export async function getRelatedProducts(product, limit = 4) {
    return (await api.get('/products', {
        params: {
            category: product.category,
            perPage: limit + 1
        }
    })).data.items.filter(x => x._id !== product._id).slice(0, limit)
}

export async function getFeaturedProducts(limit = 4) {
    return (await api.get('/products', {params: {featured: true, perPage: limit}})).data.items.map(normalize)
}

export async function getPopularProducts(limit = 4) {
    return (await api.get('/products', {params: {sort: 'popular', perPage: limit}})).data.items.map(normalize)
}

export async function getSellerProducts(sellerId) {
    return (await api.get('/products', {params: {sellerId, includeAll: true, perPage: 100}})).data.items.map(normalize)
}

export async function saveProduct(data, id) {
    return (await (id ? api.put(`/products/${id}`, data) : api.post('/products', data))).data
}

export async function deleteProduct(id) {
    await api.delete(`/products/${id}`);
    return true
}

export async function toggleProductStatus(id, status) {
    return (await api.put(`/products/${id}`, {status})).data
}

export async function updateStock(id, quantity) {
    return (await api.patch(`/inventory/${id}`, {quantity})).data
}

export async function getInventory(params = {}) {
    const rows = (await api.get('/inventory', {params})).data;
    return rows.map(product => ({
        productId: product._id,
        product: {
            ...product,
            sellerId: typeof product.sellerId === 'object' ? product.sellerId?._id : product.sellerId
        },
        seller: product.sellerId && typeof product.sellerId === 'object' ? product.sellerId : null,
        quantity: Number(product.stock || 0),
        reservedQuantity: 0,
        lastUpdated: product.updatedAt
    }));
}

export async function getProductReviews(id) {
    return (await api.get(`/products/${id}/reviews`)).data.map(r => ({
        ...r,
        user: typeof r.userId === 'object' ? (r.userId?.name || 'Customer') : (r.user || 'Customer'),
        avatar: typeof r.userId === 'object' ? (r.userId?.avatar || '') : (r.avatar || ''),
        userId: typeof r.userId === 'object' ? r.userId?._id : r.userId
    }));
}

export async function submitProductReview(id, payload) {
    return (await api.post(`/products/${id}/reviews`, payload)).data
}

export async function isVerifiedPurchase() {
    return true
}