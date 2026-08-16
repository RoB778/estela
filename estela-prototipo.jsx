import React, { useState } from "react";

const PERFUMES = [
  {
    id: "bdc",
    casa: "Chanel",
    nombre: "Bleu de Chanel",
    concentracion: "Eau de Parfum · 50 ml",
    familia: "Amaderado aromático",
    genero: "masculino",
    voz:
      "Lo elijo cuando quieres que te tomen en serio sin levantar la voz. El cítrico de salida se va rápido; lo que queda a las tres horas es madera seca e incienso, y eso es lo que la gente recuerda de ti.",
    trail: [
      { fase: "salida", notas: "Limón, menta, pomelo rosa", ventana: "0 – 25 min", h: 32 },
      { fase: "corazón", notas: "Jengibre, nuez moscada, jazmín", ventana: "25 min – 3 h", h: 62 },
      { fase: "fondo", notas: "Sándalo, incienso, cedro", ventana: "3 – 8 h", h: 104 },
    ],
    precios: [
      { tienda: "Druni", precio: "89,95" },
      { tienda: "Amazon", precio: "92,40" },
      { tienda: "Primor", precio: "94,00" },
      { tienda: "Sephora", precio: "99,99" },
    ],
  },
  {
    id: "ysly",
    casa: "Yves Saint Laurent",
    nombre: "Y",
    concentracion: "Eau de Parfum · 60 ml",
    familia: "Aromático ambarino",
    genero: "masculino",
    voz:
      "Es el perfume de oficina que no aburre. Manzana y jengibre arriba para que entre fácil, ámbar y haba tonka abajo para que siga ahí cuando salgas a cenar.",
    trail: [
      { fase: "salida", notas: "Manzana, jengibre, bergamota", ventana: "0 – 20 min", h: 30 },
      { fase: "corazón", notas: "Salvia, enebro, hoja de violeta", ventana: "20 min – 4 h", h: 66 },
      { fase: "fondo", notas: "Ambroxan, haba tonka, cedro", ventana: "4 – 9 h", h: 108 },
    ],
    precios: [
      { tienda: "Primor", precio: "68,90" },
      { tienda: "Druni", precio: "71,50" },
      { tienda: "Amazon", precio: "74,20" },
      { tienda: "Sephora", precio: "79,99" },
    ],
  },
  {
    id: "khamrah",
    casa: "Lattafa",
    nombre: "Khamrah",
    concentracion: "Eau de Parfum · 100 ml",
    familia: "Gourmand especiado",
    genero: "unisex",
    voz:
      "Por treinta euros no vas a oler a treinta euros. Canela y dátil sobre vainilla: dulce, especiado y descaradamente invernal. Dos pulverizaciones bastan, tres son demasiadas.",
    trail: [
      { fase: "salida", notas: "Canela, nuez moscada, bergamota", ventana: "0 – 30 min", h: 30 },
      { fase: "corazón", notas: "Dátil, praliné, haba tonka", ventana: "30 min – 5 h", h: 70 },
      { fase: "fondo", notas: "Vainilla, benjuí, ámbar, mirra", ventana: "5 – 12 h", h: 112 },
    ],
    precios: [
      { tienda: "Amazon", precio: "29,95" },
      { tienda: "Primor", precio: "32,50" },
      { tienda: "Druni", precio: "34,90" },
      { tienda: "Sephora", precio: null },
    ],
  },
  {
    id: "goodgirl",
    casa: "Carolina Herrera",
    nombre: "Good Girl",
    concentracion: "Eau de Parfum · 50 ml",
    familia: "Floral avainillado",
    genero: "femenino",
    voz:
      "Empieza con almendra y café, dos cosas que no esperas juntas en un frasco tan elegante. El fondo de cacao y vainilla es lo que se queda pegado a la bufanda al día siguiente.",
    trail: [
      { fase: "salida", notas: "Almendra, café, bergamota", ventana: "0 – 25 min", h: 32 },
      { fase: "corazón", notas: "Jazmín sambac, tuberosa, azucena", ventana: "25 min – 4 h", h: 68 },
      { fase: "fondo", notas: "Cacao, haba tonka, vainilla, sándalo", ventana: "4 – 9 h", h: 104 },
    ],
    precios: [
      { tienda: "Primor", precio: "74,90" },
      { tienda: "Amazon", precio: "77,30" },
      { tienda: "Druni", precio: "79,95" },
      { tienda: "Sephora", precio: "84,99" },
    ],
  },
];

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

