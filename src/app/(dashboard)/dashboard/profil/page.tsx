'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { updateProfile, updateSitterProfile } from './actions';
import type { Profile, SitterProfile } from '@/types';

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

function Section({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const RADIUS_OPTIONS = [5, 10, 20, 50];

export default function ProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Basis-Felder
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [plz, setPlz] = useState('');
  const [ort, setOrt] = useState('');
  const [ortschaft, setOrtschaft] = useState('');
  const [bio, setBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Sitter-Felder
  const [erfahrungJahre, setErfahrungJahre] = useState(0);
  const [hatEigeneTiere, setHatEigeneTiere] = useState(false);
  const [eigeneTiereBeschreibung, setEigeneTiereBeschreibung] = useState('');
  const [hatGarten, setHatGarten] = useState(false);
  const [kannMedikamente, setKannMedikamente] = useState(false);
  const [betreutHunde, setBetreutHunde] = useState(true);
  const [betreutKatzen, setBetreutKatzen] = useState(false);
  const [betreutKleintiere, setBetreutKleintiere] = useState(false);
  const [bietetGassi, setBietetGassi] = useState(true);
  const [bietetFuettern, setBietetFuettern] = useState(true);
  const [bietetUebernachtung, setBietetUebernachtung] = useState(false);
  const [bietetTagesbetreuung, setBietetTagesbetreuung] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10);
  const [savingSitter, setSavingSitter] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single<Profile>();

      if (p) {
        setProfile(p);
        setFullName(p.full_name);
        setPhone(p.phone ?? '');
        setPlz(p.plz ?? '');
        setOrt(p.ort ?? '');
        setOrtschaft(p.ortschaft ?? '');
        setBio(p.bio ?? '');

        if (p.role === 'sitter' || p.role === 'beide') {
          const { data: sp } = await supabase
            .from('sitter_profiles')
            .select('*')
            .eq('id', user.id)
            .single<SitterProfile>();

          if (sp) {
            setErfahrungJahre(sp.erfahrung_jahre);
            setHatEigeneTiere(sp.hat_eigene_tiere);
            setEigeneTiereBeschreibung(sp.eigene_tiere_beschreibung ?? '');
            setHatGarten(sp.hat_garten);
            setKannMedikamente(sp.kann_medikamente);
            setBetreutHunde(sp.betreut_hunde);
            setBetreutKatzen(sp.betreut_katzen);
            setBetreutKleintiere(sp.betreut_kleintiere);
            setBietetGassi(sp.bietet_gassi);
            setBietetFuettern(sp.bietet_fuettern);
            setBietetUebernachtung(sp.bietet_uebernachtung);
            setBietetTagesbetreuung(sp.bietet_tagesbetreuung);
            setRadiusKm(sp.radius_km);
          }
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleAvatarUpload(file: File) {
    if (!profile) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar darf maximal 2 MB groß sein.');
      return;
    }
    setUploadingAvatar(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `${profile.id}/avatar.${ext}`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const url = supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl;
      const result = await updateProfile({ avatar_url: url });
      if (result.error) throw new Error(result.error);
      setProfile((prev) => prev ? { ...prev, avatar_url: url } : prev);
      toast.success('Avatar aktualisiert.');
    } catch {
      toast.error('Avatar-Upload fehlgeschlagen.');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSaveProfile() {
    if (!fullName.trim()) { toast.error('Name ist erforderlich.'); return; }
    setSavingProfile(true);
    const result = await updateProfile({
      full_name: fullName,
      phone: phone || null,
      plz: plz || null,
      ort: ort || null,
      ortschaft: ortschaft || null,
      bio: bio || null,
    });
    setSavingProfile(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success('Profil gespeichert.');
    router.refresh();
  }

  async function handleSaveSitter() {
    setSavingSitter(true);
    const result = await updateSitterProfile({
      erfahrung_jahre: erfahrungJahre,
      hat_eigene_tiere: hatEigeneTiere,
      eigene_tiere_beschreibung: hatEigeneTiere ? eigeneTiereBeschreibung || null : null,
      hat_garten: hatGarten,
      kann_medikamente: kannMedikamente,
      betreut_hunde: betreutHunde,
      betreut_katzen: betreutKatzen,
      betreut_kleintiere: betreutKleintiere,
      bietet_gassi: bietetGassi,
      bietet_fuettern: bietetFuettern,
      bietet_uebernachtung: bietetUebernachtung,
      bietet_tagesbetreuung: bietetTagesbetreuung,
      radius_km: radiusKm,
    });
    setSavingSitter(false);
    if (result.error) { toast.error(result.error); return; }
    toast.success('Sitter-Profil gespeichert.');
    router.refresh();
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Lade Profil…</div>;
  }

  const isSitter = profile?.role === 'sitter' || profile?.role === 'beide';

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Mein Profil</h1>

      {/* ── A) Basis-Profil ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Persönliche Daten</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#2D6A4F] font-bold flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(profile?.full_name ?? '?')
            )}
          </div>
          <div>
            <label className="cursor-pointer text-sm text-[#2D6A4F] font-medium hover:underline">
              Foto hochladen
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
              />
            </label>
            {uploadingAvatar && <p className="text-xs text-gray-400 mt-0.5">Wird hochgeladen…</p>}
            <p className="text-xs text-gray-400 mt-0.5">max. 2 MB · JPG, PNG, WebP</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vollständiger Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            />
          </div>

          {/* E-Mail (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail <span className="text-gray-400 font-normal">(kann nicht geändert werden)</span>
            </label>
            <input
              type="email"
              value={profile?.email ?? ''}
              readOnly
              className="w-full border border-gray-100 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49 6592 ..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            />
          </div>

          {/* PLZ + Ort + Ortschaft */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PLZ</label>
              <input
                type="text"
                value={plz}
                onChange={(e) => setPlz(e.target.value)}
                maxLength={5}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              <input
                type="text"
                value={ort}
                onChange={(e) => setOrt(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ortschaft</label>
            <input
              type="text"
              value={ortschaft}
              onChange={(e) => setOrtschaft(e.target.value)}
              placeholder="z.B. Gillenfeld, Gerolstein…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Über mich{' '}
              <span className="text-gray-400 font-normal">({bio.length}/300 Zeichen)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              placeholder="Ein paar Worte über Dich…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="self-start bg-[#2D6A4F] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#245a42] transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {savingProfile ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Speichern…
              </>
            ) : (
              'Profil speichern'
            )}
          </button>
        </div>
      </div>

      {/* ── B) Sitter-Erweiterung ─────────────────────────── */}
      {isSitter && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Meine Sitter-Informationen</h2>

          <div className="flex flex-col gap-4">
            {/* Erfahrung */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Erfahrung in Jahren
              </label>
              <input
                type="number"
                value={erfahrungJahre}
                onChange={(e) => setErfahrungJahre(parseInt(e.target.value) || 0)}
                min={0}
                max={50}
                className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
              />
            </div>

            <Toggle checked={hatEigeneTiere} onChange={setHatEigeneTiere} label="Ich habe eigene Tiere" />
            {hatEigeneTiere && (
              <textarea
                value={eigeneTiereBeschreibung}
                onChange={(e) => setEigeneTiereBeschreibung(e.target.value)}
                placeholder="Welche Tiere? z.B. 1 Labrador, 2 Katzen"
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
              />
            )}
            <Toggle checked={hatGarten} onChange={setHatGarten} label="Ich habe einen Garten" />
            <Toggle checked={kannMedikamente} onChange={setKannMedikamente} label="Kann Medikamente verabreichen" />

            <Section title="Welche Tiere betreue ich?" />
            <div className="flex flex-col gap-3">
              <Toggle checked={betreutHunde} onChange={setBetreutHunde} label="Hunde" />
              <Toggle checked={betreutKatzen} onChange={setBetreutKatzen} label="Katzen" />
              <Toggle checked={betreutKleintiere} onChange={setBetreutKleintiere} label="Kleintiere" />
            </div>

            <Section title="Welche Leistungen biete ich?" />
            <div className="flex flex-col gap-3">
              <Toggle checked={bietetGassi} onChange={setBietetGassi} label="Gassi gehen" />
              <Toggle checked={bietetFuettern} onChange={setBietetFuettern} label="Füttern" />
              <Toggle checked={bietetTagesbetreuung} onChange={setBietetTagesbetreuung} label="Tagesbetreuung" />
              <Toggle checked={bietetUebernachtung} onChange={setBietetUebernachtung} label="Übernachtung" />
            </div>

            {/* Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Radius: <span className="text-[#2D6A4F] font-bold">{radiusKm} km</span>
              </label>
              <div className="flex gap-2">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadiusKm(r)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      radiusKm === r
                        ? 'bg-[#2D6A4F] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveSitter}
              disabled={savingSitter}
              className="self-start bg-[#2D6A4F] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#245a42] transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {savingSitter ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Speichern…
                </>
              ) : (
                'Sitter-Profil speichern'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
