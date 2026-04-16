import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  otpHash?: string;
  otpExpiry?: Date;
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  otpHash: { type: String },
  otpExpiry: { type: Date },
}, { timestamps: true });

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
