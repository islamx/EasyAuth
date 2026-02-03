import { z } from 'zod';
import { signupSchema, signinSchema } from './validation';

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
  requestId: string;
}
