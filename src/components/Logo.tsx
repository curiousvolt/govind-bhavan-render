import React from 'react';
import { cn } from '../utils/cn';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  return (
    <div 
      className={cn(
        sizes[size],
        "bg-primary-600 shrink-0",
        className
      )}
      style={{
        maskImage: "url('/src/gemini-svg.svg')",
        WebkitMaskImage: "url('/src/gemini-svg.svg')",
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain'
      }}
      aria-hidden="true"
    />
  );
};
