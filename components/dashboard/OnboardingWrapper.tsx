'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';

interface OnboardingWrapperProps {
  userId: string;
  referralCode: string;
  children: React.ReactNode;
}

export function OnboardingWrapper({ userId, referralCode, children }: OnboardingWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const router = useRouter();

  function handleComplete() {
    setShowOnboarding(false);
    router.refresh();
  }

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          userId={userId}
          referralCode={referralCode}
          onComplete={handleComplete}
        />
      )}
      {children}
    </>
  );
}
