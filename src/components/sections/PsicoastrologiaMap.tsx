import React, { useState } from 'react';
import { Compass, Sparkles, MapPin, Clock, Calendar, Check, ArrowRight } from 'lucide-react';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';

interface NatalProfile {
  sun: { sign: string; archetype: string; reflection: string };
  moon: { sign: string; archetype: string; reflection: string };
  ascendant: { sign: string; archetype: string; reflection: string };
  chiron: { sign: string; archetype: string; reflection: string };
}

export const PsicoastrologiaMap: React.FC = () => {
  const [formData, setFormData] = useState({
    date: '1994-06-18',
    time: '14:30',
    city: 'Buenos Aires, Argentina',
  });
  const [profileGenerated, setProfileGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<'sun' | 'moon' | 'asc' | 'chiron'>('sun');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileGenerated(true);
  };

  const sampleProfile: NatalProfile = {
    sun: {
      sign: 'Géminis en Casa IX',
      archetype: 'El Escriba Viajero & El Hacedor de Preguntas',
      reflection:
        'Tu energía vital se enciende cuando conectas ideas aparentemente inconexas. El desafío es no quedarte en la dispersión intelectual y permitir que el conocimiento eche raíces en el cuerpo.',
    },
    moon: {
      sign: 'Escorpio en Casa II',
      archetype: 'Las Aguas Subterráneas & El Apego Feroz',
      reflection:
        'Necesidad de intensidad y seguridad psíquica absoluta. Tu sabiduría emocional proviene de no temerle a las crisis; allí donde otros ven caos, tú encuentras tu poder regenerador.',
    },
    ascendant: {
      sign: 'Libra a 14°',
      archetype: 'El Espejo de la Armonía & La Búsqueda Ética',
      reflection:
        'Tu forma de entrar al mundo es a través de la belleza, la escucha y el puente vincular. Tu aprendizaje consiste en no anular tu propio deseo con tal de complacer la mirada ajena.',
    },
    chiron: {
      sign: 'Virgo en Casa XII',
      archetype: 'La Herida de la Insuficiencia & El Sanador Compasivo',
      reflection:
        'La sensación inconsciente de «no ser lo suficientemente impecable». Cuando dejas de exigir perfección a ti y a la vida, te conviertes en un bálsamo reconfortante para otros.',
    },
  };

  return (
    <section id="psicoastrologia" className="py-28 px-6 sm:px-12 md:px-20 bg-[#0D1B2A] relative overflow-hidden border-t border-[#7A7A7A]/25">
      {/* Background paper grain and subtle starlight */}
      <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />

      {/* Atmospheric blue-black deep glow */}
      <div className="absolute top-1/4 right-10 w-[600px] h-[600px] bg-[#2A0E34]/35 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#00B3A4]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-[1.5px] bg-[#00B3A4]" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]">
              Capítulo II · El Observatorio Interior
            </span>
          </div>

          <EditorialBlurredHeading
            as="h2"
            delay={0.12}
            duration={1.2}
            blurAmount={12}
            className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]"
          >
            El cielo también deja huellas.
          </EditorialBlurredHeading>

          <p className="mt-4 font-editorial text-lg sm:text-xl text-[#E8D7A6]/85 font-light leading-relaxed max-w-2xl">
            La carta natal no determina quién eres.
            Es un mapa simbólico desde el cual podemos observar tus tendencias, tensiones, deseos y formas de vincularte.
          </p>

          <span className="font-handwritten text-lg text-[#00B3A4] block mt-3">
            «no estamos condicionados por los astros; compartimos su misma geometría»
          </span>
        </div>

        {/* Dual Column: Interior Map Visualizer (Left) + Calculation Input/Results (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: THE INTERIOR MAP (Bespoke Celestial Architecture, NOT a generic zodiac ring) */}
          <div className="lg:col-span-7 p-6 sm:p-10 border border-[#00B3A4]/35 bg-[#08121D] relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
            {/* Top architectural coordinates bar (responsive flex instead of overlapping absolute) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-2 border-b border-[#7A7A7A]/20 font-mono text-[9px] tracking-widest">
              <span className="text-[#7A7A7A]">GRID: INTERIORIS · 12 DOMUS</span>
              <span className="text-[#00B3A4]">EPHEMERA · NARMER</span>
            </div>

            {/* Custom Abstract Astrological Architectural Geometry */}
            <div className="relative py-6 flex flex-col items-center justify-center">
              <svg viewBox="0 0 400 360" className="w-full max-w-[420px] h-auto overflow-visible select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer delicate coordinate circle in Crema and Turquoise */}
                <circle cx="200" cy="180" r="150" stroke="#E8D7A6" strokeWidth="0.6" strokeDasharray="3 5" opacity="0.4" />
                <circle cx="200" cy="180" r="162" stroke="#00B3A4" strokeWidth="0.5" opacity="0.45" />

                {/* Horizon Axis: Ascendant / Descendant */}
                <line x1="30" y1="180" x2="370" y2="180" stroke="#E8D7A6" strokeWidth="1.2" opacity="0.7" />
                <text x="24" y="184" fill="#00B3A4" fontSize="9" fontFamily="serif" fontWeight="bold">ASC</text>
                <text x="376" y="184" fill="#E8D7A6" fontSize="9" fontFamily="serif">DSC</text>

                {/* Meridian Axis: Medium Coeli / Imum Coeli */}
                <line x1="200" y1="20" x2="200" y2="340" stroke="#E8D7A6" strokeWidth="1.2" opacity="0.7" />
                <text x="200" y="14" fill="#00B3A4" fontSize="9" fontFamily="serif" textAnchor="middle" fontWeight="bold">MC</text>
                <text x="200" y="354" fill="#E8D7A6" fontSize="9" fontFamily="serif" textAnchor="middle">IC</text>

                {/* Aspect Geometric Triangles in Violeta profundo & Turquesa */}
                <polygon points="120,70 300,120 180,310" stroke="#00B3A4" strokeWidth="0.8" fill="#2A0E34" fillOpacity="0.4" />
                <polygon points="70,180 200,60 330,180" stroke="#E8D7A6" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.5" />

                {/* Celestial Nodes / Planetary Symbols */}
                {/* Sun ☉ */}
                <g transform="translate(120, 70)">
                  <circle cx="0" cy="0" r="8" fill="#2A0E34" stroke="#E8D7A6" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2.2" fill="#00B3A4" />
                  <text x="12" y="4" fill="#E8D7A6" fontSize="10" fontFamily="serif">☉ Sol</text>
                </g>

                {/* Moon ☽ */}
                <g transform="translate(300, 120)">
                  <circle cx="0" cy="0" r="8" fill="#2A0E34" stroke="#00B3A4" strokeWidth="1" />
                  <path d="M -4,-4 A 5,5 0 0,0 2,4 A 4,4 0 0,1 -4,-4 Z" fill="#E8D7A6" />
                  <text x="12" y="4" fill="#00B3A4" fontSize="10" fontFamily="serif">☽ Luna</text>
                </g>

                {/* Chiron ⚷ */}
                <g transform="translate(180, 310)">
                  <circle cx="0" cy="0" r="8" fill="#0D1B2A" stroke="#00B3A4" strokeWidth="1" />
                  <text x="-4" y="4" fill="#00B3A4" fontSize="10" fontFamily="serif">⚷</text>
                  <text x="12" y="4" fill="#E8D7A6" fontSize="9" fontFamily="serif">Quirón</text>
                </g>

                {/* Saturn ♄ */}
                <g transform="translate(260, 240)">
                  <circle cx="0" cy="0" r="6" fill="#0D1B2A" stroke="#7A7A7A" strokeWidth="0.8" opacity="0.8" />
                  <text x="-3" y="3" fill="#7A7A7A" fontSize="8" fontFamily="serif">♄</text>
                </g>

                {/* Center Singularity: The Self (Das Selbst) */}
                <circle cx="200" cy="180" r="24" fill="#2A0E34" stroke="#00B3A4" strokeWidth="1.2" />
                <circle cx="200" cy="180" r="4" fill="#E8D7A6" />
                <text x="200" y="184" fill="#E8D7A6" fontSize="7" fontFamily="monospace" textAnchor="middle">ANIMA</text>
              </svg>

              <div className="mt-4 text-center">
                <span className="font-handwritten text-base text-[#00B3A4]">
                  «las tensiones de tu mapa son los motores de tu desarrollo»
                </span>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-4 border-t border-[#7A7A7A]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-[#7A7A7A] uppercase">
              <span>Cálculo Sideral & Tropical Integrado</span>
              <span className="text-[#00B3A4]">Psicoastrología Narmer</span>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE NATAL FORM & ARQUETYPE REVELATION */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="p-6 sm:p-7 border border-[#7A7A7A]/30 bg-[#08121D]">
              <span className="font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block mb-1">
                Exploración Natal
              </span>
              <h3 className="font-editorial text-2xl text-[#E8D7A6] font-normal mb-6">
                Ingresa tus coordenadas de origen
              </h3>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-[11px] font-clean text-[#E8D7A6]/70 block mb-1">
                    Fecha de Nacimiento
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/70 block mb-1">
                      Hora (aprox. o exacta)
                    </label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" />
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/70 block mb-1">
                      Ciudad y País
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" />
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Ej. Madrid, España"
                        className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,179,164,0.2)]"
                >
                  <Compass className="w-3.5 h-3.5 text-[#00B3A4]" />
                  <span>Explorar mi mapa natal</span>
                </button>
              </form>
            </div>

            {/* REVEALED PROFILE TABS */}
            <div className="p-6 sm:p-7 border border-[#00B3A4]/35 bg-[#160B20]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8D7A6]/15 mb-4">
                <span className="font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase font-bold">
                  Cuatro Pilares Arquetípicos
                </span>
                <span className="text-[10px] font-mono text-[#E8D7A6] flex items-center gap-1.5">
                  {profileGenerated && <Check className="w-3 h-3 text-[#00B3A4]" />}
                  <span>{formData.city.split(',')[0]}</span>
                </span>
              </div>

              {/* Archetype Segmented Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-[#0D1B2A] border border-[#7A7A7A]/30 mb-5">
                {[
                  { id: 'sun', label: 'Sol ☉' },
                  { id: 'moon', label: 'Luna ☽' },
                  { id: 'asc', label: 'Ascendente' },
                  { id: 'chiron', label: 'Quirón ⚷' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-1.5 text-[10px] font-clean tracking-wider uppercase transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] font-semibold'
                        : 'text-[#7A7A7A] hover:text-[#E8D7A6]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Tab Content */}
              {activeTab === 'sun' && (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-[11px] font-mono text-[#00B3A4] uppercase block">
                    {sampleProfile.sun.sign}
                  </span>
                  <h4 className="font-editorial text-xl text-[#E8D7A6]">
                    {sampleProfile.sun.archetype}
                  </h4>
                  <p className="text-xs font-clean text-[#E8D7A6]/80 font-light leading-relaxed">
                    {sampleProfile.sun.reflection}
                  </p>
                </div>
              )}

              {activeTab === 'moon' && (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-[11px] font-mono text-[#00B3A4] uppercase block">
                    {sampleProfile.moon.sign}
                  </span>
                  <h4 className="font-editorial text-xl text-[#E8D7A6]">
                    {sampleProfile.moon.archetype}
                  </h4>
                  <p className="text-xs font-clean text-[#E8D7A6]/80 font-light leading-relaxed">
                    {sampleProfile.moon.reflection}
                  </p>
                </div>
              )}

              {activeTab === 'asc' && (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-[11px] font-mono text-[#00B3A4] uppercase block">
                    {sampleProfile.ascendant.sign}
                  </span>
                  <h4 className="font-editorial text-xl text-[#E8D7A6]">
                    {sampleProfile.ascendant.archetype}
                  </h4>
                  <p className="text-xs font-clean text-[#E8D7A6]/80 font-light leading-relaxed">
                    {sampleProfile.ascendant.reflection}
                  </p>
                </div>
              )}

              {activeTab === 'chiron' && (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-[11px] font-mono text-[#00B3A4] uppercase block">
                    {sampleProfile.chiron.sign}
                  </span>
                  <h4 className="font-editorial text-xl text-[#E8D7A6]">
                    {sampleProfile.chiron.archetype}
                  </h4>
                  <p className="text-xs font-clean text-[#E8D7A6]/80 font-light leading-relaxed">
                    {sampleProfile.chiron.reflection}
                  </p>
                </div>
              )}

              <div className="pt-4 mt-6 border-t border-[#E8D7A6]/15 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7A7A7A]">Análisis completo en consulta 1 a 1</span>
                <a href="#sesiones" className="font-clean text-[11px] uppercase tracking-widest text-[#00B3A4] hover:underline flex items-center gap-1 font-medium">
                  <span>Ver sesiones</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
