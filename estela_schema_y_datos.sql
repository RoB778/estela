-- ============================================================
-- ESTELA — Esquema de base de datos + carga de los 15 primeros
-- perfumes masculinos fichados. Pegar entero en el SQL Editor
-- de Supabase y ejecutar de una sola vez.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- TABLA: perfumes
-- ------------------------------------------------------------
create table if not exists perfumes (
  id                    uuid primary key default gen_random_uuid(),
  nombre                text not null,
  casa                  text not null,
  familia_principal     text not null,
  familia_secundaria    text,
  notas_salida          text[] not null default '{}',
  notas_corazon         text[] not null default '{}',
  notas_fondo           text[] not null default '{}',
  intensidad            smallint check (intensidad between 1 and 5),
  longevidad            text check (longevidad in ('baja','media','media-alta','alta')),
  temporada             text[] not null default '{}',
  genero                text not null check (genero in ('masculino','femenino','unisex')),
  ocasion               text[] not null default '{}',
  fuentes_consultadas   text,
  created_at            timestamptz not null default now(),
  unique (nombre, casa)
);

-- ------------------------------------------------------------
-- TABLA: dupes
-- direccion = 'perfume_es_original'  -> el perfume de esta fila
--             es el caro, y relacionado_nombre es la alternativa
--             barata (caso normal: Boss Bottled -> G. Bellini X-Bolt)
-- direccion = 'perfume_es_dupe'      -> el perfume de esta fila
--             ES la alternativa barata, y relacionado_nombre es
--             el original caro (caso Asad -> Sauvage Elixir)
-- ------------------------------------------------------------
create table if not exists dupes (
  id                  uuid primary key default gen_random_uuid(),
  perfume_id          uuid not null references perfumes(id) on delete cascade,
  relacionado_nombre  text not null,
  relacionado_casa    text,
  direccion           text not null check (direccion in ('perfume_es_original','perfume_es_dupe')),
  verificado          boolean not null default false,
  nota                text,
  created_at          timestamptz not null default now()
);

-- ------------------------------------------------------------
-- TABLA: precios (vacía por ahora, se rellena con los feeds
-- de Awin/Amazon cuando estén operativos)
-- ------------------------------------------------------------
create table if not exists precios (
  id            uuid primary key default gen_random_uuid(),
  perfume_id    uuid not null references perfumes(id) on delete cascade,
  tienda        text not null,
  precio        numeric(8,2),
  url_afiliado  text,
  actualizado_en timestamptz not null default now(),
  unique (perfume_id, tienda)
);

