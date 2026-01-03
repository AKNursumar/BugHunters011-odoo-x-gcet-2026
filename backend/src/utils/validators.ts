import { z } from 'zod';
import { LeaveType, LeaveStatus, AttendanceStatus, UserRole } from '../types';

// Auth Validators
export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    employeeId: z.string().min(3, 'Employee ID must be at least 3 characters'),
    role: z.nativeEnum(UserRole).optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    joiningDate: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email or Employee ID is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Employee Validators
export const createEmployeeSchema = z.object({
  body: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    employeeId: z.string().min(3),
    role: z.nativeEnum(UserRole).optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    joiningDate: z.string().optional(),
  }),
});

export const updateEmployeeSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.nativeEnum(UserRole).optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    employmentStatus: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    emergencyContact: z.object({
      name: z.string(),
      relationship: z.string(),
      phoneNumber: z.string(),
    }).optional(),
  }),
});

// Department Validators
export const departmentSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Department name must be at least 2 characters'),
    description: z.string().optional(),
    manager: z.string().optional(),
  }),
});

// Leave Validators
export const createLeaveSchema = z.object({
  body: z.object({
    leaveType: z.nativeEnum(LeaveType),
    startDate: z.string(),
    endDate: z.string(),
    duration: z.number().positive(),
    reason: z.string().min(10, 'Reason must be at least 10 characters'),
  }),
});

export const reviewLeaveSchema = z.object({
  body: z.object({
    status: z.nativeEnum(LeaveStatus),
    approverComments: z.string().optional(),
  }),
});

// Attendance Validators
export const checkInSchema = z.object({
  body: z.object({
    location: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const markAttendanceSchema = z.object({
  body: z.object({
    employee: z.string(),
    date: z.string(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    status: z.nativeEnum(AttendanceStatus),
    location: z.string().optional(),
    notes: z.string().optional(),
    overtimeHours: z.number().optional(),
  }),
});

// Payroll Validators
export const generatePayrollSchema = z.object({
  body: z.object({
    employee: z.string(),
    month: z.number().min(1).max(12),
    year: z.number().min(2000),
    basicSalary: z.number().positive(),
    allowances: z.array(z.object({
      type: z.string(),
      amount: z.number(),
    })).optional(),
    deductions: z.array(z.object({
      type: z.string(),
      amount: z.number(),
    })).optional(),
    taxDeduction: z.number().optional(),
  }),
});

// Performance Validators
export const createPerformanceSchema = z.object({
  body: z.object({
    employee: z.string(),
    reviewPeriod: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    rating: z.number().min(1).max(5),
    goals: z.array(z.string()).optional(),
    achievements: z.array(z.string()).optional(),
    areasOfImprovement: z.array(z.string()).optional(),
    comments: z.string().min(10),
    nextReviewDate: z.string().optional(),
  }),
});

// Announcement Validators
export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(5),
    content: z.string().min(10),
    priority: z.string().optional(),
    targetAudience: z.enum(['all', 'department', 'specific']).optional(),
    targetDepartment: z.string().optional(),
    targetEmployees: z.array(z.string()).optional(),
    expiryDate: z.string().optional(),
  }),
});

// Task Validators
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    assignedTo: z.array(z.string()),
    priority: z.string().optional(),
    dueDate: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    description: z.string().min(10).optional(),
    assignedTo: z.array(z.string()).optional(),
    priority: z.string().optional(),
    status: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    dueDate: z.string().optional(),
  }),
});
