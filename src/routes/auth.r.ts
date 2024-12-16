import express from 'express';
const router = express.Router();

import authController from '../controllers/auth.c';

router.post('/login', authController.login);

export default router;