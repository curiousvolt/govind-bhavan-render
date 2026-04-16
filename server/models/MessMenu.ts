import mongoose, { Schema, Document } from 'mongoose';

// Week-based menu: stores a menu for a specific date range (Mon-Sun of a week)
export interface IWeekMenu extends Document {
  weekStart: string;  // YYYY-MM-DD (always Monday)
  weekEnd: string;    // YYYY-MM-DD (always Sunday)
  weekLabel: string;  // e.g. "Week 3 of April 2026"
  days: {
    day: string;      // 'Monday'..'Sunday'
    date: string;     // YYYY-MM-DD
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
  }[];
}

const DayMenuSchema = new Schema({
  day: { type: String, required: true },
  date: { type: String, required: true },
  breakfast: { type: String, default: '' },
  lunch: { type: String, default: '' },
  snacks: { type: String, default: '' },
  dinner: { type: String, default: '' },
}, { _id: false });

const WeekMenuSchema = new Schema<IWeekMenu>({
  weekStart: { type: String, required: true, unique: true },
  weekEnd: { type: String, required: true },
  weekLabel: { type: String, required: true },
  days: [DayMenuSchema],
}, { timestamps: true });

export const WeekMenu = mongoose.model<IWeekMenu>('WeekMenu', WeekMenuSchema);

// Daily votes — one vote per student per date
export interface IMessVote extends Document {
  date: string;
  studentId: mongoose.Types.ObjectId;
  voteType: 'up' | 'down';
}

const MessVoteSchema = new Schema<IMessVote>({
  date: { type: String, required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  voteType: { type: String, enum: ['up', 'down'], required: true },
}, { timestamps: true });

MessVoteSchema.index({ date: 1, studentId: 1 }, { unique: true });

export const MessVote = mongoose.model<IMessVote>('MessVote', MessVoteSchema);
