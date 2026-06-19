'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { createTierProfile, updateTierProfile, deleteTierProfile } from './actions';
import type { TierProfile, Tierart, Geschlecht } from '@/types';
import TierFotoUpload from '@/components/dashboard/TierFotoUpload';

// ── Toggle Switch ────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-[#2D6A4F]' : 'bg-gray-200'
        }`}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

// ── Section Divider ──────────────────────────────────────────
function Section({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

// ── Tier-Emoji by Tierart ────────────────────────────────────
function tierartEmoji(t: Tierart): string {
  const map: Record<Tierart, string> = {
    hund: '🐶',
    katze: '🐱',
    vogel: '🐦',
    kleintier: '🐹',
    sonstiges: '🐾',
  };
  return map[t];
}

// ── Form State ───────────────────────────────────────────────
interface FormState {
  name: string;
  tierart: Tierart;
  rasse: string;
  alter_jahre: string;
  gewicht_kg: string;
  geschlecht: Geschlecht | '';
  kastriert: boolean;
  foto_url: string;
  vertraeglich_hunde: boolean;
  vertraeglich_katzen: boolean;
  vertraeglich_kinder: boolean;
  fuetterung_zeiten: string;
  gassi_haeufigkeit: string;
  medikamente: boolean;
  medikamente_info: string;
  besonderheiten: string;
  notfallkontakt_name: string;
  notfallkontakt_phone: string;
  tierarzt_name: string;
  tierarzt_phone: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  tierart: 'hund',
  rasse: '',
  alter_jahre: '',
  gewicht_kg: '',
  geschlecht: '',
  kastriert: false,
  foto_url: '',
  vertraeglich_hunde: true,
  vertraeglich_katzen: true,
  vertraeglich_kinder: true,
  fuetterung_zeiten: '',
  gassi_haeufigkeit: '',
  medikamente: false,
  medikamente_info: '',
  besonderheiten: '',
  notfallkontakt_name: '',
  notfallkontakt_phone: '',
  tierarzt_name: '',
  tierarzt_phone: '',
};

export default function TierePage() {
  const router = useRouter();
  const [tiere, setTiere] = useState<TierProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [fotoUrls, setFotoUrls] = useState<string[]>([]);

  const fetchTiere = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('tier_profiles')
      .select('*')
      .eq('owner_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    setTiere((data as TierProfile[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTiere();
  }, [fetchTiere]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openAddForm() {
    setForm(INITIAL_FORM);
    setFotoUrls([]);
    setEditId(null);
    setShowForm(true);
  }

  function openEditForm(t: TierProfile) {
    setForm({
      name: t.name,
      tierart: t.tierart,
      rasse: t.rasse ?? '',
      alter_jahre: t.alter_jahre?.toString() ?? '',
      gewicht_kg: t.gewicht_kg?.toString() ?? '',
      geschlecht: t.geschlecht ?? '',
      kastriert: t.kastriert,
      foto_url: t.foto_url ?? '',
      vertraeglich_hunde: t.vertraeglich_hunde,
      vertraeglich_katzen: t.vertraeglich_katzen,
      vertraeglich_kinder: t.vertraeglich_kinder,
      fuetterung_zeiten: t.fuetterung_zeiten ?? '',
      gassi_haeufigkeit: t.gassi_haeufigkeit?.toString() ?? '',
      medikamente: t.medikamente,
      medikamente_info: t.medikamente_info ?? '',
      besonderheiten: t.besonderheiten ?? '',
      notfallkontakt_name: t.notfallkontakt_name ?? '',
      notfallkontakt_phone: t.notfallkontakt_phone ?? '',
      tierarzt_name: t.tierarzt_name ?? '',
      tierarzt_phone: t.tierarzt_phone ?? '',
    });
    // Lade bestehende Fotos: foto_urls hat Priorität, Fallback auf foto_url
    const vorhandene = (t as TierProfile & { foto_urls?: string[] }).foto_urls ?? (t.foto_url ? [t.foto_url] : []);
    setFotoUrls(vorhandene);
    setEditId(t.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('Bitte einen Namen eingeben.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      tierart: form.tierart,
      rasse: form.rasse || null,
      alter_jahre: form.alter_jahre ? parseInt(form.alter_jahre) : null,
      gewicht_kg: form.gewicht_kg ? parseFloat(form.gewicht_kg) : null,
      geschlecht: (form.geschlecht || null) as Geschlecht | null,
      kastriert: form.kastriert,
      foto_url: (fotoUrls[0] ?? form.foto_url) || null,
      foto_urls: fotoUrls,
      vertraeglich_hunde: form.vertraeglich_hunde,
      vertraeglich_katzen: form.vertraeglich_katzen,
      vertraeglich_kinder: form.vertraeglich_kinder,
      fuetterung_zeiten: form.fuetterung_zeiten || null,
      gassi_haeufigkeit: form.gassi_haeufigkeit ? parseInt(form.gassi_haeufigkeit) : null,
      medikamente: form.medikamente,
      medikamente_info: form.medikamente_info || null,
      besonderheiten: form.besonderheiten || null,
      notfallkontakt_name: form.notfallkontakt_name || null,
      notfallkontakt_phone: form.notfallkontakt_phone || null,
      tierarzt_name: form.tierarzt_name || null,
      tierarzt_phone: form.tierarzt_phone || null,
      is_active: true as const,
    };

    const result = editId
      ? await updateTierProfile(editId, payload)
      : await createTierProfile(payload);

    setSaving(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(editId ? 'Tier aktualisiert.' : 'Tier hinzugefügt.');
    setShowForm(false);
    await fetchTiere();
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`"${name}" wirklich löschen?`)) return;
    const result = await deleteTierProfile(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`${name} gelöscht.`);
    await fetchTiere();
    router.refresh();
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meine Tiere</h1>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="bg-[#2D6A4F] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#245a42] transition-colors"
          >
            + Tier hinzufügen
          </button>
        )}
      </div>

      {/* ── Form Card ─────────────────────────────────────── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">
            {editId ? 'Tier bearbeiten' : 'Neues Tier anlegen'}
          </h2>

          <div className="flex flex-col gap-4">
            {/* Name + Tierart */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Bello"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tierart</label>
                <select
                  value={form.tierart}
                  onChange={(e) => set('tierart', e.target.value as Tierart)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                >
                  <option value="hund">🐶 Hund</option>
                  <option value="katze">🐱 Katze</option>
                  <option value="vogel">🐦 Vogel</option>
                  <option value="kleintier">🐹 Kleintier</option>
                  <option value="sonstiges">🐾 Sonstiges</option>
                </select>
              </div>
            </div>

            {/* Rasse + Alter + Gewicht */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rasse</label>
                <input
                  type="text"
                  value={form.rasse}
                  onChange={(e) => set('rasse', e.target.value)}
                  placeholder="Labrador"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alter (Jahre)</label>
                <input
                  type="number"
                  value={form.alter_jahre}
                  onChange={(e) => set('alter_jahre', e.target.value)}
                  min={0}
                  max={30}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gewicht (kg)</label>
                <input
                  type="number"
                  value={form.gewicht_kg}
                  onChange={(e) => set('gewicht_kg', e.target.value)}
                  min={0}
                  step={0.1}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
            </div>

            {/* Geschlecht + Kastriert + Foto */}
            <div className="grid grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Geschlecht</label>
                <div className="flex gap-4">
                  {(['maennlich', 'weiblich'] as Geschlecht[]).map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={form.geschlecht === g}
                        onChange={() => set('geschlecht', g)}
                        className="accent-[#2D6A4F]"
                      />
                      <span className="text-sm text-gray-700">
                        {g === 'maennlich' ? 'Männlich' : 'Weiblich'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <Toggle
                checked={form.kastriert}
                onChange={(v) => set('kastriert', v)}
                label="Kastriert"
              />
            </div>

            {/* Fotos */}
            <TierFotoUpload
              tierId={editId ?? 'neu'}
              bestehendeFotos={fotoUrls}
              onChange={setFotoUrls}
            />

            <Section title="Verträglichkeit" />
            <div className="flex flex-col gap-3">
              <Toggle
                checked={form.vertraeglich_hunde}
                onChange={(v) => set('vertraeglich_hunde', v)}
                label="Verträglich mit Hunden"
              />
              <Toggle
                checked={form.vertraeglich_katzen}
                onChange={(v) => set('vertraeglich_katzen', v)}
                label="Verträglich mit Katzen"
              />
              <Toggle
                checked={form.vertraeglich_kinder}
                onChange={(v) => set('vertraeglich_kinder', v)}
                label="Verträglich mit Kindern"
              />
            </div>

            <Section title="Betreuungshinweise" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fütterungszeiten
                </label>
                <input
                  type="text"
                  value={form.fuetterung_zeiten}
                  onChange={(e) => set('fuetterung_zeiten', e.target.value)}
                  placeholder="7:00 und 18:00 Uhr"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gassi-Häufigkeit (pro Tag)
                </label>
                <input
                  type="number"
                  value={form.gassi_haeufigkeit}
                  onChange={(e) => set('gassi_haeufigkeit', e.target.value)}
                  min={1}
                  max={5}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
            </div>
            <Toggle
              checked={form.medikamente}
              onChange={(v) => set('medikamente', v)}
              label="Medikamente nötig"
            />
            {form.medikamente && (
              <textarea
                value={form.medikamente_info}
                onChange={(e) => set('medikamente_info', e.target.value)}
                placeholder="Welche Medikamente, wann und wie?"
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
              />
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Besonderheiten</label>
              <textarea
                value={form.besonderheiten}
                onChange={(e) => set('besonderheiten', e.target.value)}
                placeholder="Was soll der Sitter noch wissen?"
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
              />
            </div>

            <Section title="Notfalldaten (nur für Dich sichtbar)" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notfallkontakt Name
                </label>
                <input
                  type="text"
                  value={form.notfallkontakt_name}
                  onChange={(e) => set('notfallkontakt_name', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notfallkontakt Telefon
                </label>
                <input
                  type="tel"
                  value={form.notfallkontakt_phone}
                  onChange={(e) => set('notfallkontakt_phone', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tierarzt Name
                </label>
                <input
                  type="text"
                  value={form.tierarzt_name}
                  onChange={(e) => set('tierarzt_name', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tierarzt Telefon
                </label>
                <input
                  type="tel"
                  value={form.tierarzt_phone}
                  onChange={(e) => set('tierarzt_phone', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#2D6A4F] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#245a42] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Speichern…
                  </>
                ) : (
                  'Speichern'
                )}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tier-Grid ─────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Lade Tierprofile…</div>
      ) : tiere.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Noch keine Tiere angelegt
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Füge jetzt Dein erstes Tier hinzu, um Sitter anfragen zu können.
          </p>
          <button
            onClick={openAddForm}
            className="bg-[#2D6A4F] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#245a42] transition-colors"
          >
            + Erstes Tier hinzufügen 🐾
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tiere.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#F0FDF4] flex items-center justify-center text-2xl flex-shrink-0">
                  {t.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.foto_url}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    tierartEmoji(t.tierart)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{t.name}</h3>
                    <span className="text-xs bg-green-100 text-[#2D6A4F] px-2 py-0.5 rounded-full">
                      {t.tierart}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {[t.rasse, t.alter_jahre ? `${t.alter_jahre} J.` : null, t.gewicht_kg ? `${t.gewicht_kg} kg` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  {/* Verträglichkeit */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {t.vertraeglich_hunde && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        ✓ Hundefreundlich
                      </span>
                    )}
                    {t.vertraeglich_katzen && (
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        ✓ Katzenfreundlich
                      </span>
                    )}
                    {t.vertraeglich_kinder && (
                      <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full">
                        ✓ Kinderfreundlich
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                <button
                  onClick={() => openEditForm(t)}
                  className="flex-1 text-sm border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  className="flex-1 text-sm border border-red-100 text-red-500 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
