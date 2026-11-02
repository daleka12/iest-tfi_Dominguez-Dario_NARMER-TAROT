import React from 'react';
import { Sparkles, Compass, Moon, HeartHandshake, ArrowRight, Clock, FileText, Video } from 'lucide-react';

interface ServicesBentoProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onSelectService }) => {
  return (
    <section id="servicios" className="py-20 px-4 sm:px-6 bg-[#0D1B2A] relative overflow-hidden">
      {/* Background ambient stars */}
      <div className="absolute inset-0 stars-overlay opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#00B3A4] mb-2 font-body">
            <span>Consultas Sagradas & Formatos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-title-classic font-bold text-gold-gradient tracking-wide">
            Caminos de Revelación & Sanación
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#E8D7A6]/80 font-body leading-relaxed">
            Cada sesión es un espacio terapéutico confidencial diseñado para brindarte lucidez profunda,
            alineación con tu destino y herramientas prácticas para tu evolución consciente.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 01. Carta Natal Psicoastrológica (Col-span 2 - Marquee Anchor) */}
          <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-[#2A0E34] via-[#1B0C24] to-[#0D1B2A] border border-[#E8D7A6]/25 p-7 sm:p-9 flex flex-col justify-between hover:border-[#00B3A4] transition-all duration-300 relative overflow-hidden group">
            {/* Background sacred geometry watermark */}
            <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full border border-[#00B3A4]/15 pointer-events-none group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute right-12 bottom-12 w-44 h-44 rounded-full border border-[#E8D7A6]/10 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#00B3A4] uppercase">
                  01. Servicio Troncal · Profundidad Total
                </span>
                <span className="text-xs text-[#E8D7A6]/70 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00B3A4]" /> 75 minutos
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-title-classic font-bold text-[#E8D7A6] mb-3">
                Carta Natal Psicoastrológica
              </h3>

              <p className="text-sm text-[#E8D7A6]/80 font-body leading-relaxed max-w-xl mb-6">
                El mapa de ruta de tu alma en el momento exacto de tu nacimiento. Analizamos la posición de los planetas,
                casas astrológicas y aspectos bajo la cosmogonía egipcia y la psicología profunda de Carl Jung.
                Identificamos patrones inconscientes, talentos innatos y el propósito superior de tu encarnación.
              </p>

              {/* Deliverables checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-xs text-[#E8D7A6]/80">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/25 border border-[#E8D7A6]/10">
                  <Video className="w-3.5 h-3.5 text-[#00B3A4] shrink-0" />
                  <span>Videollamada 1 a 1 HD</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/25 border border-[#E8D7A6]/10">
                  <FileText className="w-3.5 h-3.5 text-[#00B3A4] shrink-0" />
                  <span>Informe Escrito PDF</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/25 border border-[#E8D7A6]/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#00B3A4] shrink-0" />
                  <span>Grabación Completa Audio</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D7A6]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#E8D7A6]/60 block">Inversión por Sesión</span>
                <span className="text-xl font-title-classic font-bold text-gold-gradient">
                  $65 USD / $60.000 ARS
                </span>
              </div>
              <button
                onClick={() => onSelectService('Carta Natal Psicoastrológica')}
                className="px-6 py-2.5 rounded-xl bg-[#00B3A4] hover:bg-[#74F8EC] text-[#0D1B2A] font-title-classic font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Agendar Carta Natal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: 02. Tarot Egipcio Evolutivo (Col-span 1) */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1C0B24] via-[#140819] to-[#0D1B2A] border border-[#E8D7A6]/25 p-7 flex flex-col justify-between hover:border-[#00B3A4] transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#00B3A4] uppercase">
                  02. Momento Presente
                </span>
                <span className="text-xs text-[#E8D7A6]/70 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00B3A4]" /> 60 minutos
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-title-classic font-bold text-[#E8D7A6] mb-3">
                Tarot Egipcio Evolutivo
              </h3>

              <p className="text-xs sm:text-sm text-[#E8D7A6]/80 font-body leading-relaxed mb-6">
                Una lectura no fatalista, sino terapéutica. Usamos el mazo del Tarot Egipcio con sus tres planos
                (espiritual, mental y físico) para responder preguntas clave, destrabar bloqueos y clarificar decisiones inmediatas.
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#E8D7A6]/80">
                <div className="p-2 rounded bg-black/20 border border-[#E8D7A6]/10">
                  ✦ Tirada de la Cruz de Ankh y Balanza de Maat
                </div>
                <div className="p-2 rounded bg-black/20 border border-[#E8D7A6]/10">
                  ✦ Desglose de puntos ciegos y sincronicidades
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D7A6]/15 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#E8D7A6]/60 block">Inversión</span>
                <span className="text-base font-title-classic font-bold text-gold-gradient">
                  $50 USD / $45.000 ARS
                </span>
              </div>
              <button
                onClick={() => onSelectService('Tarot Egipcio Evolutivo')}
                className="px-4 py-2 rounded-xl bg-[#2A0E34] hover:bg-[#00B3A4] hover:text-[#0D1B2A] text-[#E8D7A6] border border-[#E8D7A6]/30 font-title-classic font-bold text-xs uppercase transition-all"
              >
                Reservar
              </button>
            </div>
          </div>

          {/* Card 3: 03. Revolución Solar & Tránsitos (Col-span 1) */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1C0B24] via-[#140819] to-[#0D1B2A] border border-[#E8D7A6]/25 p-7 flex flex-col justify-between hover:border-[#00B3A4] transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#00B3A4] uppercase">
                  03. Tu Nuevo Año
                </span>
                <span className="text-xs text-[#E8D7A6]/70 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00B3A4]" /> 75 minutos
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-title-classic font-bold text-[#E8D7A6] mb-3">
                Revolución Solar & Ciclos
              </h3>

              <p className="text-xs sm:text-sm text-[#E8D7A6]/80 font-body leading-relaxed mb-6">
                Calculada para el momento exacto en que el Sol retorna a los grados de tu nacimiento.
                Es el pronóstico energético de tus 12 meses por venir: desafíos, ventanas de oportunidad y tránsitos clave.
              </p>

              <div className="space-y-2 mb-6 text-xs text-[#E8D7A6]/80">
                <div className="p-2 rounded bg-black/20 border border-[#E8D7A6]/10">
                  ✦ Calendario de fechas de alta activación cósmica
                </div>
                <div className="p-2 rounded bg-black/20 border border-[#E8D7A6]/10">
                  ✦ Integración con la carta natal de base
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D7A6]/15 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#E8D7A6]/60 block">Inversión</span>
                <span className="text-base font-title-classic font-bold text-gold-gradient">
                  $65 USD / $60.000 ARS
                </span>
              </div>
              <button
                onClick={() => onSelectService('Revolución Solar & Tránsitos')}
                className="px-4 py-2 rounded-xl bg-[#2A0E34] hover:bg-[#00B3A4] hover:text-[#0D1B2A] text-[#E8D7A6] border border-[#E8D7A6]/30 font-title-classic font-bold text-xs uppercase transition-all"
              >
                Reservar
              </button>
            </div>
          </div>

          {/* Card 4: 04. Sinastría & Compatibilidad Vincular (Col-span 2) */}
          <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-[#2A0E34] via-[#1B0C24] to-[#0D1B2A] border border-[#E8D7A6]/25 p-7 sm:p-9 flex flex-col justify-between hover:border-[#00B3A4] transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-[#00B3A4] uppercase">
                  04. Relaciones & Alquimia Vincular
                </span>
                <span className="text-xs text-[#E8D7A6]/70 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00B3A4]" /> 90 minutos
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-title-classic font-bold text-[#E8D7A6] mb-3">
                Sinastría & Dinámica de Pareja
              </h3>

              <p className="text-sm text-[#E8D7A6]/80 font-body leading-relaxed max-w-xl mb-6">
                Cruce y superposición de las cartas natales de dos personas (pareja, socios o familiares).
                Comprende la razón por la cual sus destinos se cruzaron, los contratos de aprendizaje mutuo,
                los puntos de fricción kármica y las vías para potenciar la armonía afectiva.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs text-[#E8D7A6]/80">
                <div className="p-2.5 rounded-lg bg-black/25 border border-[#E8D7A6]/10 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#00B3A4]" />
                  <span>Análisis de Carta Compuesta (La Tercera Entidad)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/25 border border-[#E8D7A6]/10 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#00B3A4]" />
                  <span>Estrategias de comunicación y respeto de tiempos</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D7A6]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#E8D7A6]/60 block">Inversión (2 Consultantes o 1)</span>
                <span className="text-xl font-title-classic font-bold text-gold-gradient">
                  $85 USD / $78.000 ARS
                </span>
              </div>
              <button
                onClick={() => onSelectService('Sinastría & Dinámica Vincular')}
                className="px-6 py-2.5 rounded-xl bg-[#00B3A4] hover:bg-[#74F8EC] text-[#0D1B2A] font-title-classic font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Agendar Sinastría</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
