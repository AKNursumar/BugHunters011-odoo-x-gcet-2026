import Leave from '../models/Leave';
import LeaveBalance from '../models/LeaveBalance';
import { ErrorResponse } from '../middleware/errorMiddleware';
import { ILeave, LeaveStatus, QueryFilters, UserRole } from '../types';
import { sendLeaveStatusEmail } from '../utils/email';

export class LeaveService {
  // Apply for leave
  async applyLeave(employeeId: string, leaveData: Partial<ILeave>): Promise<ILeave> {
    const { leaveType, startDate, endDate, duration } = leaveData;

    // Check leave balance
    const currentYear = new Date().getFullYear();
    const leaveBalance = await LeaveBalance.findOne({
      employee: employeeId,
      year: currentYear,
      leaveType,
    });

    if (!leaveBalance || leaveBalance.remainingLeaves < duration!) {
      throw new ErrorResponse('Insufficient leave balance', 400);
    }

    // Check for overlapping leaves
    const overlappingLeave = await Leave.findOne({
      employee: employeeId,
      status: { $in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (overlappingLeave) {
      throw new ErrorResponse('You already have a leave request for these dates', 400);
    }

    const leave = await Leave.create({
      ...leaveData,
      employee: employeeId,
    });

    return leave.populate('employee');
  }

  // Get all leaves with filters
  async getAllLeaves(filters: QueryFilters, userId: string, userRole: UserRole) {
    const { status, startDate, endDate, page = 1, limit = 10 } = filters;

    const query: any = {};

    // Employees can only see their own leaves
    if (userRole === UserRole.EMPLOYEE) {
      query.employee = userId;
    }

    if (status) query.status = status;
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.endDate = { $lte: new Date(endDate) };

    const skip = (page - 1) * limit;

    const [leaves, total] = await Promise.all([
      Leave.find(query)
        .populate('employee', 'firstName lastName employeeId email')
        .populate('approver', 'firstName lastName')
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit),
      Leave.countDocuments(query),
    ]);

    return {
      leaves,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get single leave
  async getLeaveById(id: string): Promise<ILeave> {
    const leave = await Leave.findById(id)
      .populate('employee', 'firstName lastName employeeId email')
      .populate('approver', 'firstName lastName');

    if (!leave) {
      throw new ErrorResponse('Leave not found', 404);
    }

    return leave;
  }

  // Approve leave
  async approveLeave(
    leaveId: string,
    approverId: string,
    comments?: string
  ): Promise<ILeave> {
    const leave = await Leave.findById(leaveId).populate('employee');

    if (!leave) {
      throw new ErrorResponse('Leave not found', 404);
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new ErrorResponse('Leave has already been reviewed', 400);
    }

    leave.status = LeaveStatus.APPROVED;
    leave.approver = approverId as any;
    leave.approverComments = comments;
    leave.reviewedAt = new Date();
    await leave.save();

    // Update leave balance
    const currentYear = new Date(leave.startDate).getFullYear();
    await LeaveBalance.findOneAndUpdate(
      {
        employee: leave.employee,
        year: currentYear,
        leaveType: leave.leaveType,
      },
      {
        $inc: { usedLeaves: leave.duration },
      }
    );

    // Send email notification
    const employee = leave.employee as any;
    await sendLeaveStatusEmail(
      employee.email,
      employee.firstName,
      leave.leaveType,
      'approved',
      comments
    );

    return leave;
  }

  // Reject leave
  async rejectLeave(
    leaveId: string,
    approverId: string,
    comments?: string
  ): Promise<ILeave> {
    const leave = await Leave.findById(leaveId).populate('employee');

    if (!leave) {
      throw new ErrorResponse('Leave not found', 404);
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new ErrorResponse('Leave has already been reviewed', 400);
    }

    leave.status = LeaveStatus.REJECTED;
    leave.approver = approverId as any;
    leave.approverComments = comments;
    leave.reviewedAt = new Date();
    await leave.save();

    // Send email notification
    const employee = leave.employee as any;
    await sendLeaveStatusEmail(
      employee.email,
      employee.firstName,
      leave.leaveType,
      'rejected',
      comments
    );

    return leave;
  }

  // Get leave balance
  async getLeaveBalance(employeeId: string) {
    const currentYear = new Date().getFullYear();

    const balances = await LeaveBalance.find({
      employee: employeeId,
      year: currentYear,
    });

    return balances;
  }

  // Get leave calendar
  async getLeaveCalendar(startDate: Date, endDate: Date) {
    const leaves = await Leave.find({
      status: LeaveStatus.APPROVED,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    }).populate('employee', 'firstName lastName employeeId');

    return leaves;
  }
}

export default new LeaveService();
