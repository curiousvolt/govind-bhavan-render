import { Router, Request, Response } from 'express';
import { MessRebate } from '../models/MessRebate';
import { requireAdmin, requireStudent, validateIdentity } from '../middleware/auth';

const router = Router();

// GET /api/rebates?studentId=xxx
router.get('/', requireStudent, validateIdentity, async (req: Request, res: Response) => {
  const { studentId } = req.query;
  const filter = studentId ? { studentId: studentId as string } : {};
  const rebates = await MessRebate.find(filter).sort({ createdAt: -1 });
  res.json(rebates);
});

// POST /api/rebates
router.post('/', requireStudent, validateIdentity, async (req: Request, res: Response) => {
  const { studentId, student, room, fromDate, toDate, reason } = req.body;
  
  // FALLACY FIX: Date Logic
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return res.status(400).json({ message: 'Invalid start date: Cannot apply for past rebates' });
  }
  
  const minDurationMs = 2 * 24 * 60 * 60 * 1000; // 3 days inclusive means end is at least 2 days after start
  if (end.getTime() - start.getTime() < minDurationMs) {
    return res.status(400).json({ message: 'Invalid dates: Rebates require a minimum period of 3 consecutive days.' });
  }

  const submittedOn = new Date().toISOString().split('T')[0];
  const rebate = new MessRebate({ studentId, student, room, fromDate, toDate, reason, submittedOn });
  await rebate.save();
  res.status(201).json(rebate);
});

// PATCH /api/rebates/:id/status
router.patch('/:id/status', requireAdmin, async (req: Request, res: Response) => {
  const { status } = req.body;
  const rebate = await MessRebate.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!rebate) return res.status(404).json({ message: 'Rebate not found' });
  res.json(rebate);
});

export default router;
