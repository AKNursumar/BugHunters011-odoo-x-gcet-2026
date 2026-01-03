import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import leaveService from '../services/leaveService';
import { AuthRequest, ApiResponse } from '../types';

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
export const applyLeave = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const leave = await leaveService.applyLeave(String(req.user!.id), req.body);

    const response: ApiResponse = {
      success: true,
      data: leave,
      message: 'Leave application submitted successfully',
    };

    res.status(201).json(response);
  }
);

// @desc    Get all leaves
// @route   GET /api/leaves
// @access  Private
export const getAllLeaves = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const filters = {
      status: req.query.status as string,
      startDate: req.query.startDate as any,
      endDate: req.query.endDate as any,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await leaveService.getAllLeaves(
      filters,
      String(req.user!.id),
      req.user!.role
    );

    const response: ApiResponse = {
      success: true,
      data: result.leaves,
      pagination: result.pagination,
    };

    res.status(200).json(response);
  }
);

// @desc    Get single leave
// @route   GET /api/leaves/:id
// @access  Private
export const getLeaveById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const leave = await leaveService.getLeaveById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: leave,
    };

    res.status(200).json(response);
  }
);

// @desc    Approve leave
// @route   PATCH /api/leaves/:id/approve
// @access  Private (Manager/HR/Admin)
export const approveLeave = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { comments } = req.body;

    const leave = await leaveService.approveLeave(
      req.params.id,
      String(req.user!.id),
      comments
    );

    const response: ApiResponse = {
      success: true,
      data: leave,
      message: 'Leave approved successfully',
    };

    res.status(200).json(response);
  }
);

// @desc    Reject leave
// @route   PATCH /api/leaves/:id/reject
// @access  Private (Manager/HR/Admin)
export const rejectLeave = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { comments } = req.body;

    const leave = await leaveService.rejectLeave(
      req.params.id,
      String(req.user!.id),
      comments
    );

    const response: ApiResponse = {
      success: true,
      data: leave,
      message: 'Leave rejected',
    };

    res.status(200).json(response);
  }
);

// @desc    Get leave balance
// @route   GET /api/leaves/balance/:employeeId
// @access  Private
export const getLeaveBalance = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const employeeId = String(req.params.employeeId || req.user!.id);

    const balance = await leaveService.getLeaveBalance(employeeId);

    const response: ApiResponse = {
      success: true,
      data: balance,
    };

    res.status(200).json(response);
  }
);

// @desc    Get leave calendar
// @route   GET /api/leaves/calendar
// @access  Private
export const getLeaveCalendar = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    const leaves = await leaveService.getLeaveCalendar(startDate, endDate);

    const response: ApiResponse = {
      success: true,
      data: leaves,
    };

    res.status(200).json(response);
  }
);
