'use client';

import { useEffect, useState } from 'react';

export function useScrollPastThreshold(threshold: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const check = () => setPast(window.scrollY > threshold);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [threshold]);

  return past;
}
