import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import {mail} from '../utils/mailer.js';

const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const orderStatusEmail = (order, recipient) => mail(recipient.email, `Lumina order ${order.status}`, `Order status updated`, `<p>Hi <strong>${recipient.name}</strong>,</p><p>Order <strong>${order._id}</strong> is now <strong>${order.status}</strong>.</p><p>Payment method: ${order.paymentMethod}</p>`, `Hi ${recipient.name},\n\nOrder ${order._id} is now ${order.status}.\nPayment method: ${order.paymentMethod}.`).catch(console.error);

export async function create(req, res) {
    const customer = await (await import('../models/User.js')).default.findById(req.user.sub).select('emailVerified');
    if (!customer?.emailVerified) return res.status(403).json({message: 'Please verify your email before placing an order'});
    const {items = [], deliveryAddress = req.body.address, deliveryFee = 0} = req.body;
    const paymentMethod = ['COD', 'Cash on Delivery'].includes(req.body.paymentMethod) ? 'COD' : req.body.paymentMethod || 'COD';
    if (!Array.isArray(items) || !items.length) return res.status(400).json({message: 'Order must contain at least one item'});
    const normalized = items.map(i => ({...i, qty: Number(i.qty ?? i.quantity ?? 0)}));
    const ps = await Product.find({_id: {$in: normalized.map(i => i.productId)}, status: 'Active'});
    const m = new Map(ps.map(p => [p._id.toString(), p]));
    for (const i of normalized) {
        const p = m.get(String(i.productId));
        if (!p) return res.status(409).json({message: `Product ${i.productId} is unavailable`});
        if (!Number.isInteger(i.qty) || i.qty < 1) return res.status(400).json({message: 'Each item quantity must be a positive integer'});
        if (p.stock < i.qty) return res.status(409).json({message: `Only ${p.stock} item(s) remain for ${p.name}`});
    }
    const lines = normalized.map(i => {
        const p = m.get(i.productId);
        return {...i, name: p.name, price: p.price, sellerId: p.sellerId}
    }), subtotal = lines.reduce((s, i) => s + i.price * i.qty, 0);
    for (const i of lines) await Product.updateOne({_id: i.productId}, {$inc: {stock: -i.qty, soldCount: i.qty}});
    const sellerIds = [...new Set(lines.map(i => String(i.sellerId)).filter(Boolean))];
    const sellerUsers = await User.find({_id: {$in: sellerIds}}).select('sellerSettings email name');
    const initialStatus = sellerUsers.length && sellerUsers.every(s => s.sellerSettings?.autoAccept) ? 'Processing' : 'Pending';
    const created = await Order.create({
        customerId: req.user.sub,
        items: lines,
        deliveryAddress,
        deliveryFee,
        paymentMethod,
        subtotal,
        totalAmount: subtotal + deliveryFee,
        status: initialStatus
    });
    const customerUser = await User.findById(req.user.sub).select('name email');
    const sellers = sellerUsers;
    if (customerUser) orderStatusEmail(created, customerUser, 'customer');
    sellers.forEach(seller => orderStatusEmail(created, seller, 'seller'));
    res.status(201).json(created);
}

export const mine = async (req, res) => res.json(await Order.find({customerId: req.user.sub}).sort({createdAt: -1}));
export const sellerOrders = async (req, res) => {
    const sellerId = new mongoose.Types.ObjectId(req.user.sub);
    const orders = await Order.find({'items.sellerId': sellerId}).sort({createdAt: -1});
    res.json(orders)
};
export const one = async (req, res) => {
    const {id} = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({message: 'Valid order ID is required'});
    const filter = req.user.role === 'Administrator' ? {_id: id} : req.user.role === 'Seller' ? {
        _id: id,
        'items.sellerId': new mongoose.Types.ObjectId(req.user.sub)
    } : {_id: id, customerId: req.user.sub};
    const o = await Order.findOne(filter);
    o ? res.json(o) : res.status(404).json({message: 'Order not found'});
};
export const all = async (req, res) => res.json(await Order.find().sort({createdAt: -1}));
export const status = async (req, res) => {
    if (!validStatuses.includes(req.body.status)) return res.status(400).json({message: `Invalid status. Use: ${validStatuses.join(', ')}`});
    const filter = req.user.role === 'Seller' ? {
        _id: req.params.id,
        'items.sellerId': new mongoose.Types.ObjectId(req.user.sub)
    } : {_id: req.params.id};
    const previous = await Order.findOne(filter);
    if (!previous) return res.status(404).json({message: 'Order not found'});
    const update = {status: req.body.status};
    if (req.body.status === 'Delivered') update.paymentStatus = 'Paid';
    const order = await Order.findByIdAndUpdate(req.params.id, update, {new: true});
    const [customer, sellers] = await Promise.all([User.findById(order.customerId).select('name email'), User.find({_id: {$in: [...new Set(order.items.map(i => String(i.sellerId)))]}}).select('name email')]);
    if (customer) orderStatusEmail(order, customer, 'customer');
    sellers.forEach(seller => orderStatusEmail(order, seller, 'seller'));
    res.json(order);
};

export async function cancel(req, res) {
    const o = await Order.findOne({_id: req.params.id, customerId: req.user.sub});
    if (!o) return res.status(404).json({message: 'Order not found'});
    if (!['Pending', 'Processing'].includes(o.status)) return res.status(409).json({message: 'Cannot cancel order'});
    o.status = 'Cancelled';
    o.cancellationReason = req.body.reason;
    for (const i of o.items) await Product.updateOne({_id: i.productId}, {$inc: {stock: i.qty, soldCount: -i.qty}});
    res.json(await o.save());
}