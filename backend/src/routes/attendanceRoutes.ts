import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getAttendanceRecords,
  getTodaysAttendance,
  markAttendance,
  getAttendanceReport,
  getEmployeeAttendance,
} from '../controllers/attendanceController';
import { protect, authorize } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { checkInSchema, markAttendanceSchema } from '../utils/validators';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(protect);

router.post('/check-in', validateBody(checkInSchema.shape.body), checkIn);
router.post('/check-out', checkOut);
router.get('/today', authorize(UserRole.ADMIN, UserRole.HR), getTodaysAttendance);
router.get('/report', authorize(UserRole.ADMIN, UserRole.HR), getAttendanceReport);
router.post(
  '/mark',
  authorize(UserRole.ADMIN, UserRole.HR),
  validateBody(markAttendanceSchema.shape.body),
  markAttendance
);
router.get('/:employeeId', getEmployeeAttendance);
router.get('/', getAttendanceRecords);

export default router;
