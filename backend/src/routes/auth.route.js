import { log } from 'console';
import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
const router = express.Router();

router.get('/test', (req, res) => {
    log('Auth route is working');
    res.status(200).json({
        status: 200,
        message: 'Auth route is working',
    });
});

router.post('/signup', (req, res) => signup(req, res));
router.post('/login', (req, res) => login(req, res));
router.post('/logout', (req, res) => logout(req, res));

export default router;