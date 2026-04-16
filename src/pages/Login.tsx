import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { OTPInput } from '../components/OTPInput';
import { CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';

const emailSchema = z.object({
  email: z.string().email('Invalid email address').refine(
    (val) => val.endsWith('.iitr.ac.in') || val === 'govindbhavan@iitr.ac.in',
    "Must be a valid IITR email (@*.iitr.ac.in) or admin email"
  )
});

type EmailFormValues = z.infer<typeof emailSchema>;

export const Login = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState('Invalid OTP. Please try again.');
  const [emailError, setEmailError] = useState('');
  const { requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema)
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setEmailError('');
    try {
      await requestOtp(data.email);
      setEmail(data.email);
      setStep('otp');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to send OTP. Check your email.';
      setEmailError(msg);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    try {
      await verifyOtp(email, otp);
      setOtpError(false);
      setStep('success');

      setTimeout(() => {
        if (email === 'govindbhavan@iitr.ac.in') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid OTP. Please try again.';
      setOtpErrorMsg(msg);
      setOtpError(true);
      setTimeout(() => setOtpError(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#161616] px-4 pt-32 pb-12 relative overflow-hidden font-sans">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-300/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/5 p-8 md:p-10 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex flex-col items-center mb-8">
            <Logo size="xl" />
            <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mt-6 tracking-tight text-center">Govind Bhavan</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium uppercase tracking-widest text-center">Student & Admin Portal</p>
          </div>
        </div>

        {step === 'email' && (
          <motion.form 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit(onEmailSubmit)} 
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                IITR Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="e.g., student@ee.iitr.ac.in"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.email.message}</p>
              )}
              {emailError && (
                <p className="text-red-500 text-[10px] mt-2 font-medium">{emailError}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-sans font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex justify-center items-center shadow-lg shadow-primary-600/20"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Send OTP'
              )}
            </button>
            
          </motion.form>
        )}

        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit OTP sent to <br/>
              <span className="font-medium text-gray-900 dark:text-white">{email}</span>
            </p>
            
            <OTPInput length={6} onComplete={handleOtpComplete} error={otpError} />
            
            {otpError && (
              <p className="text-red-500 text-sm animate-pulse">{otpErrorMsg}</p>
            )}
            

            <button
              onClick={() => setStep('email')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Change email
            </button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <CheckCircle2 size={64} className="text-emerald-500" />
            </motion.div>
            <h3 className="text-xl font-sans font-medium text-gray-900 dark:text-white">Login Successful!</h3>
            <p className="text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
