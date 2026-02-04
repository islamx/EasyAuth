'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput, type AuthResponse, type ErrorResponse } from '@easyauth/shared';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { api, setAuthToken } from '@/lib/api';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>('');

  useEffect(() => {
    api<AuthResponse>('/auth/me')
      .then(() => router.replace('/app'))
      .catch(() => {});
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      setServerError('');
      const res = await api<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) setAuthToken(res.token);
      router.push('/app');
    } catch (error) {
      const err = error as ErrorResponse;
      if (Array.isArray(err.message)) {
        setServerError(err.message.join(', '));
      } else {
        setServerError(err.message || 'An error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-sm text-zinc-400 mt-1">Get started with EasyAuth</p>
        </div>

        {serverError && (
          <div className="p-3 bg-red-500/10 border border-red-400/50 rounded-md">
            <p className="text-sm text-red-400">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Field
            label="Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" disabled={!isValid || isSubmitting} isLoading={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-sm text-zinc-400 text-center">
          Already have an account?{' '}
          <Link href="/signin" className="text-emerald-500 hover:text-emerald-400 transition-colors">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
