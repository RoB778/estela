import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";

// ------------------------------------------------------------
// Parser de contenido_markdown
// Separador de bloques: |||
// H2: ## Título
// Negrita: **texto**
// CTA: marcador [CTA-SOMMELIER] como bloque propio
// FAQ: dentro de la sección "## Preguntas frecuentes...", cada
// pregunta es un bloque en negrita completo terminado en "?"
// seguido del bloque de respuesta.
// ------------------------------------------------------------

// Convierte "texto con **negrita** dentro" en nodos React reales,
// sin dangerouslySetInnerHTML.
function renderInline(texto, keyBase) {
  var partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return partes.map(function (parte, i) {
    if (parte.indexOf("**") === 0) {
      return <strong key={keyBase + "-b" + i} style={{ color: "#1A1410", fontWeight: 600 }}>{parte.slice(2, -2)}</strong>;
    }
    return parte ? <React.Fragment key={keyBase + "-t" + i}>{parte}</React.Fragment> : null;
  });
}

function esBloquePreguntaCompleta(bloque) {
  var m = /^\*\*(.+)\*\*$/.exec(bloque.trim());
  if (!m) return false;
  var interior = m[1].trim();
  return interior.length > 0 && interior.charAt(interior.length - 1) === "?";
}

// Construye la lista de nodos React a partir del markdown completo,
// en un único pase que sabe en qué sección está (para la entradilla,
// los separadores y el agrupado de FAQ) y dónde insertar el CTA.
function renderContenido(md, onIrSommelier) {
  var bloques = md
    .split("|||")
    .map(function (b) { return b.trim(); })
    .filter(function (b) { return b.length > 0; });

  var nodos = [];
  var huboH2 = false;
  var huboEntradilla = false;
  var dentroFAQ = false;
  var preguntaPendiente = null;

  bloques.forEach(function (bloque, i) {
    var key = "b" + i;

    // --- CTA ---
    if (bloque === "[CTA-SOMMELIER]") {
      nodos.push(
        <div className="es-art-cta" key={key}>
          <p className="es-art-cta-eyebrow">¿No sabes cuál elegir?</p>
          <p className="es-art-cta-texto">
            Nuestro sommelier te orienta con seis preguntas rápidas y compara el precio en cada tienda.
          </p>
          <button className="es-art-cta-btn" onClick={onIrSommelier}>
            Probar el sommelier
          </button>
        </div>
      );
      return;
    }

    // --- H2 ---
    if (bloque.indexOf("## ") === 0) {
      var titulo = bloque.replace("## ", "").trim();
      var esFAQ = /preguntas frecuentes/i.test(titulo);

      if (huboH2) {
        nodos.push(<div className="es-art-separador" key={key + "-sep"} aria-hidden="true">· · ·</div>);
      }
      huboH2 = true;
      dentroFAQ = esFAQ;
      preguntaPendiente = null;

      nodos.push(<h2 className="es-art-h2" key={key}>{titulo}</h2>);
      return;
    }

    // --- Dentro de FAQ: pregunta o respuesta ---
    if (dentroFAQ) {
      if (esBloquePreguntaCompleta(bloque)) {
        preguntaPendiente = bloque.slice(2, -2).trim(); // quita ** **
        return;
      }
      if (preguntaPendiente) {
        nodos.push(
          <div className="es-faq-item" key={key}>
            <p className="es-faq-pregunta">{preguntaPendiente}</p>
            <p className="es-faq-respuesta">{renderInline(bloque, key)}</p>
          </div>
        );
        preguntaPendiente = null;
        return;
      }
    }

    // --- Párrafo normal (con posible entradilla) ---
    var esEntradilla = huboH2 && !huboEntradilla;
    if (esEntradilla) huboEntradilla = true;

    nodos.push(
      <p className={esEntradilla ? "es-art-entradilla" : "es-art-parrafo"} key={key}>
        {renderInline(bloque, key)}
      </p>
    );
  });

  return nodos;
}

