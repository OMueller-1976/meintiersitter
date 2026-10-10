/** Strukturierte Daten (schema.org) als JSON-LD. */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // "<" escapen, damit der Inhalt nicht aus dem Script-Tag ausbrechen kann
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}
