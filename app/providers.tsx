'use client';

import { SessionProvider } from 'next-auth/react';
import { AnalyticsProvider } from '@/lib/analytics';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </SessionProvider>
  );
}
