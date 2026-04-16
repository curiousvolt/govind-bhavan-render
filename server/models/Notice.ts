import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  category: string;
  date: string;
  description: string;
  pinned: boolean;
}

const NoticeSchema = new Schema<INotice>({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['Event', 'Academic', 'Sports', 'Maintenance', 'General'] },
  date: { type: String, required: true },
  description: { type: String, required: true },
  pinned: { type: Boolean, default: false },
}, { timestamps: true });

export const Notice = mongoose.model<INotice>('Notice', NoticeSchema);
