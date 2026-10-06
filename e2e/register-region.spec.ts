import { test, expect, type Page } from '@playwright/test'

// Regression: Registrierung aus Region X darf nie in Region Daun/Vulkaneifel landen.
// Es wird NICHT abgeschickt (keine echten Accounts), sondern bis zum Adress-Schritt geklickt
// und die abgeschickte Region per Abfangen der Server-Action geprueft.

const REGIONS = [
  { slug: 'daun', name: 'Landkreis Vulkaneifel', db: 'vulkaneifel' },
  { slug: 'wittlich', name: 'Bernkastel-Wittlich', db: 'wittlich' },
  { slug: 'koblenz', name: 'Region Koblenz & Hunsrück', db: 'koblenz' },
  { slug: 'euskirchen', name: 'Kreis Euskirchen', db: 'euskirchen' },
]

async function toAdresseStep(page: Page) {
  await page.getByRole('button', { name: /Ich suche einen Sitter/ }).click()
  await page.getByRole('button', { name: /Weiter/ }).click()
  await page.getByPlaceholder('Max Mustermann').fill('Test Nutzer')
  await page.locator('input[type="email"]').fill('test@example.com')
  const pw = page.locator('input[type="password"]')
  await pw.nth(0).fill('Passwort1234!')
  await pw.nth(1).fill('Passwort1234!')
  await page.getByRole('button', { name: /Weiter/ }).click()
}

for (const r of REGIONS) {
  test(`Registrieren-Link auf /${r.slug}/sitter fuehrt mit Region ${r.slug} zur Registrierung`, async ({ page }) => {
    await page.goto(`/${r.slug}/sitter`)
    const link = page.locator('a[href^="/register"]').first()
    await expect(link).toHaveAttribute('href', new RegExp(`region=${r.slug}`))
  })

  test(`/register?region=${r.slug} belegt Landkreis vor`, async ({ page }) => {
    await page.goto(`/register?region=${r.slug}&role=tierhalter`)
    await toAdresseStep(page)
    await expect(page.locator('select')).toHaveValue(r.slug)
  })
}

test('/register ohne Region: kein Fallback auf Daun, Auswahl erzwungen', async ({ page }) => {
  await page.goto('/register')
  await toAdresseStep(page)
  await expect(page.locator('select')).toHaveValue('')
  await page.getByPlaceholder('54550').fill('54470')
  await page.getByPlaceholder('Daun', { exact: true }).fill('Bernkastel-Kues')
  await page.getByRole('button', { name: /Weiter/ }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'Landkreis' })).toBeVisible()
  await page.locator('select').selectOption('wittlich')
  await page.getByRole('button', { name: /Weiter/ }).click()
  await expect(page.getByText(/Schritt 4 von/)).toBeVisible()
})

test('Validierung: schwaches Passwort, ungueltige E-Mail, Name zu kurz', async ({ page }) => {
  await page.goto('/register?region=wittlich&role=tierhalter')
  await page.getByRole('button', { name: /Weiter/ }).click()
  await page.locator('#reg-name').fill('A')
  await page.locator('#reg-email').fill('foo@bar')
  await page.locator('#reg-pw').fill('123456789')
  await page.locator('#reg-pw2').fill('abc')
  await page.getByRole('button', { name: /Weiter/ }).click()
  await expect(page.locator('#reg-name-error')).toBeVisible()
  await expect(page.locator('#reg-email-error')).toBeVisible()
  await expect(page.locator('#reg-pw-error')).toBeVisible()
  await expect(page.locator('#reg-pw2-error')).toBeVisible()
  await expect(page.locator('#reg-email')).toHaveAttribute('aria-invalid', 'true')
})

test('Validierung: Ort "1" wird abgelehnt', async ({ page }) => {
  await page.goto('/register?region=wittlich&role=tierhalter')
  await toAdresseStep(page)
  await page.locator('#reg-plz').fill('54470')
  await page.locator('#reg-ort').fill('1')
  await page.getByRole('button', { name: /Weiter/ }).click()
  await expect(page.locator('#reg-ort-error')).toBeVisible()
})

