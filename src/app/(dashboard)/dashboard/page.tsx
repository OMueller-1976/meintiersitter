import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types';

interface StatCard {
  icon: string;
  label: string;
  value: string;
}

function getTierhalterStats(): StatCard[] {
  return [
    { icon: '🐾', label: 'Meine Tiere', value: '–' },
    { icon: '📬', label: 'Offene Anfragen', value: '0' },
    { icon: '🤝', label: 'Aktive Matches', value: '0' },
    { icon: '⭐', label: 'Bewertungen', value: '–' },
  ];
}

function getSitterStats(): StatCard[] {
  return [
    { icon: '🗓', label: 'Verfügbare Slots', value: '0' },
    { icon: '📬', label: 'Anfragen', value: '0' },
    { icon: '🤝', label: 'Aktive Matches', value: '0' },
    { icon: '⭐', label: 'Meine Bewertung', value: '–' },
  ];
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>();

  const stats = profile?.role === 'sitter' ? getSitterStats() : getTierhalterStats();

  return (
    <div className="p-6 md:p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Willkommen zurück, {profile?.full_name ?? user.email}! 👋
        </h1>
        {profile?.ortschaft && (
          <p className="text-gray-500 text-sm mt-1">
            📍 {profile.ortschaft}
            {profile.ort ? `, ${profile.ort}` : ''}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Dein Dashboard wird aufgebaut
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Hier erscheinen bald Deine Matches, Nachrichten und{' '}
          {profile?.role === 'sitter' ? 'Tierbetreuungs-Anfragen' : 'Sitter-Vorschläge'}.
        </p>
      </div>
    </div>
  );
}
