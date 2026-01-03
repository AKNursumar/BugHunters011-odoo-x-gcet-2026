import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema } from '../utils/validators';
import { authLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema.shape.body), register);
router.post('/login', authLimiter, validateBody(loginSchema.shape.body), login);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getCurrentUser);

export default router;
