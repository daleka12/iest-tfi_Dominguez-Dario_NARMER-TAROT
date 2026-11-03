import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, Clock, BookOpen } from 'lucide-react';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { SupabaseMedia } from '../ui/SupabaseMedia';
import { fetchSupabaseTable } from '../../services/supabase';

interface Article {
  id: string;
  category: 'Tarot' | 'Psicoastrología' | 'Arquetipos' | 'Luna' | 'Vínculos' | 'Autoconocimiento';
  number: string;
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  excerpt: string;
  fullEssay: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'auto';
}

const ESSAYS: Article[] = [
  {
    id: 'sombra-tarot',
    category: 'Tarot',
    number: 'N° 01',
    title: 'La belleza incómoda de las cartas difíciles',
    subtitle: 'Por qué La Torre, El Diablo y La Muerte son los aliados más compasivos del mazo.',
    readTime: '6 min',
    date: 'Otoño 2026',
    excerpt:
      'La mente occidental teme al colapso. Sin embargo, en el lenguaje de los símbolos, nada que caiga con verdad puede quitarnos lo que es verdaderamente nuestro.',
    fullEssay: [
      'Cuando un consultante ve aparecer La Torre o La Muerte sobre la mesa de paño oscuro, su primer reflejo biológico es la contracción. Hemos sido educados en una cultura de la acumulación perpetua: retener vínculos, sostener estatus, evitar a toda costa la grieta.',
      'Pero el Tarot no tiene moral burguesa. El Tarot opera con la lógica de las estaciones y los bosques: para que la semilla brote, la cáscara debe rajarse. La Torre no es un castigo divino; es el relámpago que desmantela una prisión que tú mismo confundías con un palacio.',
      'Aprender a recibir las cartas de despojo con gratitud es el primer paso de la madurez espiritual. Lo que cae no eres tú: es la máscara que te impedía respirar.',
    ],
  },
  {
    id: 'quiron-herida',
    category: 'Psicoastrología',
    number: 'N° 02',
    title: 'Quirón y el don que nace de la grieta',
    subtitle: 'Cómo tu mayor vulnerabilidad natal se convierte en tu medicina para el mundo.',
    readTime: '8 min',
    date: 'Equinoccio 2026',
    excerpt:
      'En la mitología, Quirón es el centauro inmortal herido por una flecha envenenada. Al no poder sanarse a sí mismo, aprende el secreto de todas las hierbas del monte.',
    fullEssay: [
      'En cada carta natal existe un pequeño glifo con forma de llave: Quirón. Marca el punto exacto donde la vida nos tocó con una espina que nunca termina de cerrarse del todo.',
      'A menudo pasamos la primera mitad de la vida intentando compensar o esconder esa herida: si está en la casa de la palabra, tememos hablar; si está en la del amor, tememos no ser dignos de ternura.',
      'La Psicoastrología no busca «eliminar» a Quirón, porque lo que no cicatriza es precisamente lo que te mantiene humilde, poroso y empático. Tu herida no es un defecto de fábrica: es la ventana por donde entra tu don.',
    ],
  },
  {
    id: 'luna-inconsciente',
    category: 'Luna',
    number: 'N° 03',
    title: 'El territorio donde no hay palabras: tu Luna natal',
    subtitle: 'El refugio emocional que construimos en la infancia y cómo nos vinculamos de adultos.',
    readTime: '5 min',
    date: 'Novilunio 2026',
    excerpt:
      'El Sol es lo que queremos ser a la luz del día; la Luna es lo que necesitamos cuando apagamos la luz de la habitación y nadie nos está mirando.',
    fullEssay: [
      'Tu signo lunar describe el mecanismo automático que aprendiste para sentirte a salvo cuando eras un niño asustado. Una Luna en Capricornio aprendió que ser autosuficiente era el único modo de ser querida; una Luna en Piscis aprendió a disolverse en el dolor de los otros.',
      'Cuando somos adultos y experimentamos estrés o desamor, regresamos sin darnos cuenta a ese búnker infantil.',
      'Hacer consciente tu Luna es aprender a maternar tu propia fragilidad sin exigirle a tu pareja o a tus amigos que sean el salvavidas perpetuo de tu biografía.',
    ],
  },
];

