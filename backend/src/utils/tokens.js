import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const randomToken = () => crypto.randomBytes(48).toString('hex');
export const sign = (u) => jwt.sign({
    sub: u._id.toString(),
    role: u.role
}, process.env.JWT_SECRET , {expiresIn: '7d'});
export const publicUser = u => {
    if (!u) return null;
    const x = u.toObject ? u.toObject() : {...u};
    for (const k of ['password', 'verifyToken', 'verifyExpires', 'resetToken', 'resetExpires']) delete x[k];
    return x
};