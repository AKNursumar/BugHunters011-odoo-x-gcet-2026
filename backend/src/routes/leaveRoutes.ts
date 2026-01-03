import { Router } from 'express';
import {
  applyLeave,
  getAllLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave,
  getLeaveBalance,
  getLeaveCalendar,
} from '../controllers/leaveController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { createLeaveSchema, reviewLeaveSchema } from '../utils/validators';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/calendar', getLeaveCalendar);
router.get('/balance/:employeeId?', getLeaveBalance);
router.get('/', getAllLeaves);
router.get('/:id', getLeaveById);
router.post('/', validateBody(createLeaveSchema.shape.body), applyLeave);
router.patch(
  '/:id/approve',
  authorize(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER),
  validateBody(reviewLeaveSchema.shape.body),
  approveLeave
);
router.patch(
  '/:id/reject',
  authorize(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER),
  validateBody(reviewLeaveSchema.shape.body),
  rejectLeave
);

export default router;
