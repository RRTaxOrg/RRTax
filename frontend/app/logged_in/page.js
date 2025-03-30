'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoggedInPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/logged_in/dashboard');
  }, [router]);

  return null;
}