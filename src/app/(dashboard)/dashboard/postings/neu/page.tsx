'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createBrowserClient } from '@supabase/ssr';
import { createPosting } from '../actions';
import type { TierProfile, Leistung } from '@/types';

const LEISTUNGEN: { value: Leistung; label: string; icon: string }[] = [
  { value: 'gassi', label: 'Gassi gehen', icon: '🐕' },
  { value: 'fuettern', label: 'Füttern', icon: '🍽️' },
  { value: 'tagesbetreuung', label: 'Tagesbetreuung', icon: '🏠' },
  { value: 'uebernachtung', label: 'Übernachtung', icon: '🌙' },
];

export default function PostingNeuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tiere, setTiere] = useState<TierProfile[]>([]);

  const [form, setForm] = useState({
    tier_id: '',
    leistung: '' as Leistung | '',
    datum_von: '',
    datum_bis: '',
    uhrzeit_von: '',
    uhrzeit_bis: '',
    nachricht: '',
    plz: '',
    ort: '',
  });

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: tierData }, { data: profileData }] = await Promise.all([
        supabase.from('tier_profiles').select('*').eq('owner_id', user.id).eq('is_active', true),
        supabase.from('profiles').select('plz, ort').eq('id', user.id).single(),
      ]);
      setTiere(tierData ?? []);
      if (profileData) {
        setForm((f) => ({
          ...f,
          plz: profileData.plz ?? '',
          ort: profileData.ort ?? '',
        }));
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!form.leistung) { toast.error('Bitte wähle eine Leistung.'); return; }
    if (!form.datum_von) { toast.error('Bitte gib ein Startdatum an.'); return; }
    if (!form.datum_bis) { toast.error('Bitte gib ein Enddatum an.'); return; }
    if (!form.plz || !form.ort) { toast.error('PLZ und Ort sind erforderlich.'); return; }

    setLoading(true);
    const result = await createPosting({
      tier_id: form.tier_id || null,
      leistung: form.leistung as Leistung,
      datum_von: form.datum_von,
      datum_bis: form.datum_bis,
      uhrzeit_von: form.uhrzeit_von || null,
      uhrzeit_bis: form.uhrzeit_bis || null,
      nachricht: form.nachricht || null,
      plz: form.plz,
      ort: form.ort,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Gesuch veröffentlicht!');
      router.push('/dashboard/postings');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1E3249] mb-2">Neues Gesuch erstellen</h1>
      <p className="text-[#4E779F] mb-8">
        Wir suchen automatisch passende Sitter in deiner PLZ – und dein Gesuch erscheint auf der
        öffentlichen Pinnwand.
      </p>

      {/* Info Box */}
      <div className="bg-[#EEF2F8] border border-[#DDEAF4] rounded-2xl p-4 mb-8 text-sm text-[#2E4A6B]">
        <p className="font-semibold mb-1">So funktioniert es:</p>
        <ul className="list-disc list-inside space-y-1 text-[#2E4A6B]">
          <li>Wir benachrichtigen passende Sitter in deiner PLZ automatisch.</li>
          <li>Dein Gesuch erscheint zusätzlich auf der öffentlichen Pinnwand.</li>
          <li>Du wählst selbst, wer dein Tier betreut.</li>
        </ul>
      </div>

      <div className="space-y-6">
        {/* Tier auswählen */}
        {tiere.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-2">Tier (optional)</label>
            <select
              value={form.tier_id}
              onChange={(e) => setForm({ ...form, tier_id: e.target.value })}
              className="w-full border border-[#C8D8EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
            >
              <option value="">Kein Tier angeben</option>
              {tiere.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.tierart})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Leistung */}
        <div>
          <label className="block text-sm font-medium text-[#1E3249] mb-3">Leistung *</label>
          <div className="grid grid-cols-2 gap-3">
            {LEISTUNGEN.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setForm({ ...form, leistung: l.value })}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  form.leistung === l.value
                    ? 'border-[#2E4A6B] bg-[#EEF2F8]'
                    : 'border-[#C8D8EC] hover:border-[#A8C0DC]'
                }`}
              >
                <span className="text-2xl">{l.icon}</span>
                <span className="text-sm font-medium text-[#1E3249]">{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Zeitraum */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-2">Von *</label>
            <input
              type="date"
              value={form.datum_von}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setForm({ ...form, datum_von: e.target.value, datum_bis: e.target.value })}
              className="w-full border border-[#C8D8EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-2">Bis *</label>
            <input
              type="date"
              value={form.datum_bis}
              min={form.datum_von || new Date().toISOString().split('T')[0]}
              onChange={(e) => setForm({ ...form, datum_bis: e.target.value })}
              className="w-full border border-[#C8D8EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
            />
          </div>
        </div>

        {/* Uhrzeiten */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-2">Uhrzeit von</label>
            <input
              type="time"
              value={form.uhrzeit_von}
              onChange={(e) => setForm({ ...form, uhrzeit_von: e.target.value })}
              className="w-full border border-[#C8D8EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-2">Uhrzeit bis</label>
            <input
              type="time"
              value={form.uhrzeit_bis}
              onChange={(e) => setForm({ ...form, uhrzeit_bis: e.target.value })}
              className="w-full border border-[#C8D8EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
            />
          </div>
        </div>

        {/* PLZ + Ort */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-2">PLZ *</label>
            <input
              type="text"
              value={form.plz}
              onChange={(e) => setForm({ ...form, plz: e.target.value })}
              placeholder="z.B. 54550"
              className="w-full border border-[#C8D8EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3249] mb-2">Ort *</label>
            <input
              type="text"
              value={form.ort}
              onChange={(e) => setForm({ ...form, ort: e.target.value })}
              placeholder="z.B. Daun"
              className="w-full border border-[#C8D8EC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
            />
          </div>
        </div>

        {/* Nachricht */}
        <div>
          <label className="block text-sm font-medium text-[#1E3249] mb-2">
            Nachricht <span className="text-[#7A9DBF] font-normal">(optional)</span>
          </label>
          <textarea
            value={form.nachricht}
            onChange={(e) => setForm({ ...form, nachricht: e.target.value })}
            placeholder="Besonderheiten, Wünsche oder weitere Infos…"
            rows={4}
            className="w-full border border-[#C8D8EC] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E4A6B]"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#2E4A6B] text-white font-semibold py-3 rounded-xl hover:bg-[#3A5A80] transition-colors disabled:opacity-50"
          >
            {loading ? 'Wird veröffentlicht…' : 'Gesuch veröffentlichen'}
          </button>
          <button
            onClick={() => router.back()}
            className="border border-[#C8D8EC] text-[#4E779F] px-5 py-3 rounded-xl hover:bg-[#EEF2F8] transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
