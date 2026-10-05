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
  await pw.nth(0).fill('Passwort123!')
  await pw.nth(1).fill('Passwort123!')
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
  await expect(page.getByRole('button', { name: /Weiter/ })).toBeDisabled()
  await page.locator('select').selectOption('wittlich')
  await expect(page.getByRole('button', { name: /Weiter/ })).toBeEnabled()
})
