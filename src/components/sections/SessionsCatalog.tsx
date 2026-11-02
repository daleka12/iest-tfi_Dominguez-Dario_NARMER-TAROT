import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Video, FileText, Sparkles, Dna, Bell } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { SupabaseMedia } from '../ui/SupabaseMedia';
import { fetchSupabaseTable } from '../../services/supabase';

interface SessionCatalogItem {
  index: string;
  title: string;
  subtitle: string;
  duration: string;
  format: string;
  investment: string;
  description: string;
  deliverables: string[];
  quote: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'auto';
}

interface SessionsCatalogProps {
  onBookSession: (sessionTitle: string) => void;
}

const DEFAULT_SESSIONS: SessionCatalogItem[] = [
    {
      index: '01',
      title: 'TAROT',
      subtitle: 'Una conversación con los símbolos.',
      duration: '60 min',
      format: 'Online en vivo (Zoom / Meet) · Grabación completa',
      investment: '$55 USD / $50.000 ARS',
      description:
        'Una lectura íntima y dialógica. No buscamos adivinar tu porvenir: desplegamos los arcanos mayores y menores como un espejo de tus nudos actuales, tus puntos ciegos y la energía que pide ser encarnada en el presente.',
      deliverables: [
        'Tirada evolutiva focalizada en tus preguntas clave',
        'Audio íntegro en alta fidelidad para escuchar cuando lo necesites',
        'Fotografía en alta resolución de la mesa de arcanos',
      ],
      quote: '«El arcano te nombra antes de que tú puedas defenderte.»',
    },
    {
      index: '02',
      title: 'PSICOASTROLOGÍA',
      subtitle: 'Leer el cielo para comprender tus propios patrones.',
      duration: '75 min',
      format: 'Online en vivo · Incluye Carta Gráfica & Audio HD',
      investment: '$70 USD / $65.000 ARS',
      description:
        'Análisis profundo de tu mapa natal a través de la psicología arquetípica de Carl Jung. Desentrañamos la arquitectura de tu sol, tu paisaje lunar inconsciente, tus tensiones planetarias y la herida de Quirón como portal de maestría.',
      deliverables: [
        'Interpretación del mandala natal y sus ejes evolutivos',
        'Dossier gráfico con tus aspectos planetarios y nodos',
        'Grabación completa de la sesión para revisión periódica',
      ],
      quote: '«La carta natal es el pentagrama sobre el cual compones tu propia melodía.»',
    },
    {
      index: '03',
      title: 'TAROT + CARTA NATAL',
      subtitle: 'Una lectura que une el símbolo terrestre con el mapa celeste.',
      duration: '90 min',
      format: 'Consulta integral en vivo · Dos planos articulados',
      investment: '$90 USD / $85.000 ARS',
      description:
        'La experiencia cumbre del Gabinete Narmer. Cruzamos la partitura astronómica de tu nacimiento con la tirada viva de los 78 arcanos en tiempo real. Lo intemporal de los astros dialoga con la coyuntura viva de tu momento presente.',
      deliverables: [
        'Cruce simultáneo de tránsitos celestes con tirada de tarot',
        'Informe sintético con coordenadas clave del año',
        'Audio HD y registro fotográfico de la sesión',
      ],
      quote: '«Como es arriba, es abajo; como es adentro, es afuera.»',
    },
  ];

