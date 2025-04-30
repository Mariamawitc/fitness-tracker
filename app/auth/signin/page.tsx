'use client';

import { signIn } from 'next-auth/react';
import AuthForm from '@/app/components/AuthForm';

export default function SignIn() {
  return <AuthForm mode="signin" />;
}
