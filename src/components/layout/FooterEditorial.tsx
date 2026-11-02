import React from 'react';
import { Send, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { NarmerLogo } from '../ui/NarmerLogo';

interface FooterEditorialProps {
  onOpenBooking: () => void;
}

export const FooterEditorial: React.FC<FooterEditorialProps> = ({ onOpenBooking }) => {
  return (
    <footer className="bg-[#070F18] border-t border-[#7A7A7A]/25 pt-20 pb-24 sm:pb-16 px-6 sm:px-12 md:px-20 text-[#E8D7A6]/80 text-left">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#7A7A7A]/20">
          {/* Brand & Poetic Closing Statement (Cols 1-6) */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-4">
              <NarmerLogo size="md" showSubtitle={false} />
              <div>
                <span className="font-editorial text-2xl sm:text-3xl tracking-[0.25em] text-[#E8D7A6] font-normal block leading-tight">
                  NARMER
                </span>
                <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block mt-1">
                  Gabinete de Interpretación Simbólica & Psicoastrología
                </span>
              </div>
            </div>

            <p className="font-editorial italic text-xl sm:text-2xl text-[#E8D7A6] max-w-md leading-relaxed">
              «Nos encontramos entre lo que sabemos y lo que todavía estamos aprendiendo a mirar.»
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <MagneticButton
                onClick={onOpenBooking}
                strength={0.3}
                className="px-6 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,179,164,0.18)]"
              >
                <span>Agendar una consulta</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#00B3A4]" />
              </MagneticButton>
            </div>
          </div>

          {/* Directory Links (Cols 7-9) */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block font-bold">
              Exploración
            </span>
            <ul className="space-y-3 font-clean text-xs uppercase tracking-widest text-[#E8D7A6]/75">
              <li>
                <a href="#tarot" className="hover:text-[#00B3A4] transition-colors">
                  El Tarot (78 arcanos)
                </a>
              </li>
              <li>
                <a href="#oraculo" className="hover:text-[#00B3A4] transition-colors">
                  Una Pregunta (Ritual)
                </a>
              </li>
              <li>
                <a href="#psicoastrologia" className="hover:text-[#00B3A4] transition-colors">
                  Psicoastrología
                </a>
              </li>
              <li>
                <a href="#sesiones" className="hover:text-[#00B3A4] transition-colors">
                  Sesiones & Catálogo
                </a>
              </li>
              <li>
                <a href="#testimonios" className="hover:text-[#00B3A4] transition-colors">
                  Resonancias (Testimonios)
                </a>
              </li>
              <li>
                <a href="#espacio" className="hover:text-[#00B3A4] transition-colors">
                  El Espacio
                </a>
              </li>
              <li>
                <a href="#cuaderno" className="hover:text-[#00B3A4] transition-colors">
                  Cuaderno de Símbolos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Presence (Cols 10-12) */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block font-bold">
              Correspondencia
            </span>
            <div className="space-y-3 font-clean text-xs text-[#E8D7A6]/75 font-light leading-relaxed">
              <p>Consultas individuales y a distancia para España, Latinoamérica y Estados Unidos.</p>
              
              <div className="pt-2 flex flex-col gap-2 font-mono text-[11px] text-[#E8D7A6]">
                <a
                  href="https://wa.me/5493516429757"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00B3A4] flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3 text-[#00B3A4]" /> WhatsApp: 3516429757
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00B3A4] transition-colors"
                >
                  @narmer.simbolos
                </a>
                <span className="text-[#7A7A7A]">contacto@narmer.art</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Disclaimer & Colophon */}
        <div className="pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[10px] font-clean text-[#7A7A7A] leading-relaxed">
          <p className="max-w-2xl">
            <strong>Nota ética:</strong> El Tarot y la psicoastrología se presentan como herramientas simbólicas de reflexión y autoconocimiento. No sustituyen asesoramiento médico, psicológico, legal o financiero.
          </p>

          <div className="font-mono tracking-widest text-[#00B3A4] shrink-0">
            © {new Date().getFullYear()} NARMER · GABINETE SIMBÓLICO
          </div>
        </div>
      </div>
    </footer>
  );
};
