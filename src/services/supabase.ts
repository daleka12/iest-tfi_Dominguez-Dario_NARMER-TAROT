/**
 * Capa de integración ligera con Supabase (Storage & Database REST API)
 *
 * - No requiere modificar credenciales existentes ni rompe la aplicación si las
 *   variables de entorno aún no están configuradas.
 * - Cuando VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY están presentes en el entorno,
 *   habilita la carga de fotografías/videos desde Supabase Storage y la sincronización
 *   de datos y reservas con Supabase Database sin duplicar estructuras existentes.
 */

const getEnvVar = (key: string): string => {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    return env?.[key]?.trim() || '';
  } catch {
    return '';
  }
};

export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      SUPABASE_URL.startsWith('http') &&
      !SUPABASE_URL.includes('YOUR_') &&
      !SUPABASE_ANON_KEY.includes('YOUR_')
  );
};

export type StorageBucketName = 'cards' | 'brand' | 'space' | 'essays' | 'sessions' | 'testimonials' | string;

/**
 * Construye la URL pública de un archivo (fotografía o video) alojado en Supabase Storage.
 * Si `pathOrUrl` ya es una URL completa (http/https), la devuelve directamente.
 */
export const getSupabaseStorageUrl = (
  bucket: StorageBucketName,
  pathOrUrl?: string | null
): string | null => {
  if (!pathOrUrl) return null;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (!SUPABASE_URL || !SUPABASE_URL.startsWith('http')) {
    return null;
  }

  const baseUrl = SUPABASE_URL.replace(/\/+$/, '');
  const cleanBucket = bucket.replace(/^\/+|\/+$/g, '');
  const cleanPath = trimmed.replace(/^\/+/, '');

  return `${baseUrl}/storage/v1/object/public/${cleanBucket}/${cleanPath}`;
};

/**
 * Detecta si una URL o nombre de archivo corresponde a un recurso de video.
 */
export const isVideoAsset = (urlOrPath?: string | null): boolean => {
  if (!urlOrPath) return false;
  const clean = urlOrPath.split('?')[0].toLowerCase();
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.endsWith('.ogg');
};

/**
 * Consulta registros de una tabla en Supabase Database mediante PostgREST.
 * Devuelve `null` de forma silenciosa si Supabase no está configurado o si ocurre un error,
 * permitiendo que los componentes conserven sus datos editoriales originales sin duplicarlos.
 */
export async function fetchSupabaseTable<T>(
  table: string,
  queryParams: string = 'select=*'
): Promise<T[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const baseUrl = SUPABASE_URL.replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/rest/v1/${table}?${queryParams}`, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? (data as T[]) : null;
  } catch {
    return null;
  }
}

/**
 * Inserta un registro en una tabla de Supabase Database (ej. reservas de sesiones o consultas).
 * Operación segura y no bloqueante.
 */
export async function insertSupabaseRecord(
  table: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase no configurado aún' };
  }

  try {
    const baseUrl = SUPABASE_URL.replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error de red' };
  }
}

