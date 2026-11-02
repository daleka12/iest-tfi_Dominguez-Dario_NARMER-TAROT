import React, { useState } from 'react';
import { useAmbientAudio } from '../../context/AmbientAudioContext';
import { Volume2, VolumeX, Wind, Bell, Sliders, Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';

export const AtmosphericAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    volume,
    mode,
    isPanelOpen,
    togglePlay,
    setVolume,
    setMode,
    triggerChime,
    togglePanel,
    setPanelOpen,
  } = useAmbientAudio();

  const [chimeRinging, setChimeRinging] = useState(false);

  const handleManualChime = () => {
    triggerChime();
    setChimeRinging(true);
    setTimeout(() => setChimeRinging(false), 2400);
  };

  const modeDescriptions = {
    nocturno: 'Viento nocturno, campanas distantes y resonancia 432 Hz',
    viento: 'Susurro de brisa continua y sosiego contemplativo',
    campanas: 'Resonancia pura de campanas templarias en silencio',
  };

  return (
    <aside
      aria-label="Reproductor de atmósfera sonora"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none flex flex-col items-end"
    >
      {/* EXPANDABLE CONTROL PANEL */}
      {isPanelOpen && (
        <div className="mb-3 w-72 sm:w-80 p-5 rounded-none border border-[#00B3A4]/40 bg-[#0D1B2A]/95 backdrop-blur-md shadow-2xl text-left space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D7A6]/20">
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block font-bold">
                Atmósfera Acústica
              </span>
              <h4 className="font-editorial text-lg text-[#E8D7A6] font-normal leading-tight">
                Gabinete Sonoro
              </h4>
            </div>

            <button
              onClick={() => setPanelOpen(false)}
              className="p-1 text-[#E8D7A6]/60 hover:text-[#00B3A4] transition-colors"
              aria-label="Minimizar panel sonoro"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Soundscape Mode Selector */}
          <div>
            <label className="text-[10px] font-mono tracking-widest uppercase text-[#00B3A4] block mb-2 font-bold">
              Textura Sonora
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#070F18] border border-[#7A7A7A]/30 text-[10px] font-clean">
              <button
                onClick={() => setMode('nocturno')}
                className={`py-1.5 px-2 tracking-wider uppercase transition-all ${
                  mode === 'nocturno'
                    ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] font-semibold'
                    : 'text-[#7A7A7A] hover:text-[#E8D7A6]'
                }`}
              >
                Nocturno
              </button>
              <button
                onClick={() => setMode('viento')}
                className={`py-1.5 px-2 tracking-wider uppercase transition-all ${
                  mode === 'viento'
                    ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] font-semibold'
                    : 'text-[#7A7A7A] hover:text-[#E8D7A6]'
                }`}
              >
                Viento
              </button>
              <button
                onClick={() => setMode('campanas')}
                className={`py-1.5 px-2 tracking-wider uppercase transition-all ${
                  mode === 'campanas'
                    ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] font-semibold'
                    : 'text-[#7A7A7A] hover:text-[#E8D7A6]'
                }`}
              >
                Campanas
              </button>
            </div>
            <p className="text-[11px] font-editorial italic text-[#E8D7A6]/75 mt-1.5 leading-snug">
              {modeDescriptions[mode]}
            </p>
          </div>

          {/* Volume Control */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#E8D7A6]/75 mb-1.5">
              <span className="uppercase tracking-widest text-[#00B3A4]">Intensidad</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#070F18] rounded-none appearance-none cursor-pointer accent-[#00B3A4]"
              aria-label="Volumen del ambiente sonoro"
            />
          </div>

          {/* Interactive Bell Strike Button */}
          <div className="pt-2 border-t border-[#7A7A7A]/20 flex items-center justify-between">
            <button
              onClick={handleManualChime}
              className={`px-3 py-1.5 border text-[10px] font-clean uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                chimeRinging
                  ? 'border-[#00B3A4] bg-[#2A0E34] text-[#00B3A4]'
                  : 'border-[#7A7A7A]/40 text-[#E8D7A6] hover:border-[#00B3A4] hover:text-[#00B3A4]'
              }`}
              title="Resonar campana de 432 Hz"
            >
              <Bell className={`w-3 h-3 text-[#00B3A4] ${chimeRinging ? 'animate-bounce' : ''}`} />
              <span>Tocar campana (432Hz)</span>
            </button>

            <span className="text-[9px] font-mono text-[#7A7A7A]">
              Tecla [M] mutear
            </span>
          </div>
        </div>
      )}

      {/* COMPACT FLOATING BAR / CONTROLLER */}
      <div className="flex items-center gap-2 p-1.5 border border-[#00B3A4]/40 bg-[#0D1B2A]/90 backdrop-blur-md shadow-2xl transition-all duration-300">
        {/* Play/Stop Main Button */}
        <button
          onClick={togglePlay}
          className={`px-3 py-1.5 text-xs font-clean uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${
            isPlaying
              ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] shadow-[0_0_12px_rgba(0,179,164,0.25)]'
              : 'text-[#E8D7A6]/70 hover:text-[#00B3A4] hover:bg-[#152336]'
          }`}
          aria-label={isPlaying ? 'Pausar atmósfera sonoro' : 'Activar atmósfera sonoro'}
        >
          {isPlaying ? (
            <>
              {/* Animated subtle sound bars */}
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-[#00B3A4] animate-[pulse_1.2s_ease-in-out_infinite]" />
                <span className="w-0.5 h-2 bg-[#E8D7A6] animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 h-2.5 bg-[#00B3A4] animate-[pulse_1.5s_ease-in-out_infinite]" />
              </div>
              <span className="text-[10px] font-mono font-medium">Atmósfera Activa</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#7A7A7A]" />
              <span className="text-[10px] font-mono">Sonido [M]</span>
            </>
          )}
        </button>

        {/* Quick Strike Bell Button */}
        <button
          onClick={handleManualChime}
          className="p-1.5 text-[#E8D7A6]/70 hover:text-[#00B3A4] hover:bg-[#152336] transition-colors"
          title="Tocar campana"
          aria-label="Tocar campana armónica"
        >
          <Bell className="w-3.5 h-3.5 text-[#00B3A4]" />
        </button>

        {/* Expand / Collapse Settings Toggle */}
        <button
          onClick={togglePanel}
          className={`p-1.5 transition-colors ${
            isPanelOpen
              ? 'text-[#00B3A4] bg-[#2A0E34]'
              : 'text-[#E8D7A6]/60 hover:text-[#00B3A4] hover:bg-[#152336]'
          }`}
          title="Ajustes de atmósfera sonora"
          aria-label="Abrir panel de opciones de sonido"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
