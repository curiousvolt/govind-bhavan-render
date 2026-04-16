import { Router, Request, Response } from 'express';
import { Student } from '../models/Student';
import { requireAdmin, requireStudent, validateIdentity } from '../middleware/auth';

const router = Router();

// GET /api/students?search=xxx&page=1&limit=15
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  const { search, page = '1', limit = '15' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter: any = {};
  if (search) {
    const regex = new RegExp(search as string, 'i');
    filter.$or = [
      { name: regex },
      { enrollmentNo: regex },
      { room: regex },
      { branch: regex },
      { email: regex },
    ];
  }

  const [students, total] = await Promise.all([
    Student.find(filter, '-otpHash -otpExpiry').sort({ name: 1 }).skip(skip).limit(limitNum),
    Student.countDocuments(filter),
  ]);

  res.json({ students, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
});

// GET /api/students/:id — for profiles
router.get('/:id', requireStudent, validateIdentity, async (req: Request, res: Response) => {
  // Allow if admin OR if requester is the student themselves
  const role = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];
  if (role !== 'admin' && userId !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden: You can only access your own profile' });
  }

  const student = await Student.findById(req.params.id, '-otpHash -otpExpiry');
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

// GET /api/students/:id/profile — full history
router.get('/:id/profile', requireStudent, async (req: Request, res: Response) => {
  const role = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];
  if (role !== 'admin' && userId !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden: You can only access your own profile history' });
  }

  const { Complaint } = await import('../models/Complaint');
  const { MessRebate } = await import('../models/MessRebate');
  const { GuestBooking } = await import('../models/GuestBooking');
  const { Event } = await import('../models/Event');

  const [student, complaints, rebates, bookings, events] = await Promise.all([
    Student.findById(req.params.id, '-otpHash -otpExpiry'),
    Complaint.find({ studentId: req.params.id }).sort({ createdAt: -1 }),
    MessRebate.find({ studentId: req.params.id }).sort({ createdAt: -1 }),
    GuestBooking.find({ studentId: req.params.id }).sort({ createdAt: -1 }),
    Event.find({ registeredStudents: req.params.id }).select('title date category status maxRegistrations'),
  ]);

  if (!student) return res.status(404).json({ message: 'Student not found' });

  res.json({ student, complaints, rebates, bookings, events });
});

// PATCH /api/students/:id
router.patch('/:id', requireStudent, async (req: Request, res: Response) => {
  const role = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];
  if (role !== 'admin' && userId !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
  }

  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { mobile: req.body.mobile },
    { new: true, select: '-otpHash -otpExpiry' }
  );
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

export default router;
