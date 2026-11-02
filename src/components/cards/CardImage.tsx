import React from 'react';
import { SupabaseMedia } from '../ui/SupabaseMedia';

export type SupportedArcanaId =
  | 'sacerdotisa'
  | 'ermitano'
  | 'torre'
  | 'colgado'
  | 'luna'
  | 'mago'
  | 'estrella'
  | 'emperador';

interface CardImageProps {
  cardId: SupportedArcanaId;
  /** Ruta o URL opcional en Supabase Storage (foto o video de la carta) */
  storagePath?: string;
  mediaType?: 'image' | 'video' | 'auto';
  className?: string;
  alt: string;
  fallbackSvg?: React.ReactNode;
}

const CARD_FILENAME_MAP: Record<SupportedArcanaId, string> = {
  sacerdotisa: '2.jpeg',
  ermitano: '9.jpeg',
  torre: '16.jpeg',
  colgado: '12.jpeg',
  luna: '18.jpeg',
  mago: '1.jpeg',
  estrella: '17.jpeg',
  emperador: '4.jpeg',
};

const LOCAL_STORAGE_KEY_PREFIX = 'narmer_card_img_';

export const CardImage: React.FC<CardImageProps> = ({
  cardId,
  storagePath,
  mediaType = 'auto',
  className = '',
  alt,
  fallbackSvg,
}) => {
  const fileName = CARD_FILENAME_MAP[cardId] || 'card.jpeg';

  return (
    <SupabaseMedia
      bucket="cards"
      storagePath={storagePath || fileName}
      localFallbackSrc={`/cards/${fileName}`}
      localStorageKey={LOCAL_STORAGE_KEY_PREFIX + cardId}
      mediaType={mediaType}
      alt={alt}
      className={className}
      mediaClassName="w-full h-full object-contain rounded-xl select-none"
      fallbackContent={
        fallbackSvg ? (
          <div className="w-full h-full flex items-center justify-center">
            {fallbackSvg}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#08121D] p-4 text-center border border-[#00B3A4]/30 rounded-xl">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#00B3A4] mb-2">
              Arcano · {fileName}
            </span>
            <span className="font-editorial text-sm text-[#E8D7A6]">{alt}</span>
          </div>
        )
      }
    />
  );
};
