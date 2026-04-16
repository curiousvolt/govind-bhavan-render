import { Router, Request, Response } from 'express';
import { Complaint } from '../models/Complaint';
import { requireAdmin, requireStudent, validateIdentity } from '../middleware/auth';

const router = Router();

// GET /api/complaints?studentId=xxx&category=xxx&status=xxx&page=1&limit=20
router.get('/', requireStudent, validateIdentity, async (req: Request, res: Response) => {
  const { studentId, category, status } = req.query;
  const filter: any = {};
  if (studentId) filter.studentId = studentId;
  if (category) filter.category = category;
  if (status) filter.status = status;
  const complaints = await Complaint.find(filter).sort({ date: -1, createdAt: -1 });
  res.json(complaints);
});

// POST /api/complaints
router.post('/', requireStudent, validateIdentity, async (req: Request, res: Response) => {
  const { studentId, student, room, category, description } = req.body;
  const date = new Date().toISOString().split('T')[0];
  
  // Generate short readable ID: Month code (A-L), Week (1-5), and number (max 5 chars e.g. A1001)
  const d = new Date();
  const monthChar = String.fromCharCode(65 + d.getMonth()); // A = Jan, B = Feb, etc.
  const weekChar = Math.ceil(d.getDate() / 7).toString(); // 1 to 5
  const prefix = `${monthChar}${weekChar}`;
  
  const last = await Complaint.findOne({ complaintId: new RegExp(`^${prefix}`) })
    .sort({ complaintId: -1 })
    .select('complaintId')
    .lean();
    
  let nextNum = 1;
  if (last?.complaintId) {
    const num = parseInt(last.complaintId.replace(prefix, ''), 10);
    if (!isNaN(num)) nextNum = num + 1;
  }
  const complaintId = `${prefix}${String(nextNum).padStart(3, '0')}`;

  const complaint = new Complaint({ 
    complaintId,
    studentId, 
    student, 
    room, 
    category, 
    description, 
    date 
  });
  await complaint.save();
  res.status(201).json(complaint);
});

// PATCH /api/complaints/:id/status
router.patch('/:id/status', requireAdmin, async (req: Request, res: Response) => {
  const { status } = req.body;
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  res.json(complaint);
});

export default router;
