import {Router} from "express";
import * as a from "../controllers/auth.js";

const r = Router();
r.get('/health', (req, res) =>
    res.json({
        ok: true,
        service: 'lumina-backend'
    }));
r.post('/auth/register', a.register);
r.post('/auth/login', a.login);
r.get('/auth/verify-email', a.verify);

export default r;