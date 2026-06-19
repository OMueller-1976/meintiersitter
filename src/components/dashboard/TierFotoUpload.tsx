'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { komprimiereUndLadeHoch } from '@/lib/upload-tier-foto'

interface Props {
  tierId: string
  bestehendeFotos: string[]
  onChange: (fotos: string[]) => void
}

const MAX_FOTOS = 3

export default function TierFotoUpload({ tierId, bestehendeFotos, onChange }: Props) {
  const [uploading, setUploading] = useState<number | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(index)
    try {
      const url = await komprimiereUndLadeHoch(file, tierId, index)
      const neueUrls = [...bestehendeFotos]
      neueUrls[index] = url
      onChange(neueUrls.filter(Boolean))
      toast.success('Foto hochgeladen.')
    } catch {
      toast.error('Foto-Upload fehlgeschlagen.')
    } finally {
      setUploading(null)
      e.target.value = ''
    }
  }

  function handleRemove(index: number) {
    const neueUrls = bestehendeFotos.filter((_, i) => i !== index)
    onChange(neueUrls)
  }

  const slots = Array.from({ length: MAX_FOTOS }, (_, i) => bestehendeFotos[i] ?? null)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Fotos (bis zu 3)
      </label>
      <div className="grid grid-cols-3 gap-3">
        {slots.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square max-w-[120px] w-full"
          >
            {url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/80 transition-colors leading-none"
                  aria-label="Foto entfernen"
                >
                  ✕
                </button>
              </>
            ) : (
              <label className="w-full h-full border-2 border-dashed border-[#C8D8EC] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#2E4A6B] hover:bg-[#EEF2F8] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e, index)}
                  disabled={uploading !== null}
                />
                {uploading === index ? (
                  <span className="text-xs text-[#7A9DBF]">Lädt…</span>
                ) : (
                  <span className="text-2xl text-[#C8D8EC]">+</span>
                )}
              </label>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Bis zu 3 Fotos, werden automatisch optimiert.
      </p>
    </div>
  )
}
