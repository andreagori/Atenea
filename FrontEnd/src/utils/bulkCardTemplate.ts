import ExcelJS from "exceljs";

export type BulkTemplateKind = "activeRecall" | "both";
export type BulkMethod = "activeRecall" | "cornell";

export interface ParsedCardRow {
  sourceRow: number;
  title: string;
  learningMethod: BulkMethod;
  questionTitle?: string;
  answer?: string;
  principalNote?: string;
  noteQuestions?: string;
  shortNote?: string;
}

const SHEET = "Cartas";

// Prompt the student pastes into any external AI together with their material.
// It asks the AI to BUILD the finished spreadsheet file, ready to upload.
export const BULK_PROMPT_ACTIVE_RECALL = `Eres un asistente que crea tarjetas de estudio.
A partir del material que te adjunto (PDF, apuntes, texto), genera tarjetas de Repaso Activo
y entrégame un ARCHIVO DE HOJA DE CÁLCULO ya rellenado y listo para descargar.

ARCHIVO QUE DEBES GENERAR:
- Un archivo Excel (.xlsx) descargable.
- Una sola hoja, nombrada exactamente: Cartas
- Fila 1 = encabezados EXACTOS, en este orden: Título | Pregunta | Respuesta
- Desde la fila 2, una tarjeta por fila.
- Si no puedes generar .xlsx, genera un archivo .csv (codificación UTF-8) con esas
  mismas 3 columnas y la misma fila de encabezados.

REGLAS DE CONTENIDO:
- "Título": nombre corto del concepto, entre 3 y 100 caracteres.
- "Pregunta": una sola pregunta clara que obligue a recordar (evita preguntas de sí/no).
- "Respuesta": correcta, concisa y autosuficiente.
- Crea una tarjeta por cada idea evaluable del material; cubre todo lo importante.
- Fidelidad total al material: no inventes ni añadas datos que no estén ahí.
- Si algo no está claro en el material, omítelo en vez de inventar.

Ejemplo de fila (Título, Pregunta, Respuesta):
Ciclo de Krebs | ¿En qué orgánulo ocurre el ciclo de Krebs? | En la matriz mitocondrial

Cuando termines, dame el archivo para descargarlo. No expliques nada más.`;

export const BULK_PROMPT_BOTH = `Eres un asistente que crea tarjetas de estudio.
A partir del material que te adjunto (PDF, apuntes, texto), genera tarjetas
y entrégame un ARCHIVO DE HOJA DE CÁLCULO ya rellenado y listo para descargar.

ARCHIVO QUE DEBES GENERAR:
- Un archivo Excel (.xlsx) descargable.
- Una sola hoja, nombrada exactamente: Cartas
- Fila 1 = encabezados EXACTOS, en este orden:
  Título | Método | Pregunta | Respuesta | Nota principal | Preguntas guía | Resumen
- Desde la fila 2, una tarjeta por fila (7 columnas siempre, aunque alguna quede vacía).
- Si no puedes generar .xlsx, genera un archivo .csv (UTF-8) con esas mismas 7 columnas
  y la misma fila de encabezados.

REGLAS DE CONTENIDO:
- "Método" debe ser exactamente "activeRecall" o "cornell".
- Si Método = activeRecall: rellena Pregunta y Respuesta; deja vacíos Nota principal, Preguntas guía y Resumen.
- Si Método = cornell: rellena Nota principal, Preguntas guía y Resumen; deja vacíos Pregunta y Respuesta.
- "Título": nombre corto del concepto, entre 3 y 100 caracteres.
- Elige el método que mejor se ajuste a cada idea del material.
- Fidelidad total al material: no inventes ni añadas datos que no estén ahí.

Ejemplo de filas:
Ciclo de Krebs | activeRecall | ¿En qué orgánulo ocurre? | En la matriz mitocondrial | | |
Sistema límbico | cornell | | | Estructuras y funciones del sistema límbico | ¿Qué regula la amígdala? | Regula emociones y memoria emocional

Cuando termines, dame el archivo para descargarlo. No expliques nada más.`;

export const promptFor = (kind: BulkTemplateKind) =>
  kind === "activeRecall" ? BULK_PROMPT_ACTIVE_RECALL : BULK_PROMPT_BOTH;

const headersFor = (kind: BulkTemplateKind): string[] =>
  kind === "activeRecall"
    ? ["Título", "Pregunta", "Respuesta"]
    : [
        "Título",
        "Método",
        "Pregunta",
        "Respuesta",
        "Nota principal",
        "Preguntas guía",
        "Resumen",
      ];

const instructions = (kind: BulkTemplateKind): string[] => [
  "RELLENA ESTA PLANTILLA A MANO (opcional)",
  "",
  "Lo más rápido es dejar que la IA genere el archivo por ti: usa el PROMPT",
  "de más abajo en ChatGPT/Claude/Gemini con tu PDF y sube el archivo que te dé.",
  "",
  "Si prefieres llenarla a mano: escribe una tarjeta por fila en la hoja",
  "\"Cartas\", a partir de la fila 2, sin tocar la fila 1 de encabezados.",
  "Luego guarda y sube el archivo en Atenea.",
  "",
  kind === "activeRecall"
    ? "Nota: las cartas visuales (imágenes) no se pueden crear por carga masiva."
    : "Nota: Método válido = activeRecall o cornell. Las cartas visuales no se crean por carga masiva.",
  "",
  "──────────────────────────────────────────────",
  "PROMPT PARA LA IA (cópialo completo, desde aquí):",
  "──────────────────────────────────────────────",
  "",
  promptFor(kind),
];

