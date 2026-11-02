import React, { useState } from 'react';
import { Sparkles, RefreshCw, Eye, Moon, Sun, Shield } from 'lucide-react';

interface ArchetypeCard {
  id: string;
  name: string;
  title: string;
  egyptianGod: string;
  astrologicalSign: string;
  zodiacSymbol: string;
  element: string;
  psychologicalTheme: string;
  lightAttribute: string;
  shadowAttribute: string;
  oracleMessage: string;
  mantra: string;
}

const ARCHETYPES: ArchetypeCard[] = [
  {
    id: 'isis',
    name: 'La Intuición y los Misterios',
    title: 'Arcano II · La Suma Sacerdotisa',
    egyptianGod: 'Isis (Auset)',
    astrologicalSign: 'Luna en Cáncer',
    zodiacSymbol: '♋',
    element: 'Agua Primordial',
    psychologicalTheme: 'La Conexión con el Inconsciente y el Saber Oculto',
    lightAttribute: 'Percepción extrasensorial, sanación del linaje, paciencia creadora.',
    shadowAttribute: 'Aislamiento emocional, secretos reprimidos, evasión de la realidad.',
    oracleMessage:
      'No apresures lo que aún está gestándose en las aguas profundas de tu psique. Hay respuestas que no se conquistan con el intelecto, sino habitando el silencio fértil.',
    mantra: '«Confío en lo que mi alma ya sabe antes de que mi mente lo nombre.»',
  },
  {
    id: 'osiris',
    name: 'El Renacimiento y la Transformación',
    title: 'Arcano XIII · La Muerte / Transmutación',
    egyptianGod: 'Osiris (Ausar)',
    astrologicalSign: 'Plutón en Escorpio',
    zodiacSymbol: '♏',
    element: 'Agua y Tierra',
    psychologicalTheme: 'Integración de la Sombra y Resurrección Psíquica',
    lightAttribute: 'Capacidad de resurgir de las cenizas, fin de ciclos tóxicos, soberanía interior.',
    shadowAttribute: 'Resistencia destructiva al cambio, apego al dolor pasado, miedo a la entrega.',
    oracleMessage:
      'Todo lo que hoy parece derrumbarse es abono para tu nueva encarnación. Permite que muera la versión de ti que ya no te sirve.',
    mantra: '«Despido lo que fue con gratitud para abrir paso a mi soberanía.»',
  },
  {
    id: 'horus',
    name: 'La Claridad y la Visión Superior',
    title: 'Arcano I · El Mago / El Ojo de Horus',
    egyptianGod: 'Horus (Heru)',
    astrologicalSign: 'Sol en Aries / Leo',
    zodiacSymbol: '♌',
    element: 'Fuego Solar',
    psychologicalTheme: 'La Voluntad Consciente y el Enfoque Recto',
    lightAttribute: 'Visión certera de objetivos, coraje para reclamar tu lugar, mente afilada.',
    shadowAttribute: 'Impaciencia dogmática, ira ciega, necesidad de venganza o validación.',
    oracleMessage:
      'El Ojo de Horus observa más allá de la apariencia engañosa del conflicto. Eleva tu perspectiva; lo que hoy te turba es un campo de entrenamiento para tu liderazgo.',
    mantra: '«Miro con el ojo de la verdad y alineo mi acción con mi propósito.»',
  },
  {
    id: 'hathor',
    name: 'El Gozo, la Belleza y la Abundancia',
    title: 'Arcano III · La Emperatriz',
    egyptianGod: 'Hathor (Het-Hert)',
    astrologicalSign: 'Venus en Tauro',
    zodiacSymbol: '♉',
    element: 'Tierra Fértil',
    psychologicalTheme: 'Merecimiento y Placer como Vía Espiritual',
    lightAttribute: 'Sensualidad sagrada, magnética atracción de recursos, nutrición amorosa.',
    shadowAttribute: 'Complacencia vacía, vanidad superficial, postergación por confort.',
    oracleMessage:
      'Recuerda que la abundancia cósmica florece cuando reconoces tu propio valor innegociable. Ábrete a recibir sin culpa ni justificaciones.',
    mantra: '«Merezco la belleza, el amor y la plenitud que habitan en mi ser.»',
  },
  {
    id: 'thoth',
    name: 'La Palabra Sagrada y la Sabiduría',
    title: 'Arcano V · El Hierofante / El Escriba',
    egyptianGod: 'Thoth (Djehuty)',
    astrologicalSign: 'Mercurio en Virgo / Géminis',
    zodiacSymbol: '♍',
    element: 'Aire Intelectual',
    psychologicalTheme: 'La Geometría del Pensamiento y el Discernimiento',
    lightAttribute: 'Comunicación impecable, estudio de leyes universales, síntesis clara.',
    shadowAttribute: 'Sobreanálisis paralizante, cinismo intelectual, desconexión del corazón.',
    oracleMessage:
      'Ordena tus pensamientos como quien traza jeroglíficos en una piedra eterna. Tu palabra tiene poder de creación; bendice tu camino con lo que dices.',
    mantra: '«Mis palabras son decretos de orden, lucidez y armonía cósmica.»',
  },
  {
    id: 'maat',
    name: 'La Justicia Cósmica y la Verdad',
    title: 'Arcano VIII · La Justicia',
    egyptianGod: 'Maat',
    astrologicalSign: 'Venus en Libra',
    zodiacSymbol: '♎',
    element: 'Aire Equilibrado',
    psychologicalTheme: 'El Peso del Corazón y la Coherencia Ética',
    lightAttribute: 'Equidad en acuerdos, paz interior inquebrantable, reconciliación auténtica.',
    shadowAttribute: 'Juicio severo a otros, autoexigencia asfixiante, parálisis decisoria.',
    oracleMessage:
      'Coloca tu corazón en la balanza frente a la pluma de la verdad. Actúa hoy desde lo justo, no desde el resentimiento ni la complacencia.',
    mantra: '«Vivo en rectitud y el cosmos equilibra todas las fuerzas a mi favor.»',
  },
];

