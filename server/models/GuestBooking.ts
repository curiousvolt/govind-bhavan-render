import mongoose, { Schema, Document } from 'mongoose';

export interface IGuestBooking extends Document {
  studentId: mongoose.Types.ObjectId;
  student: string;
  guestName: string;
  relation: string;
  checkIn: string;
  checkOut: string;
  roomType: 'AC' | 'Non-AC';
  guestsCount: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  submittedOn: string;
}

const GuestBookingSchema = new Schema<IGuestBooking>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  student: { type: String, required: true },
  guestName: { type: String, required: true },
  relation: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  roomType: { type: String, enum: ['AC', 'Non-AC'], required: true },
  guestsCount: { type: Number, required: true, min: 1, max: 3 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  submittedOn: { type: String, required: true },
}, { timestamps: true });

export const GuestBooking = mongoose.model<IGuestBooking>('GuestBooking', GuestBookingSchema);
