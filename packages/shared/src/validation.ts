import { z } from 'zod';

// ============ CONSTANTS (Single Source of Truth) ============
export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 3;

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const PASSWORD_MESSAGE =
  'Password must be at least 8 characters with at least 1 letter, 1 number, and 1 special character (@$!%*#?&)';
export const NAME_MESSAGE = 'Name must be at least 3 characters';
export const EMAIL_MESSAGE = 'Invalid email format';

// ============ ZOD SCHEMAS ============
export const emailSchema = z.string().email(EMAIL_MESSAGE).toLowerCase().trim();

export const nameSchema = z.string().min(NAME_MIN_LENGTH, NAME_MESSAGE).trim();

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .regex(PASSWORD_REGEX, PASSWORD_MESSAGE);

export const signupSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});
