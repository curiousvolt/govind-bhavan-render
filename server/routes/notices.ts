import { Router, Request, Response } from 'express';
import { Notice } from '../models/Notice';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/notices
router.get('/', async (_req: Request, res: Response) => {
  const notices = await Notice.find().sort({ pinned: -1, date: -1 });
  res.json(notices);
});

// POST /api/notices
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const { title, category, description, pinned } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const notice = new Notice({ title, category, description, pinned: pinned || false, date });
  await notice.save();
  res.status(201).json(notice);
});

// PATCH /api/notices/:id
router.patch('/:id', requireAdmin, async (req: Request, res: Response) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!notice) return res.status(404).json({ message: 'Notice not found' });
  res.json(notice);
});

// DELETE /api/notices/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notice deleted' });
});

export default router;
