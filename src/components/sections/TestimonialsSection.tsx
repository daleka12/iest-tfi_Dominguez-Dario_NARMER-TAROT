import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Pause, Play, Feather, X, CheckCircle2 } from 'lucide-react';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { SupabaseMedia } from '../ui/SupabaseMedia';
import { fetchSupabaseTable, insertSupabaseRecord, getLocalRecords, appendLocalRecord } from '../../services/supabase';

export type TestimonialGender = 'female' | 'male' | 'couple';

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  sessionType: string;
  archetype: string;
  year: string;
  gender?: TestimonialGender;
  avatarUrl?: string;
}

/**
 * Ilustración vectorial de perfil femenino al estilo del Tarot Egipcio Narmer
 * (inspirada en La Sacerdotisa: tocado de loto/luna, peluca trenzada egipcia, ojo de Horus, aro solar y collar Wesekh)
 */
const EgyptianFemaleProfileSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 120"
    className={`w-full h-full ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="egyptianFemaleClip">
        <circle cx="60" cy="60" r="54" />
      </clipPath>
    </defs>

    {/* Marco circular estilo medallón egipcio */}
    <circle cx="60" cy="60" r="58" fill="#00B3A4" />
    <circle cx="60" cy="60" r="54.5" fill="#180821" stroke="#E8D7A6" strokeWidth="1.8" />

    <g clipPath="url(#egyptianFemaleClip)">
      {/* Cielo nocturno del santuario */}
      <circle cx="60" cy="60" r="54" fill="#180821" />
      <rect x="0" y="84" width="120" height="40" fill="#0D1B2A" />

      {/* Estrellas sutiles */}
      <circle cx="24" cy="34" r="1.1" fill="#E8D7A6" opacity="0.85" />
      <circle cx="96" cy="28" r="1.2" fill="#FFFFFF" opacity="0.8" />
      <path d="M 96,24 L 96,32 M 92,28 L 100,28" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.7" />
      <circle cx="98" cy="52" r="1" fill="#E8D7A6" opacity="0.7" />

      {/* Disco lunar y cuernos de Hathor en la corona */}
      <path
        d="M 43,22 C 43,12 50,10 56,10 C 62,10 69,12 69,22"
        stroke="#00B3A4"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="56" cy="16" r="6.5" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />

      {/* Peluca egipcia trenzada (parte posterior) */}
      <path
        d="M 34,32 C 34,23 44,20 58,20 C 70,20 75,25 76,33 L 72,36 L 60,82 L 30,82 C 29,64 31,45 34,32 Z"
        fill="#2A0E34"
        stroke="#E8D7A6"
        strokeWidth="1.3"
      />
      {/* Líneas de trenzas doradas/turquesa en la peluca */}
      <line x1="36" y1="42" x2="52" y2="42" stroke="#00B3A4" strokeWidth="1.4" />
      <line x1="35" y1="50" x2="51" y2="50" stroke="#E8D7A6" strokeWidth="1.1" />
      <line x1="34" y1="58" x2="50" y2="58" stroke="#00B3A4" strokeWidth="1.4" />
      <line x1="33" y1="66" x2="49" y2="66" stroke="#E8D7A6" strokeWidth="1.1" />

      {/* Cuello esbelto y rostro femenino de perfil mirando a la derecha */}
      <path
        d="M 48,70 L 50,88 L 66,88 L 64,71 C 71,71 75,69 77,65 C 78,62 77,60 79,58 C 77,57 77,55 79,54 C 81,53 83,52 83,50 C 83,48 79,42 76,36 L 54,36 Z"
        fill="#F2DFB8"
        stroke="#0E1724"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Labios femeninos delicados */}
      <path d="M 79,58 L 74,58.5" stroke="#2A0E34" strokeWidth="1.3" strokeLinecap="round" />

      {/* Ojo de Horus (Kohl egipcio y ceja arqueada) */}
      <path d="M 65,43 Q 71,41 75,43" stroke="#0E1724" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <ellipse cx="70.5" cy="46.5" rx="3.2" ry="1.6" fill="#FFFFFF" stroke="#0E1724" strokeWidth="1.2" />
      <circle cx="71.2" cy="46.5" r="1.2" fill="#0E1724" />
      <path d="M 67,46.5 L 61,48.5" stroke="#0E1724" strokeWidth="1.3" strokeLinecap="round" />

      {/* Mechón lateral de la peluca y aro dorado */}
      <path
        d="M 48,34 L 62,34 L 59,76 L 45,76 Z"
        fill="#250B30"
        stroke="#E8D7A6"
        strokeWidth="1.2"
      />
      <rect x="46" y="64" width="13" height="4" fill="#00B3A4" />
      <rect x="46" y="70" width="13" height="3" fill="#E8D7A6" />

      {/* Aro solar egipcio */}
      <circle cx="60" cy="56" r="4.5" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />
      <circle cx="60" cy="56" r="1.8" fill="#00B3A4" />

      {/* Diadema real turquesa y Uraeus dorado en la frente */}
      <path d="M 35,31 L 76,31 L 77,35 L 34,35 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2" />
      <path
        d="M 76,31 C 80,27 82,29 80,33 C 79,35 77,35 76,34 Z"
        fill="#E8D7A6"
        stroke="#0E1724"
        strokeWidth="1"
      />

      {/* Hombros y Collar ceremonial Wesekh */}
      <path
        d="M 22,120 C 24,94 37,84 58,84 C 79,84 91,94 94,120 Z"
        fill="#00B3A4"
        stroke="#0E1724"
        strokeWidth="1.5"
      />
      <path
        d="M 34,86 C 42,99 74,99 82,86 C 77,104 39,104 34,86 Z"
        fill="#E8D7A6"
        stroke="#0E1724"
        strokeWidth="1.2"
      />
      <path
        d="M 30,90 C 40,108 76,108 86,90 C 81,112 35,112 30,90 Z"
        fill="#2A0E34"
        stroke="#E8D7A6"
        strokeWidth="1.2"
      />
    </g>
  </svg>
);

/**
 * Ilustración vectorial de perfil masculino al estilo del Tarot Egipcio Narmer
 * (inspirada en El Eremita / Sabio Egipcio: tocado Nemes a franjas turquesa y violeta, barba ceremonial trenzada, ojo de Horus y collar Wesekh)
 */
const EgyptianMaleProfileSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 120"
    className={`w-full h-full ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="egyptianMaleClip">
        <circle cx="60" cy="60" r="54" />
      </clipPath>
    </defs>

    {/* Marco circular estilo medallón egipcio */}
    <circle cx="60" cy="60" r="58" fill="#00B3A4" />
    <circle cx="60" cy="60" r="54.5" fill="#07101B" stroke="#E8D7A6" strokeWidth="1.8" />

    <g clipPath="url(#egyptianMaleClip)">
      {/* Cielo nocturno estrellado */}
      <circle cx="60" cy="60" r="54" fill="#07101B" />
      <rect x="0" y="84" width="120" height="40" fill="#180821" />

      {/* Sol alquímico / astro superior */}
      <circle cx="26" cy="28" r="6" fill="#E8D7A6" opacity="0.9" />
      <circle cx="96" cy="34" r="1.2" fill="#FFFFFF" opacity="0.85" />
      <circle cx="92" cy="50" r="1" fill="#E8D7A6" opacity="0.75" />

      {/* Tocado Nemes egipcio (caída posterior con franjas turquesa y violeta) */}
      <path
        d="M 30,30 C 31,19 44,16 60,16 C 72,16 77,22 78,31 L 58,82 L 24,82 C 24,62 27,44 30,30 Z"
        fill="#00B3A4"
        stroke="#0E1724"
        strokeWidth="1.5"
      />
      {/* Franjas del tocado Nemes */}
      <path d="M 32,24 L 75,24 L 76,29 L 30,29 Z" fill="#2A0E34" />
      <path d="M 29,36 L 56,36 L 54,42 L 28,42 Z" fill="#2A0E34" />
      <path d="M 27,48 L 53,48 L 51,54 L 26,54 Z" fill="#2A0E34" />
      <path d="M 25,60 L 50,60 L 48,66 L 25,66 Z" fill="#2A0E34" />
      <path d="M 24,72 L 48,72 L 46,78 L 24,78 Z" fill="#2A0E34" />

      {/* Rostro masculino de perfil mirando a la derecha */}
      <path
        d="M 48,68 L 49,88 L 68,88 L 66,70 C 73,70 77,68 78,63 C 79,60 78,58 80,56 C 78,55 78,53 80,52 C 83,51 85,50 85,48 C 85,45 80,39 77,33 L 52,33 Z"
        fill="#E5CFA3"
        stroke="#0E1724"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Rasgos masculinos: boca firme y ojo de Horus */}
      <path d="M 80,56.5 L 73.5,56.5" stroke="#0E1724" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 65,40.5 L 76,40.5" stroke="#0E1724" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="71.5" cy="44.5" rx="3.4" ry="1.6" fill="#FFFFFF" stroke="#0E1724" strokeWidth="1.2" />
      <circle cx="72.2" cy="44.5" r="1.2" fill="#0E1724" />
      <path d="M 68,44.5 L 61,46" stroke="#0E1724" strokeWidth="1.4" strokeLinecap="round" />

      {/* Barba ceremonial egipcia trenzada */}
      <path
        d="M 74,66 L 78,64 L 82,81 C 82,84 79,85 77,83 L 73,68 Z"
        fill="#250B30"
        stroke="#E8D7A6"
        strokeWidth="1.1"
      />
      <line x1="75" y1="71" x2="79" y2="70" stroke="#E8D7A6" strokeWidth="1" />
      <line x1="76" y1="76" x2="80" y2="75" stroke="#E8D7A6" strokeWidth="1" />

      {/* Banda frontal dorada y caída lateral del Nemes */}
      <path d="M 30,29 L 78,29 L 78,34 L 30,34 Z" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />
      <path
        d="M 46,33 L 58,33 L 56,78 L 44,78 Z"
        fill="#250B30"
        stroke="#E8D7A6"
        strokeWidth="1.2"
      />
      <rect x="45" y="42" width="12" height="5" fill="#00B3A4" />
      <rect x="45" y="54" width="11.5" height="5" fill="#00B3A4" />
      <rect x="44.5" y="66" width="11.5" height="5" fill="#00B3A4" />

      {/* Hombros anchos, túnica y Collar Wesekh */}
      <path
        d="M 18,120 C 20,92 35,83 59,83 C 83,83 96,92 98,120 Z"
        fill="#2A0E34"
        stroke="#E8D7A6"
        strokeWidth="1.5"
      />
      <path
        d="M 31,85 C 40,100 76,100 85,85 C 80,105 36,105 31,85 Z"
        fill="#00B3A4"
        stroke="#0E1724"
        strokeWidth="1.2"
      />
      <path
        d="M 36,85 C 44,95 72,95 80,85 C 76,98 40,98 36,85 Z"
        fill="#E8D7A6"
        stroke="#0E1724"
        strokeWidth="1.1"
      />
    </g>
  </svg>
);