export const NarmerDailyOracle: React.FC = () => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(true);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const currentCard = ARCHETYPES[selectedCardIndex];

  const handleDrawCard = () => {
    setIsShuffling(true);
    setIsRevealed(false);

    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * ARCHETYPES.length);
      if (nextIndex === selectedCardIndex) {
        nextIndex = (nextIndex + 1) % ARCHETYPES.length;
      }
      setSelectedCardIndex(nextIndex);
      setIsRevealed(true);
      setIsShuffling(false);
    }, 450);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-[#1E0927] via-[#0D1B2A] to-[#140819] border border-[#E8D7A6]/30 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Background ambient stars */}
      <div className="absolute inset-0 stars-overlay opacity-30 pointer-events-none" />

      {/* Decorative top title */}
      <div className="text-center relative z-10 max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A0E34] border border-[#00B3A4]/40 text-[#00B3A4] text-xs font-semibold uppercase tracking-widest mb-3">
          <Eye className="w-3.5 h-3.5" /> Oráculo Arquetípico Diario
        </div>
        <h3 className="text-2xl sm:text-3xl font-title-classic font-bold text-gold-gradient tracking-wide">
          Sincronía Sagrada de Narmer
        </h3>
        <p className="text-xs sm:text-sm text-[#E8D7A6]/75 mt-2 font-body tracking-wider">
          Conecta con la frecuencia de los arcanos egipcios y tu mapa astrológico. Extrae tu arquetipo guía para el momento presente.
        </p>
      </div>

      {/* Main Oracle Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        {/* Tarot Card Display (Cols 1-5) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div
            className={`relative w-64 sm:w-72 h-96 sm:h-[420px] rounded-2xl p-4 transition-all duration-700 cursor-pointer transform ${
              isShuffling ? 'rotate-3 scale-95 opacity-50' : 'rotate-0 scale-100'
            }`}
            style={{
              background: 'linear-gradient(145deg, #2A0E34 0%, #0D1B2A 70%, #15081A 100%)',
              boxShadow: '0 15px 40px -10px rgba(0, 179, 164, 0.4), 0 0 0 2px rgba(232, 215, 166, 0.35)',
            }}
            onClick={handleDrawCard}
          >
            {/* Inner Gold Foil Border */}
            <div className="w-full h-full rounded-xl border border-[#E8D7A6]/60 p-3.5 flex flex-col justify-between relative overflow-hidden bg-black/25">
              {/* Corner Ornaments */}
              <div className="absolute top-1.5 left-1.5 text-[#E8D7A6]/70 text-[10px]">✦</div>
              <div className="absolute top-1.5 right-1.5 text-[#E8D7A6]/70 text-[10px]">✦</div>
              <div className="absolute bottom-1.5 left-1.5 text-[#E8D7A6]/70 text-[10px]">✦</div>
              <div className="absolute bottom-1.5 right-1.5 text-[#E8D7A6]/70 text-[10px]">✦</div>

              {/* Card Header */}
              <div className="text-center pt-1">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#00B3A4] font-semibold block">
                  {currentCard.title}
                </span>
                <span className="font-title-classic text-sm text-[#E8D7A6] font-bold block mt-0.5">
                  {currentCard.egyptianGod}
                </span>
              </div>

              {/* Card Central Visual: Sacred Egyptian Vector Illustration */}
              <div className="my-auto py-2 flex flex-col items-center justify-center relative">
                <div className="w-32 h-32 rounded-full border border-[#E8D7A6]/40 flex items-center justify-center relative bg-[#2A0E34]/50">
                  {/* Glowing zodiac sign background */}
                  <span className="text-5xl text-[#00B3A4]/80 filter drop-shadow-[0_0_12px_rgba(0,179,164,0.7)] font-serif select-none">
                    {currentCard.zodiacSymbol}
                  </span>

                  {/* Sacred Pyramid and Eye motif overlay */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full p-2 pointer-events-none"
                    fill="none"
                    stroke="#E8D7A6"
                    strokeWidth="1.2"
                  >
                    <polygon points="50,15 20,80 80,80" strokeOpacity="0.5" />
                    <line x1="50" y1="15" x2="50" y2="80" stroke="#00B3A4" strokeWidth="1.5" strokeOpacity="0.8" />
                    <circle cx="50" cy="50" r="10" stroke="#E8D7A6" strokeWidth="1" strokeDasharray="2 3" />
                  </svg>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#E8D7A6]">
                  <span className="text-[#00B3A4]">{currentCard.astrologicalSign}</span>
                  <span>·</span>
                  <span className="text-[#7A7A7A]">{currentCard.element}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="text-center pb-1 border-t border-[#E8D7A6]/20 pt-2">
                <div className="font-title-classic text-xs font-semibold text-[#E8D7A6] leading-tight">
                  {currentCard.name}
                </div>
              </div>
            </div>
          </div>

          {/* Shuffle button */}
          <button
            onClick={handleDrawCard}
            disabled={isShuffling}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#2A0E34] hover:bg-[#00B3A4] hover:text-[#0D1B2A] text-[#E8D7A6] border border-[#00B3A4]/40 font-title-classic text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
            Extraer Otra Sincronía
          </button>
        </div>

        {/* Oracle Interpretation Details (Cols 6-12) */}
        <div className="md:col-span-7 space-y-5 text-left">
          <div className="border-b border-[#E8D7A6]/20 pb-3">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#00B3A4] block">
              Psicología Arquetípica & Astrología Egipcia
            </span>
            <h4 className="text-xl sm:text-2xl font-title-classic font-bold text-[#E8D7A6] mt-1">
              {currentCard.name} ({currentCard.egyptianGod})
            </h4>
            <p className="text-xs text-[#E8D7A6]/75 mt-1 font-body">
              <strong>Núcleo Psíquico:</strong> {currentCard.psychologicalTheme}
            </p>
          </div>

          {/* Oracle message block */}
          <div className="p-4 rounded-xl bg-[#0D1B2A]/90 border-l-4 border-[#00B3A4] text-xs sm:text-sm text-[#E8D7A6] leading-relaxed italic shadow-inner">
            "{currentCard.oracleMessage}"
          </div>

          {/* Dual Polarities: Light & Shadow Integration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[#2A0E34]/50 border border-[#E8D7A6]/15">
              <div className="flex items-center gap-1.5 text-[#00B3A4] font-semibold mb-1">
                <Sun className="w-3.5 h-3.5" />
                <span>Aspecto Luz / Consciencia</span>
              </div>
              <p className="text-[#E8D7A6]/80 text-[11px] leading-relaxed">
                {currentCard.lightAttribute}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1B2A]/60 border border-[#7A7A7A]/30">
              <div className="flex items-center gap-1.5 text-[#7A7A7A] font-semibold mb-1">
                <Moon className="w-3.5 h-3.5" />
                <span>Aspecto Sombra / Integración</span>
              </div>
              <p className="text-[#E8D7A6]/70 text-[11px] leading-relaxed">
                {currentCard.shadowAttribute}
              </p>
            </div>
          </div>

          {/* Mantra of the day */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#2A0E34]/80 to-[#0D1B2A]/80 border border-[#E8D7A6]/25 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00B3A4]/20 border border-[#00B3A4] flex items-center justify-center shrink-0 text-[#00B3A4]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#00B3A4] font-semibold block">
                Decreto / Mantra de Alineación
              </span>
              <p className="text-xs font-semibold text-[#E8D7A6] mt-0.5">
                {currentCard.mantra}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
