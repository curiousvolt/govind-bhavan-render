import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  enrollmentNo: string;
  room: string;
  branch: string;
  year: string;
  mobile: string;
  otpHash?: string;
  otpExpiry?: Date;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  enrollmentNo: { type: String, required: true, unique: true },
  room: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  mobile: { type: String, required: true },
  otpHash: { type: String },
  otpExpiry: { type: Date },
}, { timestamps: true });

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
