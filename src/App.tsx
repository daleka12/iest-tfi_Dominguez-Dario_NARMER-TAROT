/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AmbientAudioProvider } from './context/AmbientAudioContext';
import { AtmosphericAudioPlayer } from './components/audio/AtmosphericAudioPlayer';
import { OrbitalCursor } from './components/ui/OrbitalCursor';
import { NavbarEditorial } from './components/layout/NavbarEditorial';
import { HeroArtistic } from './components/sections/HeroArtistic';
import { TarotGalleryArtistic } from './components/sections/TarotGalleryArtistic';
import { TarotRitualExperience } from './components/oracle/TarotRitualExperience';
import { PsicoastrologiaMap } from './components/sections/PsicoastrologiaMap';
import { SessionsCatalog } from './components/sections/SessionsCatalog';
import { AboutSpace } from './components/sections/AboutSpace';
import { ManifestoPhrases } from './components/sections/ManifestoPhrases';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { CuadernoSimbolos } from './components/sections/CuadernoSimbolos';
import { FooterEditorial } from './components/layout/FooterEditorial';
import { BookingEditorialModal } from './components/booking/BookingEditorialModal';
import { EditorialSectionReveal } from './components/ui/EditorialSectionReveal';
import { EditorialScrollTimeline } from './components/ui/EditorialScrollTimeline';
import { AnalogFilmGrainOverlay } from './components/ui/AnalogFilmGrainOverlay';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState('01 · TAROT (60 min)');

  const handleOpenBooking = (sessionTitle?: string) => {
    if (sessionTitle) {
      setSelectedSession(sessionTitle);
    }
    setBookingModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AmbientAudioProvider>
      <div className="min-h-screen bg-[#0D1B2A] text-[#E8D7A6] relative selection:bg-[#2A0E34] selection:text-[#E8D7A6] custom-cursor-active overflow-x-hidden">
        {/* Full-Screen Dynamic Analog Film Grain Noise Overlay */}
        <AnalogFilmGrainOverlay />

        {/* Subtle Editorial Scroll Progress Line at Top of Viewport */}
        <EditorialScrollTimeline />

        {/* Delicate Astronomical Cursor (Desktops) */}
        <OrbitalCursor />

        {/* Minimalist Editorial Navigation */}
        <NavbarEditorial
          onOpenBooking={() => handleOpenBooking()}
        />

        <main className="relative">
          {/* 1. Hero / Portada Artística (Primary viewport entry) */}
          <HeroArtistic
            onEnterOracle={() => scrollToSection('oraculo')}
            onExploreChart={() => scrollToSection('psicoastrologia')}
            onBookSession={() => handleOpenBooking()}
          />

          {/* 2. Sección "El Tarot" (78 maneras de mirarte) */}
          <EditorialSectionReveal conduitLabel="CAP. I · ARCANOS">
            <TarotGalleryArtistic />
          </EditorialSectionReveal>

          {/* 3. Tarot Interactivo: "Una pregunta" (Ritual digital) */}
          <EditorialSectionReveal conduitLabel="RITUAL · ORÁCULO">
            <TarotRitualExperience />
          </EditorialSectionReveal>

          {/* 4. Psicoastrología: "El cielo también deja huellas" (Mapa interior) */}
          <EditorialSectionReveal conduitLabel="CAP. II · ASTROS">
            <PsicoastrologiaMap />
          </EditorialSectionReveal>

          {/* 5. Catálogo Editorial de Sesiones */}
          <EditorialSectionReveal conduitLabel="CAP. III · CONSULTAS">
            <SessionsCatalog onBookSession={(title) => handleOpenBooking(title)} />
          </EditorialSectionReveal>

          {/* 6. Testimonios & Resonancias (Slider contemplativo de lenta transición) */}
          <EditorialSectionReveal conduitLabel="VOCES · RESONANCIAS">
            <TestimonialsSection />
          </EditorialSectionReveal>

          {/* 7. Frases / Manifiesto (Pausa contemplativa) */}
          <EditorialSectionReveal conduitLabel="PAUSA · AFORISMOS">
            <ManifestoPhrases />
          </EditorialSectionReveal>

          {/* 8. Sobre el Espacio ("Detrás de los símbolos, hay una persona") */}
          <EditorialSectionReveal conduitLabel="CAP. IV · GABINETE">
            <AboutSpace />
          </EditorialSectionReveal>

          {/* 9. Cuaderno de Símbolos (Revista editorial & ensayos) */}
          <EditorialSectionReveal conduitLabel="CAP. V · ENSAYOS">
            <CuadernoSimbolos />
          </EditorialSectionReveal>
        </main>

        {/* Floating Minimalist Audio Player Component */}
        <AtmosphericAudioPlayer />

        {/* 9. Footer Artístico */}
        <EditorialSectionReveal showConduit={false}>
          <FooterEditorial
            onOpenBooking={() => handleOpenBooking()}
          />
        </EditorialSectionReveal>

        {/* Modal de Reserva Intuitivo */}
        <BookingEditorialModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          initialSession={selectedSession}
        />
      </div>
    </AmbientAudioProvider>
  );
}

