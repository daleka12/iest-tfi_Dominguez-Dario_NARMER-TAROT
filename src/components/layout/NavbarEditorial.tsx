import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Sliders } from 'lucide-react';
import { useAmbientAudio } from '../../context/AmbientAudioContext';
import { MagneticButton } from '../ui/MagneticButton';
import { NarmerLogo } from '../ui/NarmerLogo';

interface NavbarEditorialProps {
  onOpenBooking: () => void;
}

export const NavbarEditorial: React.FC<NavbarEditorialProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPlaying, togglePlay, togglePanel } = useAmbientAudio();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0D1B2A]/92 backdrop-blur-md border-b border-[#E8D7A6]/15 py-3.5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Brand Mark: Editorial & Celestial Emblem */}
          <a href="#" className="flex items-center gap-3 group">
            <NarmerLogo size="sm" showSubtitle={false} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-editorial text-lg sm:text-xl tracking-[0.22em] text-[#E8D7A6] group-hover:text-[#00B3A4] transition-colors font-medium leading-none">
                NARMER
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#00B3A4] opacity-90 mt-1">
                Tarot y Psicoastrología
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-9 text-[11px] xl:text-xs font-clean font-light tracking-[0.18em] xl:tracking-[0.2em] uppercase text-[#E8D7A6]/75">
            <a href="#tarot" className="hover:text-[#00B3A4] transition-colors whitespace-nowrap">
              Tarot
            </a>
            <a href="#oraculo" className="hover:text-[#00B3A4] transition-colors whitespace-nowrap">
              Oráculo
            </a>
            <a href="#psicoastrologia" className="hover:text-[#00B3A4] transition-colors whitespace-nowrap">
              Psicoastrología
            </a>
            <a href="#sesiones" className="hover:text-[#00B3A4] transition-colors whitespace-nowrap">
              Sesiones
            </a>
            <a href="#testimonios" className="hover:text-[#00B3A4] transition-colors whitespace-nowrap">
              Resonancias
            </a>
            <a href="#espacio" className="hover:text-[#00B3A4] transition-colors whitespace-nowrap">
              El espacio
            </a>
            <a href="#cuaderno" className="hover:text-[#00B3A4] transition-colors whitespace-nowrap">
              Cuaderno
            </a>
          </nav>

          {/* Right Controls: Ambient Audio Toggle + Small "Reservar" */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Ambient Sound Trigger */}
            <div className="flex items-center gap-1">
              <button
                onClick={togglePlay}
                className={`p-2 rounded-full border transition-all text-[11px] font-mono flex items-center gap-1.5 ${
                  isPlaying
                    ? 'border-[#00B3A4] text-[#E8D7A6] bg-[#2A0E34]/80 shadow-[0_0_12px_rgba(0,179,164,0.3)]'
                    : 'border-[#E8D7A6]/25 text-[#E8D7A6]/60 hover:text-[#00B3A4] hover:border-[#00B3A4]'
                }`}
                title={isPlaying ? 'Pausar atmósfera sonoro' : 'Activar atmósfera sonoro (Viento & Campanas)'}
                aria-label="Alternar sonido ambiental"
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#00B3A4]" />
                    <span className="hidden lg:inline text-[9px] tracking-widest uppercase">Atmósfera ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline text-[9px] tracking-widest uppercase">Atmósfera</span>
                  </>
                )}
              </button>

              {/* Discreet Settings Trigger */}
              <button
                onClick={togglePanel}
                className="hidden sm:inline-flex p-1.5 text-[#E8D7A6]/50 hover:text-[#00B3A4] transition-colors"
                title="Ajustes de sonido (Viento / Campanas / Volumen)"
                aria-label="Abrir panel de sonido"
              >
                <Sliders className="w-3 h-3" />
              </button>
            </div>

            {/* Small Editorial Action: "Reservar" */}
            <MagneticButton
              onClick={onOpenBooking}
              strength={0.25}
              className="px-4 py-2 border border-[#00B3A4]/60 bg-[#2A0E34]/30 hover:bg-[#2A0E34] hover:border-[#00B3A4] text-[#E8D7A6] font-clean text-[11px] tracking-[0.22em] uppercase transition-all duration-300"
            >
              Reservar
            </MagneticButton>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#E8D7A6] hover:text-[#00B3A4] transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Editorial Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0D1B2A] flex flex-col justify-between p-6 sm:p-8 text-left animate-fadeIn overflow-y-auto">
          <div className="flex items-center justify-between pb-5 border-b border-[#E8D7A6]/20">
            <div>
              <span className="font-editorial text-2xl tracking-[0.25em] text-[#E8D7A6]">
                NARMER
              </span>
              <span className="block font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4]">
                Gabinete Simbólico
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#E8D7A6]/70 hover:text-[#E8D7A6]"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-4 sm:gap-5 py-6 font-editorial text-2xl sm:text-3xl text-[#E8D7A6]">
            <a
              href="#tarot"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4"
            >
              <span>01. Tarot</span>
              <span className="font-mono text-xs text-[#00B3A4]">78 arcanos</span>
            </a>
            <a
              href="#oraculo"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4"
            >
              <span>02. Oráculo</span>
              <span className="font-mono text-xs text-[#00B3A4]">una pregunta</span>
            </a>
            <a
              href="#psicoastrologia"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4"
            >
              <span>03. Psicoastrología</span>
              <span className="font-mono text-xs text-[#00B3A4]">mapa interior</span>
            </a>
            <a
              href="#sesiones"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4"
            >
              <span>04. Sesiones</span>
              <span className="font-mono text-xs text-[#00B3A4]">consultas</span>
            </a>
            <a
              href="#testimonios"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4"
            >
              <span>05. Resonancias</span>
              <span className="font-mono text-xs text-[#00B3A4]">testimonios</span>
            </a>
            <a
              href="#espacio"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4"
            >
              <span>06. El espacio</span>
              <span className="font-mono text-xs text-[#00B3A4]">filosofía</span>
            </a>
            <a
              href="#cuaderno"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4"
            >
              <span>07. Cuaderno</span>
              <span className="font-mono text-xs text-[#00B3A4]">ensayos</span>
            </a>
          </nav>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-[#E8D7A6]/20 flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-4 border border-[#00B3A4] bg-[#2A0E34] text-[#E8D7A6] font-clean text-xs font-semibold tracking-[0.25em] uppercase hover:bg-[#1E0926]"
            >
              Agendar Consulta
            </button>
            <div className="flex items-center justify-between text-xs text-[#E8D7A6]/60 font-mono">
              <button onClick={togglePlay} className="flex items-center gap-2">
                {isPlaying ? <Volume2 className="w-4 h-4 text-[#00B3A4]" /> : <VolumeX className="w-4 h-4" />}
                <span>Sonido {isPlaying ? 'ON' : 'OFF'}</span>
              </button>
              <span className="text-[#7A7A7A]">LAT 31°12' N</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
