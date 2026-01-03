import Payroll from '../models/Payroll';
import User from '../models/User';
import { ErrorResponse } from '../middleware/errorMiddleware';
import { IPayroll, QueryFilters } from '../types';
import { sendPayrollEmail } from '../utils/email';

export class PayrollService {
  // Generate payroll
  async generatePayroll(payrollData: Partial<IPayroll>): Promise<IPayroll> {
    const { employee, month, year } = payrollData;

    // Check if payroll already exists for this month
    const existingPayroll = await Payroll.findOne({
      employee,
      month,
      year,
    });

    if (existingPayroll) {
      throw new ErrorResponse('Payroll already exists for this month', 400);
    }

    // Create payroll (calculations happen in model pre-save hook)
    const payroll = await Payroll.create(payrollData);

    // Send email notification
    const employeeData = await User.findById(employee);
    if (employeeData) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      await sendPayrollEmail(
        employeeData.email,
        employeeData.firstName,
        monthNames[month! - 1],
        year!,
        payroll.netSalary
      );
    }

    return payroll.populate('employee', 'firstName lastName employeeId email');
  }

  // Get all payroll records
  async getAllPayroll(filters: QueryFilters) {
    const { page = 1, limit = 10 } = filters;

    const query: any = {};

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Payroll.find(query)
        .populate('employee', 'firstName lastName employeeId email')
        .sort({ year: -1, month: -1 })
        .skip(skip)
        .limit(limit),
      Payroll.countDocuments(query),
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

  // Get single payroll
  async getPayrollById(id: string): Promise<IPayroll> {
    const payroll = await Payroll.findById(id).populate(
      'employee',
      'firstName lastName employeeId email department'
    );

    if (!payroll) {
      throw new ErrorResponse('Payroll not found', 404);
    }

    return payroll;
  }

  // Get employee payroll history
  async getEmployeePayroll(employeeId: string) {
    const records = await Payroll.find({ employee: employeeId })
      .sort({ year: -1, month: -1 })
      .limit(12);

    return records;
  }

  // Update payroll
  async updatePayroll(id: string, updateData: Partial<IPayroll>): Promise<IPayroll> {
    const payroll = await Payroll.findById(id);

    if (!payroll) {
      throw new ErrorResponse('Payroll not found', 404);
    }

    Object.assign(payroll, updateData);
    await payroll.save();

    return payroll.populate('employee', 'firstName lastName employeeId email');
  }

  // Get payroll statistics
  async getPayrollStats(month: number, year: number) {
    const stats = await Payroll.aggregate([
      { $match: { month, year } },
      {
        $group: {
          _id: null,
          totalGross: { $sum: '$grossSalary' },
          totalNet: { $sum: '$netSalary' },
          totalTax: { $sum: '$taxDeduction' },
          count: { $sum: 1 },
        },
      },
    ]);

    return stats[0] || {
      totalGross: 0,
      totalNet: 0,
      totalTax: 0,
      count: 0,
    };
  }

  // Bulk generate payroll for all active employees
  async bulkGeneratePayroll(month: number, year: number) {
    const employees = await User.find({
      isActive: true,
      employmentStatus: 'active',
    });

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const employee of employees) {
      try {
        // Check if payroll already exists
        const existing = await Payroll.findOne({
          employee: employee._id,
          month,
          year,
        });

        if (existing) {
          results.failed++;
          results.errors.push(`Payroll already exists for ${employee.employeeId}`);
          continue;
        }

        // Here you would typically fetch salary details from employee record
        // For now, using basic salary structure
        await Payroll.create({
          employee: employee._id,
          month,
          year,
          basicSalary: 50000, // This should come from employee record
          allowances: [
            { type: 'HRA', amount: 15000 },
            { type: 'Transport', amount: 3000 },
          ],
          deductions: [
            { type: 'PF', amount: 5000 },
          ],
          taxDeduction: 8000,
        });

        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${employee.employeeId}: ${error.message}`);
      }
    }

    return results;
  }
}

export default new PayrollService();
