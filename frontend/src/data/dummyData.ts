// Type definitions only - All data is now fetched from MongoDB API
// This file exists only for type compatibility with existing components

export interface User {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: 'employee' | 'hr' | 'admin';
  avatar: string;
  department: string;
  designation: string;
  joiningDate: string;
  phone: string;
  address: string;
  salary: {
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
  };
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'half-day' | 'leave' | 'half_day';
  workHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'paid' | 'sick' | 'unpaid' | 'casual' | 'vacation';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComment?: string;
  appliedOn: string;
}

export interface Activity {
  id: string;
  type: 'attendance' | 'leave' | 'payroll' | 'profile';
  message: string;
  timestamp: string;
}

// Empty arrays - components should load data from MongoDB API
export const employees: User[] = [];
export const attendanceRecords: AttendanceRecord[] = [];
export const leaveRequests: LeaveRequest[] = [];
export const recentActivities: Activity[] = [];

export const dashboardMetrics = {
  totalEmployees: 0,
  presentToday: 0,
  onLeave: 0,
  pendingLeaves: 0,
  averageAttendance: 0,
  totalDepartments: 0,
};

export const monthlyAttendance: Array<{ month: string; present: number; absent: number; leave: number }> = [];
export const salaryDistribution: Array<{ name: string; value: number }> = [];
export const departmentData: Array<{ name: string; count: number; color: string }> = [];
