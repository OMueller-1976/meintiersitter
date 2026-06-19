'use client'

import { useEffect } from 'react'
import SpendenHinweis from './SpendenHinweis'

interface Props {
  onClose: () => void
}

export default function SpendenModal({ onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
        <SpendenHinweis variant="ausführlich" />
        <button
          onClick={onClose}
          className="text-xs text-[#7A9DBF] hover:text-[#4E779F] transition-colors text-center mt-1"
        >
          Vielleicht später
        </button>
      </div>
    </div>
  )
}
