import React, { useState } from 'react';
import { Sparkles, Brain, Eye, Sun, Compass, ShieldCheck } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      id: 'jung',
      title: '01. Psicología Arquetípica de Jung',
      subtitle: 'La Carta Astral como Mapa de la Psique',
      icon: Brain,
      summary:
        'Los planetas no son astros que dictan tu destino desde afuera: son proyecciones vivas de tus propios complejos, sombras y potencias interiores.',
      details: [
        'Carl G. Jung descubrió que la astrología es la suma de todo el conocimiento psicológico de la antigüedad.',
        'No predecimos desgracias ni alimentamos miedos; traducimos el lenguaje simbólico para que lo inconsciente se vuelva consciente.',
        'La Sombra: Reconocer las partes rechazadas de tu carta natal que, al no ser asumidas, se manifiestan como destino exterior adverso.',
      ],
      quote: '«Hasta que lo inconsciente no se haga consciente, el subconsciente dirigirá tu vida y tú lo llamarás destino.» — C.G. Jung',
    },
    {
      id: 'egypt',
      title: '02. Cosmogonía y Zodiaco de Dendera',
      subtitle: 'La Sabiduría Estelar de los Faraones',
      icon: Sun,
      summary:
        'En los templos de Hathor en Dendera y en las estelas sagradas de la dinastía de Narmer, el cielo era el libro viviente del alma.',
      details: [
        'Los 36 Decanatos egipcios asignan una deidad tutelar y una medicina específica a cada sector del firmamento.',
        'La pirámide de doble faceta representa la integración de la materia terrenal (la piedra labrada) con la luz sagrada de la turquesa celestial.',
        'Cada consulta rescata el mito personal que tu alma eligió protagonizar en este plano terrenal.',
      ],
      quote: '«Como es arriba, es abajo; como es adentro, es afuera.» — Sabiduría Hermética de Thoth',
    },
    {
      id: 'horus',
      title: '03. El Ojo de Horus (Udjat) y Maat',
      subtitle: 'La Mirada Integrada que Restaura el Orden',
      icon: Eye,
      summary:
        'En la mitología egipcia, el Ojo de Horus fue despedazado y luego reconstituido para representar la sanación total de la consciencia dividida.',
      details: [
        'Ver con el Ojo de Horus significa mirar tus crisis actuales no como castigos, sino como procesos de reintegración.',
        'La Pluma de Maat: En cada lectura evaluamos el equilibrio ético y emocional de tus decisiones para devolverte paz interior.',
        'Herramientas prácticas: Te llevas decretos de poder, ejercicios de introspección y fechas propicias para actuar.',
      ],
      quote: '«El ojo que todo lo ve es la consciencia despierta que se observa a sí misma en el espejo cósmico.»',
    },
  ];

  const current = pillars[activePillar];
  const IconComp = current.icon;

  return (
    <section id="metodologia" className="py-20 px-4 sm:px-6 bg-[#120617] border-y border-[#E8D7A6]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#00B3A4] mb-2 font-body">
            <span>Metodología & Fundamentos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-title-classic font-bold text-gold-gradient tracking-wide">
            El Método Narmer
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#E8D7A6]/80 font-body leading-relaxed">
            Una síntesis rigurosa que eleva el tarot y la astrología por encima de la adivinación simplista,
            convirtiéndolos en un espejo terapéutico de autoconocimiento y soberanía.
          </p>
        </div>

        {/* Interactive Segmented Pillar Switcher (Buttons with handlers) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {pillars.map((pillar, idx) => {
            const PIcon = pillar.icon;
            const isSelected = activePillar === idx;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(idx)}
                className={`p-4 rounded-xl text-left transition-all duration-300 border flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-[#2A0E34] border-[#00B3A4] shadow-[0_0_20px_rgba(0,179,164,0.3)]'
                    : 'bg-[#0D1B2A]/60 border-[#E8D7A6]/20 hover:border-[#E8D7A6]/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#00B3A4] text-[#0D1B2A]'
                      : 'bg-[#2A0E34]/80 text-[#E8D7A6]/70'
                  }`}
                >
                  <PIcon className="w-5 h-5" />
                </div>
                <div>
                  <div
                    className={`font-title-classic text-xs font-bold leading-tight ${
                      isSelected ? 'text-[#E8D7A6]' : 'text-[#E8D7A6]/70'
                    }`}
                  >
                    {pillar.title}
                  </div>
                  <div className="text-[11px] text-[#00B3A4] font-body mt-0.5">
                    {pillar.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Content Box */}
        <div className="p-7 sm:p-10 rounded-2xl bg-gradient-to-br from-[#1C0924] via-[#0D1B2A] to-[#120617] border border-[#E8D7A6]/25 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-mono font-bold text-[#00B3A4] tracking-widest uppercase">
                {current.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-title-classic font-bold text-[#E8D7A6] mt-1">
                {current.title}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-[#E8D7A6]/90 font-body leading-relaxed font-light">
              {current.summary}
            </p>

            <div className="space-y-3 pt-2">
              {current.details.map((point, index) => (
                <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-[#E8D7A6]/80 font-body">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00B3A4] mt-2 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8D7A6]/15">
              <p className="text-xs italic text-[#E8D7A6]/75 border-l-2 border-[#00B3A4] pl-3 py-1">
                {current.quote}
              </p>
            </div>
          </div>

          {/* Pillar Sacred Visual Representation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-black/30 border border-[#E8D7A6]/15 text-center relative overflow-hidden">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#2A0E34] to-[#00B3A4]/30 border-2 border-[#E8D7A6]/40 flex items-center justify-center text-[#00B3A4] mb-4 shadow-[0_0_30px_rgba(0,179,164,0.3)]">
              <IconComp className="w-12 h-12" />
            </div>

            <h4 className="font-title-classic text-base font-bold text-[#E8D7A6]">
              Coherencia Sagrada
            </h4>
            <p className="text-xs text-[#E8D7A6]/70 mt-1 max-w-xs font-body leading-relaxed">
              Sin sesgos supersticiosos ni fatalismo: trabajamos con tu libre albedrío y responsabilidad personal como soberano de tu destino.
            </p>

            <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#00B3A4] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Ética y Confidencialidad Absoluta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
