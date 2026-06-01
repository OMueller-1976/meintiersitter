'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createBewerbung } from '@/app/(dashboard)/dashboard/postings/actions';

interface Props {
  postingId: string;
  isLoggedIn: boolean;
  hasBewerbung: boolean;
}

export default function PinnwandBewerbenButton({ postingId, isLoggedIn, hasBewerbung }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(hasBewerbung);
  const [showForm, setShowForm] = useState(false);
  const [nachricht, setNachricht] = useState('');

  if (!isLoggedIn) {
    return (
      <a
        href="/login"
        className="inline-block bg-[#2E4A6B] text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-[#1E3249] transition-colors"
      >
        Anmelden &amp; bewerben
      </a>
    );
  }

  if (applied) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-[#2E4A6B] bg-[#EEF2F8] px-4 py-2 rounded-xl font-medium">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Beworben
      </span>
    );
  }

  if (showForm) {
    return (
      <div className="flex flex-col gap-2 min-w-[220px]">
        <textarea
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          placeholder="Kurze Nachricht (optional)"
          rows={3}
          className="border border-[#C8D8EC] rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
        />
        <div className="flex gap-2">
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const result = await createBewerbung(postingId, nachricht || undefined);
              setLoading(false);
              if (result.error) {
                toast.error(result.error);
              } else {
                setApplied(true);
                setShowForm(false);
                toast.success('Bewerbung gesendet!');
                router.refresh();
              }
            }}
            className="flex-1 bg-[#2E4A6B] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#3A5A80] transition-colors disabled:opacity-50"
          >
            {loading ? 'Senden…' : 'Absenden'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="border border-[#C8D8EC] text-[#4E779F] text-sm px-3 py-2 rounded-xl hover:bg-[#EEF2F8] transition-colors"
          >
            Abbruch
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="bg-[#F4A261] text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-[#E07B30] transition-colors"
    >
      Bewerben
    </button>
  );
}
