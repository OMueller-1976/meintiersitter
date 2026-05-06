'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { createVerfuegbarkeit, deleteVerfuegbarkeit } from './actions';
import type { Verfuegbarkeit, VerfuegbarkeitTyp } from '@/types';

const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function typLabel(t: VerfuegbarkeitTyp): string {
  return { einmalig: 'Einmalig', wiederkehrend: 'Wiederkehrend', spontan: 'Spontan' }[t];
}

function typColor(t: VerfuegbarkeitTyp): string {
  return {
    einmalig: 'bg-blue-100 text-blue-600',
    wiederkehrend: 'bg-green-100 text-[#2D6A4F]',
    spontan: 'bg-orange-100 text-[#F4A261]',
  }[t];
}

function formatDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface FormState {
  typ: VerfuegbarkeitTyp;
  datum_von: string;
  datum_bis: string;
  uhrzeit_von: string;
  uhrzeit_bis: string;
  wochentage: number[];
  notiz: string;
}

const INITIAL: FormState = {
  typ: 'einmalig',
  datum_von: '',
  datum_bis: '',
  uhrzeit_von: '',
  uhrzeit_bis: '',
  wochentage: [],
  notiz: '',
};

export default function VerfuegbarkeitPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<Verfuegbarkeit[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [saving, setSaving] = useState(false);

  const fetchSlots = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('verfuegbarkeit')
      .select('*')
      .eq('is_active', true)
      .eq('rolle', 'sitter')
      .order('datum_von', { ascending: true });
    setSlots((data as Verfuegbarkeit[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleWochentag(index: number) {
    setForm((prev) => ({
      ...prev,
      wochentage: prev.wochentage.includes(index)
        ? prev.wochentage.filter((d) => d !== index)
        : [...prev.wochentage, index].sort(),
    }));
  }

  async function handleSave() {
    if (!form.datum_von || !form.datum_bis) {
      toast.error('Bitte Datum von und bis angeben.');
      return;
    }
    if (form.datum_bis < form.datum_von) {
      toast.error('"Bis"-Datum muss nach "Von"-Datum liegen.');
      return;
    }

    setSaving(true);
    const result = await createVerfuegbarkeit({
      typ: form.typ,
      datum_von: form.datum_von,
      datum_bis: form.datum_bis,
      uhrzeit_von: form.uhrzeit_von || null,
      uhrzeit_bis: form.uhrzeit_bis || null,
      wochentage: form.typ === 'wiederkehrend' && form.wochentage.length > 0
        ? form.wochentage
        : null,
      notiz: form.notiz || null,
      is_active: true,
    });
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Slot gespeichert.');
    setForm(INITIAL);
    await fetchSlots();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Diesen Slot wirklich löschen?')) return;
    const result = await deleteVerfuegbarkeit(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Slot gelöscht.');
    await fetchSlots();
    router.refresh();
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Meine Verfügbarkeit</h1>
      <p className="text-gray-500 text-sm mb-8">
        Trage ein, wann Du Zeit hast – Tierhalter können Dich dann anfragen.
      </p>

      {/* ── Neuen Slot hinzufügen ────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Neuen Slot hinzufügen</h2>

        {/* Typ */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {(['einmalig', 'wiederkehrend', 'spontan'] as VerfuegbarkeitTyp[]).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={form.typ === t}
                onChange={() => set('typ', t)}
                className="accent-[#2D6A4F]"
              />
              <span className="text-sm text-gray-700">{typLabel(t)}</span>
            </label>
          ))}
        </div>

        {/* Datum */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datum von <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.datum_von}
              onChange={(e) => set('datum_von', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datum bis <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.datum_bis}
              min={form.datum_von}
              onChange={(e) => set('datum_bis', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            />
          </div>
        </div>

        {/* Uhrzeit */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uhrzeit von <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="time"
              value={form.uhrzeit_von}
              onChange={(e) => set('uhrzeit_von', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uhrzeit bis <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="time"
              value={form.uhrzeit_bis}
              onChange={(e) => set('uhrzeit_bis', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            />
          </div>
        </div>

        {/* Wochentage (nur bei "wiederkehrend") */}
        {form.typ === 'wiederkehrend' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Wochentage</label>
            <div className="flex gap-2 flex-wrap">
              {WOCHENTAGE.map((tag, i) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleWochentag(i + 1)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    form.wochentage.includes(i + 1)
                      ? 'bg-[#2D6A4F] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notiz */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notiz <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.notiz}
            onChange={(e) => set('notiz', e.target.value)}
            placeholder="z.B. Nur tagsüber"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2D6A4F] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#245a42] transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Speichern…
            </>
          ) : (
            'Slot speichern'
          )}
        </button>
      </div>

      {/* ── Bestehende Slots ──────────────────────────────── */}
      <h2 className="font-bold text-gray-900 mb-3">Meine Slots</h2>
      {loading ? (
        <p className="text-gray-400 text-sm">Lade Slots…</p>
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          Noch keine Slots eingetragen.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typColor(slot.typ)}`}>
                    {typLabel(slot.typ)}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(slot.datum_von)}
                    {slot.datum_von !== slot.datum_bis && ` – ${formatDate(slot.datum_bis)}`}
                  </span>
                  {(slot.uhrzeit_von || slot.uhrzeit_bis) && (
                    <span className="text-sm text-gray-500">
                      {slot.uhrzeit_von && slot.uhrzeit_von.slice(0, 5)}
                      {slot.uhrzeit_bis && ` – ${slot.uhrzeit_bis.slice(0, 5)}`}
                    </span>
                  )}
                </div>
                {slot.wochentage && Array.isArray(slot.wochentage) && slot.wochentage.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {(slot.wochentage as number[])
                      .map((d) => WOCHENTAGE[d - 1])
                      .join(', ')}
                  </p>
                )}
                {slot.notiz && <p className="text-xs text-gray-400 mt-0.5">{slot.notiz}</p>}
              </div>
              <button
                onClick={() => handleDelete(slot.id)}
                className="text-sm text-red-400 hover:text-red-600 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex-shrink-0"
              >
                Löschen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
