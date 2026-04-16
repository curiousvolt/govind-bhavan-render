import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  complaintId: string;  // short readable ID e.g. C-001
  studentId: mongoose.Types.ObjectId;
  student: string;
  room: string;
  category: string;
  description: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

const ComplaintSchema = new Schema<IComplaint>({
  complaintId: { type: String, unique: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  student: { type: String, required: true },
  room: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
}, { timestamps: true });

// No pre-save hook needed for now, we will handle ID generation in the routes and seed script
// to ensure perfect uniqueness and control.

export const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
