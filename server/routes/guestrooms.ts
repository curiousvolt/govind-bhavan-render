import { Router, Request, Response } from 'express';
import { GuestBooking } from '../models/GuestBooking';
import { requireAdmin, requireStudent, validateIdentity } from '../middleware/auth';

const router = Router();

// GET /api/guestrooms?studentId=xxx
router.get('/', requireStudent, validateIdentity, async (req: Request, res: Response) => {
  const { studentId } = req.query;
  const filter = studentId ? { studentId: studentId as string } : {};
  const bookings = await GuestBooking.find(filter).sort({ createdAt: -1 });
  res.json(bookings);
});

// POST /api/guestrooms
router.post('/', requireStudent, validateIdentity, async (req: Request, res: Response) => {
  const { studentId, student, guestName, relation, checkIn, checkOut, roomType, guestsCount, total } = req.body;
  
  // FALLACY FIX: Date Logic
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return res.status(400).json({ message: 'Invalid check-in: Cannot book in the past' });
  }
  if (end <= start) {
    return res.status(400).json({ message: 'Invalid dates: Check-out must be after check-in' });
  }

  const submittedOn = new Date().toISOString().split('T')[0];
  const booking = new GuestBooking({ studentId, student, guestName, relation, checkIn, checkOut, roomType, guestsCount, total, submittedOn });
  await booking.save();
  res.status(201).json(booking);
});

// PATCH /api/guestrooms/:id/status
router.patch('/:id/status', requireAdmin, async (req: Request, res: Response) => {
  const { status } = req.body;
  const booking = await GuestBooking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

export default router;
