export const NEXT_STATUSES = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
};

export const allowedNext = (status) => NEXT_STATUSES[status] || [];
export const canSellerCancel = (status) => ["Pending", "Processing"].includes(status);
