import mongoose, { Schema } from 'mongoose';
import { IPerformance } from '../types';

const performanceSchema = new Schema<IPerformance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee is required'],
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer is required'],
    },
    reviewPeriod: {
      startDate: {
        type: Date,
        required: [true, 'Review period start date is required'],
      },
      endDate: {
        type: Date,
        required: [true, 'Review period end date is required'],
      },
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    goals: [
      {
        type: String,
        trim: true,
      },
    ],
    achievements: [
      {
        type: String,
        trim: true,
      },
    ],
    areasOfImprovement: [
      {
        type: String,
        trim: true,
      },
    ],
    comments: {
      type: String,
      required: [true, 'Comments are required'],
      trim: true,
    },
    nextReviewDate: {
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

// Indexes
performanceSchema.index({ employee: 1, createdAt: -1 });
performanceSchema.index({ reviewer: 1 });
performanceSchema.index({ 'reviewPeriod.startDate': 1, 'reviewPeriod.endDate': 1 });

export default mongoose.model<IPerformance>('Performance', performanceSchema);
