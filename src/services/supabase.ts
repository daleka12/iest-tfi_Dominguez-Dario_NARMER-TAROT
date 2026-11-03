/**
 * Capa de integración con Supabase (Storage & Database REST API) + Respaldo Local y Notificación por Email
 *
 * Tablas soportadas en Supabase:
 * 1. `testimonials` -> Comentarios y resonancias en Capítulo IV (Resonancias & Huellas)
 * 2. `essays`       -> Ensayos y notas editoriales en Capítulo V (Ensayos & Apuntes)
 * 3. `essay_notes`  -> Apuntes y notas al margen dentro de cada ensayo del Capítulo V
 * 4. `bookings`     -> Reservas de sesiones con envío de notificación a dalekavideos@gmail.com
 */

export const OWNER_NOTIFICATION_EMAIL = 'dalekavideos@gmail.com';

const getEnvVar = (key: string): string => {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const fromEnv = env?.[key]?.trim();
    if (fromEnv) return fromEnv;
  } catch {
    // Ignorar si import.meta no está disponible
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (key === 'VITE_SUPABASE_URL') {
        return window.localStorage.getItem('narmer_supabase_url')?.trim() || '';
      }
      if (key === 'VITE_SUPABASE_ANON_KEY') {
        return window.localStorage.getItem('narmer_supabase_anon_key')?.trim() || '';
      }
    }
  } catch {
    // Ignorar errores de acceso a localStorage
  }

  return '';
};

export const DEFAULT_SUPABASE_URL = 'https://goztukplpqyjjwyxidku.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_rxUGsgEcszvKQSLAb6A3hg_vqdbzsfu';

export const getSupabaseUrl = (): string => getEnvVar('VITE_SUPABASE_URL') || DEFAULT_SUPABASE_URL;
export const getSupabaseAnonKey = (): string => getEnvVar('VITE_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY;

export const SUPABASE_URL = getSupabaseUrl();
export const SUPABASE_ANON_KEY = getSupabaseAnonKey();

export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url &&
      key &&
      url.startsWith('http') &&
      !url.includes('YOUR_') &&
      !key.includes('YOUR_')
  );
};

export const saveSupabaseCredentialsLocal = (url: string, anonKey: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('narmer_supabase_url', url.trim());
      window.localStorage.setItem('narmer_supabase_anon_key', anonKey.trim());
    }
  } catch {
    // Ignorar si localStorage está bloqueado
  }
};

export type StorageBucketName = 'cards' | 'brand' | 'space' | 'essays' | 'sessions' | 'testimonials' | string;

/**
 * Construye la URL pública de un archivo alojado en Supabase Storage.
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

  const url = getSupabaseUrl();
  if (!url || !url.startsWith('http')) {
    return null;
  }

  const baseUrl = url.replace(/\/+$/, '');
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
 * Lee registros guardados localmente en el navegador como respaldo inmediato.
 */
export function getLocalRecords<T>(storageKey: string): T[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda un registro en localStorage para persistencia inmediata aún sin conexión.
 */
export function appendLocalRecord<T>(storageKey: string, record: T): T[] {
  try {
    const current = getLocalRecords<T>(storageKey);
    const updated = [record, ...current];
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    return updated;
  } catch {
    return [record];
  }
}

/**
 * Consulta registros de una tabla en Supabase Database mediante PostgREST.
 */
export async function fetchSupabaseTable<T>(
  table: string,
  queryParams: string = 'select=*'
): Promise<T[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const baseUrl = getSupabaseUrl().replace(/\/+$/, '');
    const anonKey = getSupabaseAnonKey();
    const response = await fetch(`${baseUrl}/rest/v1/${table}?${queryParams}`, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
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
 * Inserta un registro en una tabla de Supabase Database (testimonials, essays, essay_notes, bookings).
 */
export async function insertSupabaseRecord(
  table: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase en modo local (pendiente configurar credenciales)' };
  }

  try {
    const baseUrl = getSupabaseUrl().replace(/\/+$/, '');
    const anonKey = getSupabaseAnonKey();
    const response = await fetch(`${baseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return { ok: false, error: `HTTP ${response.status} ${errText}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error de red' };
  }
}

export interface BookingEmailPayload {
  session_type: string;
  client_name: string;
  client_email: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  created_at: string;
}

/**
 * Envía automáticamente los datos de la reserva al correo dalekavideos@gmail.com
 * mediante FormSubmit AJAX y genera el enlace mailto de respaldo.
 */
export async function sendBookingEmailToOwner(
  booking: BookingEmailPayload
): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${OWNER_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `✦ Nueva Reserva NARMER: ${booking.session_type} — ${booking.client_name}`,
        _template: 'table',
        _captcha: 'false',
        Consultante: booking.client_name,
        Email_Consultante: booking.client_email,
        Sesion_Solicitada: booking.session_type,
        Fecha_Tentativa: booking.preferred_date || 'A coordinar',
        Horario_Preferido: `${booking.preferred_time} hs`,
        Mensaje_o_Inquietud: booking.notes || 'Sin notas adicionales',
        Fecha_Registro: booking.created_at,
      }),
    });

    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
}

/**
 * Construye un enlace mailto: directo hacia dalekavideos@gmail.com con el detalle de la reserva.
 */
export function buildBookingMailtoUrl(booking: BookingEmailPayload): string {
  const subject = encodeURIComponent(
    `Reserva de Consulta NARMER · ${booking.session_type} (${booking.client_name})`
  );
  const body = encodeURIComponent(
    [
      'Hola Narmer,',
      '',
      'Te envío los datos de mi solicitud de reserva en el Gabinete:',
      '',
      `• Consultante: ${booking.client_name}`,
      `• Correo de contacto: ${booking.client_email}`,
      `• Sesión solicitada: ${booking.session_type}`,
      `• Fecha tentativa: ${booking.preferred_date || 'A coordinar'}`,
      `• Franja horaria: ${booking.preferred_time} hs`,
      `• Inquietud / Nota: ${booking.notes || 'Sin notas adicionales'}`,
      '',
      'Muchas gracias.',
    ].join('\n')
  );
  return `mailto:${OWNER_NOTIFICATION_EMAIL}?subject=${subject}&body=${body}`;
}
