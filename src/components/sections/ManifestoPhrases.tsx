import React, { useState, useEffect } from 'react';

export const ManifestoPhrases: React.FC = () => {
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  const phrases = [
    {
      line1: 'No todo lo que buscas',
      line2: 'necesita una respuesta.',
      author: 'Aforismo I',
    },
    {
      line1: 'Algunas preguntas',
      line2: 'vienen a transformarte.',
      author: 'Aforismo II',
    },
    {
      line1: 'El símbolo no explica.',
      line2: 'El símbolo abre.',
      author: 'Aforismo III',
    },
    {
      line1: 'Mirar hacia adentro',
      line2: 'también es una forma de viajar.',
      author: 'Aforismo IV',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [phrases.length]);

  return (
    <section className="py-24 sm:py-32 md:py-36 px-6 sm:px-12 md:px-20 bg-[#08121D] relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[55vh] border-t border-[#7A7A7A]/25">
      {/* Paper texture */}
      <div className="absolute inset-0 paper-grain opacity-25 pointer-events-none" />

      {/* Extreme Negative Space */}
      <div className="max-w-4xl mx-auto relative z-10 space-y-8 sm:space-y-10">
        <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#00B3A4] block font-bold">
          {phrases[activePhraseIndex].author} · PAUSA CONTEMPLATIVA
        </span>

        {/* The Poetic Phrase with transition */}
        <div className="min-h-[140px] flex flex-col items-center justify-center">
          <blockquote className="space-y-2">
            <span className="font-editorial text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E8D7A6] font-normal leading-tight block">
              «{phrases[activePhraseIndex].line1}
            </span>
            <span className="font-editorial italic text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFFF] font-normal leading-tight block">
              {phrases[activePhraseIndex].line2}»
            </span>
          </blockquote>
        </div>

        {/* Small Progress Dots to allow manual reflection */}
        <div className="flex items-center justify-center gap-3 pt-6">
          {phrases.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePhraseIndex(i)}
              className={`transition-all duration-500 ${
                activePhraseIndex === i
                  ? 'w-8 h-[1.5px] bg-[#00B3A4]'
                  : 'w-2 h-[1px] bg-[#7A7A7A]/40 hover:bg-[#E8D7A6]/60'
              }`}
              aria-label={`Ver aforismo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
