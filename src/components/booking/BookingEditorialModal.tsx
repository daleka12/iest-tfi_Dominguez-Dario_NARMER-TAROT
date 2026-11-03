import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, Send, Feather, Mail } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import {
  insertSupabaseRecord,
  appendLocalRecord,
  sendBookingEmailToOwner,
  buildBookingMailtoUrl,
  OWNER_NOTIFICATION_EMAIL,
  BookingEmailPayload,
} from '../../services/supabase';

interface BookingEditorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSession?: string;
}

const SESSION_OPTIONS = [
  { id: '01 · TAROT', title: '01 · TAROT (60 min)', cost: '$55 USD / $50.000 ARS' },
  { id: '02 · PSICOASTROLOGÍA', title: '02 · PSICOASTROLOGÍA (75 min)', cost: '$70 USD / $65.000 ARS' },
  { id: '03 · TAROT + CARTA NATAL', title: '03 · TAROT + CARTA NATAL (90 min)', cost: '$90 USD / $85.000 ARS' },
  { id: '04 · BIODECODIFICACIÓN', title: '04 · BIODECODIFICACIÓN (Próximamente · Lista de Espera)', cost: 'Próximamente disponible' },
];

export const BookingEditorialModal: React.FC<BookingEditorialModalProps> = ({
  isOpen,
  onClose,
  initialSession = '01 · TAROT (60 min)',
}) => {
  const [session, setSession] = useState(initialSession);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '18:00',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<'sending' | 'sent' | 'ready'>('ready');
  const [lastBookingPayload, setLastBookingPayload] = useState<BookingEmailPayload | null>(null);

  useEffect(() => {
    if (!initialSession) return;
    const upper = initialSession.toUpperCase();
    const matched = SESSION_OPTIONS.find(
      (opt) =>
        opt.title.toUpperCase() === upper ||
        (upper.includes('BIODECODIFICA') && opt.id.includes('BIODECODIFICACIÓN')) ||
        (upper.includes('CARTA NATAL') && upper.includes('TAROT') && opt.id.includes('TAROT + CARTA NATAL')) ||
        (upper.includes('PSICOASTROLOG') && opt.id.includes('PSICOASTROLOGÍA')) ||
        (upper === 'TAROT' && opt.id === '01 · TAROT')
    );
    setSession(matched ? matched.title : initialSession);
  }, [initialSession, isOpen]);

  if (!isOpen) return null;

  const sessionOptions = SESSION_OPTIONS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const createdAt = new Date().toISOString();
    const payload: BookingEmailPayload = {
      session_type: session,
      client_name: formData.name.trim(),
      client_email: formData.email.trim(),
      preferred_date: formData.date || '',
      preferred_time: formData.time,
      notes: formData.message.trim(),
      created_at: createdAt,
    };

    setLastBookingPayload(payload);
    setSubmitted(true);
    setEmailSentStatus('sending');

    // 1. Respaldo local inmediato
    appendLocalRecord('narmer_local_bookings', {
      ...payload,
      recipient_email: OWNER_NOTIFICATION_EMAIL,
    });

    // 2. Guardar en Supabase Database (`bookings`)
    void insertSupabaseRecord('bookings', {
      session_type: payload.session_type,
      client_name: payload.client_name,
      client_email: payload.client_email,
      preferred_date: payload.preferred_date || null,
      preferred_time: payload.preferred_time,
      notes: payload.notes || null,
      recipient_email: OWNER_NOTIFICATION_EMAIL,
      created_at: payload.created_at,
    });

    // 3. Enviar notificación por correo electrónico a dalekavideos@gmail.com
    const mailResult = await sendBookingEmailToOwner(payload);
    setEmailSentStatus(mailResult.ok ? 'sent' : 'ready');
  };

  const whatsappText = encodeURIComponent(
    `Hola Narmer, quisiera coordinar la sesión de *${session}* a nombre de ${formData.name}. Fecha tentativa: ${formData.date} a las ${formData.time}. Nota: ${formData.message || 'Sin notas adicionales'}.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0D1B2A] border border-[#00B3A4]/40 p-8 sm:p-10 text-left my-auto max-h-[92vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#E8D7A6]/70 hover:text-[#00B3A4] transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-full border border-[#00B3A4] flex items-center justify-center text-[#00B3A4] bg-[#2A0E34]/50 shadow-[0_0_20px_rgba(0,179,164,0.25)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block mb-2 font-bold">
                Solicitud Recibida
              </span>
              <h3 className="font-editorial text-3xl text-[#E8D7A6] font-normal">
                Tu cita está en preparación.
              </h3>
              <p className="mt-3 font-editorial text-base text-[#E8D7A6]/80 max-w-md mx-auto leading-relaxed">
                Gracias, <strong className="text-[#FFFFFF]">{formData.name}</strong>. Nos pondremos en contacto a la brevedad con los datos de acceso para tu sesión de <strong className="text-[#00B3A4]">{session}</strong>.
              </p>
            </div>

            <div className="p-4 border border-[#7A7A7A]/30 bg-[#08121D] text-xs font-mono text-[#E8D7A6]/80 text-left space-y-1.5 max-w-md mx-auto">
              <div>Consultante: <span className="text-[#E8D7A6] font-semibold">{formData.name}</span></div>
              <div>Correo: <span className="text-[#E8D7A6] font-semibold">{formData.email}</span></div>
              <div>Fecha tentativa: <span className="text-[#00B3A4]">{formData.date || 'A coordinar'} · {formData.time}</span></div>
              <div>
                Notificación enviada a:{' '}
                <span className="text-[#00B3A4] font-semibold">{OWNER_NOTIFICATION_EMAIL}</span>
                {emailSentStatus === 'sending' && <span className="ml-2 text-[#E8D7A6]/60">(Enviando…)</span>}
                {emailSentStatus === 'sent' && <span className="ml-2 text-[#00B3A4]">✓ Enviado</span>}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
              {lastBookingPayload && (
                <a
                  href={buildBookingMailtoUrl(lastBookingPayload)}
                  className="w-full sm:w-auto px-5 py-3 border border-[#00B3A4] bg-[#160A20] hover:bg-[#2A0E34] text-[#E8D7A6] font-clean text-xs uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,179,164,0.2)]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#00B3A4]" />
                  <span>Enviar copia a {OWNER_NOTIFICATION_EMAIL}</span>
                </a>
              )}
              <a
                href={`https://wa.me/5493516429757?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs uppercase tracking-[0.18em] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,179,164,0.2)]"
              >
                <Send className="w-3.5 h-3.5 text-[#00B3A4]" />
                <span>Confirmar por WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 border border-[#7A7A7A]/40 text-xs font-clean uppercase tracking-[0.18em] text-[#E8D7A6]/80 hover:text-[#00B3A4]"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block mb-1 font-bold">
                Gabinete Narmer · Reserva
              </span>
              <h3 className="font-editorial text-3xl text-[#E8D7A6] font-normal">
                Abrir un espacio de consulta.
              </h3>
              <p className="font-editorial text-sm text-[#E8D7A6]/75 mt-1 font-light">
                Sesión individual y confidencial en vivo por videoconferencia HD.
              </p>
            </div>

            {/* Session Type */}
            <div>
              <label className="text-[11px] font-mono tracking-widest uppercase text-[#00B3A4] block mb-2 font-bold">
                1. Selección de Consulta
              </label>
              <div className="space-y-2">
                {sessionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSession(opt.title)}
                    className={`w-full p-3 border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 transition-all ${
                      session.includes(opt.id)
                        ? 'border-[#00B3A4] bg-[#2A0E34] text-[#E8D7A6] shadow-[0_0_15px_rgba(0,179,164,0.2)]'
                        : 'border-[#7A7A7A]/30 bg-[#08121D] text-[#E8D7A6]/70 hover:border-[#00B3A4]/50'
                    }`}
                  >
                    <span className="font-editorial text-base leading-snug">{opt.title}</span>
                    <span className="font-mono text-[11px] text-[#00B3A4] font-semibold shrink-0">{opt.cost}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-clean text-[#E8D7A6]/70 block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-clean text-[#E8D7A6]/70 block mb-1">
                  Email de Contacto *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@correo.com"
                  className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none"
                />
              </div>
            </div>

            {/* Date & Time Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-clean text-[#E8D7A6]/70 block mb-1">
                  Fecha Tentativa Deseada
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-clean text-[#E8D7A6]/70 block mb-1">
                  Franja Horaria Preferida
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" />
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none"
                  >
                    <option value="11:00">Mañana (11:00 hs)</option>
                    <option value="15:00">Tarde (15:00 hs)</option>
                    <option value="18:00">Vespertino (18:00 hs)</option>
                    <option value="20:00">Noche (20:00 hs)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Questions or Context */}
            <div>
              <label className="text-[11px] font-clean text-[#E8D7A6]/70 block mb-1">
                ¿Qué tema o pregunta te gustaría explorar? (Opcional)
              </label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Breve apunte o inquietud..."
                className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-clean uppercase tracking-wider text-[#7A7A7A] hover:text-[#E8D7A6]"
              >
                Cancelar
              </button>

              <MagneticButton
                type="submit"
                strength={0.28}
                className="px-6 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.2em] uppercase transition-colors shadow-[0_0_15px_rgba(0,179,164,0.2)]"
              >
                <Feather className="w-3.5 h-3.5 text-[#00B3A4]" />
                <span>Solicitar Reserva</span>
              </MagneticButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
