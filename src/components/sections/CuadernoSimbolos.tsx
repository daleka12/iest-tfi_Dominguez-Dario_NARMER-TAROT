import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, Clock, BookOpen, Feather, CheckCircle2, Sparkles } from 'lucide-react';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { SupabaseMedia } from '../ui/SupabaseMedia';
import { fetchSupabaseTable, insertSupabaseRecord, getLocalRecords, appendLocalRecord } from '../../services/supabase';

interface EditorialMarginalNote {
  id: string;
  essay_id: string;
  author: string;
  note: string;
  created_at: string;
}

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
  const [articles, setArticles] = useState<Article[]>(() => {
    const localSaved = getLocalRecords<Article>('narmer_local_essays');
    return [...ESSAYS, ...localSaved];
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isNewEssayOpen, setIsNewEssayOpen] = useState(false);
  const [savingEssay, setSavingEssay] = useState(false);
  const [essayNotice, setEssayNotice] = useState<string | null>(null);
  const [essayForm, setEssayForm] = useState({
    category: 'Tarot' as Article['category'],
    title: '',
    subtitle: '',
    readTime: '5 min',
    date: 'Bitácora 2026',
    excerpt: '',
    body: '',
  });

  // Notas editoriales al margen dentro de cada ensayo
  const [marginalNotes, setMarginalNotes] = useState<EditorialMarginalNote[]>(() =>
    getLocalRecords<EditorialMarginalNote>('narmer_local_essay_notes')
  );
  const [noteAuthor, setNoteAuthor] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    let active = true;
    fetchSupabaseTable<Record<string, any>>('essays', 'select=*&order=number.asc').then((remoteRows) => {
      if (!active || !remoteRows || remoteRows.length === 0) return;
      const byId = new Map<string, Article>();
      ESSAYS.forEach((item) => byId.set(item.id, item));
      const localSaved = getLocalRecords<Article>('narmer_local_essays');
      localSaved.forEach((item) => byId.set(item.id, item));
      remoteRows.forEach((row) => {
        const parsedParagraphs = Array.isArray(row.fullEssay)
          ? row.fullEssay
          : Array.isArray(row.full_essay)
          ? row.full_essay
          : typeof row.full_essay === 'string'
          ? row.full_essay.split('\n\n').filter(Boolean)
          : null;
        if (row.id && row.title && parsedParagraphs) {
          byId.set(String(row.id), {
            id: String(row.id),
            category: (row.category as Article['category']) || 'Tarot',
            number: String(row.number || `N° 0${byId.size + 1}`),
            title: String(row.title),
            subtitle: String(row.subtitle || ''),
            readTime: String(row.readTime || row.read_time || '5 min'),
            date: String(row.date || 'Bitácora 2026'),
            excerpt: String(row.excerpt || ''),
            fullEssay: parsedParagraphs,
            mediaUrl: row.mediaUrl || row.media_url || undefined,
          });
        }
      });
      setArticles(Array.from(byId.values()));
    });

    fetchSupabaseTable<EditorialMarginalNote>('essay_notes', 'select=*&order=created_at.desc').then((remoteNotes) => {
      if (!active || !remoteNotes || remoteNotes.length === 0) return;
      const byId = new Map<string, EditorialMarginalNote>();
      getLocalRecords<EditorialMarginalNote>('narmer_local_essay_notes').forEach((n) => byId.set(n.id, n));
      remoteNotes.forEach((n) => {
        if (n.id && n.essay_id && n.note) byId.set(n.id, n);
      });
      setMarginalNotes(Array.from(byId.values()));
    });

    return () => {
      active = false;
    };
  }, []);

  const handleCreateEssay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!essayForm.title.trim() || !essayForm.body.trim()) return;
    setSavingEssay(true);

    const nextNumber = `N° ${String(articles.length + 1).padStart(2, '0')}`;
    const paragraphs = essayForm.body
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const autoExcerpt =
      essayForm.excerpt.trim() ||
      (paragraphs[0] ? paragraphs[0].slice(0, 165) + (paragraphs[0].length > 165 ? '…' : '') : '');

    const newArticle: Article = {
      id: `nota-${Date.now()}`,
      category: essayForm.category,
      number: nextNumber,
      title: essayForm.title.trim(),
      subtitle: essayForm.subtitle.trim() || 'Apunte del Gabinete de Interpretación Simbólica.',
      readTime: essayForm.readTime.trim() || '5 min',
      date: essayForm.date.trim() || 'Bitácora 2026',
      excerpt: autoExcerpt,
      fullEssay: paragraphs,
    };

    appendLocalRecord('narmer_local_essays', newArticle);
    setArticles((prev) => [...prev, newArticle]);

    const res = await insertSupabaseRecord('essays', {
      id: newArticle.id,
      category: newArticle.category,
      number: newArticle.number,
      title: newArticle.title,
      subtitle: newArticle.subtitle,
      read_time: newArticle.readTime,
      date: newArticle.date,
      excerpt: newArticle.excerpt,
      full_essay: newArticle.fullEssay,
      created_at: new Date().toISOString(),
    });

    setSavingEssay(false);
    setEssayNotice(
      res.ok
        ? 'Nota editorial guardada en Supabase y publicada en el Cuaderno.'
        : 'Nota editorial publicada y guardada en el Cuaderno de Símbolos.'
    );

    setTimeout(() => {
      setIsNewEssayOpen(false);
      setEssayNotice(null);
      setEssayForm({
        category: 'Tarot',
        title: '',
        subtitle: '',
        readTime: '5 min',
        date: 'Bitácora 2026',
        excerpt: '',
        body: '',
      });
    }, 1400);
  };

  const handleAddMarginalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !noteContent.trim()) return;
    setSavingNote(true);

    const newNote: EditorialMarginalNote = {
      id: `apunte-${Date.now()}`,
      essay_id: selectedArticle.id,
      author: noteAuthor.trim() || 'Nota de Lectura',
      note: noteContent.trim(),
      created_at: new Date().toISOString(),
    };

    appendLocalRecord('narmer_local_essay_notes', newNote);
    setMarginalNotes((prev) => [newNote, ...prev]);

    await insertSupabaseRecord('essay_notes', {
      id: newNote.id,
      essay_id: newNote.essay_id,
      author: newNote.author,
      note: newNote.note,
      created_at: newNote.created_at,
    });

    setSavingNote(false);
    setNoteAuthor('');
    setNoteContent('');
  };

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
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="font-mono text-xs text-[#00B3A4] tracking-widest uppercase">
                REVISTA EDITORIAL · NARMER
              </span>
              <button
                onClick={() => setIsNewEssayOpen(true)}
                className="px-4 py-2 rounded-full border border-[#00B3A4]/60 bg-[#2A0E34]/50 hover:bg-[#2A0E34] text-[#E8D7A6] font-clean text-[10px] tracking-[0.18em] uppercase transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,179,164,0.2)]"
              >
                <Feather className="w-3.5 h-3.5 text-[#00B3A4]" />
                <span>Escribir Nota Editorial</span>
              </button>
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

            {/* Notas Editoriales & Apuntes al Margen (Guardados en Supabase) */}
            <div className="mt-10 pt-8 border-t border-[#00B3A4]/30 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#00B3A4] flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3 h-3" /> Notas Editoriales & Apuntes al Margen
                </span>
                <span className="font-mono text-[10px] text-[#7A7A7A]">
                  {marginalNotes.filter((n) => n.essay_id === selectedArticle.id).length} apuntes
                </span>
              </div>

              {marginalNotes.filter((n) => n.essay_id === selectedArticle.id).length > 0 && (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {marginalNotes
                    .filter((n) => n.essay_id === selectedArticle.id)
                    .map((n) => (
                      <div
                        key={n.id}
                        className="p-3.5 rounded-lg border border-[#E8D7A6]/15 bg-[#08121D] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] text-[#00B3A4]">
                          <span>{n.author}</span>
                          <span className="text-[#7A7A7A]">
                            {new Date(n.created_at).toLocaleDateString('es-AR')}
                          </span>
                        </div>
                        <p className="font-editorial text-sm text-[#E8D7A6]/90 leading-relaxed">
                          {n.note}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              <form onSubmit={handleAddMarginalNote} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    placeholder="Autor / Firma (ej. Narmer)"
                    className="bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                  />
                  <input
                    type="text"
                    required
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Agregar apunte o nota editorial sobre este ensayo..."
                    className="sm:col-span-2 bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingNote}
                    className="px-4 py-2 border border-[#00B3A4]/70 bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-[10px] uppercase tracking-[0.2em] transition-colors rounded flex items-center gap-1.5"
                  >
                    <Feather className="w-3 h-3 text-[#00B3A4]" />
                    <span>{savingNote ? 'Guardando...' : 'Guardar Apunte'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-10 pt-6 border-t border-[#7A7A7A]/25 flex items-center justify-between text-xs font-mono text-[#7A7A7A]">
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

      {/* Modal para Crear una Nueva Nota Editorial / Ensayo en Capítulo V */}
      {isNewEssayOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsNewEssayOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-[#0D1B2A] border border-[#00B3A4]/45 p-7 sm:p-9 text-left my-auto shadow-2xl rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsNewEssayOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#E8D7A6]/70 hover:text-[#00B3A4] transition-colors"
              aria-label="Cerrar editor de nota"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block mb-1 font-bold">
                Capítulo V · Ensayos & Apuntes
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#E8D7A6] font-normal">
                Nueva Nota Editorial & Apunte.
              </h3>
              <p className="font-editorial text-sm text-[#E8D7A6]/75 mt-1 font-light">
                Se guardará en la base de datos de Supabase (`essays`) y se sumará al Cuaderno de Símbolos.
              </p>
            </div>

            {essayNotice ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full border border-[#00B3A4] flex items-center justify-center text-[#00B3A4] bg-[#2A0E34]/60">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-editorial text-lg text-[#E8D7A6]">{essayNotice}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateEssay} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Categoría
                    </label>
                    <select
                      value={essayForm.category}
                      onChange={(e) =>
                        setEssayForm({ ...essayForm, category: e.target.value as Article['category'] })
                      }
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    >
                      <option value="Tarot">Tarot</option>
                      <option value="Psicoastrología">Psicoastrología</option>
                      <option value="Arquetipos">Arquetipos</option>
                      <option value="Luna">Luna</option>
                      <option value="Vínculos">Vínculos</option>
                      <option value="Autoconocimiento">Autoconocimiento</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Fecha / Época
                    </label>
                    <input
                      type="text"
                      value={essayForm.date}
                      onChange={(e) => setEssayForm({ ...essayForm, date: e.target.value })}
                      placeholder="Ej. Solsticio 2026"
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Lectura Estimada
                    </label>
                    <input
                      type="text"
                      value={essayForm.readTime}
                      onChange={(e) => setEssayForm({ ...essayForm, readTime: e.target.value })}
                      placeholder="Ej. 5 min"
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                    Título de la Nota Editorial *
                  </label>
                  <input
                    type="text"
                    required
                    value={essayForm.title}
                    onChange={(e) => setEssayForm({ ...essayForm, title: e.target.value })}
                    placeholder="Ej. El silencio del Eremita frente al ruido moderno"
                    className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                    Subtítulo / Bajada Poética
                  </label>
                  <input
                    type="text"
                    value={essayForm.subtitle}
                    onChange={(e) => setEssayForm({ ...essayForm, subtitle: e.target.value })}
                    placeholder="Breve frase que sintetiza el espíritu del apunte..."
                    className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                    Desarrollo de la Nota / Ensayo (separa párrafos con Enter) *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={essayForm.body}
                    onChange={(e) => setEssayForm({ ...essayForm, body: e.target.value })}
                    placeholder="Escribe aquí el contenido completo de la nota editorial..."
                    className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewEssayOpen(false)}
                    className="px-4 py-2 text-xs font-clean uppercase tracking-wider text-[#7A7A7A] hover:text-[#E8D7A6]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingEssay}
                    className="px-6 py-2.5 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2 rounded shadow-[0_0_15px_rgba(0,179,164,0.25)]"
                  >
                    <Feather className="w-3.5 h-3.5 text-[#00B3A4]" />
                    <span>{savingEssay ? 'Guardando...' : 'Publicar Nota Editorial'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
