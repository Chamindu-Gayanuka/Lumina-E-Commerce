import api from './api';

const normalizeOrder = o => {
    if (!o) return o;
    const a = o.deliveryAddress || {};
    return {
        ...o,
        id: o._id || o.id,
        orderNumber: o.orderNumber || String(o._id || o.id).slice(-8).toUpperCase(),
        placedAt: o.placedAt || o.createdAt,
        address: o.address || {
            name: a.fullName || a.name,
            line1: a.address || a.addressLine1,
            city: a.city,
            district: a.district,
            postalCode: a.postalCode,
            phone: a.phone
        },
        payment: o.payment || {method: o.paymentMethod || 'COD', status: o.paymentStatus || 'Pending'},
        items: (o.items || []).map(i => ({...i, qty: i.qty ?? i.quantity ?? 1}))
    }
}

export async function getMyOrders() {
    return (await api.get('/orders/mine')).data.map(normalizeOrder)
}

export async function getOrder(id) {
    if (!id) throw new Error('Order ID is required');
    return normalizeOrder((await api.get(`/orders/${id}`)).data)
}

export async function placeOrder(payload) {
    return normalizeOrder((await api.post('/orders', payload)).data)
}

export async function cancelOrder(id, reason) {
    return normalizeOrder((await api.patch(`/orders/${id}/cancel`, {reason})).data)
}

export async function getAllOrders() {
    return (await api.get('/admin/orders')).data.map(normalizeOrder)
}

export async function getSellerOrders() {
    return (await api.get('/seller/orders')).data.map(normalizeOrder)
}

export async function updateOrderStatus(id, status) {
    return normalizeOrder((await api.patch(`/orders/${id}/status`, {status})).data)
}