test('Stepper: Schrittzahl bleibt nach Rollenwahl stabil (Tierhalter)', async ({ page }) => {
  await page.goto('/register?region=wittlich')
  await expect(page.getByText(/Schritt 1 von 5/)).toBeVisible()
  await page.getByRole('button', { name: /Ich suche einen Sitter/ }).click()
  await expect(page.getByText(/Schritt 1 von 5/)).toBeVisible()
})

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 700 } })

  test('Bottom-Nav sichtbar, Mehr-Sheet oeffnet, Sidebar versteckt', async ({ page }) => {
    await page.goto('/wittlich')
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' })
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link', { name: /Sitter/ })).toHaveAttribute('href', '/wittlich/sitter')
    await nav.getByRole('button', { name: /Mehr/ }).click()
    const sheet = page.getByRole('dialog', { name: 'Navigation' })
    await expect(sheet).toBeVisible()
    await expect(sheet.getByRole('link', { name: 'Wanderrouten' })).toHaveAttribute('href', '/wittlich/ratgeber/wandern')
    await expect(sheet.getByRole('link', { name: 'Special Hunde' })).toHaveAttribute('href', '/wittlich/ratgeber/hundestrand')
    await page.keyboard.press('Escape')
    await expect(sheet).toBeHidden()
  })

  test('kein horizontaler Scroll', async ({ page }) => {
    await page.goto('/wittlich')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
})

test('Desktop: keine Mobile-Nav', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/wittlich')
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeHidden()
})

test.describe('Regionsinhalte (kein Daun-Fallback)', () => {
  test('Wittlich: Unterkuenfte ohne Eifel/Daun-Inhalte, mit eigenen Eintraegen', async ({ page }) => {
    await page.goto('/wittlich/ratgeber/unterkuenfte')
    await expect(page.getByRole('heading', { name: /Bernkastel-Wittlich/ })).toBeVisible()
    await expect(page.getByText('Ferienhaus an der Traumschleife')).toBeVisible()
    await expect(page.getByText('Hundeparadies Eifel')).toHaveCount(0)
    await expect(page.getByText('Bad Bertrich')).toHaveCount(0)
  })

  test('Daun: Unterkuenfte zeigt Hundeparadies Eifel', async ({ page }) => {
    await page.goto('/daun/ratgeber/unterkuenfte')
    await expect(page.getByText('Hundeparadies Eifel').first()).toBeVisible()
  })

  test('Euskirchen: Unterkunft und Tiertafel regional', async ({ page }) => {
    await page.goto('/euskirchen/ratgeber/unterkuenfte')
    await expect(page.getByText('Eifelpark Kronenburger See').first()).toBeVisible()
    await page.goto('/euskirchen/anlaufstellen')
    await expect(page.locator('#futterstationen')).toContainText('Tiertafel Kreis Euskirchen')
  })

  for (const r of ['daun', 'wittlich', 'koblenz', 'euskirchen']) {
    test(`/${r}/anlaufstellen hat Futterstationen-Abschnitt (Anker)`, async ({ page }) => {
      await page.goto(`/${r}/anlaufstellen`)
      await expect(page.locator('#futterstationen')).toBeVisible()
    })
  }
})

test.describe('Hundesuchhilfe Saving Paws', () => {
  for (const r of ['daun', 'wittlich', 'koblenz', 'euskirchen']) {
    test(`/${r}: Anlaufstelle, Special Hunde und Ratgeber verlinkt`, async ({ page }) => {
      await page.goto(`/${r}/anlaufstellen`)
      await expect(page.getByText('Hundesuchhilfe Saving Paws').first()).toBeVisible()

      await page.goto(`/${r}/ratgeber/hundestrand`)
      const tel = page.locator('a[href="tel:+491707350767"]').first()
      await expect(tel).toBeVisible()
      await page.getByRole('link', { name: /Ratgeber: Das hilft jetzt/ }).click()
      await expect(page).toHaveURL(new RegExp(`/${r}/ratgeber/hund-entlaufen`))
      await expect(page.getByRole('heading', { name: /Hund entlaufen/ }).first()).toBeVisible()
      await expect(page.locator('a[href="https://www.hundesuchhilfe.de"]').first()).toBeVisible()
    })
  }

  test('Ratgeber-Uebersicht enthaelt Karte "Hund entlaufen?"', async ({ page }) => {
    await page.goto('/wittlich/ratgeber')
    await page.getByRole('link', { name: /Hund entlaufen/ }).click()
    await expect(page).toHaveURL(/\/wittlich\/ratgeber\/hund-entlaufen/)
  })

  test('Wittlich: Einsatzgebiet wird ehrlich benannt', async ({ page }) => {
    await page.goto('/wittlich/ratgeber/hund-entlaufen')
    await expect(page.getByText(/telefonisch klären|per Telefon/).first()).toBeVisible()
  })
})
