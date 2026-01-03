import mongoose, { Schema } from 'mongoose';
import { ILeave, LeaveType, LeaveStatus } from '../types';

const leaveSchema = new Schema<ILeave>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee is required'],
    },
    leaveType: {
      type: String,
      enum: Object.values(LeaveType),
      required: [true, 'Leave type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING,
    },
    approver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approverComments: {
      type: String,
      trim: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
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

// Indexes for faster queries
leaveSchema.index({ employee: 1, startDate: -1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });

// Validation: End date should be after start date
leaveSchema.pre<ILeave>('save', function (next: any) {
  if (this.endDate < this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

export default mongoose.model<ILeave>('Leave', leaveSchema);
