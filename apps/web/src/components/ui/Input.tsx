import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full py-3 px-4 bg-zinc-900 border border-zinc-800 rounded-md text-sm',
          'text-white placeholder:text-zinc-500',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
          'transition-all',
          error && 'border-red-400 focus:ring-red-400/50',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
