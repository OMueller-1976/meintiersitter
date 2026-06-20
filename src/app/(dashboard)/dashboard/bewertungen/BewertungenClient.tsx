'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BewertungsModal from '@/components/ui/BewertungsModal';

interface Props {
  matchId: string;
  bewertetId: string;
  bewertetName: string;
}

export default function BewertungenClient({ matchId, bewertetId, bewertetName }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex-shrink-0 bg-[#F4A261] text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#e08a44] transition-colors"
      >
        Jetzt bewerten →
      </button>
      {showModal && (
        <BewertungsModal
          matchId={matchId}
          bewertetId={bewertetId}
          bewertetName={bewertetName}
          onClose={(bewertet) => {
            setShowModal(false);
            if (bewertet) router.refresh();
          }}
        />
      )}
    </>
  );
}
