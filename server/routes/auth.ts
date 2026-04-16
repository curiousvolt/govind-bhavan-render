import { Router, Request, Response } from 'express';
import { Student } from '../models/Student';
import { Admin } from '../models/Admin';

const router = Router();

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Bypass OTP — always accepted for easy testing
const BYPASS_OTP = '123456';

// POST /api/auth/request-otp
router.post('/request-otp', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const lowerEmail = email.toLowerCase().trim();
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Check admin first
  if (lowerEmail === 'govindbhavan@iitr.ac.in') {
    const admin = await Admin.findOneAndUpdate(
      { email: lowerEmail },
      { otpHash: otp, otpExpiry: expiry },
      { new: true }
    );
    if (!admin) return res.status(404).json({ message: 'Admin account not found. Please seed the database.' });
    console.log(`\n🔑 OTP for ${lowerEmail}: ${otp}\n`);
    return res.json({ message: 'OTP sent successfully', role: 'admin' });
  }

  // Otherwise student
  const student = await Student.findOneAndUpdate(
    { email: lowerEmail },
    { otpHash: otp, otpExpiry: expiry },
    { new: true }
  );
  if (!student) return res.status(404).json({ message: 'No student found with this email. Please check your email.' });

  console.log(`\n🔑 OTP for ${lowerEmail}: ${otp}\n`);
  return res.json({ message: 'OTP sent successfully', role: 'student' });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const lowerEmail = email.toLowerCase().trim();

  // Admin check
  if (lowerEmail === 'govindbhavan@iitr.ac.in') {
    const admin = await Admin.findOne({ email: lowerEmail });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const validOtp = otp === BYPASS_OTP || admin.otpHash === otp;
    if (!validOtp) return res.status(401).json({ message: 'Invalid OTP' });
    if (otp !== BYPASS_OTP && admin.otpExpiry && admin.otpExpiry < new Date()) return res.status(401).json({ message: 'OTP expired' });
    // Clear OTP
    admin.otpHash = undefined;
    admin.otpExpiry = undefined;
    await admin.save();
    return res.json({
      role: 'admin',
      user: { _id: admin._id, name: admin.name, email: admin.email }
    });
  }

  // Student check
  const student = await Student.findOne({ email: lowerEmail });
  if (!student) return res.status(404).json({ message: 'Student not found' });
    const validOtp = otp === BYPASS_OTP || student.otpHash === otp;
    if (!validOtp) return res.status(401).json({ message: 'Invalid OTP' });
    if (otp !== BYPASS_OTP && student.otpExpiry && student.otpExpiry < new Date()) return res.status(401).json({ message: 'OTP expired' });
  // Clear OTP
  student.otpHash = undefined;
  student.otpExpiry = undefined;
  await student.save();
  return res.json({
    role: 'student',
    user: {
      _id: student._id,
      name: student.name,
      email: student.email,
      enrollmentNo: student.enrollmentNo,
      room: student.room,
      branch: student.branch,
      year: student.year,
      mobile: student.mobile,
    }
  });
});

export default router;
