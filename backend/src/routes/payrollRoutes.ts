import { Router } from 'express';
import {
  generatePayroll,
  getAllPayroll,
  getPayrollById,
  getEmployeePayroll,
  updatePayroll,
  getPayrollStats,
  bulkGeneratePayroll,
} from '../controllers/payrollController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { generatePayrollSchema } from '../utils/validators';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/stats', authorize(UserRole.ADMIN, UserRole.HR), getPayrollStats);
router.post(
  '/generate',
  authorize(UserRole.ADMIN, UserRole.HR),
  validateBody(generatePayrollSchema.shape.body),
  generatePayroll
);
router.post(
  '/bulk-generate',
  authorize(UserRole.ADMIN, UserRole.HR),
  bulkGeneratePayroll
);
router.get('/', authorize(UserRole.ADMIN, UserRole.HR), getAllPayroll);
router.get('/:id', getPayrollById);
router.get('/employee/:id', getEmployeePayroll);
router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.HR),
  updatePayroll
);

export default router;
