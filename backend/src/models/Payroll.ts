import mongoose, { Schema } from 'mongoose';
import { IPayroll, PayrollStatus } from '../types';

const payrollSchema = new Schema<IPayroll>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee is required'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: 0,
    },
    allowances: [
      {
        type: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    deductions: [
      {
        type: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    grossSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    taxDeduction: {
      type: Number,
      default: 0,
      min: 0,
    },
    netSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(PayrollStatus),
      default: PayrollStatus.PENDING,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc: any, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for unique payroll per employee per month
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
payrollSchema.index({ status: 1 });
payrollSchema.index({ paymentDate: -1 });

// Calculate gross and net salary before saving
payrollSchema.pre<IPayroll>('save', function (next: any) {
  // Calculate total allowances
  const totalAllowances = this.allowances.reduce(
    (sum: number, allowance: { type: string; amount: number }) => sum + allowance.amount,
    0
  );

  // Calculate total deductions
  const totalDeductions = this.deductions.reduce(
    (sum: number, deduction: { type: string; amount: number }) => sum + deduction.amount,
    0
  );

  // Gross salary = basic + allowances
  this.grossSalary = this.basicSalary + totalAllowances;

  // Net salary = gross - deductions - tax
  this.netSalary =
    this.grossSalary - totalDeductions - this.taxDeduction;

  next();
});

export default mongoose.model<IPayroll>('Payroll', payrollSchema);
