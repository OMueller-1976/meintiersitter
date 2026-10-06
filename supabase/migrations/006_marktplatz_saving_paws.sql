-- Hundesuchhilfe Saving Paws (gemeinnuetziger Verein, Birresborn) in allen Regionen.
-- Quellen: hundesuchhilfe.de, Lokalo 22.08.2023, Eifel Journal 11.01.2024.
-- Idempotent: legt je Region nur an, wenn noch kein Eintrag existiert.
insert into marktplatz_eintraege
  (kategorie, name, beschreibung, ort, phone, website, is_active, is_verified, is_premium, region)
select 'sonstiges', 'Hundesuchhilfe Saving Paws', v.beschreibung, 'Birresborn (Vulkaneifel)',
       '0170 7350767', 'https://www.hundesuchhilfe.de', true, (v.region = 'vulkaneifel'), false, v.region
from (values
  ('vulkaneifel', 'Gemeinnütziger Verein mit Sitz in Birresborn. Hilfe bei entlaufenen Hunden: Suchflyer, Futterstellen, Suchhunde, Wärmebilddrohnen, Lebendfallen. Notfall-Hotline auch am Wochenende und an Feiertagen.'),
  ('wittlich',    'Gemeinnütziger Verein aus der Vulkaneifel/Südeifel (Helfer in der Eifel bis Trier). Hilfe bei entlaufenen Hunden. Ob ein Einsatz im Kreis Bernkastel-Wittlich möglich ist, bitte telefonisch klären.'),
  ('koblenz',     'Gemeinnütziger Verein aus der Vulkaneifel/Südeifel. Hilfe bei entlaufenen Hunden. Ob ein Einsatz in der Region Koblenz/Hunsrück möglich ist, bitte telefonisch klären.'),
  ('euskirchen',  'Gemeinnütziger Verein aus der Vulkaneifel/Südeifel. Hilfe bei entlaufenen Hunden. Ob ein Einsatz im Kreis Euskirchen möglich ist, bitte telefonisch klären.')
) as v(region, beschreibung)
where not exists (
  select 1 from marktplatz_eintraege m
  where m.name = 'Hundesuchhilfe Saving Paws' and m.region = v.region
);
