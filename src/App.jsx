import React, { useState, useEffect, useCallback } from "react";
import { supabase } from './supabaseClient';

// Alturas de la pirámide según longevidad del perfume
const ALTURAS_TRAIL = {
  baja:      [24, 48, 72],
  media:     [30, 62, 90],
  "media-alta": [32, 66, 104],
  alta:      [34, 72, 116],
};

// Convierte un perfume de Supabase al formato que espera la interfaz
function adaptarPerfume(p) {
  const alturas = ALTURAS_TRAIL[p.longevidad] || ALTURAS_TRAIL["media-alta"];
  return {
    id: p.id,
    casa: p.casa,
    nombre: p.nombre,
    concentracion: p.familia_principal + (p.familia_secundaria ? ` · ${p.familia_secundaria}` : ""),
    familia: p.familia_principal,
    familia_principal: p.familia_principal || "",
    familia_secundaria: p.familia_secundaria || "",
    genero: p.genero,
    es_nicho: p.es_nicho || false,
    intensidad: p.intensidad ?? null,
    temporada: p.temporada || [],
    ocasion: p.ocasion || [],
    voz: p.voz || "",
    trail: [
      {
        fase: "salida",
        notas: (p.notas_salida || []).join(", "),
        ventana: "0 – 30 min",
        h: alturas[0],
      },
      {
        fase: "corazón",
        notas: (p.notas_corazon || []).join(", "),
        ventana: "30 min – 4 h",
        h: alturas[1],
      },
      {
        fase: "fondo",
        notas: (p.notas_fondo || []).join(", "),
        ventana: "4 h en adelante",
        h: alturas[2],
      },
    ],
    precios: (p.precios || []).map((pr) => ({
      tienda: pr.tienda,
      precio: pr.precio ? String(pr.precio).replace(".", ",") : null,
      url: pr.url_afiliado || null,
    })),
    dupes: (p.dupes || []).filter((d) => d.direccion === "perfume_es_original"),
  };
}



const FAMILIAS = [
  {
    id: "floral",
    nombre: "Floral",
    pista: "Jazmín, rosa, azahar",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M22 40 C22 30 22 22 22 14" />
        <path d="M22 26 C16 26 12 22 12 18 C18 18 22 21 22 26 Z" />
        <path d="M22 30 C28 30 32 27 33 22 C27 22 23 25 22 30 Z" />
        <circle cx="22" cy="11" r="4.5" />
        <path d="M22 11 L22 11" />
      </g>
    ),
  },
  {
    id: "amaderado",
    nombre: "Amaderado",
    pista: "Cedro, sándalo, vetiver",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <circle cx="22" cy="22" r="3" />
        <path d="M22 12 A10 10 0 0 1 32 22" />
        <path d="M22 8 A14 14 0 0 1 36 22" />
        <path d="M22 16 A6 6 0 0 1 28 22" />
        <path d="M12 22 A10 10 0 0 0 22 32" />
        <path d="M8 22 A14 14 0 0 0 22 36" />
      </g>
    ),
  },
  {
    id: "oriental",
    nombre: "Oriental",
    pista: "Ámbar, incienso, especias",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M22 38 C15 38 12 33 12 29 C12 24 18 20 22 12 C26 20 32 24 32 29 C32 33 29 38 22 38 Z" />
        <path d="M22 8 C25 5 19 4 22 1" />
      </g>
    ),
  },
  {
    id: "fresco",
    nombre: "Fresco",
    pista: "Cítricos, marino, verde",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <circle cx="22" cy="22" r="13" />
        <path d="M22 22 L22 9" />
        <path d="M22 22 L33 15" />
        <path d="M22 22 L33 29" />
        <path d="M22 22 L22 35" />
        <path d="M22 22 L11 29" />
        <path d="M22 22 L11 15" />
      </g>
    ),
  },
  {
    id: "gourmand",
    nombre: "Gourmand",
    pista: "Vainilla, caramelo, café",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M17 6 C13 16 13 30 17 38" />
        <path d="M17 6 C21 16 21 30 17 38" />
        <path d="M27 6 C23 16 23 30 27 38" />
        <path d="M27 6 C31 16 31 30 27 38" />
      </g>
    ),
  },
  {
    id: "especiado",
    nombre: "Especiado",
    pista: "Canela, pimienta, cardamomo",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <circle cx="16" cy="14" r="3.2" />
        <circle cx="27" cy="12" r="2.4" />
        <circle cx="23" cy="22" r="3.6" />
        <circle cx="14" cy="25" r="2.2" />
        <circle cx="29" cy="27" r="2.8" />
        <path d="M23 22 L23 34" strokeWidth="0.75" opacity="0.6" />
      </g>
    ),
  },
  {
    id: "chipre",
    nombre: "Chipre",
    pista: "Musgo, bergamota, labdanum",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M22 8 L22 36" />
        <path d="M22 14 C16 18 14 24 16 30" />
        <path d="M22 14 C28 18 30 24 28 30" />
        <path d="M18 20 C20 22 24 22 26 20" />
      </g>
    ),
  },
  {
    id: "cuero",
    nombre: "Cuero",
    pista: "Cuero, tabaco, oud",
    path: (
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <rect x="12" y="10" width="20" height="24" rx="3" />
        <path d="M12 16 L32 16" />
        <path d="M17 22 L27 22" />
        <path d="M17 28 L27 28" />
      </g>
    ),
  },
];

const PASOS = [
  { n: "01", label: "Género" },
  { n: "02", label: "Presupuesto" },
  { n: "03", label: "Familia" },
  { n: "04", label: "Ocasión" },
  { n: "05", label: "Intensidad" },
  { n: "06", label: "Ancla" },
];

const GRANO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

function pistaPresupuesto(v) {
  if (v < 40) return "Territorio de clones y casas árabes. Se puede oler muy bien aquí.";
  if (v < 80) return "El grueso de la perfumería de diseñador en oferta.";
  if (v < 140) return "Ediciones en parfum y frascos grandes de las casas conocidas.";
  if (v < 220) return "Empieza el nicho accesible: Mancera, Xerjoff Casamorati, Amouage Beach.";
  return "Nicho sin límite. Aquí el precio deja de ser el filtro.";
}

// ------------------------------------------------------------
// MOTOR DE MATCHING
// Las 6 familias del selector del usuario son categorías amplias;
// la base de datos tiene familias más específicas y reales de
// perfumería. Este mapa traduce una a la otra por palabras clave.
// ------------------------------------------------------------
const FAMILIA_KEYWORDS = {
  floral: ["floral"],
  amaderado: ["amaderad", "fougère", "fougere"],
  oriental: ["oriental", "ámbar", "ambar"],
  fresco: ["acuátic", "acuatic", "cítric", "citric", "aromátic", "aromatic"],
  especiado: ["especiad"],
  chipre: ["chipre", "chypre"],
  cuero: ["cuero", "tabac", "oud"],
  gourmand: ["gourmand", "vainilla", "dulce"],
};

// Calcula el precio más bajo disponible de un perfume, o null si no
// hay ningún precio cargado todavía (caso normal antes de los feeds)
function precioMinimo(perfume) {
  const disponibles = (perfume.precios || []).filter((p) => p.precio);
  if (!disponibles.length) return null;
  return Math.min(...disponibles.map((p) => parseFloat(String(p.precio).replace(",", "."))));
}

// Puntúa un perfume del 0 al 100 según cuánto encaja con lo que
// el usuario ha respondido. No es IA — es scoring ponderado simple,
// transparente y barato de ejecutar, tal como estaba planteado
// desde el esquema original del producto.
function puntuarPerfume(perfume, filtros) {
  let score = 0;

  // Familia olfativa — el criterio de mayor peso (40 pts)
  const textoFamilia = `${perfume.familia_principal} ${perfume.familia_secundaria}`.toLowerCase();
  if (filtros.familias.length) {
    const coincide = filtros.familias.some((fid) =>
      (FAMILIA_KEYWORDS[fid] || []).some((kw) => textoFamilia.includes(kw))
    );
    score += coincide ? 40 : 0;
  } else {
    score += 20; // sin preferencia declarada, no penaliza ni premia
  }

  // Temporada (20 pts) — "todo el año" siempre cuenta como acierto
  const temporadas = perfume.temporada.map((t) => t.toLowerCase());
  const quiereTemp =
    filtros.temporada === "todo" ? null : filtros.temporada.toLowerCase();
  if (!quiereTemp || temporadas.some((t) => t.includes("todo el año"))) {
    score += 20;
  } else if (temporadas.some((t) => t.includes(quiereTemp))) {
    score += 20;
  }

  // Ocasión (20 pts)
  const ocasiones = perfume.ocasion.map((o) => o.toLowerCase());
  if (ocasiones.some((o) => o.includes(filtros.ocasion.toLowerCase()))) {
    score += 20;
  }

  // Intensidad (20 pts) — cuanto más cerca del valor pedido, más puntos
  if (perfume.intensidad != null) {
    const diff = Math.abs(perfume.intensidad - filtros.intensidad);
    score += Math.max(0, 20 - diff * 7);
  } else {
    score += 8; // dato sin confirmar todavía, ni premia ni penaliza fuerte
  }

  return Math.round(score);
}

