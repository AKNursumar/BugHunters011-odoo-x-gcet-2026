import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import payrollService from '../services/payrollService';
import { AuthRequest, ApiResponse } from '../types';

// @desc    Generate payroll
// @route   POST /api/payroll/generate
// @access  Private (Admin/HR)
export const generatePayroll = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const payroll = await payrollService.generatePayroll(req.body);

    const response: ApiResponse = {
      success: true,
      data: payroll,
      message: 'Payroll generated successfully',
    };

    res.status(201).json(response);
  }
);

// @desc    Get all payroll records
// @route   GET /api/payroll
// @access  Private (Admin/HR)
export const getAllPayroll = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await payrollService.getAllPayroll(filters);

    const response: ApiResponse = {
      success: true,
      data: result.records,
      pagination: result.pagination,
    };

    res.status(200).json(response);
  }
);

// @desc    Get single payroll
// @route   GET /api/payroll/:id
// @access  Private
export const getPayrollById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const payroll = await payrollService.getPayrollById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: payroll,
    };

    res.status(200).json(response);
  }
);

// @desc    Get employee payroll history
// @route   GET /api/payroll/employee/:id
// @access  Private
export const getEmployeePayroll = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const records = await payrollService.getEmployeePayroll(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: records,
    };

    res.status(200).json(response);
  }
);

// @desc    Update payroll
// @route   PUT /api/payroll/:id
// @access  Private (Admin/HR)
export const updatePayroll = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const payroll = await payrollService.updatePayroll(
      req.params.id,
      req.body
    );

    const response: ApiResponse = {
      success: true,
      data: payroll,
      message: 'Payroll updated successfully',
    };

    res.status(200).json(response);
  }
);

// @desc    Get payroll statistics
// @route   GET /api/payroll/stats
// @access  Private (Admin/HR)
export const getPayrollStats = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const stats = await payrollService.getPayrollStats(month, year);

    const response: ApiResponse = {
      success: true,
      data: stats,
    };

    res.status(200).json(response);
  }
);

// @desc    Bulk generate payroll
// @route   POST /api/payroll/bulk-generate
// @access  Private (Admin/HR)
export const bulkGeneratePayroll = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { month, year } = req.body;

    const results = await payrollService.bulkGeneratePayroll(month, year);

    const response: ApiResponse = {
      success: true,
      data: results,
      message: `Bulk payroll generation completed. Success: ${results.success}, Failed: ${results.failed}`,
    };

    res.status(200).json(response);
  }
);
