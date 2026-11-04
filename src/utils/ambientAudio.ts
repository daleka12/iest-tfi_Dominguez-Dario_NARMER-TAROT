// Motor de audio atmosférico NARMER:
// 1. Reproduce en bucle continuo la pista musical de fondo (./cards/atmosfera-narmer.mp3)
// 2. Conserva las texturas opcionales de viento/ambiente y la campana ceremonial de 432 Hz
// 3. La campana suena con alta potencia y presencia directa (incluso si el fondo está en pausa)

export type SoundscapeType = 'nocturno' | 'viento' | 'campanas';

const BG_MUSIC_SRC = './cards/atmosfera-narmer.mp3';

class AtmosphericAudioEngine {
  private ctx: AudioContext | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private currentVolume: number = 0.65;
  private currentMode: SoundscapeType = 'nocturno';
  private userManuallyStopped: boolean = false;

  // Master nodes for subtle wind/texture accompaniment
  private masterGain: GainNode | null = null;

  // Wind nodes
  private windSource: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windLfo: OscillatorNode | null = null;
  private windLfoGain: GainNode | null = null;

  // Chime timer
  private chimeTimer: number | null = null;

  // State change callbacks
  private listeners: Set<(isPlaying: boolean, volume: number, mode: SoundscapeType) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupAutoStartOnInteraction();
    }
  }

  private getBgAudio(): HTMLAudioElement | null {
    if (!this.bgAudio && typeof window !== 'undefined') {
      const audio = new Audio(BG_MUSIC_SRC);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = this.currentVolume;
      this.bgAudio = audio;
    }
    return this.bgAudio;
  }

  /**
   * Inicia la música en bucle automáticamente (o en el primer gesto del usuario si el navegador exige interacción previa)
   */
  private setupAutoStartOnInteraction() {
    const tryAutoPlay = () => {
      if (this.userManuallyStopped || this.isPlaying) return;
      const audio = this.getBgAudio();
      if (!audio) return;
      audio.volume = this.currentVolume;
      audio
        .play()
        .then(() => {
          if (!this.isPlaying) {
            this.startSynthLayer();
            this.isPlaying = true;
            this.notify();
          }
          cleanupListeners();
        })
        .catch(() => {
          // El navegador espera el primer clic/tecla del usuario
        });
    };

    const onFirstGesture = () => {
      if (!this.userManuallyStopped && !this.isPlaying) {
        this.start();
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };

    window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', onFirstGesture, { once: true, passive: true });

    // Intentar reproducción directa al cargar
    setTimeout(tryAutoPlay, 350);
  }

  public subscribe(cb: (isPlaying: boolean, volume: number, mode: SoundscapeType) => void) {
    this.listeners.add(cb);
    cb(this.isPlaying, this.currentVolume, this.currentMode);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying, this.currentVolume, this.currentMode));
  }

  private getAudioContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val));
    if (this.bgAudio) {
      this.bgAudio.volume = this.currentVolume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume * 0.12, this.ctx.currentTime, 0.1);
    }
    this.notify();
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public setMode(mode: SoundscapeType) {
    this.currentMode = mode;
    if (this.isPlaying) {
      this.applyModeSettings();
    }
    this.notify();
  }

  public getMode(): SoundscapeType {
    return this.currentMode;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.userManuallyStopped = true;
      this.stop();
      return false;
    } else {
      this.userManuallyStopped = false;
      this.start();
      return true;
    }
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  private createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  private startSynthLayer() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Limpiar capa previa si existía
    try {
      if (this.windSource) {
        this.windSource.stop();
        this.windSource.disconnect();
      }
      if (this.windLfo) {
        this.windLfo.stop();
        this.windLfo.disconnect();
      }
    } catch {
      // Ignorar
    }

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(Math.max(0.001, this.currentVolume * 0.12), ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    // Brisa sutil para acompañar la música de fondo según el modo
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    this.windSource = ctx.createBufferSource();
    this.windSource.buffer = noiseBuffer;
    this.windSource.loop = true;

    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(380, ctx.currentTime);
    this.windFilter.Q.setValueAtTime(2.2, ctx.currentTime);

    this.windLfo = ctx.createOscillator();
    this.windLfo.type = 'sine';
    this.windLfo.frequency.setValueAtTime(0.12, ctx.currentTime);

    this.windLfoGain = ctx.createGain();
    this.windLfoGain.gain.setValueAtTime(180, ctx.currentTime);

    this.windLfo.connect(this.windLfoGain);
    this.windLfoGain.connect(this.windFilter.frequency);

    this.windGain = ctx.createGain();
    this.windGain.gain.setValueAtTime(0.15, ctx.currentTime);

    this.windSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.windSource.start();
    this.windLfo.start();

    this.applyModeSettings();
    this.scheduleNextChime();
  }

  public start() {
    // 1. Iniciar reproducción en bucle del archivo MP3 adjunto
    const audio = this.getBgAudio();
    if (audio) {
      audio.loop = true;
      audio.volume = this.currentVolume;
      audio.play().catch(() => {
        // Si el navegador requiere otro gesto
      });
    }

    // 2. Iniciar capa atmosférica y temporizador de campanas
    this.startSynthLayer();

    this.isPlaying = true;
    this.notify();
  }

  private applyModeSettings() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.currentMode === 'viento') {
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.55, now, 0.8);
    } else if (this.currentMode === 'campanas') {
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.05, now, 0.8);
    } else {
      // 'nocturno' (Música principal en bucle + brisa muy suave)
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.15, now, 0.8);
    }
  }

  private scheduleNextChime() {
    if (this.chimeTimer) window.clearTimeout(this.chimeTimer);
    const nextInterval = 14000 + Math.random() * 14000;
    this.chimeTimer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.triggerDistantChime(1.0);
        this.scheduleNextChime();
      }
    }, nextInterval);
  }

  /**
   * Campana ceremonial de alta potencia (432 Hz / armónicos tibetanos).
   * Se conecta directamente a la salida principal con un compresor dinámico
   * para que suene MUY FUERTE, clara y profunda tanto al pulsar el botón como en el ciclo.
   */
  public triggerDistantChime(pitchMultiplier: number = 1) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const baseFrequencies = [432, 528, 648, 864];
    const fundamental =
      baseFrequencies[Math.floor(Math.random() * baseFrequencies.length)] * pitchMultiplier;

    // Compresor/limitador dedicado para lograr un golpe de campana potente, lleno y sin distorsión
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-10, now);
    compressor.knee.setValueAtTime(6, now);
    compressor.ratio.setValueAtTime(3, now);
    compressor.attack.setValueAtTime(0.002, now);
    compressor.release.setValueAtTime(0.25, now);
    compressor.connect(ctx.destination);

    // Ganancia directa de la campana: muy fuerte (0.95 de amplitud máxima)
    const chimeMixer = ctx.createGain();
    const bellVolume = Math.max(0.85, this.currentVolume);
    chimeMixer.gain.setValueAtTime(0.001, now);
    chimeMixer.gain.linearRampToValueAtTime(0.95 * bellVolume, now + 0.015);
    chimeMixer.gain.exponentialRampToValueAtTime(0.0008, now + 6.5);
    chimeMixer.connect(compressor);

    // Armónicos ricos de campana de bronce / cuenco tibetano grande
    const partials = [
      { ratio: 0.5, amp: 0.55, decay: 6.2, type: 'sine' as OscillatorType },      // Sub-octava profunda de bronce
      { ratio: 1.0, amp: 1.0, decay: 5.8, type: 'sine' as OscillatorType },       // Fundamental 432 Hz potente
      { ratio: 1.5, amp: 0.45, decay: 4.5, type: 'triangle' as OscillatorType },  // Quinta resonante
      { ratio: 2.0, amp: 0.6, decay: 4.2, type: 'sine' as OscillatorType },       // Octava brillante
      { ratio: 2.76, amp: 0.5, decay: 3.4, type: 'sine' as OscillatorType },      // Parcial metálico de campana
      { ratio: 4.07, amp: 0.35, decay: 2.6, type: 'sine' as OscillatorType },     // Brillo cristalino superior
      { ratio: 5.43, amp: 0.22, decay: 1.8, type: 'sine' as OscillatorType },     // Ataque metálico inicial
    ];

    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = p.type;
      osc.frequency.setValueAtTime(fundamental * p.ratio, now);

      pGain.gain.setValueAtTime(p.amp, now);
      pGain.gain.exponentialRampToValueAtTime(0.001, now + p.decay);

      osc.connect(pGain);
      pGain.connect(chimeMixer);

      osc.start(now);
      osc.stop(now + p.decay + 0.4);
    });
  }

  public stop() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }

    if (this.chimeTimer) {
      window.clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);
    }

    setTimeout(() => {
      try {
        if (this.windSource) {
          this.windSource.stop();
          this.windSource.disconnect();
          this.windSource = null;
        }
        if (this.windLfo) {
          this.windLfo.stop();
          this.windLfo.disconnect();
          this.windLfo = null;
        }
      } catch {
        // Ignorar errores de limpieza
      }
      this.isPlaying = false;
      this.notify();
    }, 650);
  }
}

export const atmosphericAudio = new AtmosphericAudioEngine();
