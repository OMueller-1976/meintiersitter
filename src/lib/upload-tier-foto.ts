'use client'
import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'

export async function komprimiereUndLadeHoch(
  file: File,
  tierId: string,
  index: number
): Promise<string> {
  const komprimiert = await imageCompression(file, {
    maxWidthOrHeight: 1000,
    maxSizeMB: 0.6,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
  })

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Nicht eingeloggt')

  const dateiname = `${user.id}/${tierId}-${index}-${Date.now()}.jpg`

  const { error } = await supabase.storage
    .from('tier-fotos')
    .upload(dateiname, komprimiert, {
      upsert: true,
      contentType: 'image/jpeg',
    })

  if (error) throw error

  const { data } = supabase.storage
    .from('tier-fotos')
    .getPublicUrl(dateiname)

  return data.publicUrl
}
