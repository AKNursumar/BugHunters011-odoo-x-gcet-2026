import { Router } from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadProfilePicture,
  getEmployeeStats,
} from '../controllers/employeeController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { createEmployeeSchema, updateEmployeeSchema } from '../utils/validators';
import { uploadProfilePicture as uploadMiddleware } from '../middleware/uploadMiddleware';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/stats', authorize(UserRole.ADMIN, UserRole.HR), getEmployeeStats);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.HR),
  validateBody(createEmployeeSchema.shape.body),
  createEmployee
);
router.put(
  '/:id',
  validateBody(updateEmployeeSchema.shape.body),
  updateEmployee
);
router.delete('/:id', authorize(UserRole.ADMIN, UserRole.HR), deleteEmployee);
router.post('/:id/upload-avatar', uploadMiddleware, uploadProfilePicture);

export default router;
