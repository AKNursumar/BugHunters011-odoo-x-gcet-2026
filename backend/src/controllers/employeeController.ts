import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import employeeService from '../services/employeeService';
import { AuthRequest, ApiResponse } from '../types';
import { uploadToCloudinary } from '../utils/fileUpload';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
export const getAllEmployees = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const filters = {
      search: req.query.search as string,
      department: req.query.department as string,
      role: req.query.role as any,
      status: req.query.status as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await employeeService.getAllEmployees(filters);

    const response: ApiResponse = {
      success: true,
      data: result.employees,
      pagination: result.pagination,
    };

    res.status(200).json(response);
  }
);

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
export const getEmployeeById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const employee = await employeeService.getEmployeeById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: employee,
    };

    res.status(200).json(response);
  }
);

// @desc    Create employee
// @route   POST /api/employees
// @access  Private (Admin/HR)
export const createEmployee = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const employee = await employeeService.createEmployee(req.body);

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Employee created successfully',
    };

    res.status(201).json(response);
  }
);

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin/HR/Self)
export const updateEmployee = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body
    );

    const response: ApiResponse = {
      success: true,
      data: employee,
      message: 'Employee updated successfully',
    };

    res.status(200).json(response);
  }
);

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin/HR)
export const deleteEmployee = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    await employeeService.deleteEmployee(req.params.id);

    const response: ApiResponse = {
      success: true,
      message: 'Employee deleted successfully',
    };

    res.status(200).json(response);
  }
);

// @desc    Upload profile picture
// @route   POST /api/employees/:id/upload-avatar
// @access  Private
export const uploadProfilePicture = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'Please upload a file',
      });
      return;
    }

    const imageUrl = await uploadToCloudinary(req.file, 'employees/avatars');

    await employeeService.updateEmployee(req.params.id, {
      profilePicture: imageUrl,
    } as any);

    const response: ApiResponse = {
      success: true,
      data: { profilePicture: imageUrl },
      message: 'Profile picture uploaded successfully',
    };

    res.status(200).json(response);
  }
);

// @desc    Get employee statistics
// @route   GET /api/employees/stats
// @access  Private (Admin/HR)
export const getEmployeeStats = asyncHandler(
  async (_req: AuthRequest, res: Response, _next: NextFunction) => {
    const stats = await employeeService.getEmployeeStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
    };

    res.status(200).json(response);
  }
);