// Motor completo: filtra por género + presupuesto (duros),
// puntúa el resto, y si hay un perfume ancla lo ancla arriba
// del todo y da un empujón a otros de su misma familia.
function motorDeMatching(perfumes, filtros) {
  let base = perfumes.filter(
    (p) => !filtros.genero || filtros.genero === "todos" || p.genero === filtros.genero || p.genero === "unisex"
  );

  // Filtro por modo nicho/diseñador
  if (filtros.modo === "nicho") {
    base = base.filter((p) => p.es_nicho);
  } else if (filtros.modo === "diseñador") {
    base = base.filter((p) => !p.es_nicho);
  }
  // modo "todos" no filtra

  // Filtro duro de presupuesto: solo excluye si SÍ hay precio
  // cargado y supera el máximo. Sin precio todavía, no se excluye.
  base = base.filter((p) => {
    const min = precioMinimo(p);
    return min === null || min <= filtros.presupuesto;
  });

  if (!base.length) base = perfumes; // fallback si el filtro duro deja la lista vacía

  let anclaEncontrada = null;
  if (filtros.ancla && filtros.ancla.trim()) {
    const q = filtros.ancla.trim().toLowerCase();
    anclaEncontrada = base.find((p) => p.nombre.toLowerCase().includes(q)) || null;
  }

  const puntuados = base.map((p) => {
    let score = puntuarPerfume(p, filtros);
    let esAncla = false;
    if (anclaEncontrada && p.id === anclaEncontrada.id) {
      score = 999;
      esAncla = true;
    } else if (anclaEncontrada) {
      const mismaFamilia =
        p.familia_principal.toLowerCase() === anclaEncontrada.familia_principal.toLowerCase();
      if (mismaFamilia) score += 15;
    }
    return { ...p, _score: score, _esAncla: esAncla };
  });

  puntuados.sort((a, b) => b._score - a._score);
  return puntuados.slice(0, 5);
}

