import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {publicUser} from '../utils/tokens.js';

export const me = async (req, res) => res.json(publicUser(await User.findById(req.user.sub)));
export const updateProfile = async (req, res) => res.json(publicUser(await User.findByIdAndUpdate(req.user.sub, {$set: req.body}, {new: true})));
export const addresses = async (req, res) => res.json((await User.findById(req.user.sub)).addresses || []);
export const addAddress = async (req, res) => {
    const u = await User.findById(req.user.sub);
    if (req.body.isDefault) u.addresses.forEach(a => a.isDefault = false);
    u.addresses.push(req.body);
    await u.save();
    res.status(201).json(u.addresses.at(-1));
};
export const updateAddress = async (req, res) => {
    const u = await User.findById(req.user.sub), a = u.addresses.id(req.params.addressId);
    if (!a) return res.status(404).json({message: 'Address not found'});
    Object.assign(a, req.body);
    await u.save();
    res.json(a)
};
export const removeAddress = async (req, res) => {
    const u = await User.findById(req.user.sub);
    u.addresses.pull(req.params.addressId);
    await u.save();
    res.status(204).end()
};
export const changePassword = async (req, res) => {
    const u = await User.findById(req.user.sub);
    if (!await bcrypt.compare(req.body.currentPassword, u.password)) return res.status(400).json({message: 'Current password is incorrect'});
    u.password = await bcrypt.hash(req.body.newPassword, 12);
    await u.save();
    res.json({updated: true})
};