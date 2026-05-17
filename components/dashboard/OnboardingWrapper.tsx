'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';

interface OnboardingWrapperProps {
  userId: string;
  referralCode: string;
  children: React.ReactNode;
}

export function OnboardingWrapper({ userId, referralCode, children }: OnboardingWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  const storageKey = `fsh_onboarding_completed_${userId}`;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      setShowOnboarding(stored !== 'true');
    } catch {
      setShowOnboarding(true);
    }
  }, [storageKey]);

  function markDoneAndClose() {
    try {
      window.localStorage.setItem(storageKey, 'true');
    } catch {}
    setShowOnboarding(false);
    router.refresh();
  }

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          userId={userId}
          referralCode={referralCode}
          onComplete={markDoneAndClose}
          onDismiss={markDoneAndClose}
        />
      )}
      {children}
    </>
  );
}
