'use client'

import { logoutAction } from '@/app/(dashboard)/dashboard/actions'

export default function LogoutButton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <button onClick={() => logoutAction()} className={className} style={style}>
      Abmelden
    </button>
  )
}
