import api from './api';

const d = async p => (await p).data;
export const listUsers = async role => (await api.get('/users', {params: role ? {role} : {}})).data.map(u => ({
    ...u,
    id: u.id || u._id
}));
export const setUserStatus = (id, status) => d(api.patch(`/users/${id}/status`, {status}));
export const listSellers = async () => (await api.get('/sellers')).data.map(s => ({
    ...s,
    id: s.id || s._id,
    storeName: s.storeName || s.name || 'Unnamed seller',
    businessName: s.businessName || s.storeName || s.name || 'Unnamed seller',
    ownerName: s.ownerName || s.name || '',
    ownerEmail: s.ownerEmail || s.email || '',
    accountStatus: s.accountStatus || s.status || 'Inactive'
}));
export const getSeller = async id => {
    if (id) {
        try {
            return await d(api.get(`/public/sellers/${id}`));
        } catch (e) {
            if (e.response?.status !== 401 && e.response?.status !== 403) throw e;
        }
    }
    return null;
};
export const getSellerAdmin = async id => {
    const data = await d(api.get(`/sellers/${id}`));
    return {
        ...data,
        seller: {
            ...data.seller,
            id: data.seller?.id || data.seller?._id,
            storeName: data.seller?.storeName || data.seller?.name || 'Unnamed seller'
        },
        products: (data.products || []).map(p => ({...p, id: p.id || p._id}))
    };
};
export const setSellerApproval = (id, approvalStatus) => d(api.patch(`/sellers/${id}/review`, {approvalStatus}));
export const updateSellerProfile = (id, patch) => d(api.patch(`/users/${id}`, patch));
export const reviewSellerApplication = (id, decision, reason) => d(api.patch(`/sellers/${id}/review`, {
    approvalStatus: decision,
    rejectionReason: reason
}));
export const getUserDetail = async id => {
    const data = await d(api.get(`/users/${id}`));
    return {
        ...data,
        user: data.user ? {...data.user, id: data.user.id || data.user._id} : data.user,
        orders: (data.orders || []).map(o => ({...o, id: o.id || o._id}))
    };
};
export const getAdminSellerDetail = async id => {
    const data = await d(api.get(`/sellers/${id}`));
    return {
        ...data,
        seller: data.seller ? {
            ...data.seller,
            id: data.seller.id || data.seller._id,
            storeName: data.seller.storeName || data.seller.name || 'Unnamed seller'
        } : data.seller,
        products: (data.products || []).map(p => ({...p, id: p.id || p._id}))
    };
};
export const listCategories = () => d(api.get('/categories'));
export const saveCategory = (data, id) => d(id ? api.patch(`/categories/${id}`, data) : api.post('/categories', data));
export const deleteCategory = id => d(api.delete(`/categories/${id}`));
export const getProfile = () => d(api.get('/auth/me'));
export const updateProfile = (id, data) => {
    const f = new FormData();
    Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null && k !== 'avatar') f.append(k, v)
    });
    if (data.avatar instanceof File) f.append('avatar', data.avatar);
    return d(api.patch('/account/profile', f))
};
export const deleteAvatar = () => d(api.delete('/account/profile/avatar'));
export const getAddresses = () => d(api.get('/account/addresses'));
export const addAddress = x => d(api.post('/account/addresses', x));
export const updateAddress = (id, x) => d(api.patch(`/account/addresses/${id}`, x));
export const deleteAddress = id => d(api.delete(`/account/addresses/${id}`));
export const getPlatformStats = () => d(api.get('/admin/stats'));
export const getSellerStats = () => d(api.get('/seller/stats'));