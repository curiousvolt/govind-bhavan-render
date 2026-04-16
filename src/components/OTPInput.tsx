import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: boolean;
}

export const OTPInput = ({ length = 6, onComplete, error }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // Move to next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    if (pastedData.length === length) {
      onComplete(pastedData);
      inputRefs.current[length - 1]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-white dark:bg-[#1A1A2E] dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            error ? "border-red-500 text-red-500" : "border-gray-200 dark:border-white/10",
            error && "animate-[shake_0.5s_ease-in-out]"
          )}
        />
      ))}
    </div>
  );
};