export default function Estela() {
  const [pantalla, setPantalla] = useState("landing");
  const [genero, setGenero] = useState(null);
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

  const pasoActivo =
    pantalla === "genero" ? 0 :
    pantalla === "presupuesto" ? 1 :
    pantalla === "familia" ? 2 :
    pantalla === "ocasion" ? 3 :
    pantalla === "intensidad" ? 4 :
    pantalla === "ancla" ? 5 : -1;

  return (
    <div className="es-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

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
          position: absolute; top: -30vh; left: 50%; transform: translateX(-50%);
          width: 120vw; height: 90vh; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center, rgba(110,33,53,0.40) 0%, rgba(74,18,32,0.12) 42%, transparent 68%);
          animation: respirar 22s ease-in-out infinite;
        }
        @keyframes respirar {
          0%,100% { opacity: .85; transform: translateX(-50%) scale(1); }
          50%     { opacity: 1;   transform: translateX(-50%) scale(1.08); }
        }
        .es-grano {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: ${GRANO}; opacity: 0.05; mix-blend-mode: overlay;
        }
        .es-capa { position: relative; z-index: 2; }

        .es-marca {
          position: absolute; top: 28px; left: 32px; z-index: 5;
          font-family: var(--dato); font-size: 11px; letter-spacing: 0.34em;
          text-transform: uppercase; color: var(--hueso-mute);
        }

        .es-escenario {
          min-height: 100vh; display: flex; flex-direction: column;
          justify-content: center; padding: 108px 32px 72px; max-width: 1120px; margin: 0 auto;
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
        }
        .es-titular em { font-style: italic; color: var(--oro-lit); }
        .es-bajada {
          font-size: 17px; line-height: 1.75; color: var(--hueso-mute);
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

        .es-escalera {
          position: absolute; top: 30px; left: 50%; transform: translateX(-50%); z-index: 4;
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

        @media (max-width: 860px) {
          .es-escalera { display: none; }
          .es-carta { grid-template-columns: 1fr; gap: 36px; }
          .es-escenario { padding: 92px 22px 60px; }
          .es-marca { left: 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .es-root *, .es-root *::before, .es-root *::after {
            animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="es-halo" />
      <div className="es-grano" />

      <div className="es-marca">Estela</div>

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
          </section>
        )}

        {pantalla === "genero" && (
          <section className="es-escenario" key="genero">
            <p className="es-eyebrow es-entra">Paso 01 — Género</p>
            <h2 className="es-pregunta es-entra">¿Para quién buscamos?</h2>
            <p className="es-apunte es-entra-2">
              No es una casilla que te encierre, es solo para no enseñarte 200
              perfumes que no te interesan. Puedes cambiarlo cuando quieras.
            </p>

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

            <div className="es-entra-4" style={{ marginTop: 48, display: "flex", gap: 18, alignItems: "center" }}>
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
          <section className="es-escenario" key="presupuesto">
            <p className="es-eyebrow es-entra">Paso 02 — Presupuesto</p>
            <h2 className="es-pregunta es-entra">¿Cuánto quieres gastarte?</h2>
            <p className="es-apunte es-entra-2">
              Es un techo, no un objetivo. Nada de lo que te enseñemos después pasará
              de aquí.
            </p>

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
          <section className="es-escenario" key="familia">
            <p className="es-eyebrow es-entra">Paso 03 — Familia olfativa</p>
            <h2 className="es-pregunta es-entra">¿Hacia dónde tira tu nariz?</h2>
            <p className="es-apunte es-entra-2">
              Elige todas las que te suenen bien. Si no tienes ni idea, sáltalo: lo
              deducimos del resto de respuestas.
            </p>

            <div className="es-rejilla es-entra-3">
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
          <section className="es-escenario" key="ocasion">
            <p className="es-eyebrow es-entra">Paso 04 — Cuándo lo vas a llevar</p>
            <h2 className="es-pregunta es-entra">¿Para qué momento?</h2>
            <p className="es-apunte es-entra-2">
              Los perfumes tienen contexto. Uno que funciona en agosto por la mañana
              no funciona en enero por la noche, por muy bueno que sea.
            </p>

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
          <section className="es-escenario" key="intensidad">
            <p className="es-eyebrow es-entra">Paso 05 — Intensidad</p>
            <h2 className="es-pregunta es-entra">¿Cuánto quieres que se note?</h2>
            <p className="es-apunte es-entra-2">
              La intensidad no es la calidad. Un perfume discreto puede ser tan
              caro como uno que llena una habitación. Aquí es solo cuestión de
              gusto y de cómo lo quieres llevar.
            </p>

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
          <section className="es-escenario" key="ancla">
            <p className="es-eyebrow es-entra">Paso 06 — Un ancla, si quieres</p>
            <h2 className="es-pregunta es-entra">¿Hay algún perfume que ya te enamore?</h2>
            <p className="es-apunte es-entra-2">
              Si lo hay, escríbelo. Nos ayuda a calibrar mucho mejor, porque
              deducimos tu gusto de algo real. Si no, salta al final: con lo que
              nos has dicho ya tenemos lo suficiente.
            </p>

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
            <p className="es-eyebrow es-entra">
              {{ femenino: "Para ella", masculino: "Para él", unisex: "Sin distinción", todos: "De todo un poco" }[genero] || "Lo que encaja"}
            </p>
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

            <div className="es-entra-3">
              {(() => {
                const filtrados =
                  !genero || genero === "todos"
                    ? PERFUMES
                    : PERFUMES.filter((p) => p.genero === genero || p.genero === "unisex");
                const lista = filtrados.length ? filtrados : PERFUMES;
                return lista.map((p) => {
                const disponibles = p.precios.filter((x) => x.precio);
                const barato = disponibles.reduce((a, b) =>
                  parseFloat(a.precio.replace(",", ".")) <= parseFloat(b.precio.replace(",", ".")) ? a : b
                );
                return (
                  <article className="es-carta" key={p.id}>
                    <div>
                      <p className="es-casa">{p.casa}</p>
                      <h3 className="es-nombre">{p.nombre}</h3>
                      <p className="es-sub">
                        {p.concentracion} — {p.familia}
                      </p>
                      <p className="es-voz">{p.voz}</p>

                      <div className="es-trail">
                        <div className="es-columna" aria-hidden="true">
                          {p.trail.map((t, i) => (
                            <div
                              key={t.fase}
                              className="es-banda"
                              style={{
                                height: t.h,
                                background: [
                                  "rgba(226,190,131,0.85)",
                                  "rgba(201,154,78,0.6)",
                                  "rgba(110,33,53,0.9)",
                                ][i],
                              }}
                            />
                          ))}
                        </div>
                        <div className="es-fases">
                          {p.trail.map((t) => (
                            <div className="es-fase" key={t.fase} style={{ height: t.h }}>
                              <p className="es-fase-cab">
                                {t.fase} <b>{t.ventana}</b>
                              </p>
                              <p className="es-fase-notas">{t.notas}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="es-precios">
                        <p className="es-precio-cab">Dónde comprarlo</p>
                        {p.precios.map((t) => (
                          <div
                            key={t.tienda}
                            className={`es-fila ${!t.precio ? "nd" : t.tienda === barato.tienda ? "mejor" : ""}`}
                          >
                            <span>{t.tienda}</span>
                            <span>
                              {t.precio ? `${t.precio} €` : "no disponible"}
                              {t.precio && t.tienda === barato.tienda && (
                                <span className="es-tag">mejor precio</span>
                              )}
                            </span>
                          </div>
                        ))}
                        <button className="es-btn es-comprar">
                          Ver en {barato.tienda} · {barato.precio} €
                        </button>
                      </div>
                    </div>
                  </article>
                );
              });
              })()}
            </div>

            <div className="es-pie es-entra-4">
              <p className="es-susurro" style={{ maxWidth: "58ch", lineHeight: 1.8 }}>
                Estela cobra una comisión si compras a través de estos enlaces. No
                cambia lo que pagas ni el orden en que aparecen los resultados.
              </p>
              <button className="es-btn es-btn-fantasma" onClick={() => { setGenero(null); setPantalla("landing"); }}>
                Empezar de nuevo
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
