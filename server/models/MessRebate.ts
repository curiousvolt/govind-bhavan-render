import mongoose, { Schema, Document } from 'mongoose';

export interface IMessRebate extends Document {
  studentId: mongoose.Types.ObjectId;
  student: string;
  room: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedOn: string;
}

const MessRebateSchema = new Schema<IMessRebate>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  student: { type: String, required: true },
  room: { type: String, required: true },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  submittedOn: { type: String, required: true },
}, { timestamps: true });

export const MessRebate = mongoose.model<IMessRebate>('MessRebate', MessRebateSchema);
