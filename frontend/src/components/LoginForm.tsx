'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { z } from 'zod';

import { Button } from './ui/Button';
import { Input } from './ui/Input';

import { loginUser } from '../services/auth';
import { useAuthStore } from '../hooks/useAuthStore';

import type { LoginDto } from '../types/auth';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export function LoginForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginDto) => {
    setServerError(null);

    try {
      const auth = await loginUser(values);

      setSession(auth);

      console.log('Login successful:', auth);

      router.push('/');
    } catch (error) {
      console.error('Login error:', error);

      setServerError(
        'Unable to sign in. Please verify your credentials and try again.'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20"
    >
      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      {serverError ? (
        <p className="text-sm text-rose-400">{serverError}</p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}