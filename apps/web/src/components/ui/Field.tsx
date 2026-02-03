import { InputHTMLAttributes, forwardRef } from 'react';
import { Input } from './Input';
import { cn } from '@/lib/cn';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('space-y-2', className)}>
        <label htmlFor={fieldId} className="block text-sm font-medium text-white">
          {label}
        </label>
        <Input
          ref={ref}
          id={fieldId}
          error={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${fieldId}-error`} className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Field.displayName = 'Field';
