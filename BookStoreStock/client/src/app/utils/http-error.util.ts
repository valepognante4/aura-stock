/** Extrae un mensaje legible desde respuestas de error de HttpClient / FastAPI. */
export function extractHttpError(err: unknown, fallback: string): string {
  if (!err || typeof err !== 'object') {
    return fallback;
  }

  const httpErr = err as { status?: number; error?: { detail?: unknown } };

  if (httpErr.status === 0) {
    return 'No se pudo conectar al servidor. Verificá que el backend esté corriendo en http://127.0.0.1:8000.';
  }

  const detail = httpErr.error?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'msg' in item) {
          return String((item as { msg: string }).msg);
        }
        return JSON.stringify(item);
      })
      .join('. ');
  }

  return fallback;
}
