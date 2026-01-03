import mongoose, { Schema } from 'mongoose';
import { ILeaveBalance, LeaveType } from '../types';

const leaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    leaveType: {
      type: String,
      enum: Object.values(LeaveType),
      required: [true, 'Leave type is required'],
    },
    totalLeaves: {
      type: Number,
      required: [true, 'Total leaves is required'],
      min: 0,
    },
    usedLeaves: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingLeaves: {
      type: Number,
      default: 0,
      min: 0,
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

// Compound index for unique leave balance per employee per year per type
leaveBalanceSchema.index(
  { employee: 1, year: 1, leaveType: 1 },
  { unique: true }
);

// Calculate remaining leaves before saving
leaveBalanceSchema.pre<ILeaveBalance>('save', function (next: any) {
  this.remainingLeaves = this.totalLeaves - this.usedLeaves;
  next();
});

export default mongoose.model<ILeaveBalance>('LeaveBalance', leaveBalanceSchema);