export const SessionsCatalog: React.FC<SessionsCatalogProps> = ({ onBookSession }) => {
  const [sessions, setSessions] = useState<SessionCatalogItem[]>(DEFAULT_SESSIONS);

  useEffect(() => {
    let active = true;
    fetchSupabaseTable<SessionCatalogItem>('sessions', 'select=*&order=index.asc').then((remoteRows) => {
      if (!active || !remoteRows || remoteRows.length === 0) return;
      const byIndex = new Map<string, SessionCatalogItem>();
      DEFAULT_SESSIONS.forEach((s) => byIndex.set(s.index, s));
      remoteRows.forEach((row) => {
        if (row.index && row.title && Array.isArray(row.deliverables)) {
          byIndex.set(row.index, { ...byIndex.get(row.index), ...row });
        }
      });
      setSessions(Array.from(byIndex.values()));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="sesiones" className="py-28 px-6 sm:px-12 md:px-20 bg-[#0D1B2A] relative overflow-hidden border-t border-[#7A7A7A]/25">
      {/* Paper texture */}
      <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-20 text-left">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-[1.5px] bg-[#00B3A4]" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]">
              Capítulo III · Catálogo de Consultas
            </span>
          </div>

          <EditorialBlurredHeading
            as="h2"
            delay={0.12}
            duration={1.2}
            blurAmount={12}
            className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]"
          >
            Sesiones de interpretación.
          </EditorialBlurredHeading>

          <p className="mt-4 font-editorial text-lg sm:text-xl text-[#E8D7A6]/85 font-light leading-relaxed">
            Cada consulta es un espacio confidencial, pausado y riguroso. Sin fórmulas prefabricadas ni juicios morales.
          </p>
        </div>

        {/* Monograph Style List: Each session is a generous editorial spread */}
        <div className="space-y-16">
          {sessions.map((session) => (
            <div
              key={session.index}
              className="border-t border-[#7A7A7A]/30 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group"
            >
              {/* Left Column: Number & Big Title (Cols 1-4) */}
              <div className="lg:col-span-4 space-y-3">
                <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-[#00B3A4] block font-bold">
                  {session.index}
                </span>

                <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#E8D7A6] font-normal tracking-wide">
                  {session.title}
                </h3>

                <p className="font-editorial italic text-base sm:text-lg text-[#00B3A4]">
                  «{session.subtitle}»
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#E8D7A6]/70">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#00B3A4]" /> {session.duration}
                  </span>
                  <span className="text-[#7A7A7A]">·</span>
                  <span className="text-[#E8D7A6] font-semibold">{session.investment}</span>
                </div>
              </div>

              {/* Right Column: Narrative, Deliverables & Booking Action (Cols 5-12) */}
              <div className="lg:col-span-8 space-y-6">
                {session.mediaUrl && (
                  <div className="aspect-[16/9] w-full max-w-xl overflow-hidden border border-[#00B3A4]/30 bg-[#08121D]">
                    <SupabaseMedia
                      bucket="sessions"
                      storagePath={session.mediaUrl}
                      mediaType={session.mediaType || 'auto'}
                      alt={`Sesión ${session.title}`}
                      mediaClassName="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light">
                  {session.description}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-2 py-2">
                  {session.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light">
                      <span className="text-[#00B3A4] font-mono text-[10px]">✦</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Quote Marginalia */}
                <div className="border-l border-[#00B3A4]/40 pl-4 py-1">
                  <span className="font-handwritten text-base sm:text-lg text-[#E8D7A6]/75">
                    {session.quote}
                  </span>
                </div>

                {/* Action button */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <MagneticButton
                    onClick={() => onBookSession(session.title)}
                    strength={0.28}
                    className="px-6 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,179,164,0.18)]"
                  >
                    <span>Reservar sesión</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00B3A4]" />
                  </MagneticButton>
                  <span className="text-[11px] font-mono text-[#7A7A7A] tracking-wider">
                    {session.format}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* UPCOMING SERVICE: 04 · BIODECODIFICACIÓN */}
          <div className="border-t border-[#00B3A4]/40 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative bg-[#130A1A]/40 p-6 sm:p-8 rounded-2xl border border-dashed border-[#00B3A4]/35 shadow-[0_0_30px_rgba(0,179,164,0.08)]">
            {/* Left Column: Number & Big Title */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-[#00B3A4] font-bold">
                  04
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] bg-[#00B3A4]/15 text-[#00B3A4] border border-[#00B3A4]/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Próximamente disponible
                </span>
              </div>

              <h3 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#E8D7A6] font-normal tracking-wide flex items-center gap-2">
                <span>BIODECODIFICACIÓN</span>
              </h3>

              <p className="font-editorial italic text-base sm:text-lg text-[#00B3A4]">
                «El cuerpo expresa lo que el alma calla.»
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#E8D7A6]/70">
                <span className="flex items-center gap-1.5 text-[#00B3A4]">
                  <Dna className="w-3.5 h-3.5" /> Nueva disciplina terapéutica
                </span>
                <span className="text-[#7A7A7A]">·</span>
                <span className="text-[#E8D7A6]/80 font-semibold">En preparación</span>
              </div>
            </div>

            {/* Right Column: Narrative, Deliverables & Notification Action */}
            <div className="lg:col-span-8 space-y-6">
              <p className="font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light">
                Un abordaje terapéutico integral que explora el origen emocional, psicosomático y transgeneracional
                de los síntomas físicos y los bloqueos recurrentes. A través de la decodificación biológica de las dolencias
                y su resonancia con la memoria celular, abrimos un puente hacia la toma de consciencia y la sanación de raíz.
              </p>

              {/* What to expect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <div className="flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light p-2.5 rounded-lg bg-black/30 border border-[#E8D7A6]/10">
                  <span className="text-[#00B3A4] font-mono text-[10px]">✦</span>
                  <span>Comprensión del sentido biológico de síntomas y patrones</span>
                </div>
                <div className="flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light p-2.5 rounded-lg bg-black/30 border border-[#E8D7A6]/10">
                  <span className="text-[#00B3A4] font-mono text-[10px]">✦</span>
                  <span>Articulación con el mapa psicoastrológico y simbólico</span>
                </div>
                <div className="flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light p-2.5 rounded-lg bg-black/30 border border-[#E8D7A6]/10">
                  <span className="text-[#00B3A4] font-mono text-[10px]">✦</span>
                  <span>Liberación de lealtades y mandatos del árbol genealógico</span>
                </div>
                <div className="flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light p-2.5 rounded-lg bg-black/30 border border-[#E8D7A6]/10">
                  <span className="text-[#00B3A4] font-mono text-[10px]">✦</span>
                  <span>Espacio confidencial 1 a 1 en vivo con seguimiento</span>
                </div>
              </div>

              {/* Quote Marginalia */}
              <div className="border-l border-[#00B3A4]/40 pl-4 py-1">
                <span className="font-handwritten text-base sm:text-lg text-[#00B3A4]/90">
                  «La enfermedad no es un error biológico, sino un programa especial con sentido de supervivencia.»
                </span>
              </div>

              {/* Action button: Consultar / Lista de espera */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <MagneticButton
                  onClick={() => onBookSession('Consulta sobre Biodecodificación (Próximo lanzamiento)')}
                  strength={0.28}
                  className="px-6 py-3 border border-[#00B3A4] bg-gradient-to-r from-[#2A0E34] to-[#120819] hover:from-[#3B1449] hover:to-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,179,164,0.25)] flex items-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5 text-[#00B3A4]" />
                  <span>Avisarme del lanzamiento</span>
                </MagneticButton>
                <span className="text-[11px] font-mono text-[#00B3A4] tracking-wider">
                  ✦ Cupos anticipados y lista de espera abierta
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
