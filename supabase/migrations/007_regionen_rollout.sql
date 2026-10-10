-- Regionen-Rollout RLP + NRW: erlaubte Regionen erweitern, Region-Zeilen anlegen.
alter table public.profiles drop constraint if exists profiles_region_check;
alter table public.profiles add constraint profiles_region_check check (region = any (array[
  'vulkaneifel','wittlich','koblenz','euskirchen','trier','ahr','nahe','mainz','vorderpfalz','suedpfalz','westpfalz','aachen','rheinsieg']));

alter table public.postings drop constraint if exists postings_region_check;
alter table public.postings add constraint postings_region_check check (region = any (array[
  'vulkaneifel','wittlich','koblenz','euskirchen','trier','ahr','nahe','mainz','vorderpfalz','suedpfalz','westpfalz','aachen','rheinsieg']));

update public.regions set landkreis_name='Mosel (Bernkastel-Wittlich & Cochem-Zell)' where landkreis_slug='wittlich';
update public.regions set landkreis_name='Koblenz, Hunsrück & Westerwald' where landkreis_slug='koblenz';

insert into public.regions (bundesland_slug, bundesland_name, landkreis_slug, landkreis_name, is_active, tierheim_name, lat, lng)
select v.* from (values
  ('rheinland-pfalz','Rheinland-Pfalz','trier','Region Trier & Eifelkreis Bitburg-Prüm',true,'Tierheim Trier',49.7596,6.6439),
  ('rheinland-pfalz','Rheinland-Pfalz','ahr','Ahr & Rhein',true,'Tierheim Kreis Ahrweiler (Remagen)',50.5446,7.1134),
  ('rheinland-pfalz','Rheinland-Pfalz','nahe','Nahe & Rheinhessen',true,'Tierheim Bad Kreuznach',49.8454,7.8678),
  ('rheinland-pfalz','Rheinland-Pfalz','mainz','Mainz & Umgebung',true,'Tierheim Mainz',49.9929,8.2473),
  ('rheinland-pfalz','Rheinland-Pfalz','vorderpfalz','Vorderpfalz',true,'Tierheim Ludwigshafen',49.4774,8.4452),
  ('rheinland-pfalz','Rheinland-Pfalz','suedpfalz','Südpfalz',true,'Tierheim Landau',49.1990,8.1174),
  ('rheinland-pfalz','Rheinland-Pfalz','westpfalz','Westpfalz & Südwestpfalz',true,'Tierheim Kaiserslautern',49.4401,7.7491),
  ('nordrhein-westfalen','Nordrhein-Westfalen','aachen','Aachen & Düren',true,'Tierheim Aachen',50.7753,6.0839),
  ('nordrhein-westfalen','Nordrhein-Westfalen','rheinsieg','Rhein-Sieg-Kreis & Bonn',true,'Tierheim Troisdorf',50.7374,7.0982)
) as v(bundesland_slug,bundesland_name,landkreis_slug,landkreis_name,is_active,tierheim_name,lat,lng)
where not exists (select 1 from public.regions r where r.landkreis_slug=v.landkreis_slug);
