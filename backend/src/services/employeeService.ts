import User from '../models/User';
import { ErrorResponse } from '../middleware/errorMiddleware';
import { IUser, QueryFilters } from '../types';
import { sendWelcomeEmail } from '../utils/email';

export class EmployeeService {
  // Get all employees with filters and pagination
  async getAllEmployees(filters: QueryFilters) {
    const {
      search,
      department,
      role,
      status,
      page = 1,
      limit = 10,
    } = filters;

    const query: any = {};

    // Exclude HR and admin roles from employee list by default
    if (!role) {
      query.role = 'employee';
    } else if (role) {
      query.role = role;
    }

    // Search by name or employee ID
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) query.department = department;
    if (status) query.employmentStatus = status;

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Convert department ObjectId to string if needed
    const processedEmployees = employees.map((emp: any) => {
      if (emp.department && typeof emp.department === 'object' && emp.department._id) {
        // If department is still an ObjectId object, extract the name or use a placeholder
        emp.department = emp.department.name || 'Unknown Department';
      }
      return emp;
    });

    return {
      employees: processedEmployees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get single employee
  async getEmployeeById(id: string): Promise<IUser> {
    const employee = await User.findById(id);

    if (!employee) {
      throw new ErrorResponse('Employee not found', 404);
    }

    return employee;
  }

  // Create employee
  async createEmployee(employeeData: Partial<IUser>): Promise<IUser> {
    // Check if employee already exists
    const existingEmployee = await User.findOne({
      $or: [
        { email: employeeData.email },
        { employeeId: employeeData.employeeId },
      ],
    });

    if (existingEmployee) {
      throw new ErrorResponse(
        'Employee already exists with this email or employee ID',
        400
      );
    }

    const employee = await User.create(employeeData);

    // Send welcome email (optional - can be async)
    try {
      await sendWelcomeEmail(
        employee.email,
        employee.firstName,
        employee.employeeId,
        employeeData.password || 'defaultPassword123'
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return employee;
  }

  // Update employee
  async updateEmployee(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser> {
    // Don't allow password update through this method
    delete updateData.password;
    delete updateData.refreshToken;

    const employee = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('department');

    if (!employee) {
      throw new ErrorResponse('Employee not found', 404);
    }

    return employee;
  }

  // Delete employee (soft delete)
  async deleteEmployee(id: string): Promise<void> {
    const employee = await User.findByIdAndUpdate(id, {
      isActive: false,
      employmentStatus: 'terminated',
    });

    if (!employee) {
      throw new ErrorResponse('Employee not found', 404);
    }
  }

  // Get employee statistics
  async getEmployeeStats() {
    const [
      totalEmployees,
      activeEmployees,
      departmentCounts,
      roleCounts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true, employmentStatus: 'active' }),
      User.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'departmentInfo',
          },
        },
      ]),
      User.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      departmentCounts,
      roleCounts,
    };
  }
}

export default new EmployeeService();