const inferTestimonialGender = (item: TestimonialItem): TestimonialGender => {
  if (item.gender) return item.gender;
  const author = item.author.toLowerCase();
  if (author.includes('&') || author.includes(' y ')) return 'couple';
  if (
    author.includes('dra.') ||
    author.includes('mariana') ||
    author.includes('lucía') ||
    author.includes('lucia') ||
    author.includes('camila') ||
    author.includes('maría') ||
    author.includes('maria') ||
    author.includes('sofía') ||
    author.includes('valentina') ||
    author.includes('laura') ||
    author.includes('paula') ||
    author.includes('carla') ||
    author.includes('florencia')
  ) {
    return 'female';
  }
  return 'male';
};

const EgyptianTestimonialAvatar: React.FC<{
  item: TestimonialItem;
  size?: 'sm' | 'lg';
}> = ({ item, size = 'lg' }) => {
  const gender = inferTestimonialGender(item);
  const dimClass = size === 'lg' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-9 h-9';
  const coupleDimClass = size === 'lg' ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-8 h-8';

  if (item.avatarUrl) {
    return (
      <div className={`${dimClass} rounded-full overflow-hidden border-2 border-[#00B3A4] shadow-[0_0_20px_rgba(0,179,164,0.28)] shrink-0 bg-[#0D1B2A]`}>
        <SupabaseMedia
          bucket="testimonials"
          storagePath={item.avatarUrl}
          alt={`Retrato de ${item.author}`}
          mediaClassName="w-full h-full object-cover"
          fallbackContent={
            gender === 'female' ? <EgyptianFemaleProfileSvg /> : <EgyptianMaleProfileSvg />
          }
        />
      </div>
    );
  }

  if (gender === 'couple') {
    return (
      <div
        className="flex items-center -space-x-3 shrink-0"
        aria-label={`Perfiles egipcios femenino y masculino de ${item.author}`}
      >
        <div
          className={`${coupleDimClass} rounded-full shadow-[0_0_20px_rgba(0,179,164,0.25)] relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5`}
          title="Perfil Femenino · Tarot Egipcio"
        >
          <EgyptianFemaleProfileSvg />
        </div>
        <div
          className={`${coupleDimClass} rounded-full shadow-[0_0_20px_rgba(0,179,164,0.25)] relative z-0 transition-transform duration-300 group-hover:translate-x-0.5`}
          title="Perfil Masculino · Tarot Egipcio"
        >
          <EgyptianMaleProfileSvg />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${dimClass} rounded-full shadow-[0_0_22px_rgba(0,179,164,0.28)] shrink-0`}
      title={
        gender === 'female'
          ? `Perfil Egipcio Femenino · ${item.author}`
          : `Perfil Egipcio Masculino · ${item.author}`
      }
    >
      {gender === 'female' ? <EgyptianFemaleProfileSvg /> : <EgyptianMaleProfileSvg />}
    </div>
  );
};

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote:
      'Tenía reservas respecto a la astrología por prejuicios del horóscopo comercial. La sesión en Narmer fue de una precisión terapéutica quirúrgica. Me ayudó a nombrar dinámicas inconscientes que llevaba años trabajando en supervisión clínica.',
    author: 'Dra. Mariana Albarracín',
    role: 'Psicóloga Clínica & Terapeuta Gestalt',
    location: 'Córdoba, Argentina',
    sessionType: 'Carta Natal Psicoastrológica',
    archetype: 'El Espejo de la Sombra',
    year: '2025',
    gender: 'female',
  },
  {
    id: 't2',
    quote:
      'Agendé la consulta en un momento de bloqueo vocacional crítico, dudando si cerrar un estudio de ocho años. El análisis de tránsitos y los arcanos me dieron una claridad milimétrica sobre los ciclos que se agotaban. Seis meses después refundé mi proyecto con paz mental.',
    author: 'Lic. Sebastián Rosales',
    role: 'Director Creativo & Estratega',
    location: 'Ciudad de México',
    sessionType: 'Revolución Solar & Ciclos',
    archetype: 'El Colapso de la Torre',
    year: '2025',
    gender: 'male',
  },
  {
    id: 't3',
    quote:
      'Llegamos a la consulta en medio de tensiones recurrentes de convivencia. Entender la diferencia en nuestros mapas de apego y el contrato kármico mutuo cambió para siempre cómo nos comunicamos. Dejamos de culparnos y empezamos a colaborar.',
    author: 'Camila Valenzuela & Tomás Herrera',
    role: 'Arquitectos & Docentes',
    location: 'Santiago, Chile',
    sessionType: 'Sinastría & Dinámica Vincular',
    archetype: 'La Tercera Entidad',
    year: '2026',
    gender: 'couple',
  },
  {
    id: 't4',
    quote:
      'No fue una predicción: fue una revelación de lo que mi intuición ya sabía pero mi mente racional se negaba a escuchar. La lectura del Tarot Egipcio me devolvió el timón en un momento de bifurcación vital definitiva.',
    author: 'Lucía Benítez',
    role: 'Investigadora en Bioética',
    location: 'Barcelona, España',
    sessionType: 'Tarot Egipcio Evolutivo',
    archetype: 'El Umbral de la Sacerdotisa',
    year: '2026',
    gender: 'female',
  },
  {
    id: 't5',
    quote:
      'Un espacio íntimo, solemne y despojado de dogma. En Narmer los símbolos operan como una partitura viva. Salí con herramientas concretas y una sensación de reconciliación profunda con mi propia historia.',
    author: 'Martín Echeverría',
    role: 'Músico & Compositor',
    location: 'Montevideo, Uruguay',
    sessionType: 'Tarot + Carta Natal',
    archetype: 'El Sendero del Eremita',
    year: '2025',
    gender: 'male',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>(() => {
    const localSaved = getLocalRecords<TestimonialItem>('narmer_local_testimonials');
    return [...localSaved, ...TESTIMONIALS];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    author: '',
    role: '',
    location: '',
    sessionType: '01 · TAROT',
    archetype: '',
    gender: 'female' as TestimonialGender,
    quote: '',
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SLIDE_DURATION = 8000; // 8 seconds slow contemplative cycle

  useEffect(() => {
    let active = true;
    fetchSupabaseTable<Record<string, any>>('testimonials', 'select=*&order=created_at.desc').then((remoteRows) => {
      if (!active || !remoteRows || remoteRows.length === 0) return;
      const byId = new Map<string, TestimonialItem>();
      const localSaved = getLocalRecords<TestimonialItem>('narmer_local_testimonials');
      localSaved.forEach((t) => byId.set(t.id, t));
      remoteRows.forEach((row) => {
        if (row.id && row.quote && row.author) {
          const normalized: TestimonialItem = {
            id: String(row.id),
            quote: String(row.quote),
            author: String(row.author),
            role: String(row.role || 'Consultante'),
            location: String(row.location || 'Online'),
            sessionType: String(row.sessionType || row.session_type || '01 · TAROT'),
            archetype: String(row.archetype || 'Símbolo Vivo'),
            year: String(row.year || new Date().getFullYear()),
            gender: (row.gender as TestimonialGender) || undefined,
            avatarUrl: row.avatarUrl || row.avatar_url || undefined,
          };
          byId.set(normalized.id, normalized);
        }
      });
      TESTIMONIALS.forEach((t) => {
        if (!byId.has(t.id)) byId.set(t.id, t);
      });
      setItems(Array.from(byId.values()));
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmitResonancia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.quote.trim()) return;
    setSaving(true);

    const yearStr = String(new Date().getFullYear());
    const newId = `res-${Date.now()}`;
    const newItem: TestimonialItem = {
      id: newId,
      author: form.author.trim(),
      role: form.role.trim() || 'Consultante',
      location: form.location.trim() || 'Consulta Online',
      sessionType: form.sessionType,
      archetype: form.archetype.trim() || 'Resonancia Simbólica',
      year: yearStr,
      gender: form.gender,
      quote: form.quote.trim(),
    };

    // Guardar respaldo local inmediato y actualizar vista
    appendLocalRecord('narmer_local_testimonials', newItem);
    setItems((prev) => [newItem, ...prev.filter((item) => item.id !== newItem.id)]);
    setCurrentIndex(0);
    setIsPaused(true);

    // Guardar en Supabase Database (tabla `testimonials`)
    const result = await insertSupabaseRecord('testimonials', {
      id: newItem.id,
      author: newItem.author,
      role: newItem.role,
      location: newItem.location,
      session_type: newItem.sessionType,
      archetype: newItem.archetype,
      year: newItem.year,
      gender: newItem.gender,
      quote: newItem.quote,
      created_at: new Date().toISOString(),
    });

    setSaving(false);
    setSavedNotice(
      result.ok
        ? 'Tu resonancia fue guardada en Supabase y publicada en el archivo.'
        : 'Tu resonancia quedó publicada y guardada en el archivo del Gabinete.'
    );

    setTimeout(() => {
      setIsModalOpen(false);
      setSavedNotice(null);
      setForm({
        author: '',
        role: '',
        location: '',
        sessionType: '01 · TAROT',
        archetype: '',
        gender: 'female',
        quote: '',
      });
    }, 1500);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, items.length]);

  const active = items[currentIndex] || items[0];

  return (
    <section
      id="testimonios"
      className="py-28 px-6 sm:px-12 md:px-20 bg-[#070F18] relative overflow-hidden border-t border-[#7A7A7A]/25"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Resonancias y testimonios de consultantes"
    >
      {/* Paper grain & atmospheric radial glows */}
      <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2A0E34]/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00B3A4]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Astronomical faint declination lines */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="2 8" />
          <line x1="0" y1="85%" x2="100%" y2="85%" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="2 8" />
          <circle cx="85%" cy="50%" r="220" stroke="#00B3A4" strokeWidth="0.5" strokeDasharray="3 7" fill="none" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#E8D7A6]/15">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#00B3A4]" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]">
                Capítulo IV · Resonancias & Huellas
              </span>
            </div>

            <EditorialBlurredHeading
              as="h2"
              delay={0.12}
              duration={1.2}
              blurAmount={12}
              className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#E8D7A6] font-normal leading-[1.15]"
            >
              Lo que el símbolo despierta.
            </EditorialBlurredHeading>

            <p className="font-editorial text-sm sm:text-base text-[#E8D7A6]/75 font-light max-w-xl">
              Palabras de consultantes que cruzaron el umbral y tradujeron los arcanos y planetas en claridad existencial.
            </p>
          </div>

          {/* Navigation Controls: Discreet, Minimalist & Tactile */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-full border border-[#00B3A4]/60 bg-[#2A0E34]/50 hover:bg-[#2A0E34] text-[#E8D7A6] font-clean text-[10px] tracking-[0.18em] uppercase transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,179,164,0.2)]"
            >
              <Feather className="w-3.5 h-3.5 text-[#00B3A4]" />
              <span>Dejar una resonancia</span>
            </button>

            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-2 text-[#E8D7A6]/60 hover:text-[#00B3A4] transition-colors border border-[#E8D7A6]/20 rounded-full"
              title={isPaused ? 'Reanudar transición automática' : 'Pausar transición'}
              aria-label={isPaused ? 'Reanudar pase automático' : 'Pausar pase automático'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-1.5 border border-[#E8D7A6]/20 rounded-full p-1 bg-[#0D1B2A]/70 backdrop-blur-sm">
              <button
                onClick={handlePrev}
                className="p-2 text-[#E8D7A6]/80 hover:text-[#00B3A4] hover:bg-[#2A0E34]/80 rounded-full transition-all"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-[11px] tracking-widest text-[#E8D7A6]/70 px-2 select-none">
                {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>

              <button
                onClick={handleNext}
                className="p-2 text-[#E8D7A6]/80 hover:text-[#00B3A4] hover:bg-[#2A0E34]/80 rounded-full transition-all"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Slow-Fading Testimonial Stage */}
        <div className="relative min-h-[280px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col justify-between h-full"
            >
              {/* Category & Session Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#00B3A4] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#00B3A4]" />
                  {active.sessionType}
                </span>
                <span className="text-[#7A7A7A]/50">·</span>
                <span className="font-handwritten text-sm text-[#E8D7A6]/70">
                  «{active.archetype}»
                </span>
                <span className="text-[#7A7A7A]/50">·</span>
                <span className="font-mono text-[10px] text-[#7A7A7A]">
                  Registro {active.year}
                </span>
              </div>

              {/* Central Poetic Quote */}
              <blockquote className="font-editorial italic font-normal text-xl sm:text-2xl md:text-3xl text-[#E8D7A6] leading-relaxed md:leading-[1.45] tracking-[-0.01em] max-w-4xl">
                «{active.quote}»
              </blockquote>

              {/* Author Attribution Meta with Egyptian Profile Portrait */}
              <div className="mt-10 pt-6 border-t border-[#E8D7A6]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 group">
                  <EgyptianTestimonialAvatar item={active} size="lg" />
                  <div className="space-y-1">
                    <cite className="not-italic font-editorial text-lg sm:text-xl text-[#E8D7A6] font-medium block">
                      {active.author}
                    </cite>
                    <p className="font-clean text-xs text-[#E8D7A6]/70 tracking-wide font-light">
                      {active.role} · <span className="text-[#00B3A4]">{active.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00B3A4]/80 shadow-[0_0_8px_rgba(0,179,164,0.6)]" />
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#E8D7A6]/60">
                    {inferTestimonialGender(active) === 'couple'
                      ? 'Consulta vincular en vivo'
                      : 'Consulta individual en vivo'}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist Progress Indicators with Egyptian Mini-Avatars */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-[#7A7A7A]/20">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {items.map((t, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={t.id}
                  onClick={() => goToSlide(idx)}
                  className={`group flex flex-col items-center gap-2 py-1 focus:outline-none transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-105' : 'opacity-55 hover:opacity-90'
                  }`}
                  aria-label={`Ir al testimonio de ${t.author}`}
                  title={t.author}
                >
                  <div
                    className={`rounded-full p-0.5 transition-all duration-300 ${
                      isActive
                        ? 'ring-2 ring-[#00B3A4] shadow-[0_0_14px_rgba(0,179,164,0.45)]'
                        : 'ring-1 ring-[#E8D7A6]/25 group-hover:ring-[#00B3A4]/60'
                    }`}
                  >
                    <EgyptianTestimonialAvatar item={t} size="sm" />
                  </div>
                  <div className="relative h-[2px] transition-all duration-700 overflow-hidden bg-[#E8D7A6]/20 rounded-full w-10 sm:w-12">
                    {isActive ? (
                      <motion.div
                        className="absolute inset-0 bg-[#00B3A4]"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{
                          duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                          ease: 'linear',
                        }}
                      />
                    ) : (
                      <div className="w-0 group-hover:w-full h-full bg-[#E8D7A6]/40 transition-all duration-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#7A7A7A]">
            GABINETE NARMER · ARCHIVO DE TESTIMONIOS
          </span>
        </div>
      </div>

      {/* Modal para Escribir y Guardar una Resonancia / Comentario en Supabase */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0D1B2A] border border-[#00B3A4]/45 p-7 sm:p-9 text-left my-auto shadow-2xl rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#E8D7A6]/70 hover:text-[#00B3A4] transition-colors"
              aria-label="Cerrar formulario de resonancia"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block mb-1 font-bold">
                Capítulo IV · Resonancias & Huellas
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#E8D7A6] font-normal">
                Compartir tu experiencia simbólica.
              </h3>
              <p className="font-editorial text-sm text-[#E8D7A6]/75 mt-1 font-light">
                Tu comentario se guardará en el archivo de resonancias del Gabinete Narmer.
              </p>
            </div>

            {savedNotice ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full border border-[#00B3A4] flex items-center justify-center text-[#00B3A4] bg-[#2A0E34]/60">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-editorial text-lg text-[#E8D7A6]">{savedNotice}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitResonancia} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Tu Nombre o Iniciales *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="Ej. Clara M."
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Ocupación o Rol
                    </label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="Ej. Arquitecta / Docente"
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Ciudad / País
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Ej. Córdoba / Buenos Aires"
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Consulta Realizada
                    </label>
                    <select
                      value={form.sessionType}
                      onChange={(e) => setForm({ ...form, sessionType: e.target.value })}
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    >
                      <option value="01 · TAROT">01 · TAROT</option>
                      <option value="02 · PSICOASTROLOGÍA">02 · PSICOASTROLOGÍA</option>
                      <option value="03 · TAROT + CARTA NATAL">03 · TAROT + CARTA NATAL</option>
                      <option value="04 · BIODECODIFICACIÓN">04 · BIODECODIFICACIÓN</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Arquetipo o Símbolo (Opcional)
                    </label>
                    <input
                      type="text"
                      value={form.archetype}
                      onChange={(e) => setForm({ ...form, archetype: e.target.value })}
                      placeholder="Ej. La Sacerdotisa · Casa IV"
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                      Medallón de Perfil Egipcio
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as TestimonialGender })}
                      className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded"
                    >
                      <option value="female">Perfil Femenino (Sacerdotisa)</option>
                      <option value="male">Perfil Masculino (Escriba Solar)</option>
                      <option value="couple">Consulta Vincular / Pareja</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-clean text-[#E8D7A6]/80 block mb-1">
                    Tu Comentario / Resonancia *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.quote}
                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
                    placeholder="Escribe aquí lo que la lectura o el mapa despertó en ti..."
                    className="w-full bg-[#070F18] border border-[#7A7A7A]/40 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none rounded resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-clean uppercase tracking-wider text-[#7A7A7A] hover:text-[#E8D7A6]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2 rounded shadow-[0_0_15px_rgba(0,179,164,0.25)]"
                  >
                    <Feather className="w-3.5 h-3.5 text-[#00B3A4]" />
                    <span>{saving ? 'Guardando...' : 'Publicar Resonancia'}</span>
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