export default function ArticuloDetalle() {
  const { slug } = useParams();
  const [articulo, setArticulo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function cargarArticulo() {
      setCargando(true);
      var resultado = await supabase
        .from("articulos")
        .select("*")
        .eq("slug", slug)
        .eq("estado", "publicado")
        .single();
      if (resultado.error || !resultado.data) {
        setError(true);
      } else {
        setArticulo(resultado.data);
        supabase.rpc("incrementar_vistas", { articulo_slug: slug });
      }
      setCargando(false);
    }
    cargarArticulo();
  }, [slug]);

  var estilos = `
    /* ---------------------------------------------------------
       RESET DE LA PLANTILLA DE VITE
       Este componente se monta como página propia (ruta /guia/:slug)
       y no hereda el reset que vive dentro de Efluvio. Sin esto,
       #root queda a max-width:1280px centrado y aparecen franjas
       vacías a los lados en pantallas anchas — el mismo bug que
       tuvo la landing. La página de artículo es clara, así que
       color-scheme es "light" aquí (en el sommelier oscuro es "dark").
       --------------------------------------------------------- */
    html, body {
      margin: 0; padding: 0; width: 100%;
      background: #F2EDE4; color: #1A1410; text-align: left;
      color-scheme: light;
    }
    body { display: block; place-items: normal; min-width: 0; }
    #root {
      max-width: none; width: 100%; margin: 0; padding: 0;
      display: block; place-items: normal; text-align: left; color: #1A1410;
    }

    .es-art-root { background: #F2EDE4; min-height: 100vh; color: #1A1410; }
    .es-art-root *, .es-art-root *::before, .es-art-root *::after { box-sizing: border-box; }

    .es-art-nav {
      display: flex; justify-content: space-between; align-items: center;
      padding: 22px 40px; border-bottom: 1px solid rgba(26,20,16,0.09);
    }
    .es-art-logo {
      font-family: 'Fraunces', Georgia, serif; font-weight: 600; font-size: 21px;
      letter-spacing: 0.02em; color: #1A1410; text-decoration: none;
    }
    .es-art-nav-links { display: flex; gap: 28px; align-items: center; }
    .es-art-link {
      font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10px;
      letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none;
      color: #8A7E72; transition: color 300ms ease;
    }
    .es-art-link:hover { color: #1A1410; }
    .es-art-link.on { color: #C99A4E; }

    .es-art-contenedor { max-width: 740px; margin: 0 auto; padding: 60px 24px 90px; }

    .es-art-meta {
      font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10px;
      letter-spacing: 0.24em; text-transform: uppercase; color: #8A7E72; margin: 0 0 22px;
    }
    .es-art-titulo {
      font-family: 'Fraunces', Georgia, serif; font-weight: 400; font-size: clamp(30px, 4.4vw, 44px);
      line-height: 1.12; letter-spacing: -0.01em; color: #1A1410; margin: 0 0 18px;
    }
    .es-art-desc {
      font-family: 'Fraunces', Georgia, serif; font-style: italic; font-weight: 300;
      font-size: 19px; line-height: 1.6; color: #5C4F43; margin: 0 0 52px;
    }

    .es-art-h2 {
      font-family: 'Fraunces', Georgia, serif; font-weight: 500; font-size: 25px;
      line-height: 1.3; color: #1A1410; margin: 0 0 20px; padding-top: 6px;
      position: relative;
    }
    .es-art-h2::before {
      content: ""; display: block; width: 30px; height: 2px;
      background: #C99A4E; margin-bottom: 16px;
    }

    /* Primer párrafo tras cada H2: entradilla editorial, un poco más
       grande y en cursiva, para dar aire de revista sin recargar. */
    .es-art-entradilla {
      font-family: 'Fraunces', Georgia, serif; font-style: italic; font-weight: 300;
      font-size: 18.5px; line-height: 1.68; color: #5C4F43; margin: 0 0 22px;
    }
    .es-art-parrafo {
      font-size: 16.5px; line-height: 1.82; color: #2C2118; margin: 0 0 22px;
    }

    .es-art-separador {
      text-align: center; color: #C99A4E; letter-spacing: 0.5em;
      font-size: 11px; margin: 52px 0 40px; opacity: 0.75; user-select: none;
    }

    /* FAQ agrupada: tarjetas con fondo ligeramente más cálido que el
       resto de la página, para que se lea como sección aparte. */
    .es-faq-item {
      background: #EDE7DC; border-left: 2px solid #C99A4E;
      padding: 18px 22px 20px; margin-bottom: 10px;
    }
    .es-faq-pregunta {
      font-family: 'Fraunces', Georgia, serif; font-weight: 500; font-size: 16.5px;
      color: #1A1410; margin: 0 0 8px;
    }
    .es-faq-respuesta { font-size: 15px; line-height: 1.68; color: #4A3F35; margin: 0; }

    /* CTA como panel real, no un botón perdido en el texto */
    .es-art-cta {
      background: #F7F3EC; border: 1px solid rgba(74,18,32,0.18);
      border-left: 3px solid #4A1220; padding: 34px 32px; margin: 44px 0;
      text-align: center;
    }
    .es-art-cta-eyebrow {
      font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10px;
      letter-spacing: 0.2em; text-transform: uppercase; color: #8A7E72; margin: 0 0 12px;
    }
    .es-art-cta-texto {
      font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-style: italic;
      color: #2C2118; line-height: 1.5; margin: 0 0 24px; max-width: 42ch;
      margin-left: auto; margin-right: auto;
    }
    .es-art-cta-btn {
      font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 12px;
      letter-spacing: 0.16em; text-transform: uppercase; color: #EAE3D7;
      background: #4A1220; border: 0; padding: 16px 34px; cursor: pointer;
      transition: background 300ms ease;
    }
    .es-art-cta-btn:hover { background: #6E2135; }

    .es-art-tags {
      display: flex; flex-wrap: wrap; gap: 8px; margin-top: 54px;
      padding-top: 28px; border-top: 1px solid rgba(26,20,16,0.09);
    }
    .es-art-tag {
      font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10px;
      letter-spacing: 0.1em; text-transform: uppercase; color: #8A7E72;
      border: 1px solid rgba(90,75,60,0.25); padding: 6px 12px;
    }

    .es-art-volver {
      display: inline-block; margin-top: 40px;
      font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 11px;
      letter-spacing: 0.14em; text-transform: uppercase; color: #C99A4E;
      text-decoration: none;
    }
    .es-art-volver:hover { color: #4A1220; }

    @media (max-width: 560px) {
      .es-art-nav { padding: 18px 20px; }
      .es-art-nav-links { gap: 18px; }
      .es-art-contenedor { padding: 40px 18px 64px; }
      .es-art-titulo { font-size: 28px; }
      .es-art-desc { font-size: 17px; margin-bottom: 38px; }
      .es-art-h2 { font-size: 22px; }
      .es-art-cta { padding: 26px 20px; }
    }
  `;

  if (cargando) {
    return (
      <div className="es-art-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <style>{estilos}</style>
        <p style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A7E72" }}>
          Cargando...
        </p>
      </div>
    );
  }

  if (error || !articulo) {
    return (
      <div className="es-art-root">
        <style>{estilos}</style>
        <div className="es-art-contenedor" style={{ paddingTop: 90 }}>
          <h1 className="es-art-titulo">Artículo no encontrado</h1>
          <a href="/guia" className="es-art-volver">← Volver a la guía</a>
        </div>
      </div>
    );
  }

  return (
    <div className="es-art-root">
      <style>{estilos}</style>

      <nav className="es-art-nav">
        <a href="/" className="es-art-logo">Efluvio</a>
        <div className="es-art-nav-links">
          <a href="/" className="es-art-link">Sommelier</a>
          <a href="/guia" className="es-art-link on">Guía</a>
          <a href="/comunidad" className="es-art-link">Comunidad</a>
        </div>
      </nav>

      <div className="es-art-contenedor">
        <p className="es-art-meta">
          {articulo.categoria} · {articulo.minutos_lectura} min de lectura
        </p>

        <h1 className="es-art-titulo">{articulo.titulo}</h1>
        <p className="es-art-desc">{articulo.descripcion_corta}</p>

        {renderContenido(articulo.contenido_markdown, function () { window.location.href = "/"; })}

        {articulo.tags && articulo.tags.length > 0 && (
          <div className="es-art-tags">
            {articulo.tags.map(function (t) {
              return <span className="es-art-tag" key={t}>{t}</span>;
            })}
          </div>
        )}

        <a href="/guia" className="es-art-volver">← Volver a la guía</a>
      </div>
    </div>
  );
}