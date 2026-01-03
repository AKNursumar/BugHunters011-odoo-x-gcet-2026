import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import attendanceService from '../services/attendanceService';
import { AuthRequest, ApiResponse } from '../types';

// @desc    Check in
// @route   POST /api/attendance/check-in
// @access  Private
export const checkIn = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { location, notes } = req.body;

    const attendance = await attendanceService.checkIn(
      String(req.user!.id),
      location,
      notes
    );

    const response: ApiResponse = {
      success: true,
      data: attendance,
      message: 'Checked in successfully',
    };

    res.status(201).json(response);
  }
);

// @desc    Check out
// @route   POST /api/attendance/check-out
// @access  Private
export const checkOut = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const attendance = await attendanceService.checkOut(String(req.user!.id));

    const response: ApiResponse = {
      success: true,
      data: attendance,
      message: 'Checked out successfully',
    };

    res.status(200).json(response);
  }
);

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendanceRecords = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const filters = {
      startDate: req.query.startDate as any,
      endDate: req.query.endDate as any,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const employeeId = String(req.query.employeeId as string || req.user!.id);

    const result = await attendanceService.getAttendanceRecords(
      filters,
      employeeId
    );

    const response: ApiResponse = {
      success: true,
      data: result.records,
      pagination: result.pagination,
    };

    res.status(200).json(response);
  }
);

// @desc    Get today's attendance
// @route   GET /api/attendance/today
// @access  Private (Admin/HR)
export const getTodaysAttendance = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const records = await attendanceService.getTodaysAttendance();

    const response: ApiResponse = {
      success: true,
      data: records,
    };

    res.status(200).json(response);
  }
);

// @desc    Mark attendance manually
// @route   POST /api/attendance/mark
// @access  Private (Admin/HR)
export const markAttendance = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const attendance = await attendanceService.markAttendance(req.body);

    const response: ApiResponse = {
      success: true,
      data: attendance,
      message: 'Attendance marked successfully',
    };

    res.status(201).json(response);
  }
);

// @desc    Get attendance report
// @route   GET /api/attendance/report
// @access  Private (Admin/HR)
export const getAttendanceReport = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const employeeId = req.query.employeeId as string;

    const report = await attendanceService.getAttendanceReport(
      startDate,
      endDate,
      employeeId
    );

    const response: ApiResponse = {
      success: true,
      data: report,
    };

    res.status(200).json(response);
  }
);

// @desc    Get employee attendance for a month
// @route   GET /api/attendance/:employeeId
// @access  Private
export const getEmployeeAttendance = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { employeeId } = req.params;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const report = await attendanceService.getEmployeeAttendance(
      employeeId,
      month,
      year
    );

    const response: ApiResponse = {
      success: true,
      data: report,
    };

    res.status(200).json(response);
  }
);