export const CuadernoSimbolos: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(ESSAYS);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    let active = true;
    fetchSupabaseTable<Article>('essays', 'select=*&order=number.asc').then((remoteRows) => {
      if (!active || !remoteRows || remoteRows.length === 0) return;
      // Combinar sin duplicar información por `id` manteniendo la estructura original
      const byId = new Map<string, Article>();
      ESSAYS.forEach((item) => byId.set(item.id, item));
      remoteRows.forEach((row) => {
        if (row.id && row.title && Array.isArray(row.fullEssay)) {
          byId.set(row.id, { ...byId.get(row.id), ...row });
        }
      });
      setArticles(Array.from(byId.values()));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="cuaderno" className="py-28 px-6 sm:px-12 md:px-20 bg-[#0D1B2A] relative overflow-hidden border-t border-[#7A7A7A]/25">
      {/* Paper texture */}
      <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header with Ensayos & Apuntes Emblem */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 text-left">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-[1.5px] bg-[#00B3A4]" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]">
                Capítulo V · Ensayos & Apuntes
              </span>
            </div>
            <EditorialBlurredHeading
              as="h2"
              delay={0.12}
              duration={1.2}
              blurAmount={12}
              className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]"
            >
              Cuaderno de símbolos.
            </EditorialBlurredHeading>
            <p className="mt-4 font-editorial text-base sm:text-lg text-[#E8D7A6]/80 font-light leading-relaxed max-w-2xl">
              Páginas de reflexión sobre mitología, arquetipos lunares y la psicología de la mirada interior.
            </p>
            <div className="mt-5 font-mono text-xs text-[#00B3A4] tracking-widest uppercase">
              REVISTA EDITORIAL · NARMER
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[300px] sm:max-w-[350px] aspect-square rounded-2xl overflow-hidden border border-[#00B3A4]/40 bg-[#08121D] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(0,179,164,0.2)]">
              <SupabaseMedia
                bucket="essays"
                storagePath="ensayos-apuntes.jpg"
                localFallbackSrc="./cards/ensayos-apuntes.jpg?v=2"
                localStorageKey="narmer_ensayos_header_img_v2"
                alt="Ensayos & Apuntes · Narmer Tarot y Psicoastrología"
                mediaClassName="w-full h-full object-contain rounded-2xl select-none"
                fallbackContent={
                  <img
                    src="./cards/ensayos-apuntes.jpg?v=2"
                    alt="Ensayos & Apuntes · Narmer Tarot y Psicoastrología"
                    className="w-full h-full object-contain rounded-2xl select-none"
                  />
                }
              />
            </div>
          </div>
        </div>

        {/* Magazine Spreads: Large, Art-Direction Style Entries */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="p-6 sm:p-8 border border-[#7A7A7A]/30 bg-[#08121D] hover:border-[#00B3A4] hover:bg-[#160B20] transition-all duration-300 cursor-pointer flex flex-col justify-between group text-left shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#E8D7A6]/75 pb-3 border-b border-[#E8D7A6]/15 mb-6">
                  <span className="text-[#00B3A4] font-semibold">{article.category}</span>
                  <span className="text-[#7A7A7A]">{article.number}</span>
                </div>

                {article.mediaUrl && (
                  <div className="mb-5 aspect-[16/10] w-full overflow-hidden border border-[#E8D7A6]/15 bg-[#070F18]">
                    <SupabaseMedia
                      bucket="essays"
                      storagePath={article.mediaUrl}
                      mediaType={article.mediaType || 'auto'}
                      alt={article.title}
                      mediaClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

                <span className="font-mono text-[9px] tracking-widest uppercase text-[#7A7A7A] block mb-2">
                  {article.date} · {article.readTime}
                </span>

                <h3 className="font-editorial text-2xl sm:text-3xl text-[#E8D7A6] font-normal leading-snug group-hover:text-[#00B3A4] transition-colors mb-3">
                  {article.title}
                </h3>

                <p className="font-editorial italic text-sm text-[#E8D7A6]/80 mb-4">
                  «{article.subtitle}»
                </p>

                <p className="font-clean text-xs text-[#E8D7A6]/70 font-light leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-[#E8D7A6]/15 mt-8 flex items-center justify-between text-xs font-clean tracking-widest uppercase text-[#00B3A4] group-hover:text-[#E8D7A6]">
                <span>Leer ensayo</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reading Modal / Drawer for Essay Deep Dive */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0D1B2A] border border-[#00B3A4]/40 p-8 sm:p-12 text-left my-auto max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 text-[#E8D7A6]/70 hover:text-[#00B3A4]"
              aria-label="Cerrar artículo"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-xs font-mono text-[#00B3A4] tracking-widest uppercase mb-4">
              <span>{selectedArticle.category}</span>
              <span>·</span>
              <span>{selectedArticle.number}</span>
              <span>·</span>
              <span>{selectedArticle.readTime} de lectura</span>
            </div>

            <h3 className="font-editorial text-3xl sm:text-4xl text-[#E8D7A6] font-normal leading-tight">
              {selectedArticle.title}
            </h3>

            <p className="font-editorial italic text-lg text-[#00B3A4] mt-2 mb-8">
              {selectedArticle.subtitle}
            </p>

            <div className="space-y-6 font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light border-t border-[#7A7A7A]/25 pt-8">
              {selectedArticle.fullEssay.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-[#7A7A7A]/25 flex items-center justify-between text-xs font-mono text-[#7A7A7A]">
              <span>Publicado en el Cuaderno de Símbolos</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[#00B3A4] hover:underline uppercase tracking-wider font-semibold"
              >
                Cerrar lectura
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
