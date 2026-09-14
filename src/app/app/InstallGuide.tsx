'use client'

import { useEffect, useState } from 'react'

type Platform = 'ios' | 'android'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'android'
  const ua = navigator.userAgent || ''
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
  return isIOS ? 'ios' : 'android'
}

export default function InstallGuide() {
  const [platform, setPlatform] = useState<Platform>('android')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'ios' || hash === 'android') {
      setPlatform(hash)
    } else {
      setPlatform(detectPlatform())
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setInstalled(true)

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function handleAndroidInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return (
    <div className="bg-white border border-[#C8D8EC] rounded-2xl shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#C8D8EC]">
        <button
          onClick={() => setPlatform('ios')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            platform === 'ios' ? 'text-[#1E3249] border-b-2 border-[#2D6A4F]' : 'text-[#7A9DBF]'
          }`}
        >
           iOS (iPhone/iPad)
        </button>
        <button
          onClick={() => setPlatform('android')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            platform === 'android' ? 'text-[#1E3249] border-b-2 border-[#2D6A4F]' : 'text-[#7A9DBF]'
          }`}
        >
          🤖 Android
        </button>
      </div>

      <div className="p-6">
        {platform === 'ios' ? (
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">1</span>
              <span className="text-sm text-[#2E4A6B] leading-relaxed">
                Öffne <strong>tiersitti.de</strong> im <strong>Safari</strong>-Browser (wichtig: nicht in Chrome oder einer anderen App).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">2</span>
              <span className="text-sm text-[#2E4A6B] leading-relaxed">
                Tippe unten auf das <strong>Teilen-Symbol</strong> (Quadrat mit Pfeil nach oben ⬆️).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">3</span>
              <span className="text-sm text-[#2E4A6B] leading-relaxed">
                Wähle <strong>„Zum Home-Bildschirm“</strong> aus (ggf. etwas herunterscrollen).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">4</span>
              <span className="text-sm text-[#2E4A6B] leading-relaxed">
                Tippe oben rechts auf <strong>„Hinzufügen“</strong> — fertig! Tiersitti erscheint als App-Icon auf Deinem Homescreen.
              </span>
            </li>
          </ol>
        ) : (
          <div className="flex flex-col gap-5">
            {installed ? (
              <p className="text-sm text-[#2D6A4F] font-semibold">
                ✅ Tiersitti ist installiert — Du findest die App auf Deinem Homescreen.
              </p>
            ) : deferredPrompt ? (
              <button
                onClick={handleAndroidInstall}
                className="inline-block bg-[#2D6A4F] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#1E4D38] transition-colors shadow-sm text-center"
              >
                📲 Jetzt installieren
              </button>
            ) : (
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span className="text-sm text-[#2E4A6B] leading-relaxed">
                    Öffne <strong>tiersitti.de</strong> im <strong>Chrome</strong>-Browser.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span className="text-sm text-[#2E4A6B] leading-relaxed">
                    Tippe oben rechts auf das <strong>Menü</strong> (⋮).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <span className="text-sm text-[#2E4A6B] leading-relaxed">
                    Wähle <strong>„App installieren“</strong> bzw. <strong>„Zum Startbildschirm hinzufügen“</strong>.
                  </span>
                </li>
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
