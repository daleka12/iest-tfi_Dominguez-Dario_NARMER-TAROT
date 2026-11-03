import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Sparkles } from 'lucide-react';

/**
 * Ícono Egipcio (Disco Solar Alado & Prisma de Proyección) para activar el Spot de Vídeo
 */
export const EgyptianSpotIconSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 36 36"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Halo octagonal / estelar exterior */}
    <circle
      cx="18"
      cy="18"
      r="15.5"
      stroke="#00B3A4"
      strokeWidth="1.2"
      strokeDasharray="3 2"
      fill="#180821"
      fillOpacity="0.7"
    />
    {/* Alas solares estilizadas */}
    <path
      d="M 4.5,18 Q 9,12 13,15.5 L 13,20.5 Q 9,24 4.5,18 Z"
      stroke="#00B3A4"
      strokeWidth="1.1"
      fill="#2A0E34"
    />
    <path
      d="M 31.5,18 Q 27,12 23,15.5 L 23,20.5 Q 27,24 31.5,18 Z"
      stroke="#00B3A4"
      strokeWidth="1.1"
      fill="#2A0E34"
    />
    {/* Disco solar central */}
    <circle
      cx="18"
      cy="18"
      r="7.2"
      stroke="#E8D7A6"
      strokeWidth="1.3"
      fill="#0D1B2A"
    />
    {/* Prisma de reproducción sagrado (Play dorado) */}
    <polygon
      points="16.2,14.3 22.2,18 16.2,21.7"
      fill="#E8D7A6"
      stroke="#00B3A4"
      strokeWidth="0.6"
      strokeLinejoin="round"
    />
    {/* Destellos cardinales */}
    <circle cx="18" cy="6.5" r="1.1" fill="#E8D7A6" />
    <circle cx="18" cy="29.5" r="1.1" fill="#00B3A4" />
  </svg>
);

interface EgyptianVideoSpotModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const YOUTUBE_VIDEO_ID = 'NCWwVNCTeDo';
const YOUTUBE_WATCH_URL = 'https://youtu.be/NCWwVNCTeDo';
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;

export const EgyptianVideoSpotModal: React.FC<EgyptianVideoSpotModalProps> = ({
  isOpen,
  onOpen,
  onClose,
}) => {
  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Ícono Flotante Discreto y No Invasivo (Medallón Egipcio que despliega etiqueta al pasar el cursor) */}
      <div className="fixed bottom-20 left-6 z-40">
        <button
          onClick={() => (isOpen ? onClose() : onOpen())}
          aria-label="Reproducir Spot Audiovisual de Narmer"
          title="Ver Spot Audiovisual · NARMER"
          className="group relative flex items-center gap-0 hover:gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-full border border-[#E8D7A6]/45 hover:border-[#00B3A4] bg-[#0D1B2A]/90 hover:bg-[#1E0B28]/95 backdrop-blur-md text-[#E8D7A6] shadow-[0_10px_28px_rgba(0,0,0,0.75),0_0_16px_rgba(232,215,166,0.18)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.85),0_0_24px_rgba(0,179,164,0.4)] transition-all duration-400"
        >
          {/* Halo pulsante sutil */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#E8D7A6]/15 via-[#00B3A4]/20 to-[#2A0E34]/25 opacity-60 group-hover:opacity-100 blur-sm transition-opacity pointer-events-none" />

          <span className="relative flex items-center justify-center w-7 h-7 rounded-full border border-[#E8D7A6]/40 bg-[#08121D] group-hover:border-[#00B3A4] group-hover:scale-105 transition-all duration-300 shrink-0">
            <EgyptianSpotIconSvg className="w-5 h-5" />
          </span>

          {/* Etiqueta oculta que se revela suavemente al pasar el cursor para no ser invasiva */}
          <span className="relative max-w-0 overflow-hidden group-hover:max-w-[140px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-start text-left whitespace-nowrap">
            <span className="font-mono text-[7.5px] tracking-[0.24em] uppercase text-[#00B3A4] leading-none">
              Audiovisual
            </span>
            <span className="font-editorial text-xs tracking-[0.12em] text-[#E8D7A6] leading-tight mt-0.5">
              Spot · Vídeo
            </span>
          </span>
        </button>
      </div>

      {/* Modal Cinematográfico del Spot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#050B12]/92 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Spot Audiovisual · Narmer Tarot y Psicoastrología"
            onClick={onClose}
          >
            {/* Resplandor astral de fondo */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, rgba(42,14,52,0.55) 0%, rgba(0,179,164,0.12) 40%, rgba(5,11,18,0.96) 80%)',
              }}
            />

            {/* Contenedor del Reproductor con Orfebrería Egipcia */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="relative z-10 w-full max-w-4xl rounded-2xl border border-[#00B3A4]/50 bg-[#09131F]/95 p-4 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_45px_rgba(0,179,164,0.22)]"
            >
              {/* Ornamentos esquineros dorados */}
              <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-[#E8D7A6]/60 pointer-events-none" />
              <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-[#E8D7A6]/60 pointer-events-none" />
              <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-[#E8D7A6]/60 pointer-events-none" />
              <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-[#E8D7A6]/60 pointer-events-none" />

              {/* Cabecera del Modal */}
              <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E8D7A6]/15">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-full border border-[#00B3A4]/45 bg-[#1C0A27]">
                    <EgyptianSpotIconSvg className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.28em] uppercase text-[#00B3A4]">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Presentación Audiovisual · NARMER</span>
                    </div>
                    <h3 className="font-editorial text-lg sm:text-2xl text-[#E8D7A6] tracking-wide leading-tight">
                      Spot Oficial · Tarot y Psicoastrología
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={YOUTUBE_WATCH_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8D7A6]/25 hover:border-[#00B3A4] text-[10px] font-mono tracking-widest uppercase text-[#E8D7A6]/80 hover:text-[#00B3A4] transition-colors"
                    title="Abrir vídeo en YouTube"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-full border border-[#E8D7A6]/30 hover:border-[#00B3A4] bg-[#160A20] text-[#E8D7A6] hover:text-[#00B3A4] transition-colors"
                    aria-label="Cerrar Spot de Vídeo"
                    title="Cerrar (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Marco 16:9 del Vídeo */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#00B3A4]/35 bg-black shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
                <iframe
                  src={YOUTUBE_EMBED_URL}
                  title="Spot Audiovisual · NARMER Tarot y Psicoastrología"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Pie editorial del modal */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#E8D7A6]/65">
                <span className="tracking-[0.18em] uppercase text-[#00B3A4]/90">
                  ✦ El símbolo como puente entre lo visible y lo invisible
                </span>
                <a
                  href={YOUTUBE_WATCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden inline-flex items-center gap-1.5 text-[#E8D7A6] hover:text-[#00B3A4] underline underline-offset-4"
                >
                  <span>Ver directamente en YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