export async function downloadTemplate(kind: BulkTemplateKind): Promise<void> {
  const wb = new ExcelJS.Workbook();

  const info = wb.addWorksheet("Instrucciones");
  info.getColumn(1).width = 110;
  instructions(kind).forEach((line) => {
    info.addRow([line]);
  });
  info.getRow(1).font = { bold: true, size: 14 };

  const ws = wb.addWorksheet(SHEET);
  const headers = headersFor(kind);
  ws.addRow(headers);
  ws.getRow(1).font = { bold: true };
  headers.forEach((_, i) => {
    ws.getColumn(i + 1).width = i === 0 ? 28 : 40;
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    kind === "activeRecall"
      ? "plantilla-atenea-repaso-activo.xlsx"
      : "plantilla-atenea-repaso-activo-y-cornell.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}

const norm = (v: unknown) =>
  v === null || v === undefined ? "" : String(v).trim();

// Lowercase + strip accents so "Método" / "metodo" / "Titulo" all match.
const headerKey = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const methodFrom = (raw: string): BulkMethod => {
  const v = raw.toLowerCase().replace(/\s+/g, "");
  if (v === "cornell") return "cornell";
  return "activeRecall";
};

type Field =
  | "title"
  | "method"
  | "questionTitle"
  | "answer"
  | "principalNote"
  | "noteQuestions"
  | "shortNote";

const HEADER_TO_FIELD: Record<string, Field> = {
  titulo: "title",
  metodo: "method",
  pregunta: "questionTitle",
  respuesta: "answer",
  "nota principal": "principalNote",
  "preguntas guia": "noteQuestions",
  resumen: "shortNote",
};

// Splits CSV/TSV text honoring quotes, embedded newlines and commas.
function parseDelimited(text: string): string[][] {
  const clean = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const firstLine = clean.slice(0, clean.indexOf("\n") + 1 || clean.length);
  const counts = {
    "\t": (firstLine.match(/\t/g) || []).length,
    ";": (firstLine.match(/;/g) || []).length,
    ",": (firstLine.match(/,/g) || []).length,
  };
  const delim = (
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ","
  ) as string;

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (quoted) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === delim) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function matrixToRows(matrix: string[][]): ParsedCardRow[] {
  if (matrix.length === 0) return [];
  const header = matrix[0].map((h) => headerKey(norm(h)));
  const fieldByCol = header.map((h) => HEADER_TO_FIELD[h]);

  const out: ParsedCardRow[] = [];
  for (let i = 1; i < matrix.length; i++) {
    const cells = matrix[i];
    const rec: Record<Field, string> = {
      title: "",
      method: "",
      questionTitle: "",
      answer: "",
      principalNote: "",
      noteQuestions: "",
      shortNote: "",
    };
    cells.forEach((value, c) => {
      const f = fieldByCol[c];
      if (f) rec[f] = norm(value);
    });

    const empty =
      !rec.title &&
      !rec.questionTitle &&
      !rec.answer &&
      !rec.principalNote &&
      !rec.noteQuestions &&
      !rec.shortNote;
    if (empty) continue;

    out.push({
      sourceRow: i + 1,
      title: rec.title,
      learningMethod: methodFrom(rec.method),
      questionTitle: rec.questionTitle,
      answer: rec.answer,
      principalNote: rec.principalNote,
      noteQuestions: rec.noteQuestions,
      shortNote: rec.shortNote,
    });
  }
  return out;
}

// Accepts the AI-generated file: .xlsx (sheet "Cartas" or first sheet) or .csv.
export async function parseTemplate(file: File): Promise<ParsedCardRow[]> {
  const isCsv =
    file.name.toLowerCase().endsWith(".csv") ||
    file.type === "text/csv" ||
    file.type === "application/csv";

  if (isCsv) {
    return matrixToRows(parseDelimited(await file.text()));
  }

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());
  const ws = wb.getWorksheet(SHEET) ?? wb.worksheets[0];
  if (!ws) return [];

  const matrix: string[][] = [];
  ws.eachRow((row) => {
    const cells: string[] = [];
    row.eachCell({ includeEmpty: true }, (cell) => {
      cells.push(norm(cell.value));
    });
    matrix.push(cells);
  });
  return matrixToRows(matrix);
}

export function validateRow(r: ParsedCardRow): string | null {
  if (r.title.length < 3 || r.title.length > 100) {
    return "El título debe tener entre 3 y 100 caracteres";
  }
  if (r.learningMethod === "activeRecall") {
    if (!r.questionTitle || !r.answer) return "Faltan Pregunta o Respuesta";
  } else {
    if (!r.principalNote || !r.noteQuestions || !r.shortNote) {
      return "Faltan Nota principal, Preguntas guía o Resumen";
    }
  }
  return null;
}
