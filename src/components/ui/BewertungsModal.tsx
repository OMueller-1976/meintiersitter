'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import { createBewertung } from '@/app/(dashboard)/dashboard/nachrichten/actions';

const STERNE_LABEL: Record<number, string> = {
  1: 'Leider nicht empfehlenswert',
  2: 'Verbesserungswürdig',
  3: 'War in Ordnung',
  4: 'Sehr gut',
  5: 'Ausgezeichnet! ⭐',
};

interface Props {
  matchId: string;
  bewertetId: string;
  bewertetName: string;
  onClose: () => void;
}

export default function BewertungsModal({ matchId, bewertetId, bewertetName, onClose }: Props) {
  const [sterne, setSterne] = useState(0);
  const [kommentar, setKommentar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (sterne === 0) { toast.error('Bitte wähle eine Bewertung.'); return; }
    setLoading(true);
    const result = await createBewertung(matchId, bewertetId, sterne, kommentar || null);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Bewertung gespeichert!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Wie war Deine Erfahrung mit {bewertetName}?
        </h2>

        {/* Sterne */}
        <div className="my-5 flex flex-col items-center gap-2">
          <StarRating readonly={false} value={sterne} onChange={setSterne} />
          {sterne > 0 && (
            <p className="text-sm text-gray-600">{STERNE_LABEL[sterne]}</p>
          )}
        </div>

        {/* Kommentar */}
        <div className="mb-4">
          <textarea
            value={kommentar}
            onChange={(e) => setKommentar(e.target.value.slice(0, 500))}
            placeholder="Magst Du noch etwas erzählen? (optional)"
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{kommentar.length}/500</p>
        </div>

        {/* Hinweis */}
        <p className="text-xs text-gray-400 mb-5">
          Bewertungen sind öffentlich sichtbar und helfen der Community, gute Sitter zu finden.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={sterne === 0 || loading}
            className="flex-1 bg-[#2D6A4F] text-white font-semibold py-2.5 rounded-xl hover:bg-[#245a42] transition-colors disabled:opacity-40"
          >
            {loading ? 'Wird gespeichert…' : 'Bewertung absenden'}
          </button>
          <button
            onClick={onClose}
            className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Später
          </button>
        </div>
      </div>
    </div>
  );
}
