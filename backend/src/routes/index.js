import {Router} from "express";

const r = Router();
r.get('/health', (req, res) =>
    res.json({
        ok: true,
        service: 'lumina-backend'
    }));

export default r;