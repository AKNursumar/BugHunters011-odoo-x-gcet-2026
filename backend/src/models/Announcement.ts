import mongoose, { Schema } from 'mongoose';
import { IAnnouncement, AnnouncementPriority } from '../types';

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    priority: {
      type: String,
      enum: Object.values(AnnouncementPriority),
      default: AnnouncementPriority.MEDIUM,
    },
    targetAudience: {
      type: String,
      enum: ['all', 'department', 'specific'],
      default: 'all',
    },
    targetDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    targetEmployees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    attachments: [
      {
        type: String,
      },
    ],
    expiryDate: {
      type: Date,
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

// Indexes
announcementSchema.index({ isActive: 1, createdAt: -1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ expiryDate: 1 });

export default mongoose.model<IAnnouncement>('Announcement', announcementSchema);
