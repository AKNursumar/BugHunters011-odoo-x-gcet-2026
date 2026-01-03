import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User/Employee Role Types
export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

// Employment Status
export enum EmploymentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated'
}

// Leave Types
export enum LeaveType {
  SICK = 'sick',
  CASUAL = 'casual',
  VACATION = 'vacation',
  UNPAID = 'unpaid',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity'
}

// Leave Status
export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

// Attendance Status
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
  REMOTE = 'remote'
}

// Payroll Status
export enum PayrollStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  PAID = 'paid',
  FAILED = 'failed'
}

// Task Priority
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Task Status
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Announcement Priority
export enum AnnouncementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// User Interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  employeeId: string;
  role: UserRole;
  department?: Types.ObjectId | string;
  position?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  joiningDate: Date;
  employmentStatus: EmploymentStatus;
  profilePicture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
  };
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Department Interface
export interface IDepartment extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  manager?: Types.ObjectId | string;
  employeeCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Leave Interface
export interface ILeave extends Document {
  _id: Types.ObjectId;
  employee: Types.ObjectId | string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  status: LeaveStatus;
  approver?: Types.ObjectId | string;
  approverComments?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Attendance Interface
export interface IAttendance extends Document {
  _id: Types.ObjectId;
  employee: Types.ObjectId | string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: AttendanceStatus;
  location?: string;
  notes?: string;
  overtimeHours?: number;
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Payroll Interface
export interface IPayroll extends Document {
  _id: Types.ObjectId;
  employee: Types.ObjectId | string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: {
    type: string;
    amount: number;
  }[];
  deductions: {
    type: string;
    amount: number;
  }[];
  grossSalary: number;
  taxDeduction: number;
  netSalary: number;
  paymentDate?: Date;
  status: PayrollStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Performance Review Interface
export interface IPerformance extends Document {
  _id: Types.ObjectId;
  employee: Types.ObjectId | string;
  reviewer: Types.ObjectId | string;
  reviewPeriod: {
    startDate: Date;
    endDate: Date;
  };
  rating: number;
  goals: string[];
  achievements: string[];
  areasOfImprovement: string[];
  comments: string;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Announcement Interface
export interface IAnnouncement extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: Types.ObjectId | string;
  priority: AnnouncementPriority;
  targetAudience: 'all' | 'department' | 'specific';
  targetDepartment?: Types.ObjectId | string;
  targetEmployees?: (Types.ObjectId | string)[];
  attachments?: string[];
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Task Interface
export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  assignedTo: (Types.ObjectId | string)[];
  createdBy: Types.ObjectId | string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  progress: number;
  attachments?: string[];
  comments?: {
    user: Types.ObjectId | string;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Leave Balance Interface
export interface ILeaveBalance extends Document {
  _id: Types.ObjectId;
  employee: Types.ObjectId | string;
  year: number;
  leaveType: LeaveType;
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
  createdAt: Date;
  updatedAt: Date;
}

// Express Request with User
export interface AuthRequest extends Request {
  user?: {
    id: string | Types.ObjectId;
    email: string;
    role: UserRole;
    employeeId: string;
  };
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// JWT Payload
export interface JwtPayload {
  id: string | Types.ObjectId;
  email: string;
  role: UserRole;
  employeeId: string;
}

// Query Filters
export interface QueryFilters {
  search?: string;
  department?: string;
  role?: UserRole;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
