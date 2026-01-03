import Attendance from '../models/Attendance';
import { ErrorResponse } from '../middleware/errorMiddleware';
import { IAttendance, AttendanceStatus, QueryFilters } from '../types';

export class AttendanceService {
  // Check in
  async checkIn(employeeId: string, location?: string, notes?: string): Promise<IAttendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (existingAttendance) {
      throw new ErrorResponse('Already checked in today', 400);
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: new Date(),
      status: AttendanceStatus.PRESENT,
      location,
      notes,
      isManual: false,
    });

    return attendance.populate('employee', 'firstName lastName employeeId');
  }

  // Check out
  async checkOut(employeeId: string): Promise<IAttendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!attendance) {
      throw new ErrorResponse('No check-in record found for today', 404);
    }

    if (attendance.checkOut) {
      throw new ErrorResponse('Already checked out today', 400);
    }

    attendance.checkOut = new Date();
    await attendance.save();

    return attendance.populate('employee', 'firstName lastName employeeId');
  }

  // Get attendance records
  async getAttendanceRecords(filters: QueryFilters, employeeId?: string) {
    const { startDate, endDate, page = 1, limit = 10 } = filters;

    const query: any = {};

    if (employeeId) {
      query.employee = employeeId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Attendance.find(query)
        .populate('employee', 'firstName lastName employeeId')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(query),
    ]);

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get today's attendance
  async getTodaysAttendance() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await Attendance.find({ date: today }).populate(
      'employee',
      'firstName lastName employeeId department'
    );

    return records;
  }

  // Manual attendance marking (admin/HR only)
  async markAttendance(attendanceData: Partial<IAttendance>): Promise<IAttendance> {
    const { employee, date, checkIn, checkOut, status } = attendanceData;

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      employee,
      date,
    });

    if (existingAttendance) {
      // Update existing attendance
      Object.assign(existingAttendance, {
        checkIn,
        checkOut,
        status,
        isManual: true,
      });
      await existingAttendance.save();
      return existingAttendance.populate('employee', 'firstName lastName employeeId');
    }

    // Create new attendance
    const attendance = await Attendance.create({
      ...attendanceData,
      isManual: true,
    });

    return attendance.populate('employee', 'firstName lastName employeeId');
  }

  // Get attendance report
  async getAttendanceReport(startDate: Date, endDate: Date, employeeId?: string) {
    const query: any = {
      date: { $gte: startDate, $lte: endDate },
    };

    if (employeeId) {
      query.employee = employeeId;
    }

    const records = await Attendance.find(query).populate(
      'employee',
      'firstName lastName employeeId'
    );

    // Calculate statistics
    const stats = {
      totalDays: records.length,
      present: records.filter((r) => r.status === AttendanceStatus.PRESENT).length,
      absent: records.filter((r) => r.status === AttendanceStatus.ABSENT).length,
      late: records.filter((r) => r.status === AttendanceStatus.LATE).length,
      halfDay: records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length,
      remote: records.filter((r) => r.status === AttendanceStatus.REMOTE).length,
    };

    return {
      records,
      stats,
    };
  }

  // Get employee attendance
  async getEmployeeAttendance(employeeId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.getAttendanceReport(startDate, endDate, employeeId);
  }
}

export default new AttendanceService();
