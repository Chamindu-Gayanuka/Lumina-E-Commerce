import api from './api';

const d = async p => (await p).data;
export const listUsers = role => d(api.get('/users', {params: role ? {role} : {}}));
export const setUserStatus = (id, status) => d(api.patch(`/users/${id}/status`, {status}));
export const listSellers = () => d(api.get('/sellers'));
export const getSeller = id => d(api.get(`/sellers/${id}`));
export const setSellerApproval = (id, approvalStatus) => d(api.patch(`/sellers/${id}/review`, {approvalStatus}));
export const updateSellerProfile = (id, patch) => d(api.patch(`/users/${id}`, patch));
export const reviewSellerApplication = (id, decision, reason) => d(api.patch(`/sellers/${id}/review`, {
    approvalStatus: decision,
    rejectionReason: reason
}));
export const getUserDetail = id => d(api.get(`/users/${id}`));
export const getAdminSellerDetail = id => d(api.get(`/sellers/${id}`));
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