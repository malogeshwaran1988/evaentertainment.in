/**
 * Small RFC 4180 CSV reader/writer for the admin project import (no dependency).
 * Handles a UTF-8 BOM, quoted fields with commas, doubled quotes and line breaks and CRLF/LF/CR.
 */

export class CsvError extends Error {}

export function parseCsv(input: string): string[][] {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let quotedField = false;
  let i = 0;
  const endField = () => {
    row.push(field);
    field = "";
    quotedField = false;
  };
  const endRow = () => {
    endField();
    // Drop fully blank lines.
    if (!(row.length === 1 && row[0] === "")) rows.push(row);
    row = [];
  };
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      if (field.trim() === "" && !quotedField) {
        field = "";
        inQuotes = true;
        quotedField = true;
        i++;
        continue;
      }
      // A stray quote inside an unquoted field is kept literally.
      field += c;
      i++;
      continue;
    }
    if (c === ",") {
      endField();
      i++;
      continue;
    }
    if (c === "\r" || c === "\n") {
      endRow();
      i += c === "\r" && text[i + 1] === "\n" ? 2 : 1;
      continue;
    }
    field += c;
    i++;
  }
  if (inQuotes) throw new CsvError("A quoted field is never closed. Check for a missing \" in the file.");
  if (field !== "" || row.length) endRow();
  return rows;
}

function cell(value: string) {
  return /[",\r\n]/.test(value) || /^\s|\s$/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CRLF line endings and a BOM so Excel opens UTF-8 (Tamil/Hindi titles) correctly. */
export function toCsv(rows: readonly (readonly string[])[]): string {
  return `\uFEFF${rows.map((r) => r.map(cell).join(",")).join("\r\n")}\r\n`;
}
