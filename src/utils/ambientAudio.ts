// Atmospheric procedural audio synthesizer using Web Audio API
// Generates soft wind gusts (pink noise + LFO filter), distant bell chimes (modal synthesis), and warm harmonic drone
export type SoundscapeType = 'nocturno' | 'viento' | 'campanas';

class AtmosphericAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentVolume: number = 0.5;
  private currentMode: SoundscapeType = 'nocturno';

  // Master nodes
  private masterGain: GainNode | null = null;

  // Drone nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

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
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume * 0.15, this.ctx.currentTime, 0.1);
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
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  // Generates 5 seconds of pink noise for natural wind simulation
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
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  public start() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Master Gain
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, this.currentVolume * 0.15),
      ctx.currentTime + 2.5
    );
    this.masterGain.connect(ctx.destination);

    // 1. Warm Sub-Harmonic Drone (108 Hz & 162 Hz)
    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0.28;

    this.droneOsc1 = ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(108, ctx.currentTime);

    this.droneOsc2 = ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(162, ctx.currentTime);

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(260, ctx.currentTime);

    this.droneOsc1.connect(this.droneGain);
    this.droneOsc2.connect(this.droneGain);
    this.droneGain.connect(droneFilter);
    droneFilter.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();

    // 2. Wind Breeze Generator (Pink noise with resonant modulated filter)
    const noiseBuffer = this.createPinkNoiseBuffer(ctx);
    this.windSource = ctx.createBufferSource();
    this.windSource.buffer = noiseBuffer;
    this.windSource.loop = true;

    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(380, ctx.currentTime);
    this.windFilter.Q.setValueAtTime(2.2, ctx.currentTime);

    // Slow LFO simulating gusts of wind (0.12 Hz)
    this.windLfo = ctx.createOscillator();
    this.windLfo.type = 'sine';
    this.windLfo.frequency.setValueAtTime(0.12, ctx.currentTime);

    this.windLfoGain = ctx.createGain();
    this.windLfoGain.gain.setValueAtTime(180, ctx.currentTime); // Filter modulation range

    this.windLfo.connect(this.windLfoGain);
    this.windLfoGain.connect(this.windFilter.frequency);

    this.windGain = ctx.createGain();
    this.windGain.gain.setValueAtTime(0.35, ctx.currentTime);

    this.windSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.windSource.start();
    this.windLfo.start();

    // Apply specific preset balance
    this.applyModeSettings();

    // 3. Distant Chimes Interval (Procedural atmospheric strikes)
    this.triggerDistantChime();
    this.scheduleNextChime();

    this.isPlaying = true;
    this.notify();
  }

  private applyModeSettings() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.currentMode === 'viento') {
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.08, now, 1);
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.65, now, 1);
    } else if (this.currentMode === 'campanas') {
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.15, now, 1);
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.12, now, 1);
    } else {
      // 'nocturno' (Balanced)
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.28, now, 1);
      if (this.windGain) this.windGain.gain.setTargetAtTime(0.35, now, 1);
    }
  }

  private scheduleNextChime() {
    if (this.chimeTimer) window.clearTimeout(this.chimeTimer);
    // Interval between 10s and 22s
    const nextInterval = 10000 + Math.random() * 12000;
    this.chimeTimer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.triggerDistantChime();
        this.scheduleNextChime();
      }
    }, nextInterval);
  }

  // Synthesizes a delicate resonant bell strike with rich natural partials
  public triggerDistantChime(pitchMultiplier: number = 1) {
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;

    const baseFrequencies = [432, 540, 648, 864];
    const fundamental =
      baseFrequencies[Math.floor(Math.random() * baseFrequencies.length)] * pitchMultiplier;

    // Harmonic partial ratios typical of tuned Tibetan singing bowls / temple chimes
    const partials = [
      { ratio: 1.0, amp: 1.0, decay: 5.2 },
      { ratio: 2.76, amp: 0.45, decay: 4.1 },
      { ratio: 4.07, amp: 0.22, decay: 3.2 },
      { ratio: 5.43, amp: 0.12, decay: 2.0 },
    ];

    const chimeMixer = ctx.createGain();
    chimeMixer.gain.setValueAtTime(0.0001, ctx.currentTime);
    chimeMixer.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.04);
    chimeMixer.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.5);
    chimeMixer.connect(this.masterGain);

    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * p.ratio, ctx.currentTime);

      pGain.gain.setValueAtTime(p.amp, ctx.currentTime);
      pGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.decay);

      osc.connect(pGain);
      pGain.connect(chimeMixer);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + p.decay + 0.5);
    });
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;

    this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

    if (this.chimeTimer) {
      window.clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    setTimeout(() => {
      try {
        if (this.droneOsc1) {
          this.droneOsc1.stop();
          this.droneOsc1.disconnect();
          this.droneOsc1 = null;
        }
        if (this.droneOsc2) {
          this.droneOsc2.stop();
          this.droneOsc2.disconnect();
          this.droneOsc2 = null;
        }
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
      } catch (err) {
        // Safe cleanup
      }
      this.isPlaying = false;
      this.notify();
    }, 1500);
  }
}

export const atmosphericAudio = new AtmosphericAudioEngine();
