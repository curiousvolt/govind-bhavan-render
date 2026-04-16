import { Router, Request, Response } from 'express';
import { WeekMenu, MessVote } from '../models/MessMenu';
import { addDays, startOfWeek, format, parseISO } from 'date-fns';
import { requireAdmin, requireStudent } from '../middleware/auth';

const router = Router();

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getWeekBounds(dateStr: string) {
  const date = parseISO(dateStr);
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const sunday = addDays(monday, 6);
  return {
    weekStart: format(monday, 'yyyy-MM-dd'),
    weekEnd: format(sunday, 'yyyy-MM-dd'),
    weekLabel: `Week of ${format(monday, 'dd MMM')} – ${format(sunday, 'dd MMM yyyy')}`,
    monday,
  };
}

// GET /api/messmenu — all weeks, sorted newest first
router.get('/', async (_req: Request, res: Response) => {
  const weeks = await WeekMenu.find().sort({ weekStart: -1 });
  res.json(weeks);
});

// GET /api/messmenu/week?date=YYYY-MM-DD — get week containing the given date
router.get('/week', async (req: Request, res: Response) => {
  const date = (req.query.date as string) || format(new Date(), 'yyyy-MM-dd');
  const { weekStart } = getWeekBounds(date);
  const week = await WeekMenu.findOne({ weekStart });
  res.json(week || null);
});

// GET /api/messmenu/today — get today's day entry
router.get('/today', async (_req: Request, res: Response) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { weekStart } = getWeekBounds(today);
  const week = await WeekMenu.findOne({ weekStart });
  if (!week) return res.json(null);
  const dayEntry = week.days.find(d => d.date === today);
  res.json(dayEntry || null);
});

// PUT /api/messmenu/week — upsert a full week's menu (admin)
// Body: { weekStart: 'YYYY-MM-DD', days: [{day, date, breakfast, lunch, snacks, dinner}, ...] }
router.put('/week', requireAdmin, async (req: Request, res: Response) => {
  const { weekStart, days } = req.body;
  const { weekEnd, weekLabel } = getWeekBounds(weekStart);

  const week = await WeekMenu.findOneAndUpdate(
    { weekStart },
    { weekStart, weekEnd, weekLabel, days },
    { new: true, upsert: true }
  );
  res.json(week);
});

// GET /api/messmenu/votes/:date?studentId=xxx
router.get('/votes/:date', async (req: Request, res: Response) => {
  const { date } = req.params;
  const { studentId } = req.query;

  const votes = await MessVote.find({ date });
  const upvotes = votes.filter(v => v.voteType === 'up').length;
  const downvotes = votes.filter(v => v.voteType === 'down').length;

  let userVote: string | null = null;
  if (studentId) {
    const myVote = votes.find(v => v.studentId.toString() === studentId);
    userVote = myVote ? myVote.voteType : null;
  }

  res.json({ upvotes, downvotes, userVote });
});

// GET /api/messmenu/votes/week/:weekStart — vote stats for each day of a week
router.get('/votes/week/:weekStart', async (req: Request, res: Response) => {
  const { weekStart } = req.params;
  const { monday } = getWeekBounds(weekStart);

  const result = await Promise.all(
    DAYS.map(async (day, i) => {
      const date = format(addDays(monday, i), 'yyyy-MM-dd');
      const votes = await MessVote.find({ date });
      return {
        day,
        date,
        upvotes: votes.filter(v => v.voteType === 'up').length,
        downvotes: votes.filter(v => v.voteType === 'down').length,
      };
    })
  );

  res.json(result);
});

// POST /api/messmenu/votes/:date — cast or toggle vote
router.post('/votes/:date', requireStudent, async (req: Request, res: Response) => {
  const { date } = req.params;
  const { studentId, voteType } = req.body;

  // FALLACY FIX: Only allow voting for today
  const today = format(new Date(), 'yyyy-MM-dd');
  if (date !== today) {
    return res.status(400).json({ message: 'Voting closed: You can only vote for today\'s meals' });
  }

  const existing = await MessVote.findOne({ date, studentId });
  if (existing) {
    if (existing.voteType === voteType) {
      await MessVote.deleteOne({ _id: existing._id });
    } else {
      existing.voteType = voteType;
      await existing.save();
    }
  } else {
    await MessVote.create({ date, studentId, voteType });
  }

  const votes = await MessVote.find({ date });
  const myVote = await MessVote.findOne({ date, studentId });
  res.json({
    upvotes: votes.filter(v => v.voteType === 'up').length,
    downvotes: votes.filter(v => v.voteType === 'down').length,
    userVote: myVote ? myVote.voteType : null,
  });
});

export default router;
