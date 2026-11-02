import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Qué información necesito para realizar una Carta Natal?',
      a: 'Necesitas tu fecha completa de nacimiento (día, mes y año), la ciudad/país de nacimiento y la hora exacta (la encuentras habitualmente en tu partida o certificado de nacimiento). Si no tienes la hora exacta, podemos trabajar con una franja horaria aproximada o realizar una rectificación previa.',
    },
    {
      q: '¿En qué se diferencia el Tarot Egipcio Evolutivo del tarot predictivo tradicional?',
      a: 'El enfoque tradicional suele ser fatalista («te va a pasar esto»). En el Tarot Egipcio Evolutivo de Narmer, el mazo actúa como un espejo de tu estado psíquico y energético. No te quitamos tu poder de elección: te mostramos los patrones invisibles que estás atrayendo para que tomes decisiones con plena soberanía y consciencia.',
    },
    {
      q: '¿Cómo se llevan a cabo las sesiones y qué recibo al finalizar?',
      a: 'Todas las consultas son individuales y se realizan en vivo a través de Zoom o Google Meet en alta definición. Al concluir la sesión, recibes la grabación íntegra en audio/video y tu carta gráfica o informe en PDF para que puedas repasar la información tantas veces como lo desees.',
    },
    {
      q: '¿Puedo consultar si estoy fuera de Argentina / en otro país?',
      a: '¡Por supuesto! Más del 60% de nuestros consultantes residen en México, España, Estados Unidos, Chile, Colombia y Uruguay. Los pagos internacionales se gestionan de forma segura a través de PayPal o tarjeta de crédito en dólares.',
    },
    {
      q: '¿Con cuánta anticipación debo reservar mi sesión?',
      a: 'Debido a la dedicación personalizada y el estudio previo que requiere el cálculo astronómico de cada mapa, solemos tener una agenda con 4 a 7 días de anticipación. Te recomendamos agendar tu fecha apenas decidas realizarla.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="preguntas" className="py-20 px-4 sm:px-6 bg-[#120617] border-t border-[#E8D7A6]/20 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-[#00B3A4] mb-2 font-body">
            <span>Claridad & Respuestas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-title-classic font-bold text-gold-gradient tracking-wide">
            Preguntas Frecuentes
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#E8D7A6]/80 font-body">
            Todo lo que necesitas saber antes de ingresar a tu sesión sagrada.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#E8D7A6]/20 bg-[#0D1B2A]/70 overflow-hidden transition-colors hover:border-[#00B3A4]/60"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-title-classic text-sm font-bold text-[#E8D7A6]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#00B3A4] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#E8D7A6]/80 font-body leading-relaxed border-t border-[#E8D7A6]/10">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