export default function Efluvio({ initialPagina = "sommelier" }) {

  // Navegación principal
  const [pagina, setPagina] = useState(initialPagina); // sommelier | guia | comunidad

  // Estado del sommelier
  const [pantalla, setPantalla] = useState("landing");
  const [genero, setGenero] = useState(null);
  const [modo, setModo] = useState("diseñador"); // diseñador | nicho | todos
  const [presupuesto, setPresupuesto] = useState(100);
  const [familias, setFamilias] = useState(["amaderado"]);

  const alternarFamilia = (id) =>
    setFamilias((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const [ocasion, setOcasion] = useState("noche");
  const [temporada, setTemporada] = useState("otono");
  const [intensidad, setIntensidad] = useState(3);
  const [ancla, setAncla] = useState("");

  // Estado de datos reales de Supabase
  const [perfumes, setPerfumes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null);

  const cargarPerfumes = useCallback(async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const { data, error } = await supabase
        .from("perfumes")
        .select(`*, precios(*), dupes(*)`);
      if (error) throw error;
      setPerfumes((data || []).map(adaptarPerfume));
    } catch (e) {
      setErrorCarga("No pudimos cargar el catálogo. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (pantalla === "resultado" && perfumes.length === 0) {
      cargarPerfumes();
    }
  }, [pantalla, perfumes.length, cargarPerfumes]);

  // Estado de artículos reales de Supabase
  const [articulos, setArticulos] = useState([]);
  const [cargandoArticulos, setCargandoArticulos] = useState(false);

  useEffect(function () {
    if (pagina === "guia" && articulos.length === 0) {
      setCargandoArticulos(true);
      supabase
        .from("articulos")
        .select("slug, titulo, descripcion_corta, categoria, minutos_lectura, fecha_publicacion, tags")
        .eq("estado", "publicado")
        .order("fecha_publicacion", { ascending: false })
        .then(function (resultado) {
          if (!resultado.error) {
            setArticulos(resultado.data || []);
          }
          setCargandoArticulos(false);
        });
    }
  }, [pagina, articulos.length]);

  // ------------------------------------------------------------
  // INSTALACIÓN COMO APP (PWA)
  // El navegador dispara 'beforeinstallprompt' cuando la web cumple
  // los requisitos de instalación. Lo capturamos, guardamos el evento
  // y mostramos nuestro propio botón. Al pulsarlo, disparamos el
  // diálogo nativo del sistema. En iOS Safari no existe ese evento,
  // así que ahí mostramos una instrucción manual.
  // ------------------------------------------------------------
  const [promptInstalar, setPromptInstalar] = useState(null);
  const [yaInstalada, setYaInstalada] = useState(false);
  const [mostrarAyudaIOS, setMostrarAyudaIOS] = useState(false);

  useEffect(() => {
    // Detecta si ya está instalada (modo standalone)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setYaInstalada(standalone);

    const onPrompt = (e) => {
      e.preventDefault();
      setPromptInstalar(e);
    };
    const onInstalada = () => {
      setYaInstalada(true);
      setPromptInstalar(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalada);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalada);
    };
  }, []);

  const instalarApp = useCallback(async () => {
    if (promptInstalar) {
      promptInstalar.prompt();
      await promptInstalar.userChoice;
      setPromptInstalar(null);
      return;
    }
    // iOS Safari no soporta beforeinstallprompt: mostramos ayuda manual
    const esIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (esIOS) setMostrarAyudaIOS(true);
  }, [promptInstalar]);

  // Mostramos el botón si: hay prompt disponible (Android/Chrome/Edge)
  // o es iOS (ayuda manual). Nunca si ya está instalada.
  const esIOSNav = typeof window !== "undefined" && /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const puedeInstalar = !yaInstalada && (promptInstalar || esIOSNav);

  const pasoActivo =
    pantalla === "genero" ? 0 :
    pantalla === "presupuesto" ? 1 :
    pantalla === "familia" ? 2 :
    pantalla === "ocasion" ? 3 :
    pantalla === "intensidad" ? 4 :
    pantalla === "ancla" ? 5 : -1;

  const estilosCompartidos = `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        /* ---------------------------------------------------------
           RESET DE LA PLANTILLA DE VITE
           Vite crea todo proyecto nuevo con index.css y App.css que
           encajonan la app en 1280px centrados y centran el texto.
           Efluvio va a sangre completa, así que se anula aquí.
           --------------------------------------------------------- */
        html, body {
          margin: 0; padding: 0; width: 100%;
          background: #0E0A09;
          color: #EAE3D7;
          text-align: left;
          /* Declara el esquema como oscuro para que Chrome/Samsung Internet
             en modo oscuro forzado NO reescriban los colores del texto.
             Sin esto, algunos Android pintan el texto en negro sobre el
             fondo oscuro y la landing queda ilegible. */
          color-scheme: dark;
        }
        body { display: block; place-items: normal; min-width: 0; }
        #root {
          max-width: none; width: 100%;
          margin: 0; padding: 0;
          display: block; place-items: normal;
          text-align: left;
          color: #EAE3D7;
        }

        .es-root {
          --ink: #0E0A09;
          --ink-2: #16100E;
          --burdeos: #4A1220;
          --burdeos-lit: #6E2135;
          --hueso: #EAE3D7;
          --hueso-mute: #9C9083;
          --oro: #C99A4E;
          --oro-lit: #E2BE83;
          --linea: rgba(234,227,215,0.13);
          --display: 'Fraunces', 'Iowan Old Style', Georgia, serif;
          --cuerpo: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --dato: 'IBM Plex Mono', ui-monospace, Menlo, monospace;

          /* Escala de densidad — se redefine en cada breakpoint.
             Todo lo que respira bebe de aquí, así el ajuste fino
             de móvil o desktop se hace en un solo sitio. */
          --shell:    1120px;
          --pad-x:    32px;
          --pad-top:  128px;
          --nav-h:    56px;
          --fs-body:  16px;
          --gap-tras-apunte: 54px;

          position: relative;
          min-height: 100vh;
          background: var(--ink);
          color: var(--hueso);
          font-family: var(--cuerpo);
          font-weight: 300;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .es-root *, .es-root *::before, .es-root *::after { box-sizing: border-box; }

        .es-halo {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(122% 82% at 50% -16%,
              rgba(110,33,53,0.46) 0%,
              rgba(99,29,47,0.31) 24%,
              rgba(74,18,32,0.155) 44%,
              rgba(52,16,24,0.06) 62%,
              rgba(20,10,12,0.015) 78%,
              transparent 92%),
            radial-gradient(90% 60% at 50% 116%,
              rgba(74,18,32,0.20) 0%,
              rgba(58,16,26,0.07) 40%,
              transparent 74%);
          animation: respirar 22s ease-in-out infinite;
        }
        /* Solo opacidad: escalar un degradado a sangre completa reintroduce
           el canto que estamos evitando. */
        @keyframes respirar {
          0%,100% { opacity: .88; }
          50%     { opacity: 1; }
        }
        .es-grano {
          position: fixed; inset: 0; pointer-events: none; z-index: 1;
          background-image: ${GRANO}; opacity: 0.065; mix-blend-mode: overlay;
        }
        .es-capa { position: relative; z-index: 2; }

        /* Navegación principal */
        .es-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 var(--pad-x); height: var(--nav-h);
          background: rgba(14,10,9,0.92); backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(234,227,215,0.11);
        }
        /* El logo es serif con cuerpo; los enlaces son mono, pequeños y
           apagados. La separación la hace la jerarquía, no un tabique. */
        .es-nav-logo {
          font-family: var(--display); font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 40;
          font-size: 20px; font-weight: 600; letter-spacing: 0.055em;
          color: var(--hueso); line-height: 1;
          background: none; border: 0; cursor: pointer; padding: 0;
          transition: color 380ms ease;
        }
        .es-nav-logo:hover { color: var(--oro-lit); }
        .es-nav-links { display: flex; gap: 30px; align-items: center; }
        .es-nav-link {
          font-family: var(--dato); font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--hueso-mute); background: none;
          border: 0; cursor: pointer; padding: 4px 0; position: relative;
          transition: color 380ms ease;
        }
        .es-nav-link:hover { color: var(--hueso); }
        .es-nav-link.on {
          color: var(--oro);
          border-bottom: 1px solid rgba(201,154,78,0.45);
          padding-bottom: 3px;
        }

        /* Botón instalar app — vive dentro de la landing, no en la barra */
        .es-instalar {
          font-family: var(--dato); font-size: 11px; letter-spacing: 0.16em;
          text-transform: uppercase; color: var(--oro);
          background: transparent; border: 1px solid rgba(201,154,78,0.4);
          padding: 12px 20px; cursor: pointer; border-radius: 0;
          display: inline-flex; align-items: center; gap: 9px;
          transition: background 380ms ease, border-color 380ms ease, color 380ms ease;
        }
        .es-instalar:hover { background: rgba(201,154,78,0.09); border-color: var(--oro); color: var(--oro-lit); }
        .es-instalar svg { width: 14px; height: 14px; }

        /* Modal de ayuda para instalación en iOS */
        .es-ios-fondo {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(14,10,9,0.82); backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .es-ios-caja {
          background: var(--ink-2); border: 1px solid var(--linea);
          max-width: 420px; width: 100%; padding: 34px 30px 30px; position: relative;
        }
        .es-ios-caja h3 {
          font-family: var(--display); font-variation-settings: 'opsz' 60; font-weight: 400;
          font-size: 24px; color: var(--hueso); margin: 0 0 18px; letter-spacing: -0.01em;
        }
        .es-ios-caja ol { margin: 0; padding: 0 0 0 20px; }
        .es-ios-caja li {
          font-size: 15px; line-height: 1.7; color: var(--hueso-mute); margin-bottom: 12px;
        }
        .es-ios-caja li b { color: var(--oro-lit); font-weight: 400; }
        .es-ios-cerrar {
          position: absolute; top: 16px; right: 16px; background: none; border: 0;
          color: var(--hueso-mute); font-size: 20px; cursor: pointer; line-height: 1;
          padding: 4px;
        }
        .es-ios-cerrar:hover { color: var(--hueso); }

        /* Toggle de nicho integrado en paso género */
        .es-toggle-modo {
          margin-top: 28px; padding-top: 24px; border-top: 0.5px solid var(--linea);
        }
        .es-toggle-label {
          font-family: var(--dato); font-size: 10px; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--hueso-mute); margin-bottom: 14px;
          display: block;
        }
        .es-toggle-btns { display: flex; gap: 1px; background: var(--linea); border: 1px solid var(--linea); }
        .es-toggle-btn {
          flex: 1; background: var(--ink); border: 0; color: var(--hueso-mute);
          cursor: pointer; padding: 14px 12px; font-family: var(--dato);
          font-size: 11px; letter-spacing: 0.06em; text-align: center;
          transition: background 420ms ease, color 420ms ease;
        }
        .es-toggle-btn:hover { background: var(--ink-2); color: var(--hueso); }
        .es-toggle-btn.on { background: var(--ink-2); color: var(--oro-lit); }
        .es-toggle-pista {
          font-family: var(--dato); font-size: 10px; letter-spacing: 0.10em;
          color: rgba(156,144,131,0.65); margin-top: 10px; line-height: 1.6;
        }

        /* Páginas de contenido (modo lectura claro) */
        .es-pagina-clara {
          background: #F2EDE4; min-height: 100vh; color: #2C2118;
          padding: calc(var(--nav-h) + 34px) var(--pad-x) 60px;
        }
        .es-pagina-clara .es-contenedor {
          max-width: 780px; margin: 0 auto;
        }
        .es-pagina-clara .es-articulo-card p,
        .es-pagina-clara .es-red-card p { font-size: var(--fs-body); }
        .es-pagina-clara h1 {
          font-family: var(--display); font-weight: 300; font-size: clamp(30px, 5vw, 42px);
          line-height: 1.08; letter-spacing: -0.02em; color: #1A1410; margin: 0 0 12px;
        }
        .es-pagina-clara .es-intro {
          font-family: var(--display); font-style: italic; font-size: 18px;
          line-height: 1.55; color: #5C4F43; margin: 0 0 32px;
        }
        .es-pagina-clara .es-articulo-card {
          border: 0.5px solid rgba(90,75,60,0.2); padding: 24px 26px;
          margin-bottom: 16px; cursor: pointer; background: #F7F3EC;
          transition: background 380ms ease, border-color 380ms ease;
        }
        .es-pagina-clara .es-articulo-card:hover {
          background: #EDE7DC; border-color: rgba(201,154,78,0.4);
        }
        .es-pagina-clara .es-articulo-card h3 {
          font-family: var(--display); font-weight: 400; font-size: 22px;
          color: #1A1410; margin: 0 0 8px; line-height: 1.15;
        }
        .es-pagina-clara .es-articulo-card p {
          font-size: 14px; color: #5C4F43; margin: 0; line-height: 1.6;
        }
        .es-pagina-clara .es-articulo-card .es-meta {
          font-family: var(--dato); font-size: 10px; letter-spacing: 0.14em;
          color: #8A7E72; margin-top: 10px;
        }
        .es-pagina-clara .es-redes-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px; margin-top: 28px;
        }
        .es-pagina-clara .es-red-card {
          border: 0.5px solid rgba(90,75,60,0.2); padding: 28px 22px;
          text-align: center; background: #F7F3EC; transition: border-color 380ms ease;
        }
        .es-pagina-clara .es-red-card:hover { border-color: rgba(201,154,78,0.4); }
        .es-pagina-clara .es-red-card h3 {
          font-family: var(--dato); font-size: 12px; letter-spacing: 0.16em;
          text-transform: uppercase; color: #1A1410; margin: 0 0 8px;
        }
        .es-pagina-clara .es-red-card p {
          font-size: 14px; color: #5C4F43; margin: 0; line-height: 1.5;
        }
        .es-pagina-clara .es-red-link {
          display: inline-block; margin-top: 12px; font-family: var(--dato);
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: #C99A4E; text-decoration: none;
        }

        .es-escenario {
          min-height: 100vh; display: flex; flex-direction: column;
          justify-content: center; padding: var(--pad-top) var(--pad-x) 72px;
          max-width: var(--shell); margin: 0 auto;
        }

        /* DOS COLUMNAS EN DESKTOP — la pregunta se queda fija a la
           izquierda mientras se responde a la derecha. Es lo que llena
           el ancho sin inventar decoración para rellenarlo. */
        @media (min-width: 1024px) {
          .es-escena-2col {
            display: grid;
            grid-template-columns: minmax(300px, 0.82fr) minmax(0, 1.18fr);
            column-gap: 76px;
            align-content: center;
          }
          .es-escena-2col > .es-guia {
            grid-column: 1; grid-row: 1 / span 40;
            align-self: start; position: sticky; top: calc(var(--nav-h) + 64px);
          }
          .es-escena-2col > *:not(.es-guia) { grid-column: 2; }
          .es-escena-2col .es-apunte { margin-bottom: 0; }
          .es-escena-2col > *:not(.es-guia) + *:not(.es-guia) { margin-top: 26px; }
          /* Dentro de la columna derecha las rejillas van a 2 columnas:
             cuatro celdas estrechas se leerían como una barra de iconos. */
          .es-escena-2col .es-rejilla,
          .es-escena-2col .es-rejilla-familias { grid-template-columns: repeat(2, 1fr); }
        }

        .es-entra { animation: entra 620ms cubic-bezier(.22,.61,.36,1) both; }
        .es-entra-2 { animation: entra 620ms cubic-bezier(.22,.61,.36,1) 120ms both; }
        .es-entra-3 { animation: entra 620ms cubic-bezier(.22,.61,.36,1) 240ms both; }
        .es-entra-4 { animation: entra 620ms cubic-bezier(.22,.61,.36,1) 360ms both; }
        @keyframes entra { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

        .es-eyebrow {
          font-family: var(--dato); font-size: 11px; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--oro); margin: 0 0 26px;
        }
        .es-titular {
          font-family: var(--display); font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 144;
          font-weight: 400; font-size: clamp(38px, 6.4vw, 76px); line-height: 1.04;
          letter-spacing: -0.02em; margin: 0; max-width: 15ch;
          color: #EAE3D7;
        }
        .es-titular em { font-style: italic; color: #E2BE83; }
        .es-bajada {
          font-size: 17px; line-height: 1.75; color: #9C9083;
          max-width: 46ch; margin: 30px 0 0;
        }

        .es-btn {
          font-family: var(--dato); font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
          background: transparent; color: var(--hueso); border: 1px solid var(--linea);
          padding: 17px 34px; cursor: pointer; border-radius: 0;
          transition: border-color 480ms ease, color 480ms ease, background 480ms ease, letter-spacing 480ms ease;
        }
        .es-btn:hover { border-color: var(--oro); color: var(--oro-lit); letter-spacing: 0.24em; }
        .es-btn:focus-visible { outline: 1px solid var(--oro); outline-offset: 4px; }
        .es-btn-oro { border-color: rgba(201,154,78,0.5); color: var(--oro-lit); }
        .es-btn-oro:hover { background: rgba(201,154,78,0.09); }
        .es-btn-fantasma { border-color: transparent; color: var(--hueso-mute); padding-left: 0; padding-right: 22px; }
        .es-btn-fantasma:hover { color: var(--hueso); letter-spacing: 0.18em; }

        .es-susurro {
          font-family: var(--dato); font-size: 11px; letter-spacing: 0.14em;
          color: var(--hueso-mute); margin: 0;
        }

        /* La escalera vivía a 30px del borde, es decir, detrás de la
           barra fija de 52px. Ahora arranca justo por debajo. */
        .es-escalera {
          position: absolute; top: calc(var(--nav-h) + 20px); left: 50%; transform: translateX(-50%); z-index: 4;
          display: flex; flex-direction: row; gap: 18px; align-items: center;
          padding: 8px 22px; background: rgba(14,10,9,0.55); backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px); border: 1px solid var(--linea);
        }
        .es-peldano { display: flex; align-items: center; gap: 10px; font-family: var(--dato); font-size: 10px; letter-spacing: 0.16em; color: rgba(156,144,131,0.45); transition: color 520ms ease; }
        .es-peldano span.rule { display: block; width: 16px; height: 1px; background: currentColor; transition: width 520ms ease, background 520ms ease; }
        .es-peldano.on { color: var(--oro); }
        .es-peldano.on span.rule { width: 30px; }
        .es-peldano.done { color: var(--hueso-mute); }
        .es-peldano-sep { width: 1px; height: 10px; background: var(--linea); }

        .es-pregunta {
          font-family: var(--display); font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 120;
          font-weight: 400; font-size: clamp(28px, 4vw, 46px); line-height: 1.15;
          letter-spacing: -0.015em; margin: 0 0 8px; max-width: 20ch;
        }
        .es-apunte { font-size: 15px; color: var(--hueso-mute); margin: 0 0 54px; max-width: 48ch; line-height: 1.7; }

        .es-cifra {
          font-family: var(--display); font-variation-settings: 'opsz' 144;
          font-weight: 300; font-size: clamp(52px, 9vw, 92px); line-height: 1;
          letter-spacing: -0.03em; color: var(--hueso);
        }
        .es-cifra i { font-style: normal; font-family: var(--dato); font-size: 0.32em; color: var(--oro); letter-spacing: 0.1em; vertical-align: 0.9em; margin-left: 10px; }

        .es-slider { -webkit-appearance: none; appearance: none; width: 100%; background: transparent; margin: 34px 0 0; cursor: pointer; }
        .es-slider::-webkit-slider-runnable-track { height: 1px; background: var(--linea); }
        .es-slider::-moz-range-track { height: 1px; background: var(--linea); }
        .es-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 15px; height: 15px; border-radius: 50%;
          background: var(--oro); margin-top: -7px; border: 0;
          box-shadow: 0 0 0 0 rgba(201,154,78,0.35); transition: box-shadow 420ms ease;
        }
        .es-slider::-moz-range-thumb { width: 15px; height: 15px; border-radius: 50%; background: var(--oro); border: 0; }
        .es-slider:hover::-webkit-slider-thumb { box-shadow: 0 0 0 9px rgba(201,154,78,0.14); }
        .es-slider:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 9px rgba(201,154,78,0.24); }
        .es-slider:focus { outline: none; }
        .es-topes { display: flex; justify-content: space-between; font-family: var(--dato); font-size: 10px; letter-spacing: 0.14em; color: rgba(156,144,131,0.65); margin-top: 14px; }

        .es-rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(158px, 1fr)); gap: 1px; background: var(--linea); border: 1px solid var(--linea); }
        /* Rejilla de familias: 8 opciones, 4 columnas fijas = 2 filas
           exactas siempre, sin depender del ancho disponible */
        .es-rejilla-familias { grid-template-columns: repeat(4, 1fr); }
        .es-familia {
          background: var(--ink); border: 0; color: var(--hueso-mute); cursor: pointer;
          padding: 30px 20px 26px; text-align: left; display: flex; flex-direction: column; gap: 14px;
          transition: background 520ms ease, color 520ms ease;
        }
        .es-familia:hover { background: var(--ink-2); color: var(--hueso); }
        .es-familia:focus-visible { outline: 1px solid var(--oro); outline-offset: -3px; }
        .es-familia.on { background: var(--ink-2); color: var(--oro-lit); }
        .es-familia h3 { font-family: var(--display); font-variation-settings: 'opsz' 60; font-weight: 400; font-size: 19px; margin: 0; letter-spacing: -0.01em; }
        .es-familia p { font-family: var(--dato); font-size: 10px; letter-spacing: 0.09em; margin: 0; opacity: 0.72; line-height: 1.6; }
        .es-familia svg { transition: transform 620ms cubic-bezier(.22,.61,.36,1); }
        .es-familia:hover svg, .es-familia.on svg { transform: translateY(-3px); }

        .es-par { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 8px; }
        .es-par h4 { font-family: var(--dato); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--hueso-mute); margin: 0 0 20px; font-weight: 400; }
        .es-tocho { border: 1px solid var(--linea); }
        .es-opcion {
          display: flex; align-items: baseline; justify-content: space-between; gap: 20px;
          padding: 20px 22px; background: transparent; border: 0; border-bottom: 1px solid rgba(234,227,215,0.05);
          color: var(--hueso-mute); cursor: pointer; width: 100%; text-align: left; font-family: var(--cuerpo);
          transition: background 480ms ease, color 480ms ease, padding-left 480ms ease;
        }
        .es-opcion:last-child { border-bottom: 0; }
        .es-opcion:hover { color: var(--hueso); padding-left: 28px; }
        .es-opcion.on { color: var(--oro-lit); background: rgba(201,154,78,0.06); }
        .es-opcion:focus-visible { outline: 1px solid var(--oro); outline-offset: -2px; }
        .es-opcion .es-op-t { font-family: var(--display); font-variation-settings: 'opsz' 40; font-size: 20px; letter-spacing: -0.01em; }
        .es-opcion .es-op-s { font-family: var(--dato); font-size: 10px; letter-spacing: 0.12em; opacity: 0.65; }

        .es-medida { display: flex; align-items: baseline; gap: 20px; margin-top: 30px; }
        .es-medida .n { font-family: var(--display); font-variation-settings: 'opsz' 144; font-size: 84px; font-weight: 300; line-height: 1; color: var(--hueso); }
        .es-medida .l { font-family: var(--display); font-style: italic; font-size: 22px; color: var(--oro-lit); font-weight: 400; }
        .es-medida .d { font-family: var(--dato); font-size: 11px; letter-spacing: 0.14em; color: var(--hueso-mute); max-width: 32ch; line-height: 1.65; margin-left: auto; }
        .es-marcas { display: flex; justify-content: space-between; margin-top: 22px; font-family: var(--dato); font-size: 10px; letter-spacing: 0.14em; color: rgba(156,144,131,0.55); }
        .es-marcas span.dot { display: block; width: 4px; height: 4px; border-radius: 50%; background: currentColor; margin: 0 auto 8px; }
        .es-marcas div { text-align: center; }

        .es-campo {
          width: 100%; background: transparent; border: 0; border-bottom: 1px solid var(--linea);
          color: var(--hueso); font-family: var(--display); font-variation-settings: 'opsz' 40;
          font-size: 26px; font-weight: 300; padding: 14px 0; letter-spacing: -0.01em;
          transition: border-color 480ms ease;
        }
        .es-campo::placeholder { color: rgba(156,144,131,0.4); font-style: italic; }
        .es-campo:focus { outline: none; border-color: var(--oro); }
        .es-sugieres { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
        .es-sugieres button {
          background: transparent; border: 1px solid var(--linea); color: var(--hueso-mute);
          padding: 7px 14px; font-family: var(--dato); font-size: 11px; letter-spacing: 0.06em;
          cursor: pointer; transition: color 380ms ease, border-color 380ms ease;
        }
        .es-sugieres button:hover { color: var(--oro-lit); border-color: rgba(201,154,78,0.4); }

        .es-carta { border-top: 1px solid var(--linea); padding: 46px 0; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 56px; }
        .es-casa { font-family: var(--dato); font-size: 10px; letter-spacing: 0.26em; text-transform: uppercase; color: var(--oro); margin: 0 0 12px; }
        .es-nombre { font-family: var(--display); font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 120; font-weight: 400; font-size: clamp(30px, 3.6vw, 42px); line-height: 1.06; letter-spacing: -0.02em; margin: 0; }
        .es-sub { font-family: var(--dato); font-size: 11px; letter-spacing: 0.12em; color: var(--hueso-mute); margin: 12px 0 0; }
        .es-voz { font-family: var(--display); font-variation-settings: 'opsz' 20; font-weight: 300; font-style: italic; font-size: 19px; line-height: 1.65; color: rgba(234,227,215,0.86); margin: 28px 0 0; max-width: 42ch; }

        .es-trail { display: flex; gap: 18px; margin: 36px 0 0; }
        .es-columna { display: flex; flex-direction: column; width: 5px; flex-shrink: 0; }
        .es-banda { width: 100%; }
        .es-fases { display: flex; flex-direction: column; flex: 1; }
        .es-fase { display: flex; flex-direction: column; justify-content: center; }
        .es-fase-cab { font-family: var(--dato); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--hueso-mute); margin: 0 0 5px; display: flex; gap: 12px; align-items: baseline; }
        .es-fase-cab b { font-weight: 400; color: rgba(156,144,131,0.6); letter-spacing: 0.1em; text-transform: none; }
        .es-fase-notas { font-size: 14px; color: rgba(234,227,215,0.9); margin: 0; line-height: 1.5; }

        .es-precios { border: 1px solid var(--linea); }
        .es-precio-cab { font-family: var(--dato); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--hueso-mute); padding: 16px 20px; border-bottom: 1px solid var(--linea); margin: 0; }
        .es-fila { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; font-family: var(--dato); font-size: 13px; border-bottom: 1px solid rgba(234,227,215,0.06); }
        .es-fila:last-of-type { border-bottom: 0; }
        .es-fila.mejor { background: rgba(201,154,78,0.07); color: var(--oro-lit); }
        .es-fila.nd { color: rgba(156,144,131,0.45); }
        .es-tag { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--oro); margin-left: 10px; }
        .es-comprar { width: 100%; border: 0; border-top: 1px solid var(--linea); }

        .es-pie { border-top: 1px solid var(--linea); margin-top: 56px; padding: 34px 0 0; display: flex; flex-wrap: wrap; gap: 20px; justify-content: space-between; align-items: center; }

        /* --- MONITOR ANCHO: desde 1440px --- */
        @media (min-width: 1440px) {
          .es-root { --shell: 1240px; --pad-x: 48px; }
          .es-escena-2col { column-gap: 92px; }
        }

        /* --- TABLET: hasta 860px --- */
        @media (max-width: 860px) {
          .es-root { --pad-x: 24px; --pad-top: 120px; }
          .es-carta { grid-template-columns: 1fr; gap: 36px; }
          .es-marca { left: 22px; }
          .es-par { grid-template-columns: 1fr; gap: 28px; }
          .es-escalera { padding: 6px 14px; gap: 10px; }
          .es-peldano span.rule { width: 10px; }
          .es-peldano.on span.rule { width: 20px; }
        }

        /* --- MÓVIL: hasta 560px --- */
        @media (max-width: 560px) {
          /* Menos aire exterior, cuerpo de texto más grande, interlineado
             más corto. Es lo contrario de lo habitual y es justo lo que
             da densidad: el texto pequeño con mucho aire lee a formulario,
             el texto grande con poco aire lee a página impresa. */
          .es-root {
            --pad-x: 16px;
            --pad-top: 96px;
            --nav-h: 52px;
            --fs-body: 17px;
            --gap-tras-apunte: 30px;
          }
          .es-nav-logo { font-size: 18px; letter-spacing: 0.05em; }
          .es-nav-links { gap: 20px; }
          .es-nav-link { font-size: 9.5px; letter-spacing: 0.14em; }
          .es-marca {
            top: 20px; left: 20px;
            font-size: 10px; letter-spacing: 0.28em;
          }
          .es-escalera {
            top: 18px; padding: 5px 10px; gap: 7px;
            border: 0.5px solid var(--linea);
          }
          .es-peldano { font-size: 9px; letter-spacing: 0.12em; }
          .es-peldano span.rule { width: 7px; }
          .es-peldano.on span.rule { width: 14px; }
          .es-peldano-sep { height: 7px; }

          .es-escenario { min-height: auto; padding-bottom: 40px; }
          .es-apunte { margin-bottom: var(--gap-tras-apunte); }

          .es-titular {
            font-size: clamp(30px, 9vw, 44px);
            line-height: 1.05;
          }
          .es-pregunta {
            font-size: clamp(24px, 6.5vw, 32px);
            line-height: 1.15;
          }
          .es-bajada, .es-apunte { font-size: var(--fs-body); line-height: 1.58; }
          .es-eyebrow { font-size: 10px; letter-spacing: 0.22em; margin-bottom: 20px; }

          /* Botones táctiles: 44px mínimo de altura */
          .es-btn { padding: 15px 24px; font-size: 11px; width: 100%; text-align: center; }
          .es-btn-fantasma { padding: 14px 0; text-align: left; width: auto; }

          /* Rejilla de familias/género en móvil: tarjetas separadas
             con aire real entre ellas, no celdas pegadas a fondo negro.
             El gap visible + fondo propio en cada celda es lo que las
             hace sentir acogedoras en vez de frías y distantes. */
          .es-rejilla {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            background: transparent;
            border: 0;
          }
          .es-familia {
            padding: 24px 16px 22px;
            gap: 12px;
            border: 1px solid var(--linea);
            background: rgba(234,227,215,0.02);
            box-shadow: inset 0 0 28px rgba(110,33,53,0.10);
            transition: background 380ms ease, border-color 380ms ease, transform 120ms ease;
          }
          .es-familia.on {
            border-color: rgba(201,154,78,0.45);
            box-shadow: inset 0 0 28px rgba(201,154,78,0.08);
          }
          .es-familia:active {
            background: var(--ink-2);
            transform: scale(0.97);
          }
          .es-familia h3 { font-size: 18px; }
          .es-familia p { font-size: 11px; line-height: 1.5; opacity: 0.85; }
          .es-familia svg { width: 40px; height: 40px; }

          /* La rejilla de familias (6 opciones) también en 2 columnas
             en móvil — 3 filas exactas, mismo criterio sin huecos */
          .es-rejilla-familias { grid-template-columns: 1fr 1fr; }

          /* Slider de presupuesto: cifra y pista más contenidas */
          .es-cifra { font-size: clamp(44px, 12vw, 64px); }
          .es-cifra i { font-size: 0.28em; margin-left: 6px; }

          /* Selectores de ocasión/temporada */
          .es-par h4 { margin-bottom: 14px; }
          .es-opcion { padding: 16px 18px; }
          .es-opcion .es-op-t { font-size: 17px; }
          .es-opcion:hover { padding-left: 22px; }

          /* Escala de intensidad: menos aire, sin texto lateral flotando */
          .es-medida { flex-direction: column; align-items: flex-start; gap: 6px; margin-top: 24px; }
          .es-medida .n { font-size: 64px; }
          .es-medida .l { font-size: 18px; }
          .es-medida .d { margin-left: 0; font-size: 12px; }
          .es-marcas { font-size: 9px; letter-spacing: 0.08em; }
          .es-marcas span.dot { width: 3px; height: 3px; }

          /* Ancla */
          .es-campo { font-size: 22px; padding: 12px 0; }
          .es-sugieres button { padding: 6px 12px; font-size: 10px; }

          /* Carta de resultado: apilada y más compacta */
          .es-carta { padding: 30px 0; gap: 22px; }
          .es-nombre { font-size: clamp(27px, 6.4vw, 33px); }
          .es-voz { font-size: var(--fs-body); line-height: 1.55; margin-top: 18px; }
          .es-casa { font-size: 9px; letter-spacing: 0.22em; }

          /* Trail: bandas y notas más compactas */
          .es-trail { gap: 14px; margin-top: 22px; align-items: stretch; }
          .es-columna { width: 4px; display: flex; flex-direction: column; }
          .es-fase-cab { font-size: 9px; letter-spacing: 0.16em; }
          .es-fase-cab b { font-size: 10px; }
          .es-fase-notas { font-size: 14px; line-height: 1.45; }
          /* En móvil las fases se reparten proporcionalmente el alto real
             del bloque, y las bandas de color se estiran con ellas */
          .es-fases { min-height: 0; flex: 1; }
          .es-fase { padding: 8px 0; min-height: 0 !important; height: auto !important; }
          .es-fase[data-fase="salida"]  { flex: 1; }
          .es-fase[data-fase="corazon"] { flex: 1.6; }
          .es-fase[data-fase="fondo"]   { flex: 2.2; }
          .es-banda { min-height: 0 !important; height: auto !important; }
          .es-banda[data-fase="salida"]  { flex: 1; }
          .es-banda[data-fase="corazon"] { flex: 1.6; }
          .es-banda[data-fase="fondo"]   { flex: 2.2; }

          /* Bloque de precios */
          .es-precio-cab { padding: 13px 16px; font-size: 9px; letter-spacing: 0.18em; }
          .es-fila { padding: 13px 16px; font-size: 12px; }
          .es-tag { font-size: 8px; margin-left: 6px; }
          .es-comprar {
            padding: 18px 20px;
            font-size: 11px;
            width: 100%;
          }

          /* Pie de página */
          .es-pie { margin-top: 32px; padding: 24px 0 0; flex-direction: column; align-items: flex-start; gap: 18px; }
          .es-pagina-clara { padding: calc(var(--pad-top) - 24px) var(--pad-x) 48px; }

          /* Filas de botones: apiladas verticalmente para llegar bien con el pulgar */
          section .es-btn + .es-btn,
          section .es-btn-fantasma + .es-btn {
            margin-top: 4px;
          }
        }

        /* --- MÓVIL PEQUEÑO: hasta 380px --- */
        @media (max-width: 380px) {
          .es-root { --pad-x: 14px; --fs-body: 16px; --gap-tras-apunte: 24px; }
          .es-rejilla { grid-template-columns: 1fr; }
          .es-rejilla-familias { grid-template-columns: 1fr 1fr; }
          .es-titular { font-size: 30px; }
          .es-nav-logo { font-size: 17px; }
          .es-nav-links { gap: 14px; }
          .es-nav-link { font-size: 9px; letter-spacing: 0.1em; }
          .es-escenario { padding-bottom: 32px; }
          .es-familia { padding: 20px 14px 18px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .es-root *, .es-root *::before, .es-root *::after {
            animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;

  return (
    <>
    {pagina === "sommelier" && (
    <div className="es-root">
      <style>{estilosCompartidos}</style>

      <div className="es-halo" />
      <div className="es-grano" />

      <nav className="es-nav">
        <button className="es-nav-logo" onClick={() => { setPagina("sommelier"); setPantalla("landing"); }}>
          Efluvio
        </button>
        <div className="es-nav-links">
          <button
            className={`es-nav-link ${pagina === "sommelier" ? "on" : ""}`}
            onClick={() => setPagina("sommelier")}
          >
            Sommelier
          </button>
          <button
            className={`es-nav-link ${pagina === "guia" ? "on" : ""}`}
            onClick={() => setPagina("guia")}
          >
            Guía
          </button>
          <button
            className={`es-nav-link ${pagina === "comunidad" ? "on" : ""}`}
            onClick={() => setPagina("comunidad")}
          >
            Comunidad
          </button>
        </div>
      </nav>

      {mostrarAyudaIOS && (
        <div className="es-ios-fondo" onClick={() => setMostrarAyudaIOS(false)}>
          <div className="es-ios-caja" onClick={(e) => e.stopPropagation()}>
            <button className="es-ios-cerrar" onClick={() => setMostrarAyudaIOS(false)} aria-label="Cerrar">×</button>
            <h3>Añadir a la pantalla de inicio</h3>
            <ol>
              <li>Toca el botón <b>Compartir</b> en la barra de Safari (el cuadrado con la flecha hacia arriba).</li>
              <li>Baja y elige <b>Añadir a pantalla de inicio</b>.</li>
              <li>Confirma con <b>Añadir</b>. Efluvio aparecerá como una app más.</li>
            </ol>
          </div>
        </div>
      )}

      {pasoActivo >= 0 && (
        <nav className="es-escalera" aria-label="Progreso">
          {PASOS.map((p, i) => (
            <React.Fragment key={p.n}>
              <div
                className={`es-peldano ${i === pasoActivo ? "on" : ""} ${i < pasoActivo ? "done" : ""}`}
                aria-current={i === pasoActivo ? "step" : undefined}
              >
                <span className="rule" />
                {p.n}
              </div>
              {i < PASOS.length - 1 && <span className="es-peldano-sep" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="es-capa">
        {pantalla === "landing" && (
          <section className="es-escenario" key="landing">
            <p className="es-eyebrow es-entra">Sommelier de perfumería · España</p>
            <h1 className="es-titular es-entra-2">
              Antes de comprar a ciegas, <em>huele con la cabeza.</em>
            </h1>
            <p className="es-bajada es-entra-3">
              Seis preguntas sobre lo que te gusta. Una selección de perfumes que
              encajan de verdad, con el precio de cada tienda puesto uno al lado del
              otro. Sin cuenta, sin correo, sin nadie detrás del mostrador.
            </p>
            <div className="es-entra-4" style={{ marginTop: 46, display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center" }}>
              <button className="es-btn es-btn-oro" onClick={() => setPantalla("genero")}>
                Empezar
              </button>
              <p className="es-susurro">30 segundos · 4 tiendas comparadas · sin registro</p>
            </div>

            {puedeInstalar && (
              <div className="es-entra-4" style={{ marginTop: 34 }}>
                <button className="es-instalar" onClick={instalarApp} aria-label="Instalar Efluvio como app">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" />
                  </svg>
                  Instalar como app
                </button>
              </div>
            )}
          </section>
        )}

        {pantalla === "genero" && (
          <section className="es-escenario es-escena-2col" key="genero">
            <div className="es-guia">
            <p className="es-eyebrow es-entra">Paso 01 — Género</p>
            <h2 className="es-pregunta es-entra">¿Para quién buscamos?</h2>
            <p className="es-apunte es-entra-2">
              No es una casilla que te encierre, es solo para no enseñarte 200
              perfumes que no te interesan. Puedes cambiarlo cuando quieras.
            </p>
            </div>

            <div className="es-rejilla es-entra-3">
              {[
                { id: "femenino", t: "Femenino", s: "Perfumería de mujer" },
                { id: "masculino", t: "Masculino", s: "Perfumería de hombre" },
                { id: "unisex", t: "Unisex", s: "Sin distinción de género" },
                { id: "todos", t: "Sorpréndeme", s: "Muéstrame de todo" },
              ].map((g) => (
                <button
                  key={g.id}
                  className={`es-familia ${genero === g.id ? "on" : ""}`}
                  onClick={() => setGenero(g.id)}
                  aria-pressed={genero === g.id}
                  style={{ alignItems: "flex-start" }}
                >
                  <h3 style={{ marginTop: 4 }}>{g.t}</h3>
                  <p>{g.s}</p>
                </button>
              ))}
            </div>

            <div className="es-toggle-modo es-entra-4">
              <span className="es-toggle-label">Tipo de perfumería</span>
              <div className="es-toggle-btns">
                <button
                  className={`es-toggle-btn ${modo === "diseñador" ? "on" : ""}`}
                  onClick={() => setModo("diseñador")}
                >
                  Diseñador
                </button>
                <button
                  className={`es-toggle-btn ${modo === "nicho" ? "on" : ""}`}
                  onClick={() => setModo("nicho")}
                >
                  Nicho
                </button>
                <button
                  className={`es-toggle-btn ${modo === "todos" ? "on" : ""}`}
                  onClick={() => setModo("todos")}
                >
                  Todo
                </button>
              </div>
              <p className="es-toggle-pista">
                {modo === "diseñador" && "Dior, Chanel, YSL, Armani... Las casas que encuentras en cualquier perfumería."}
                {modo === "nicho" && "Xerjoff, Initio, Amouage, MFK... Perfumería exclusiva, distribución limitada."}
                {modo === "todos" && "Sin filtrar. Diseñador y nicho juntos."}
              </p>
            </div>

            <div style={{ marginTop: 28, display: "flex", gap: 18, alignItems: "center" }}>
              <button className="es-btn es-btn-fantasma" onClick={() => setPantalla("landing")}>
                Atrás
              </button>
              <button
                className="es-btn es-btn-oro"
                disabled={!genero}
                style={!genero ? { opacity: 0.35, cursor: "not-allowed" } : undefined}
                onClick={() => genero && setPantalla("presupuesto")}
              >
                Continuar
              </button>
            </div>
          </section>
        )}

        {pantalla === "presupuesto" && (
          <section className="es-escenario es-escena-2col" key="presupuesto">
            <div className="es-guia">
            <p className="es-eyebrow es-entra">Paso 02 — Presupuesto</p>
            <h2 className="es-pregunta es-entra">¿Cuánto quieres gastarte?</h2>
            <p className="es-apunte es-entra-2">
              Es un techo, no un objetivo. Nada de lo que te enseñemos después pasará
              de aquí.
            </p>
            </div>

            <div className="es-entra-3" style={{ maxWidth: 620 }}>
              <div className="es-cifra">
                {presupuesto >= 300 ? "300+" : presupuesto}
                <i>EUR</i>
              </div>
              <input
                className="es-slider"
                type="range"
                min="20"
                max="300"
                step="5"
                value={presupuesto}
                onChange={(e) => setPresupuesto(Number(e.target.value))}
                aria-label="Presupuesto máximo en euros"
              />
              <div className="es-topes">
                <span>20 €</span>
                <span>300 € y más</span>
              </div>
              <p className="es-susurro" style={{ marginTop: 30, lineHeight: 1.7, maxWidth: "42ch" }}>
                {pistaPresupuesto(presupuesto)}
              </p>
            </div>

            <div className="es-entra-4" style={{ marginTop: 58, display: "flex", gap: 18, alignItems: "center" }}>
              <button className="es-btn es-btn-fantasma" onClick={() => setPantalla("genero")}>
                Atrás
              </button>
              <button className="es-btn es-btn-oro" onClick={() => setPantalla("familia")}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {pantalla === "familia" && (
          <section className="es-escenario es-escena-2col" key="familia">
            <div className="es-guia">
            <p className="es-eyebrow es-entra">Paso 03 — Familia olfativa</p>
            <h2 className="es-pregunta es-entra">¿Hacia dónde tira tu nariz?</h2>
            <p className="es-apunte es-entra-2">
              Elige todas las que te suenen bien. Si no tienes ni idea, sáltalo: lo
              deducimos del resto de respuestas.
            </p>
            </div>

            <div className="es-rejilla es-rejilla-familias es-entra-3">
              {FAMILIAS.map((f) => (
                <button
                  key={f.id}
                  className={`es-familia ${familias.includes(f.id) ? "on" : ""}`}
                  onClick={() => alternarFamilia(f.id)}
                  aria-pressed={familias.includes(f.id)}
                >
                  <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
                    {f.path}
                  </svg>
                  <div>
                    <h3>{f.nombre}</h3>
                    <p style={{ marginTop: 6 }}>{f.pista}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="es-entra-4" style={{ marginTop: 48, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <button className="es-btn es-btn-fantasma" onClick={() => setPantalla("presupuesto")}>
                Atrás
              </button>
              <button className="es-btn es-btn-oro" onClick={() => setPantalla("ocasion")}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {pantalla === "ocasion" && (
          <section className="es-escenario es-escena-2col" key="ocasion">
            <div className="es-guia">
            <p className="es-eyebrow es-entra">Paso 04 — Cuándo lo vas a llevar</p>
            <h2 className="es-pregunta es-entra">¿Para qué momento?</h2>
            <p className="es-apunte es-entra-2">
              Los perfumes tienen contexto. Uno que funciona en agosto por la mañana
              no funciona en enero por la noche, por muy bueno que sea.
            </p>
            </div>

            <div className="es-par es-entra-3">
              <div>
                <h4>Ocasión</h4>
                <div className="es-tocho">
                  {[
                    { id: "diario", t: "Diario", s: "Oficina, calle, cotidiano" },
                    { id: "noche", t: "Noche", s: "Cenas, salidas, planes largos" },
                    { id: "especial", t: "Especial", s: "Bodas, entrevistas, momentos" },
                    { id: "casa", t: "Casa", s: "Solo para ti, sin nadie más" },
                  ].map((o) => (
                    <button
                      key={o.id}
                      className={`es-opcion ${ocasion === o.id ? "on" : ""}`}
                      onClick={() => setOcasion(o.id)}
                      aria-pressed={ocasion === o.id}
                    >
                      <span className="es-op-t">{o.t}</span>
                      <span className="es-op-s">{o.s}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4>Temporada</h4>
                <div className="es-tocho">
                  {[
                    { id: "verano", t: "Verano", s: "Calor, sudor, evaporación rápida" },
                    { id: "otono", t: "Otoño", s: "Templado, transición, capas" },
                    { id: "invierno", t: "Invierno", s: "Frío, abrigos, proyección larga" },
                    { id: "todo", t: "Todo el año", s: "Que aguante cualquier estación" },
                  ].map((o) => (
                    <button
                      key={o.id}
                      className={`es-opcion ${temporada === o.id ? "on" : ""}`}
                      onClick={() => setTemporada(o.id)}
                      aria-pressed={temporada === o.id}
                    >
                      <span className="es-op-t">{o.t}</span>
                      <span className="es-op-s">{o.s}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="es-entra-4" style={{ marginTop: 48, display: "flex", gap: 18, alignItems: "center" }}>
              <button className="es-btn es-btn-fantasma" onClick={() => setPantalla("familia")}>
                Atrás
              </button>
              <button className="es-btn es-btn-oro" onClick={() => setPantalla("intensidad")}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {pantalla === "intensidad" && (
          <section className="es-escenario es-escena-2col" key="intensidad">
            <div className="es-guia">
            <p className="es-eyebrow es-entra">Paso 05 — Intensidad</p>
            <h2 className="es-pregunta es-entra">¿Cuánto quieres que se note?</h2>
            <p className="es-apunte es-entra-2">
              La intensidad no es la calidad. Un perfume discreto puede ser tan
              caro como uno que llena una habitación. Aquí es solo cuestión de
              gusto y de cómo lo quieres llevar.
            </p>
            </div>

            <div className="es-entra-3" style={{ maxWidth: 640 }}>
              <div className="es-medida">
                <span className="n">{intensidad}</span>
                <span className="l">
                  {["Piel", "Discreto", "Presente", "Envolvente", "Estela"][intensidad - 1]}
                </span>
                <span className="d">
                  {[
                    "Solo lo hueles tú al acercarte. Íntimo, casi como un aceite.",
                    "Se percibe a menos de un metro. Educado, sobrio.",
                    "Rellena tu espacio personal. Se nota cuando te saludan.",
                    "Cruza la habitación. Se recuerda al día siguiente.",
                    "Deja rastro por donde pasas. Alguien preguntará.",
                  ][intensidad - 1]}
                </span>
              </div>

              <input
                className="es-slider"
                type="range"
                min="1"
                max="5"
                step="1"
                value={intensidad}
                onChange={(e) => setIntensidad(Number(e.target.value))}
                aria-label="Intensidad deseada, de 1 a 5"
                style={{ marginTop: 46 }}
              />
              <div className="es-marcas">
                {["Piel", "Discreto", "Presente", "Envolvente", "Estela"].map((m) => (
                  <div key={m}>
                    <span className="dot" />
                    {m}
                  </div>
                ))}
              </div>
            </div>

            <div className="es-entra-4" style={{ marginTop: 58, display: "flex", gap: 18, alignItems: "center" }}>
              <button className="es-btn es-btn-fantasma" onClick={() => setPantalla("ocasion")}>
                Atrás
              </button>
              <button className="es-btn es-btn-oro" onClick={() => setPantalla("ancla")}>
                Continuar
              </button>
            </div>
          </section>
        )}

        {pantalla === "ancla" && (
          <section className="es-escenario es-escena-2col" key="ancla">
            <div className="es-guia">
            <p className="es-eyebrow es-entra">Paso 06 — Un ancla, si quieres</p>
            <h2 className="es-pregunta es-entra">¿Hay algún perfume que ya te enamore?</h2>
            <p className="es-apunte es-entra-2">
              Si lo hay, escríbelo. Nos ayuda a calibrar mucho mejor, porque
              deducimos tu gusto de algo real. Si no, salta al final: con lo que
              nos has dicho ya tenemos lo suficiente.
            </p>
            </div>

            <div className="es-entra-3" style={{ maxWidth: 620 }}>
              <input
                className="es-campo"
                type="text"
                value={ancla}
                onChange={(e) => setAncla(e.target.value)}
                placeholder="Aventus, Baccarat Rouge 540, Sauvage…"
                aria-label="Perfume ancla (opcional)"
              />
              <p className="es-susurro" style={{ marginTop: 14, opacity: 0.65 }}>
                Puedes escribir el nombre entero o solo un trozo. Lo entenderá.
              </p>

              <div className="es-sugieres" aria-label="Sugerencias populares">
                {["Aventus", "Baccarat Rouge 540", "Sauvage", "Y EDP", "Angels' Share"].map((s) => (
                  <button key={s} onClick={() => setAncla(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="es-entra-4" style={{ marginTop: 58, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <button className="es-btn es-btn-fantasma" onClick={() => setPantalla("intensidad")}>
                Atrás
              </button>
              <button className="es-btn es-btn-oro" onClick={() => setPantalla("resultado")}>
                Ver mi selección
              </button>
              <p className="es-susurro" style={{ opacity: 0.55 }}>
                Este campo es opcional
              </p>
            </div>
          </section>
        )}

        {pantalla === "resultado" && (
          <section className="es-escenario" key="resultado" style={{ justifyContent: "flex-start" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
              <p className="es-eyebrow es-entra" style={{ margin: 0 }}>
                {{ femenino: "Para ella", masculino: "Para él", unisex: "Sin distinción", todos: "De todo un poco" }[genero] || "Lo que encaja"}
              </p>
              <button
                className="es-btn-fantasma es-entra"
                style={{ background: "none", border: 0, color: "var(--hueso-mute)", fontFamily: "var(--dato)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", padding: "4px 0" }}
                onClick={() => { setGenero(null); setPantalla("landing"); }}
              >
                ← Empezar de nuevo
              </button>
            </div>
            <h2 className="es-pregunta es-entra" style={{ maxWidth: "26ch" }}>
              Con lo que me has contado, empezaría por aquí.
            </h2>
            <p className="es-apunte es-entra-2">
              {{ femenino: "Femenino", masculino: "Masculino", unisex: "Unisex", todos: "Cualquier género" }[genero]} · Hasta {presupuesto} € ·{" "}
              {familias.length
                ? familias.map((f) => FAMILIAS.find((x) => x.id === f).nombre).join(", ")
                : "familia libre"}{" "}
              · {ocasion.charAt(0).toUpperCase() + ocasion.slice(1)}, {temporada === "todo" ? "todo el año" : temporada}
              {" · Intensidad "}{["piel", "discreta", "presente", "envolvente", "estela"][intensidad - 1]}
              {ancla && <> · Ancla: <span style={{ color: "var(--oro-lit)", fontFamily: "var(--display)", fontStyle: "italic" }}>{ancla}</span></>}
            </p>

            {cargando && (
              <div style={{ padding: "60px 0", textAlign: "center" }}>
                <p className="es-susurro" style={{ animation: "respirar 2s ease-in-out infinite" }}>
                  Consultando el catálogo...
                </p>
              </div>
            )}

            {errorCarga && (
              <div style={{ padding: "40px 0" }}>
                <p className="es-susurro" style={{ color: "var(--burdeos-lit)", marginBottom: 16 }}>
                  {errorCarga}
                </p>
                <button className="es-btn es-btn-oro" onClick={cargarPerfumes}>
                  Reintentar
                </button>
              </div>
            )}

            {!cargando && !errorCarga && (
              <div className="es-entra-3">
                {(() => {
                  const lista = motorDeMatching(perfumes, {
                    genero,
                    modo,
                    presupuesto,
                    familias,
                    ocasion,
                    temporada,
                    intensidad,
                    ancla,
                  });
                  return lista.map((p) => {
                    const disponibles = (p.precios || []).filter((x) => x.precio);
                    const barato = disponibles.length
                      ? disponibles.reduce((a, b) =>
                          parseFloat(String(a.precio).replace(",", ".")) <=
                          parseFloat(String(b.precio).replace(",", "."))
                            ? a : b
                        )
                      : null;
                    return (
                      <article className="es-carta" key={p.id}>
                        <div>
                          {p._esAncla && (
                            <p className="es-susurro" style={{ color: "var(--oro-lit)", opacity: 0.85, marginBottom: 10, letterSpacing: "0.18em" }}>
                              El que buscabas
                            </p>
                          )}
                          <p className="es-casa">
                            {p.casa}
                            {p.es_nicho && (
                              <span style={{ marginLeft: 12, color: "var(--burdeos-lit)", letterSpacing: "0.16em", fontSize: 9 }}>NICHO</span>
                            )}
                          </p>
                          <h3 className="es-nombre">{p.nombre}</h3>
                          <p className="es-sub">{p.concentracion}</p>
                          <p className="es-voz">{p.voz || <em style={{ opacity: 0.5 }}>Descripción próximamente.</em>}</p>

                          <div className="es-trail">
                            <div className="es-columna" aria-hidden="true">
                              {p.trail.map((t, i) => {
                                const slug = ["salida", "corazon", "fondo"][i];
                                return (
                                  <div
                                    key={t.fase}
                                    className="es-banda"
                                    data-fase={slug}
                                    style={{
                                      minHeight: t.h,
                                      background: [
                                        "rgba(226,190,131,0.85)",
                                        "rgba(201,154,78,0.6)",
                                        "rgba(110,33,53,0.9)",
                                      ][i],
                                    }}
                                  />
                                );
                              })}
                            </div>
                            <div className="es-fases">
                              {p.trail.map((t, i) => {
                                const slug = ["salida", "corazon", "fondo"][i];
                                return (
                                  <div className="es-fase" key={t.fase} data-fase={slug} style={{ minHeight: t.h }}>
                                    <p className="es-fase-cab">
                                      {t.fase} <b>{t.ventana}</b>
                                    </p>
                                    <p className="es-fase-notas">{t.notas}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {p.dupes && p.dupes.length > 0 && (
                            <div style={{ marginTop: 28, borderTop: "0.5px solid var(--linea)", paddingTop: 20 }}>
                              <p className="es-susurro" style={{ marginBottom: 12, opacity: 0.7 }}>
                                Alternativa asequible
                              </p>
                              {p.dupes.slice(0, 1).map((d) => (
                                <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                  <span style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 17, color: "var(--hueso)" }}>
                                    {d.relacionado_nombre}
                                  </span>
                                  {d.relacionado_casa && (
                                    <span className="es-susurro" style={{ opacity: 0.55 }}>
                                      {d.relacionado_casa}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="es-precios">
                            <p className="es-precio-cab">Dónde comprarlo</p>
                            {disponibles.length > 0 ? (
                              disponibles.map((t) => (
                                <div
                                  key={t.tienda}
                                  className={`es-fila ${barato && t.tienda === barato.tienda ? "mejor" : ""}`}
                                >
                                  <span>{t.tienda}</span>
                                  <span>
                                    {t.precio} €
                                    {barato && t.tienda === barato.tienda && (
                                      <span className="es-tag">mejor precio</span>
                                    )}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="es-fila nd">
                                <span>Precios próximamente</span>
                              </div>
                            )}
                            {barato ? (
                              <button
                                className="es-btn es-comprar"
                                onClick={() => barato.url && window.open(barato.url, "_blank")}
                                style={!barato.url ? { opacity: 0.5, cursor: "default" } : undefined}
                              >
                                {barato.url ? `Ver en ${barato.tienda} · ${barato.precio} €` : "Enlace próximamente"}
                              </button>
                            ) : (
                              <button className="es-btn es-comprar" style={{ opacity: 0.5, cursor: "default" }}>
                                Precios próximamente
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  });
                })()}
              </div>
            )}

            <div className="es-pie es-entra-4">
              <p className="es-susurro" style={{ maxWidth: "58ch", lineHeight: 1.8 }}>
                Efluvio cobra una comisión si compras a través de estos enlaces. No
                cambia lo que pagas ni el orden en que aparecen los resultados.
              </p>
              <button className="es-btn es-btn-fantasma" onClick={() => { setGenero(null); setModo("diseñador"); setPantalla("landing"); }}>
                Empezar de nuevo
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
    )}

    {/* =============== PÁGINA: GUÍA =============== */}
    {pagina === "guia" && (
    <div className="es-root">
      <style>{estilosCompartidos}</style>
      <nav className="es-nav">
        <button className="es-nav-logo" onClick={() => { setPagina("sommelier"); setPantalla("landing"); }}>Efluvio</button>
        <div className="es-nav-links">
          <button className="es-nav-link" onClick={() => setPagina("sommelier")}>Sommelier</button>
          <button className="es-nav-link on" onClick={() => setPagina("guia")}>Guía</button>
          <button className="es-nav-link" onClick={() => setPagina("comunidad")}>Comunidad</button>
        </div>
      </nav>
      <div className="es-pagina-clara">
        <div className="es-contenedor">
          <p style={{ fontFamily: "var(--dato)", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#8A7E72", margin: "0 0 20px" }}>
            Biblioteca de perfumería
          </p>
          <h1>Artículos Efluvio</h1>
          <p className="es-intro">
            Artículos escritos con criterio, no con patrocinio. Cada uno incluye comparativa de precios real y la voz de nuestro sommelier.
          </p>

          {cargandoArticulos && (
            <p style={{ color: "#8A7E72", fontFamily: "var(--dato)", fontSize: 13 }}>Cargando articulos...</p>
          )}

          {!cargandoArticulos && articulos.length === 0 && (
            <p style={{ color: "#8A7E72", fontSize: 15 }}>No hay articulos publicados todavia.</p>
          )}

          {articulos.map(function (art) {
            var fecha = art.fecha_publicacion
              ? new Date(art.fecha_publicacion).toLocaleDateString("es-ES", { month: "long", year: "numeric" })
              : "";
            return (
              <div
                key={art.slug}
                className="es-articulo-card"
                onClick={function () { window.location.href = "/guia/" + art.slug; }}
              >
                <h3>{art.titulo}</h3>
                <p>{art.descripcion_corta}</p>
                <div className="es-meta">
                  {fecha} {art.minutos_lectura ? "· " + art.minutos_lectura + " min" : ""}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 40, padding: "20px 24px", background: "#EDE7DC", borderLeft: "2.5px solid #C99A4E" }}>
            <p style={{ fontFamily: "var(--dato)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A7E72", margin: "0 0 8px" }}>
              ¿No sabes cuál elegir?
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "#2C2118", margin: "0 0 12px" }}>
              El sommelier te recomienda según tu presupuesto, la temporada y lo que ya te gusta.
            </p>
            <button
              style={{ fontFamily: "var(--dato)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C99A4E", background: "none", border: 0, cursor: "pointer", padding: 0 }}
              onClick={() => setPagina("sommelier")}
            >
              Probar el sommelier →
            </button>
          </div>
        </div>
      </div>
    </div>
    )}

    {/* =============== PÁGINA: COMUNIDAD =============== */}
    {pagina === "comunidad" && (
    <div className="es-root">
      <style>{estilosCompartidos}</style>
      <nav className="es-nav">
        <button className="es-nav-logo" onClick={() => { setPagina("sommelier"); setPantalla("landing"); }}>Efluvio</button>
        <div className="es-nav-links">
          <button className="es-nav-link" onClick={() => setPagina("sommelier")}>Sommelier</button>
          <button className="es-nav-link" onClick={() => setPagina("guia")}>Guía</button>
          <button className="es-nav-link on" onClick={() => setPagina("comunidad")}>Comunidad</button>
        </div>
      </nav>
      <div className="es-pagina-clara">
        <div className="es-contenedor">
          <p style={{ fontFamily: "var(--dato)", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#8A7E72", margin: "0 0 20px" }}>
            Donde hablamos de perfumes
          </p>
          <h1>Comunidad Efluvio</h1>
          <p className="es-intro">
            Clones de la semana, comparativas de precio y contenido que no encontrarás en ninguna revista.
          </p>

          <div className="es-redes-grid">
            <div className="es-red-card">
              <h3>Instagram</h3>
              <p>Contenido visual, pirámides de notas, comparativas semanales.</p>
              <span className="es-red-link">Próximamente →</span>
            </div>
            <div className="es-red-card">
              <h3>TikTok</h3>
              <p>Dupes virales, recomendaciones rápidas, el clon que nadie conoce.</p>
              <span className="es-red-link">Próximamente →</span>
            </div>
            <div className="es-red-card">
              <h3>Telegram</h3>
              <p>Canal con alertas de precio, lanzamientos y drops antes que nadie.</p>
              <span className="es-red-link">Próximamente →</span>
            </div>
            <div className="es-red-card">
              <h3>Newsletter</h3>
              <p>Un email semanal. El clon de la semana, el mejor precio del mes.</p>
              <span className="es-red-link">Próximamente →</span>
            </div>
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            <button
              style={{ fontFamily: "var(--dato)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C99A4E", background: "none", border: "1px solid rgba(201,154,78,0.4)", padding: "14px 28px", cursor: "pointer" }}
              onClick={() => setPagina("sommelier")}
            >
              Volver al sommelier →
            </button>
          </div>
        </div>
      </div>
    </div>
    )}

    </>
  );
}
