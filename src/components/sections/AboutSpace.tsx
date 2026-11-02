import React, { useState, useEffect } from 'react';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { SupabaseMedia } from '../ui/SupabaseMedia';
import { fetchSupabaseTable } from '../../services/supabase';

interface SpaceMediaRecord {
  id?: string;
  storage_path?: string;
  media_type?: 'image' | 'video' | 'auto';
  caption?: string;
}

export const AboutSpace: React.FC = () => {
  const [spaceMedia, setSpaceMedia] = useState<SpaceMediaRecord>({
    storage_path: 'gabinete-narmer.jpg',
    media_type: 'auto',
  });

  useEffect(() => {
    let active = true;
    fetchSupabaseTable<SpaceMediaRecord>('space_media', 'select=*&limit=1').then((rows) => {
      if (active && rows && rows[0]?.storage_path) {
        setSpaceMedia(rows[0]);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="espacio" className="py-28 px-6 sm:px-12 md:px-20 bg-[#08121D] relative overflow-hidden border-t border-[#7A7A7A]/25">
      {/* Paper texture */}
      <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait & Studio Vignette (Magazine feel, ready for Supabase Storage photo or video) */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-3 border border-[#00B3A4]/35 bg-[#170B24] transform lg:-rotate-1 shadow-2xl">
              {/* Artistic Analog Portrait / Video Container */}
              <div className="relative aspect-[3/4] w-full bg-[#0D1B2A] overflow-hidden flex flex-col justify-end p-6 border border-[#E8D7A6]/15">
                {/* Atmospheric analog lighting simulation */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/40 to-transparent z-10 pointer-events-none" />

                {/* Supabase Storage Photograph / Video with SVG Engraving Fallback */}
                <div className="absolute inset-0 z-0">
                  <SupabaseMedia
                    bucket="space"
                    storagePath={spaceMedia.storage_path}
                    localStorageKey="narmer_space_media"
                    mediaType={spaceMedia.media_type || 'auto'}
                    alt="Gabinete Narmer · Espacio de escucha y silencio"
                    mediaClassName="w-full h-full object-cover select-none opacity-85"
                    fallbackContent={
                      <svg
                        viewBox="0 0 300 400"
                        className="w-full h-full object-cover opacity-60 mix-blend-screen select-none pointer-events-none"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="150" cy="140" r="90" stroke="#00B3A4" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.4" />
                        {/* Candle flame */}
                        <path d="M 150,110 Q 155,100 150,90 Q 145,100 150,110 Z" fill="#E8D7A6" />
                        <circle cx="150" cy="100" r="16" fill="#00B3A4" fillOpacity="0.15" />
                        {/* Book & Cards on table */}
                        <line x1="60" y1="280" x2="240" y2="280" stroke="#E8D7A6" strokeWidth="1" />
                        <polygon points="100,240 140,250 130,278 90,268" stroke="#7A7A7A" strokeWidth="1" fill="#170B24" />
                        <polygon points="160,245 200,240 205,270 165,275" stroke="#00B3A4" strokeWidth="1" fill="#2A0E34" />
                      </svg>
                    }
                  />
                </div>

                {/* Portrait Caption */}
                <div className="relative z-20 text-left">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block">
                    Gabinete Narmer · Buenos Aires & Online
                  </span>
                  <span className="font-editorial text-lg text-[#E8D7A6] font-normal block mt-1">
                    Archivo de Cartas & Cartografías Celestes
                  </span>
                </div>
              </div>

              {/* Tape / Stamp Detail */}
              <div className="absolute -top-3 left-10 px-3 py-0.5 bg-[#2A0E34] border border-[#00B3A4] text-[#E8D7A6] font-mono text-[8px] tracking-[0.3em] uppercase">
                EST. 2014
              </div>
            </div>

            <div className="mt-4 text-left font-mono text-[9px] text-[#7A7A7A] tracking-widest">
              FIG. 04 · EL ESPACIO DE ESCUCHA Y SILENCIO
            </div>
          </div>

          {/* Right Column: Editorial Interview / Philosophy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-[1.5px] bg-[#00B3A4]" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]">
                  Capítulo IV · Manifiesto Humano
                </span>
              </div>

              <EditorialBlurredHeading
                as="h2"
                delay={0.12}
                duration={1.2}
                blurAmount={12}
                className="font-editorial text-4xl sm:text-5xl text-[#E8D7A6] font-normal leading-[1.15]"
              >
                Detrás de los símbolos, hay una persona.
              </EditorialBlurredHeading>
            </div>

            <div className="space-y-5 font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light">
              <p>
                Este espacio nació de una incomodidad: el agotamiento frente a un esoterismo de respuestas rápidas,
                promesas mágicas y sentencias deterministas que le quitan a la persona su propia soberanía.
              </p>
              <p>
                Ni el Tarot ni la Astrología son bolas de cristal. Son lenguajes arquetípicos nacidos de milenios de observación
                de la psique humana. Cuando abrimos una mesa de cartas o calculamos una carta natal, no estamos buscando el futuro:
                estamos construyendo una pausa sagrada para mirar lo que pasa adentro.
              </p>
              <p>
                Aquí no hay recetas. Hay una escucha atenta, una mirada estética y un compromiso riguroso con la verdad de cada consultante.
              </p>
            </div>

            {/* Handwritten Signature and Seal */}
            <div className="pt-6 border-t border-[#7A7A7A]/25 flex items-center justify-between">
              <div>
                <span className="font-handwritten text-3xl sm:text-4xl text-[#00B3A4] block transform -rotate-2">
                  Narmer
                </span>
                <span className="font-mono text-[9px] tracking-[0.25em] text-[#7A7A7A] uppercase mt-1 block">
                  Intérprete Simbólico & Psicoastrólogo
                </span>
              </div>

              <div className="w-12 h-12 rounded-full border border-[#00B3A4]/50 flex items-center justify-center font-mono text-[9px] text-[#00B3A4] opacity-90">
                ✦ SIGIL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
