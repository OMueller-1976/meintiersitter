'use client'

import { Suspense } from 'react'
import OnboardingWizard from '@/components/auth/OnboardingWizard'

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingWizard />
    </Suspense>
  )
}
