import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'w-full py-3 px-4 bg-emerald-500 text-white text-sm font-medium rounded-md',
          'hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
