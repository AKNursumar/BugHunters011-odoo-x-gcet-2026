import mongoose, { Schema } from 'mongoose';
import { IDepartment } from '../types';

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    employeeCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Index for faster queries
departmentSchema.index({ name: 1 });
departmentSchema.index({ isActive: 1 });

export default mongoose.model<IDepartment>('Department', departmentSchema);