-- ------------------------------------------------------------
-- TABLA: decants (vacía por ahora)
-- ------------------------------------------------------------
create table if not exists decants (
  id            uuid primary key default gen_random_uuid(),
  perfume_id    uuid not null references perfumes(id) on delete cascade,
  vendedor      text not null,
  tamano_ml     integer not null,
  precio        numeric(8,2),
  url_afiliado  text,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- CARGA: 15 perfumes masculinos
-- ============================================================

insert into perfumes
  (nombre, casa, familia_principal, familia_secundaria,
   notas_salida, notas_corazon, notas_fondo,
   intensidad, longevidad, temporada, genero, ocasion, fuentes_consultadas)
values
  ('Le Male', 'Jean Paul Gaultier', 'Fougère oriental', 'Aromático',
   array['artemisia','menta','cardamomo','bergamota'],
   array['lavanda','azahar','canela','comino'],
   array['sándalo','vainilla','cedro','haba tonka','ámbar'],
   3, 'media-alta', array['todo el año'], 'masculino', array['diario','noche'],
   'Fragrantica (voto comunitario), Wikipedia, Fragrance Market'),

  ('Boss Bottled EDT', 'Hugo Boss', 'Amaderada', 'Especiada',
   array['manzana','ciruela','bergamota','limón','geranio'],
   array['canela','clavo de olor','caoba'],
   array['vainilla','sándalo','cedro','vetiver','madera de olivo'],
   2, 'media', array['todo el año'], 'masculino', array['diario','oficina','casa'],
   'Fragrantica, Parfumo, comunidades hispanas de reseñadores'),

  ('Bad Boy EDT', 'Carolina Herrera', 'Ámbar', 'Especiada',
   array['pimienta blanca','bergamota','pimienta rosa'],
   array['salvia esclarea','cedro'],
   array['haba tonka','cacao'],
   3, 'media', array['otoño','invierno'], 'masculino', array['noche','salidas casuales','citas'],
   'Fragrantica, web oficial Carolina Herrera, FragranceX'),

  ('Valentino Uomo Born in Roma Intense', 'Valentino', 'Ámbar', 'Vainilla',
   array['infusión de vainilla Bourbon','jengibre'],
   array['lavandín','nuez moscada'],
   array['vetiver ahumado','notas amaderadas'],
   4, 'alta', array['otoño','invierno','primavera'], 'masculino', array['noche','especial','salidas'],
   'Fragrantica, web oficial Valentino Beauty, Parfumo'),

  ('Invictus EDT', 'Paco Rabanne', 'Amaderada', 'Acuática',
   array['notas marinas','toronja','mandarina'],
   array['hoja de laurel','jazmín'],
   array['ámbar gris','madera de gaiac','musgo de roble','pachulí'],
   4, 'alta', array['verano','primavera','todo el año'], 'masculino', array['diario','gimnasio','salidas casuales','fiesta'],
   'Fragrantica, Parfumo, FragranceX, Perfumania'),

  ('Eros Parfum', 'Versace', 'Ámbar', 'Fougère oriental',
   array['menta','limón','pimienta negra','elemí','may chang'],
   array['manzana verde','geranio','lavanda','salvia','Pomarose'],
   array['haba tonka','ámbar','vainilla','pachulí','benjuí'],
   3, 'alta', array['otoño','invierno'], 'masculino', array['noche','especial','salidas casuales'],
   'Fragrantica (ficha 2021), Parfumo, web oficial Versace'),

  ('Acqua di Giò EDT', 'Giorgio Armani', 'Aromática', 'Acuática',
   array['lima','limón','bergamota','jazmín','naranja','mandarina','neroli'],
   array['notas marinas','jazmín','calone','durazno','freesia','ciclamen','jacinto','romero','violeta','cilantro','nuez moscada','rosa','mignonette'],
   array['almizcle blanco','cedro','musgo de roble','pachulí','ámbar'],
   2, 'media', array['verano','primavera'], 'masculino', array['diario','casa','oficina','post-gimnasio'],
   'Fragrantica, Parfumo, Decant House'),

  ('Eternity for Men EDT', 'Calvin Klein', 'Aromática', 'Fougère',
   array['lavanda','mandarina','bergamota','limón'],
   array['salvia','bayas de enebro','albahaca','geranio','cilantro','jazmín','azahar','lirio de los valles','azucena'],
   array['sándalo','vetiver','almizcle','palo de rosa de Brasil','ámbar'],
   2, 'media', array['primavera','verano','todo el año'], 'masculino', array['diario','oficina','casa','post-ducha'],
   'Fragrantica (ficha 1990), Parfumo, Perfumania'),

  ('Y Eau de Parfum', 'Yves Saint Laurent', 'Aromática', 'Fougère',
   array['manzana verde','jengibre','bergamota'],
   array['salvia','bayas de enebro','geranio'],
   array['amberwood','haba tonka','cedro','vetiver','incienso de olíbano'],
   4, 'alta', array['todo el año'], 'masculino', array['diario','noche','especial'],
   'Fragrantica (12.000+ votos), Parfumo, YSL Beauty'),

  ('Devotion Pour Homme Parfum', 'Dolce & Gabbana', 'Oriental', 'Fougère',
   array['lavanda','limón','pimienta negra'],
   array['café','ciprés'],
   array['vainilla de Madagascar','madera de gaiac','musgo de roble'],
   3, 'alta', array['otoño','invierno'], 'masculino', array['noche','especial','citas'],
   'Fragrantica (Parfum 2025), web oficial Dolce & Gabbana'),

  ('Esencia Eau de Parfum', 'Loewe', 'Amaderada', 'Aromática / Especiada',
   array['bayas de enebro','lavanda','pimienta verde','pimienta roja'],
   array['albahaca','estragón','cedro','acetato de vetiver'],
   array['vetiver','sándalo','musgo','pachulí','haba tonka'],
   3, 'alta', array['todo el año'], 'masculino', array['diario','oficina','especial'],
   'Fragrantica (EDP 2018), web oficial Loewe, Wikiparfum'),

  ('Le Sel d''Issey Eau de Parfum', 'Issey Miyake', 'Aromática', 'Acuática',
   array['sal marina','algas marinas'],
   array['incienso (olíbano)'],
   array['cedro','ámbar'],
   3, 'alta', array['primavera','verano','todo el año'], 'masculino', array['diario','oficina','casual'],
   'Fragrantica (ficha EDP 2025), nota de lanzamiento Fragrantica'),

  ('1 Million EDT', 'Rabanne', 'Amaderada', 'Especiada',
   array['mandarina roja','toronja','menta'],
   array['canela','notas especiadas','rosa'],
   array['ámbar','cuero','notas amaderadas','pachulí hindú'],
   4, 'alta', array['otoño','invierno'], 'masculino', array['noche','fiesta','citas'],
   'Fragrantica (ficha 2008), Parfumo, Fragrance Market'),

  ('Asad', 'Lattafa Perfumes', 'Oriental', 'Ámbar',
   array['pimienta negra','tabaco','piña'],
   array['pachulí','café','iris'],
   array['vainilla','ámbar','madera seca','benjuí','ládano'],
   4, 'alta', array['otoño','invierno'], 'masculino', array['noche','especial','salidas casuales nocturnas'],
   'Fragrantica (ficha 2021), Parfumo, web oficial Lattafa'),

  ('Costa Azzurra Parfum', 'Tom Ford', 'Amaderada', 'Aromática / Fougère',
   array['limón italiano'],
   array['ciprés','roble'],
   array['ámbar','ládano'],
   3, 'alta', array['primavera','verano','otoño'], 'masculino', array['especial','noche','oficina elegante'],
   'Fragrantica (ficha 2022), Basenotes, Scent Grail');

-- ============================================================
-- CARGA: dupes (23 relaciones)
-- ============================================================

-- Boss Bottled EDT
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'X-Bolt', 'G. Bellini (Lidl)', 'perfume_es_original', true,
  'Dupe ampliamente reconocido y documentado en Fragrantica, Parfumo, Basenotes, blogs y vídeos especializados.'
from perfumes where nombre = 'Boss Bottled EDT' and casa = 'Hugo Boss';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Gesto', 'Mercadona', 'perfume_es_original', true,
  'Citado ampliamente como equivalente, con matiz: salida algo más verde/aromática frente a la más afrutada del original. Parecido notable pero no total.'
from perfumes where nombre = 'Boss Bottled EDT' and casa = 'Hugo Boss';

-- Bad Boy EDT
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Star Night', 'Zara', 'perfume_es_original', false,
  'Clon directo, actualmente descatalogado. Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Bad Boy EDT' and casa = 'Carolina Herrera';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Nebras', 'Lattafa', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Bad Boy EDT' and casa = 'Carolina Herrera';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Scent ID', null, 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Bad Boy EDT' and casa = 'Carolina Herrera';

-- Valentino Uomo Born in Roma Intense
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Asad Zanzibar', 'Lattafa', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Valentino Uomo Born in Roma Intense' and casa = 'Valentino';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, '800 Black', 'Zara', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Valentino Uomo Born in Roma Intense' and casa = 'Valentino';

-- Invictus EDT
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Seoul 532-8 Sinsa Dong', 'Zara', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Invictus EDT' and casa = 'Paco Rabanne';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Najdia', 'Lattafa', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Invictus EDT' and casa = 'Paco Rabanne';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Hawas', 'Rasasi', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Invictus EDT' and casa = 'Paco Rabanne';

-- Eros Parfum
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Versencia Oro', 'Maison Alhambra', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Eros Parfum' and casa = 'Versace';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Ambery Mint', 'Zara', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Eros Parfum' and casa = 'Versace';

-- Acqua di Giò EDT
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Lisboa Colombo Avenida do Colégio Militar', 'Zara', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Acqua di Giò EDT' and casa = 'Giorgio Armani';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, '360 Red', 'Perry Ellis', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Acqua di Giò EDT' and casa = 'Giorgio Armani';

-- Eternity for Men EDT
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'America Look', 'Milton-Lloyd', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Eternity for Men EDT' and casa = 'Calvin Klein';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Florence', 'Zara', 'perfume_es_original', false, 'Descatalogado. Sin verificación independiente en esta pasada.'
from perfumes where nombre = 'Eternity for Men EDT' and casa = 'Calvin Klein';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Equivalencia genérica línea clásica', 'Mercadona / Carrefour', 'perfume_es_original', false, 'Referencia genérica sin producto concreto identificado. Sin verificación independiente.'
from perfumes where nombre = 'Eternity for Men EDT' and casa = 'Calvin Klein';

-- Y Eau de Parfum
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Fakhar Black', 'Lattafa', 'perfume_es_original', true,
  'El dupe árabe más exacto, famoso y vendido de este perfume; comparte aproximadamente el 90% del ADN aunque dura algo menos que el original.'
from perfumes where nombre = 'Y Eau de Parfum' and casa = 'Yves Saint Laurent';

-- 1 Million EDT
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'One Fragrance', 'G. Bellini (Lidl)', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = '1 Million EDT' and casa = 'Rabanne';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Man Uomo', 'Zara', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = '1 Million EDT' and casa = 'Rabanne';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Gold', 'Poseidon (Instituto Español)', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = '1 Million EDT' and casa = 'Rabanne';

insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'The Golden Secret', 'Antonio Banderas', 'perfume_es_original', false, 'Sin verificación independiente en esta pasada.'
from perfumes where nombre = '1 Million EDT' and casa = 'Rabanne';

-- Asad (Lattafa) — caso invertido: Asad ES el dupe del original caro
insert into dupes (perfume_id, relacionado_nombre, relacionado_casa, direccion, verificado, nota)
select id, 'Sauvage Elixir', 'Dior', 'perfume_es_dupe', true,
  'Asad está ampliamente documentado como dupe confirmado de Sauvage Elixir en Fragrantica, Parfumo y comunidades especializadas.'
from perfumes where nombre = 'Asad' and casa = 'Lattafa Perfumes';

-- ============================================================
-- VERIFICACIÓN RÁPIDA (ejecutar aparte para comprobar la carga)
-- ============================================================
-- select count(*) as total_perfumes from perfumes;
-- select count(*) as total_dupes from dupes;
-- select p.nombre, p.casa, d.relacionado_nombre, d.direccion, d.verificado
--   from dupes d join perfumes p on p.id = d.perfume_id
--   order by p.nombre;
