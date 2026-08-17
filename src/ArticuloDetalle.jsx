import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";

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

  if (cargando) {
    return React.createElement("div", {
      style: { padding: 60, fontFamily: "Inter, sans-serif" }
    }, "Cargando...");
  }

  if (error || !articulo) {
    return (
      <div style={{ padding: 60, fontFamily: "Inter, sans-serif" }}>
        <h1>Articulo no encontrado</h1>
        <a href="/guia" style={{ color: "#C99A4E" }}>Volver a la Guia</a>
      </div>
    );
  }

  var partes = articulo.contenido_markdown.split("[CTA-SOMMELIER]");

  var navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 40px",
    borderBottom: "1px solid rgba(0,0,0,0.08)"
  };

  var logoStyle = {
    fontFamily: "Fraunces, serif",
    fontSize: 22,
    color: "#1A1410",
    textDecoration: "none"
  };

  var linkStyle = {
    color: "#5C4F43",
    textDecoration: "none",
    fontSize: 14
  };

  var linkActiveStyle = {
    color: "#1A1410",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500
  };

  var metaStyle = {
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 10,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: "#8A7E72",
    marginBottom: 20
  };

  var tituloStyle = {
    fontFamily: "Fraunces, serif",
    fontSize: 40,
    lineHeight: 1.15,
    color: "#1A1410",
    marginBottom: 16
  };

  var descStyle = {
    fontSize: 17,
    color: "#5C4F43",
    marginBottom: 48,
    lineHeight: 1.6
  };

  var ctaStyle = {
    display: "inline-block",
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 12,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#EAE3D7",
    background: "#4A1220",
    padding: "18px 36px",
    textDecoration: "none",
    borderRadius: 2
  };

  return (
    <div style={{ background: "#F2EDE4", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#1A1410" }}>
      <nav style={navStyle}>
        <a href="/" style={logoStyle}>Estela</a>
        <div style={{ display: "flex", gap: 28 }}>
          <a href="/" style={linkStyle}>Sommelier</a>
          <a href="/guia" style={linkActiveStyle}>Guia</a>
          <a href="/comunidad" style={linkStyle}>Comunidad</a>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px" }}>
        <p style={metaStyle}>
          {articulo.categoria} - {articulo.minutos_lectura} min de lectura
        </p>

        <h1 style={tituloStyle}>{articulo.titulo}</h1>

        <p style={descStyle}>{articulo.descripcion_corta}</p>

        <div style={{ fontSize: 16, lineHeight: 1.8, color: "#2C2118" }}>
          {partes.map(function (parte, i) {
            return (
              <React.Fragment key={i}>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdownBasico(parte) }} />
                {i < partes.length - 1 ? (
                  <div style={{ textAlign: "center", margin: "48px 0" }}>
                    <a href="/" style={ctaStyle}>Probar el sommelier IA</a>
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderMarkdownBasico(texto) {
  var bloques = texto.split("|||");
  var resultado = [];
  for (var i = 0; i < bloques.length; i++) {
    var bloque = bloques[i].trim();
    if (bloque.length === 0) {
      continue;
    }
    if (bloque.indexOf("## ") === 0) {
      var titulo = bloque.replace("## ", "");
      resultado.push(
        '<h2 style="font-family: Fraunces, serif; font-size: 24px; margin: 40px 0 16px; color: #1A1410;">' +
        titulo +
        "</h2>"
      );
    } else {
      var conNegrita = bloque.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      resultado.push('<p style="margin-bottom: 20px; line-height: 1.8;">' + conNegrita + "</p>");
    }
  }
  return resultado.join("");
}