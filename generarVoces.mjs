// generarVoces.mjs
//
// Script de un solo uso (o repetible) que rellena el campo "voz" de
// cada perfume en Supabase que todavía no la tiene, usando la API
// de Claude para escribir la frase evocadora en primera persona
// editorial, con el mismo tono que ya tiene el resto del producto.
//
// SE EJECUTA DESDE TU ORDENADOR, NUNCA SE DESPLIEGA NI SE SUBE
// A VERCEL. Las claves que usa aquí (Anthropic + Supabase service
// role) no deben aparecer jamás en el código del frontend.
//
// Uso: node generarVoces.mjs

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// --- Configuración -------------------------------------------------

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // clave secreta, solo aquí, nunca en el frontend
);

const MODELO = "claude-sonnet-5";
const PAUSA_ENTRE_LLAMADAS_MS = 1200; // evita saturar el rate limit

const SYSTEM_PROMPT = `Eres el redactor de "voz de sommelier" de Estela, una web
española de perfumería que compara precios y recomienda fragancias.

Tu única tarea: escribir UNA frase evocadora de 2-3 líneas en primera
persona editorial sobre un perfume concreto, a partir de sus notas reales.

Reglas estrictas:
- Nunca digas cosas tipo "coincidencia del 87%" ni lenguaje de algoritmo.
- Nunca copies ni parafrasees texto de Fragrantica, Parfumo ni ninguna
  fuente externa — escribe desde cero a partir de los datos que te paso.
- Da información ACCIONABLE, no solo bonita: cuándo ponérselo, cuántas
  pulverizaciones, para qué tipo de persona o momento, qué esperar.
- Tono: cercano pero con criterio, como alguien que sabe de perfumería
  y te lo explica sin venderte nada. Nunca cursi, nunca publicitario.
- Máximo 280 caracteres. Nada de comillas al principio o final.
- Responde SOLO con la frase, sin preámbulo, sin explicación, sin comillas.`;

function construirPrompt(p) {
  return `Perfume: ${p.nombre} (${p.casa})
Familia: ${p.familia_principal}${p.familia_secundaria ? " / " + p.familia_secundaria : ""}
Notas de salida: ${(p.notas_salida || []).join(", ")}
Notas de corazón: ${(p.notas_corazon || []).join(", ")}
Notas de fondo: ${(p.notas_fondo || []).join(", ")}
Intensidad: ${p.intensidad ?? "no confirmada"} (de 1 a 5)
Longevidad: ${p.longevidad ?? "no confirmada"}
Temporada recomendada: ${(p.temporada || []).join(", ")}
Ocasión: ${(p.ocasion || []).join(", ")}
Género: ${p.genero}

Escribe la frase de voz de sommelier para este perfume.`;
}

async function generarVoz(perfume) {
  const respuesta = await anthropic.messages.create({
    model: MODELO,
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: construirPrompt(perfume) }],
  });
  const texto = respuesta.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  return texto;
}

async function main() {
  console.log("Buscando perfumes sin voz de sommelier...");

  const { data: perfumes, error } = await supabase
    .from("perfumes")
    .select("*")
    .is("voz", null);

  if (error) {
    console.error("Error consultando Supabase:", error.message);
    process.exit(1);
  }

  if (!perfumes.length) {
    console.log("No hay perfumes pendientes. Todos tienen voz ya.");
    return;
  }

  console.log(`${perfumes.length} perfumes pendientes. Empezando...\n`);

  for (let i = 0; i < perfumes.length; i++) {
    const p = perfumes[i];
    process.stdout.write(`[${i + 1}/${perfumes.length}] ${p.nombre} (${p.casa})... `);

    try {
      const voz = await generarVoz(p);

      const { error: errorUpdate } = await supabase
        .from("perfumes")
        .update({ voz })
        .eq("id", p.id);

      if (errorUpdate) {
        console.log(`ERROR al guardar: ${errorUpdate.message}`);
      } else {
        console.log("OK");
        console.log(`   → "${voz}"\n`);
      }
    } catch (e) {
      console.log(`ERROR generando: ${e.message}`);
    }

    if (i < perfumes.length - 1) {
      await new Promise((r) => setTimeout(r, PAUSA_ENTRE_LLAMADAS_MS));
    }
  }

  console.log("\nListo. Recarga la app y deberías ver las voces reales.");
}

main();