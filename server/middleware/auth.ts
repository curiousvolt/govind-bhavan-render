import { Request, Response, NextFunction } from 'express';

// Simple middleware to simulate RBAC based on headers for this local dev env
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

export const requireStudent = (req: Request, res: Response, next: NextFunction) => {
  const role = req.headers['x-user-role'];
  if (role !== 'student' && role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Student access required' });
  }
  next();
};

// Validates that the studentId in body matches the requester (if not admin)
export const validateIdentity = (req: Request, res: Response, next: NextFunction) => {
  const role = req.headers['x-user-role'];
  const userId = req.headers['x-user-id'];
  
  if (role === 'admin') return next();

  const bodyStudentId = req.body.studentId;
  const queryStudentId = req.query.studentId;

  if (bodyStudentId && bodyStudentId !== userId) {
    return res.status(403).json({ message: 'Forbidden: You can only act on your own data' });
  }

  if (queryStudentId && queryStudentId !== userId) {
    return res.status(403).json({ message: 'Forbidden: You can only access your own data' });
  }

  next();
};
