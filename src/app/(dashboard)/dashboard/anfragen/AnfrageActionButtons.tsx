'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  akzeptiereBewerbung,
  lehneBewerbungAb,
  akzeptiereKontaktanfrage,
  lehneKontaktanfrageAb,
} from '@/app/(dashboard)/dashboard/actions';

interface BewerbungButtonsProps {
  bewerbungId: string;
}

export function BewerbungButtons({ bewerbungId }: BewerbungButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);
  const [done, setDone] = useState<'accepted' | 'rejected' | null>(null);

  if (done === 'accepted') {
    return (
      <span className="text-xs px-3 py-1.5 rounded-xl font-medium bg-green-50 text-green-700">
        Angenommen ✓
      </span>
    );
  }
  if (done === 'rejected') {
    return (
      <span className="text-xs px-3 py-1.5 rounded-xl font-medium bg-red-50 text-red-500">
        Abgelehnt
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={!!loading}
        onClick={async () => {
          setLoading('accept');
          const r = await akzeptiereBewerbung(bewerbungId);
          if (!r.error) {
            setDone('accepted');
            router.refresh();
          }
          setLoading(null);
        }}
        className="text-xs bg-green-600 text-white font-medium px-3 py-1.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading === 'accept' ? '…' : 'Annehmen'}
      </button>
      <button
        disabled={!!loading}
        onClick={async () => {
          setLoading('reject');
          const r = await lehneBewerbungAb(bewerbungId);
          if (!r.error) {
            setDone('rejected');
            router.refresh();
          }
          setLoading(null);
        }}
        className="text-xs border border-red-200 text-red-500 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {loading === 'reject' ? '…' : 'Ablehnen'}
      </button>
    </div>
  );
}

interface KontaktanfrageButtonsProps {
  matchId: string;
}

export function KontaktanfrageButtons({ matchId }: KontaktanfrageButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);
  const [done, setDone] = useState<'accepted' | 'rejected' | null>(null);

  if (done === 'accepted') {
    return (
      <span className="text-xs px-3 py-1.5 rounded-xl font-medium bg-green-50 text-green-700">
        Angenommen ✓
      </span>
    );
  }
  if (done === 'rejected') {
    return (
      <span className="text-xs px-3 py-1.5 rounded-xl font-medium bg-red-50 text-red-500">
        Abgelehnt
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={!!loading}
        onClick={async () => {
          setLoading('accept');
          const r = await akzeptiereKontaktanfrage(matchId);
          if (!r.error) {
            setDone('accepted');
            router.push('/dashboard/nachrichten');
          }
          setLoading(null);
        }}
        className="text-xs bg-green-600 text-white font-medium px-3 py-1.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading === 'accept' ? '…' : 'Annehmen'}
      </button>
      <button
        disabled={!!loading}
        onClick={async () => {
          setLoading('reject');
          const r = await lehneKontaktanfrageAb(matchId);
          if (!r.error) {
            setDone('rejected');
            router.refresh();
          }
          setLoading(null);
        }}
        className="text-xs border border-red-200 text-red-500 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {loading === 'reject' ? '…' : 'Ablehnen'}
      </button>
    </div>
  );
}
