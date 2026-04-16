import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  category: string;
  status: 'Upcoming' | 'Completed';
  maxRegistrations: number;
  registeredStudents: mongoose.Types.ObjectId[];
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Upcoming', 'Completed'], default: 'Upcoming' },
  maxRegistrations: { type: Number, required: true, min: 1 },
  registeredStudents: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
