import React, { useState, useEffect } from 'react';
import { getSupabaseStorageUrl, isVideoAsset, StorageBucketName } from '../../services/supabase';

export interface SupabaseMediaProps {
  /** Nombre del bucket en Supabase Storage (ej. 'cards', 'space', 'essays', 'brand') */
  bucket?: StorageBucketName;
  /** Ruta dentro del bucket o URL directa de fotografía/video */
  storagePath?: string | null;
  /** Ruta estática local de respaldo (ej. '/cards/2.jpeg') */
  localFallbackSrc?: string | null;
  /** Clave opcional de localStorage para previsualización local */
  localStorageKey?: string;
  /** Forzar tipo de medio ('image' | 'video' | 'auto') */
  mediaType?: 'image' | 'video' | 'auto';
  /** URL opcional de póster para elementos de video */
  poster?: string;
  alt: string;
  className?: string;
  mediaClassName?: string;
  /** Contenido de respaldo (ej. grabado SVG artesanal) si la imagen/video no existe aún */
  fallbackContent?: React.ReactNode;
}

/**
 * SupabaseMedia
 *
 * Componente preparado para recibir fotografías y videos desde Supabase Storage
 * con degradación elegante (fallback encadenado: Supabase Storage -> LocalStorage -> Archivo local -> SVG artesanal).
 */
export const SupabaseMedia: React.FC<SupabaseMediaProps> = ({
  bucket = 'space',
  storagePath,
  localFallbackSrc,
  localStorageKey,
  mediaType = 'auto',
  poster,
  alt,
  className = '',
  mediaClassName = 'w-full h-full object-cover select-none',
  fallbackContent,
}) => {
  const candidateSources = React.useMemo(() => {
    const sources: string[] = [];

    if (localStorageKey) {
      try {
        const stored = localStorage.getItem(localStorageKey);
        if (stored) sources.push(stored);
      } catch {
        // Ignorar errores de acceso a localStorage
      }
    }

    if (storagePath) {
      const supaUrl = getSupabaseStorageUrl(bucket, storagePath);
      if (supaUrl) sources.push(supaUrl);
    }

    if (localFallbackSrc) {
      sources.push(localFallbackSrc);
    }

    return sources;
  }, [bucket, storagePath, localFallbackSrc, localStorageKey]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setExhausted(candidateSources.length === 0);
  }, [candidateSources]);

  const activeSrc = !exhausted ? candidateSources[sourceIndex] : null;
  const shouldRenderVideo =
    activeSrc && (mediaType === 'video' || (mediaType === 'auto' && isVideoAsset(activeSrc)));

  const handleMediaError = () => {
    if (sourceIndex + 1 < candidateSources.length) {
      setSourceIndex((prev) => prev + 1);
    } else {
      setExhausted(true);
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {activeSrc && !exhausted ? (
        shouldRenderVideo ? (
          <video
            key={activeSrc}
            src={activeSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={handleMediaError}
            aria-label={alt}
            className={mediaClassName}
          />
        ) : (
          <img
            key={activeSrc}
            src={activeSrc}
            alt={alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleMediaError}
            className={mediaClassName}
          />
        )
      ) : fallbackContent ? (
        <div className="w-full h-full flex items-center justify-center">{fallbackContent}</div>
      ) : null}
    </div>
  );
};

