import mongoose, { Schema } from 'mongoose';
import { IAttendance, AttendanceStatus } from '../types';

const attendanceSchema = new Schema<IAttendance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PRESENT,
    },
    location: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    overtimeHours: {
      type: Number,
      default: 0,
    },
    isManual: {
      type: Boolean,
      default: false,
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

// Compound index for unique attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ status: 1 });

// Virtual for total hours worked
attendanceSchema.virtual('hoursWorked').get(function (this: IAttendance) {
  if (this.checkIn && this.checkOut) {
    const diff = this.checkOut.getTime() - this.checkIn.getTime();
    return Math.round((diff / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimals
  }
  return 0;
});

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
