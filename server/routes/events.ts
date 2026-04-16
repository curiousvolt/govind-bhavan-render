import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Event } from '../models/Event';
import { requireAdmin, requireStudent } from '../middleware/auth';

const router = Router();

// GET /api/events
router.get('/', async (_req: Request, res: Response) => {
  const events = await Event.find().sort({ date: 1 });
  const populated = await Event.populate(events, {
    path: 'registeredStudents',
    select: 'name room branch enrollmentNo email mobile'
  });
  const result = (populated as any[]).map((e: any) => ({
    _id: e._id,
    id: e._id.toString(),
    title: e.title,
    date: e.date,
    category: e.category,
    status: e.status,
    maxRegistrations: e.maxRegistrations,
    registeredStudents: e.registeredStudents.map((s: any) => s.name),
    registeredStudentDetails: e.registeredStudents,
  }));
  res.json(result);
});

// POST /api/events
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const { title, date, category, maxRegistrations } = req.body;
  const event = new Event({ title, date, category, maxRegistrations, status: 'Upcoming', registeredStudents: [] });
  await event.save();
  res.status(201).json({ ...event.toObject(), id: event._id.toString(), registeredStudents: [], registeredStudentDetails: [] });
});

// PATCH /api/events/:id
router.patch('/:id', requireAdmin, async (req: Request, res: Response) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

// POST /api/events/:id/register
router.post('/:id/register', requireStudent, async (req: Request, res: Response) => {
  const { studentId } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  // FALLACY FIX: Check if event date has passed
  const eventDate = new Date(event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (eventDate < today) {
    return res.status(400).json({ message: 'Registration closed: Event has already occurred' });
  }

  const sid = new mongoose.Types.ObjectId(studentId);
  const idx = event.registeredStudents.findIndex(s => s.equals(sid));

  if (idx === -1) {
    if (event.registeredStudents.length >= event.maxRegistrations) {
      return res.status(400).json({ message: 'Event is full' });
    }
    event.registeredStudents.push(sid);
  } else {
    event.registeredStudents.splice(idx, 1);
  }

  await event.save();
  const populated: any = await Event.findById(event._id).populate('registeredStudents', 'name room branch enrollmentNo email mobile');
  res.json({
    ...populated.toObject(),
    id: populated._id.toString(),
    registeredStudents: populated.registeredStudents.map((s: any) => s.name),
    registeredStudentDetails: populated.registeredStudents,
  });
});

export default router;
