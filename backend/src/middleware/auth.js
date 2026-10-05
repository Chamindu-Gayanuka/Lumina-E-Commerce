import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    try {
        const h = req.headers.authorization || '';
        if (!h.startsWith('Bearer ')) throw 0;
        req.user = jwt.verify(h.slice(7), process.env.JWT_SECRET);
        next()
    } catch {
        res.status(401).json({message: 'Authentication required'})
    }
}

export const allow = (...roles) => (req, res, next) =>
    roles.includes(req.user.role) ? next() : res.status(403).json({message: 'Forbidden'});