/** Separador compatible con Excel en configuración regional es-AR (es-419). */
export const CSV_DELIMITER = ';';

/**
 * Escapa un campo según RFC 4180, usando el delimitador indicado.
 */
export function escapeCsvField(value: string | number, delimiter = CSV_DELIMITER): string {
  const str = String(value);
  if (/["\n\r]/.test(str) || str.includes(delimiter)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Construye el contenido CSV a partir de filas, con delimitador y saltos CRLF (RFC 4180).
 */
export function buildCsv(rows: (string | number)[][], delimiter = CSV_DELIMITER): string {
  return rows
    .map((row) => row.map((cell) => escapeCsvField(cell, delimiter)).join(delimiter))
    .join('\r\n');
}

/** Prefijo BOM UTF-8 para que Excel reconozca la codificación al abrir el archivo. */
export function withCsvBom(content: string): string {
  return `\uFEFF${content}`;
}

export function downloadCsvFile(filename: string, rows: (string | number)[][]): void {
  const content = withCsvBom(buildCsv(rows));
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Detecta el delimitador predominante en la primera línea del archivo. */
export function detectCsvDelimiter(headerLine: string): string {
  const semicolons = (headerLine.match(/;/g) ?? []).length;
  const commas = (headerLine.match(/,/g) ?? []).length;
  return semicolons >= commas && semicolons > 0 ? ';' : ',';
}

/** Parsea una línea CSV respetando campos entre comillas (RFC 4180). */
export function parseCsvLine(line: string, delimiter = CSV_DELIMITER): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
