'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  VORLAGEN_TIERHALTER_AN_SITTER,
  VORLAGEN_SITTER_AN_TIERHALTER,
} from '@/lib/nachrichten-vorlagen';
import {
  sendeKontaktanfrageAnSitter,
  bewerbenAufPosting,
} from '@/app/(dashboard)/dashboard/actions';

interface NachrichtModalProps {
  open: boolean;
  onClose: () => void;
  empfaengerName: string;
  empfaengerId: string;
  tierName?: string;    // für Sitter-Kontext (Vorlage-Parameter)
  postingId?: string;   // falls Bewerbung auf Posting
  richtung: 'tierhalter-an-sitter' | 'sitter-an-tierhalter';
}

export default function NachrichtModal({
  open,
  onClose,
  empfaengerName,
  empfaengerId,
  tierName,
  postingId,
  richtung,
}: NachrichtModalProps) {
  const router = useRouter();
  const vorlagen =
    richtung === 'tierhalter-an-sitter'
      ? VORLAGEN_TIERHALTER_AN_SITTER
      : VORLAGEN_SITTER_AN_TIERHALTER;

  // Parameter für Vorlagen-Text
  const vorlagenParam =
    richtung === 'tierhalter-an-sitter' ? empfaengerName : (tierName ?? 'Deinem Tier');

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  if (!open || !mounted) return null;

  async function handleSend() {
    if (!text.trim() || sending) return;
    setSending(true);

    let result: { error?: string; success?: boolean };

    if (richtung === 'tierhalter-an-sitter') {
      result = await sendeKontaktanfrageAnSitter(empfaengerId, text);
    } else {
      if (!postingId) {
        toast.error('Kein Posting angegeben');
        setSending(false);
        return;
      }
      result = await bewerbenAufPosting(postingId, text);
    }

    setSending(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Nachricht gesendet! Du wirst benachrichtigt sobald geantwortet wird.');
    onClose();
    router.push('/dashboard/anfragen');
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[#1E3249] mb-1">
          Nachricht an {empfaengerName}
        </h3>
        <p className="text-sm text-[#4E779F] mb-4">
          Wähle eine Vorlage oder schreibe Deine eigene Nachricht.
        </p>

        {/* Vorlagen als klickbare Karten */}
        <div className="space-y-2 mb-4">
          {vorlagen.map((v) => (
            <button
              key={v.id}
              onClick={() => setText(v.text(vorlagenParam))}
              className="w-full text-left p-3 rounded-xl border border-[#C8D8EC] hover:border-[#2E4A6B] hover:bg-[#EEF2F8] text-sm text-[#4E779F] transition-colors"
            >
              <span className="font-medium text-[#1E3249] block mb-1">{v.label}</span>
              {v.text(vorlagenParam)}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full border border-[#C8D8EC] rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#2E4A6B] resize-none"
          placeholder="Oder schreibe Deine eigene Nachricht..."
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-[#4E779F] px-4 py-2 hover:underline"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="bg-[#2E4A6B] text-white px-6 py-2 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[#1E3249] transition-colors"
          >
            {sending ? 'Wird gesendet...' : 'Nachricht senden'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
