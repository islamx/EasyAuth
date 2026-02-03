import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('bg-zinc-900 border border-zinc-800 rounded-lg p-6', className)}
      {...props}
    />
  );
});

Card.displayName = 'Card';
