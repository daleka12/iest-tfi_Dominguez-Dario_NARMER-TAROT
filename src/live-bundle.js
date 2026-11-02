// Pre-compiled ES Module Bundle for Live Server & Static Preview
import React from "react";
import * as ReactDOMClient from "react-dom/client";
import * as LucideReact from "lucide-react";
import * as MotionReact from "motion/react";

const __ext = {
  "react": Object.assign({ default: React }, React),
  "react-dom/client": Object.assign({ default: ReactDOMClient }, ReactDOMClient),
  "lucide-react": LucideReact,
  "motion/react": MotionReact,
  "framer-motion": MotionReact,
};

const __modules = {};
const __cache = {};

function __require(id) {
  if (id in __ext) return __ext[id];
  if (id.endsWith(".css")) return {};
  if (__cache[id]) return __cache[id].exports;
  if (!__modules[id]) throw new Error("Module not found: " + id);
  const mod = { exports: {} };
  __cache[id] = mod;
  __modules[id](mod.exports, __require, mod);
  return mod.exports;
}

// --- utils/ambientAudio.ts ---
__modules["utils/ambientAudio.ts"] = function(exports, require, module) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atmosphericAudio = void 0;
class AtmosphericAudioEngine {
    ctx = null;
    isPlaying = false;
    currentVolume = 0.5;
    currentMode = 'nocturno';
    // Master nodes
    masterGain = null;
    // Drone nodes
    droneOsc1 = null;
    droneOsc2 = null;
    droneGain = null;
    // Wind nodes
    windSource = null;
    windGain = null;
    windFilter = null;
    windLfo = null;
    windLfoGain = null;
    // Chime timer
    chimeTimer = null;
    // State change callbacks
    listeners = new Set();
    subscribe(cb) {
        this.listeners.add(cb);
        cb(this.isPlaying, this.currentVolume, this.currentMode);
        return () => {
            this.listeners.delete(cb);
        };
    }
    notify() {
        this.listeners.forEach((cb) => cb(this.isPlaying, this.currentVolume, this.currentMode));
    }
    getAudioContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        return this.ctx;
    }
    setVolume(val) {
        this.currentVolume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(this.currentVolume * 0.15, this.ctx.currentTime, 0.1);
        }
        this.notify();
    }
    getVolume() {
        return this.currentVolume;
    }
    setMode(mode) {
        this.currentMode = mode;
        if (this.isPlaying) {
            this.applyModeSettings();
        }
        this.notify();
    }
    getMode() {
        return this.currentMode;
    }
    toggle() {
        if (this.isPlaying) {
            this.stop();
            return false;
        }
        else {
            this.start();
            return true;
        }
    }
    isAudioPlaying() {
        return this.isPlaying;
    }
    // Generates 5 seconds of pink noise for natural wind simulation
    createPinkNoiseBuffer(ctx) {
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
    start() {
        const ctx = this.getAudioContext();
        if (!ctx)
            return;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        // Master Gain
        this.masterGain = ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.currentVolume * 0.15), ctx.currentTime + 2.5);
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
    applyModeSettings() {
        if (!this.ctx)
            return;
        const now = this.ctx.currentTime;
        if (this.currentMode === 'viento') {
            if (this.droneGain)
                this.droneGain.gain.setTargetAtTime(0.08, now, 1);
            if (this.windGain)
                this.windGain.gain.setTargetAtTime(0.65, now, 1);
        }
        else if (this.currentMode === 'campanas') {
            if (this.droneGain)
                this.droneGain.gain.setTargetAtTime(0.15, now, 1);
            if (this.windGain)
                this.windGain.gain.setTargetAtTime(0.12, now, 1);
        }
        else {
            // 'nocturno' (Balanced)
            if (this.droneGain)
                this.droneGain.gain.setTargetAtTime(0.28, now, 1);
            if (this.windGain)
                this.windGain.gain.setTargetAtTime(0.35, now, 1);
        }
    }
    scheduleNextChime() {
        if (this.chimeTimer)
            window.clearTimeout(this.chimeTimer);
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
    triggerDistantChime(pitchMultiplier = 1) {
        const ctx = this.getAudioContext();
        if (!ctx || !this.masterGain)
            return;
        const baseFrequencies = [432, 540, 648, 864];
        const fundamental = baseFrequencies[Math.floor(Math.random() * baseFrequencies.length)] * pitchMultiplier;
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
    stop() {
        if (!this.ctx || !this.masterGain)
            return;
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
            }
            catch (err) {
                // Safe cleanup
            }
            this.isPlaying = false;
            this.notify();
        }, 1500);
    }
}
exports.atmosphericAudio = new AtmosphericAudioEngine();

};

// --- context/AmbientAudioContext.tsx ---
__modules["context/AmbientAudioContext.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAmbientAudio = exports.AmbientAudioProvider = void 0;
const react_1 = __importStar(require("react"));
const ambientAudio_ts_1 = require("utils/ambientAudio.ts");
const AmbientAudioContext = (0, react_1.createContext)(undefined);
const AmbientAudioProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [volume, setVolumeState] = (0, react_1.useState)(0.5);
    const [mode, setModeState] = (0, react_1.useState)('nocturno');
    const [isPanelOpen, setPanelOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Listen to changes from the procedural synthesizer
        const unsubscribe = ambientAudio_ts_1.atmosphericAudio.subscribe((playing, vol, currentMode) => {
            setIsPlaying(playing);
            setVolumeState(vol);
            setModeState(currentMode);
        });
        // Keyboard shortcut: Press 'm' or 'M' to toggle mute/play when not in an input field
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'm' &&
                !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) {
                ambientAudio_ts_1.atmosphericAudio.toggle();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            unsubscribe();
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const togglePlay = () => {
        ambientAudio_ts_1.atmosphericAudio.toggle();
    };
    const handleSetVolume = (val) => {
        ambientAudio_ts_1.atmosphericAudio.setVolume(val);
    };
    const handleSetMode = (newMode) => {
        ambientAudio_ts_1.atmosphericAudio.setMode(newMode);
    };
    const triggerChime = () => {
        if (isPlaying) {
            ambientAudio_ts_1.atmosphericAudio.triggerDistantChime(1.1);
        }
        else {
            // If paused, striking the bell will produce a single ephemeral chime without starting continuous playback
            ambientAudio_ts_1.atmosphericAudio.triggerDistantChime(1.0);
        }
    };
    const togglePanel = () => {
        setPanelOpen((prev) => !prev);
    };
    return (react_1.default.createElement(AmbientAudioContext.Provider, { value: {
            isPlaying,
            volume,
            mode,
            isPanelOpen,
            togglePlay,
            setVolume: handleSetVolume,
            setMode: handleSetMode,
            triggerChime,
            setPanelOpen,
            togglePanel,
        } }, children));
};
exports.AmbientAudioProvider = AmbientAudioProvider;
const useAmbientAudio = () => {
    const context = (0, react_1.useContext)(AmbientAudioContext);
    if (!context) {
        throw new Error('useAmbientAudio must be used within an AmbientAudioProvider');
    }
    return context;
};
exports.useAmbientAudio = useAmbientAudio;

};

// --- components/audio/AtmosphericAudioPlayer.tsx ---
__modules["components/audio/AtmosphericAudioPlayer.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtmosphericAudioPlayer = void 0;
const react_1 = __importStar(require("react"));
const AmbientAudioContext_tsx_1 = require("context/AmbientAudioContext.tsx");
const lucide_react_1 = require("lucide-react");
const AtmosphericAudioPlayer = () => {
    const { isPlaying, volume, mode, isPanelOpen, togglePlay, setVolume, setMode, triggerChime, togglePanel, setPanelOpen, } = (0, AmbientAudioContext_tsx_1.useAmbientAudio)();
    const [chimeRinging, setChimeRinging] = (0, react_1.useState)(false);
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
    return (react_1.default.createElement("aside", { "aria-label": "Reproductor de atm\u00F3sfera sonora", className: "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none flex flex-col items-end" },
        isPanelOpen && (react_1.default.createElement("div", { className: "mb-3 w-72 sm:w-80 p-5 rounded-none border border-[#00B3A4]/40 bg-[#0D1B2A]/95 backdrop-blur-md shadow-2xl text-left space-y-4 animate-fadeIn" },
            react_1.default.createElement("div", { className: "flex items-center justify-between pb-3 border-b border-[#E8D7A6]/20" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block font-bold" }, "Atm\u00F3sfera Ac\u00FAstica"),
                    react_1.default.createElement("h4", { className: "font-editorial text-lg text-[#E8D7A6] font-normal leading-tight" }, "Gabinete Sonoro")),
                react_1.default.createElement("button", { onClick: () => setPanelOpen(false), className: "p-1 text-[#E8D7A6]/60 hover:text-[#00B3A4] transition-colors", "aria-label": "Minimizar panel sonoro" },
                    react_1.default.createElement(lucide_react_1.X, { className: "w-4 h-4" }))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "text-[10px] font-mono tracking-widest uppercase text-[#00B3A4] block mb-2 font-bold" }, "Textura Sonora"),
                react_1.default.createElement("div", { className: "grid grid-cols-3 gap-1.5 p-1 bg-[#070F18] border border-[#7A7A7A]/30 text-[10px] font-clean" },
                    react_1.default.createElement("button", { onClick: () => setMode('nocturno'), className: `py-1.5 px-2 tracking-wider uppercase transition-all ${mode === 'nocturno'
                            ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] font-semibold'
                            : 'text-[#7A7A7A] hover:text-[#E8D7A6]'}` }, "Nocturno"),
                    react_1.default.createElement("button", { onClick: () => setMode('viento'), className: `py-1.5 px-2 tracking-wider uppercase transition-all ${mode === 'viento'
                            ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] font-semibold'
                            : 'text-[#7A7A7A] hover:text-[#E8D7A6]'}` }, "Viento"),
                    react_1.default.createElement("button", { onClick: () => setMode('campanas'), className: `py-1.5 px-2 tracking-wider uppercase transition-all ${mode === 'campanas'
                            ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] font-semibold'
                            : 'text-[#7A7A7A] hover:text-[#E8D7A6]'}` }, "Campanas")),
                react_1.default.createElement("p", { className: "text-[11px] font-editorial italic text-[#E8D7A6]/75 mt-1.5 leading-snug" }, modeDescriptions[mode])),
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: "flex items-center justify-between text-[10px] font-mono text-[#E8D7A6]/75 mb-1.5" },
                    react_1.default.createElement("span", { className: "uppercase tracking-widest text-[#00B3A4]" }, "Intensidad"),
                    react_1.default.createElement("span", null,
                        Math.round(volume * 100),
                        "%")),
                react_1.default.createElement("input", { type: "range", min: "0", max: "1", step: "0.02", value: volume, onChange: (e) => setVolume(parseFloat(e.target.value)), className: "w-full h-1 bg-[#070F18] rounded-none appearance-none cursor-pointer accent-[#00B3A4]", "aria-label": "Volumen del ambiente sonoro" })),
            react_1.default.createElement("div", { className: "pt-2 border-t border-[#7A7A7A]/20 flex items-center justify-between" },
                react_1.default.createElement("button", { onClick: handleManualChime, className: `px-3 py-1.5 border text-[10px] font-clean uppercase tracking-wider transition-all flex items-center gap-1.5 ${chimeRinging
                        ? 'border-[#00B3A4] bg-[#2A0E34] text-[#00B3A4]'
                        : 'border-[#7A7A7A]/40 text-[#E8D7A6] hover:border-[#00B3A4] hover:text-[#00B3A4]'}`, title: "Resonar campana de 432 Hz" },
                    react_1.default.createElement(lucide_react_1.Bell, { className: `w-3 h-3 text-[#00B3A4] ${chimeRinging ? 'animate-bounce' : ''}` }),
                    react_1.default.createElement("span", null, "Tocar campana (432Hz)")),
                react_1.default.createElement("span", { className: "text-[9px] font-mono text-[#7A7A7A]" }, "Tecla [M] mutear")))),
        react_1.default.createElement("div", { className: "flex items-center gap-2 p-1.5 border border-[#00B3A4]/40 bg-[#0D1B2A]/90 backdrop-blur-md shadow-2xl transition-all duration-300" },
            react_1.default.createElement("button", { onClick: togglePlay, className: `px-3 py-1.5 text-xs font-clean uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${isPlaying
                    ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] shadow-[0_0_12px_rgba(0,179,164,0.25)]'
                    : 'text-[#E8D7A6]/70 hover:text-[#00B3A4] hover:bg-[#152336]'}`, "aria-label": isPlaying ? 'Pausar atmósfera sonoro' : 'Activar atmósfera sonoro' }, isPlaying ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { className: "flex items-end gap-0.5 h-3" },
                    react_1.default.createElement("span", { className: "w-0.5 h-3 bg-[#00B3A4] animate-[pulse_1.2s_ease-in-out_infinite]" }),
                    react_1.default.createElement("span", { className: "w-0.5 h-2 bg-[#E8D7A6] animate-[pulse_0.8s_ease-in-out_infinite]" }),
                    react_1.default.createElement("span", { className: "w-0.5 h-2.5 bg-[#00B3A4] animate-[pulse_1.5s_ease-in-out_infinite]" })),
                react_1.default.createElement("span", { className: "text-[10px] font-mono font-medium" }, "Atm\u00F3sfera Activa"))) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(lucide_react_1.VolumeX, { className: "w-3.5 h-3.5 text-[#7A7A7A]" }),
                react_1.default.createElement("span", { className: "text-[10px] font-mono" }, "Sonido [M]")))),
            react_1.default.createElement("button", { onClick: handleManualChime, className: "p-1.5 text-[#E8D7A6]/70 hover:text-[#00B3A4] hover:bg-[#152336] transition-colors", title: "Tocar campana", "aria-label": "Tocar campana arm\u00F3nica" },
                react_1.default.createElement(lucide_react_1.Bell, { className: "w-3.5 h-3.5 text-[#00B3A4]" })),
            react_1.default.createElement("button", { onClick: togglePanel, className: `p-1.5 transition-colors ${isPanelOpen
                    ? 'text-[#00B3A4] bg-[#2A0E34]'
                    : 'text-[#E8D7A6]/60 hover:text-[#00B3A4] hover:bg-[#152336]'}`, title: "Ajustes de atm\u00F3sfera sonora", "aria-label": "Abrir panel de opciones de sonido" },
                react_1.default.createElement(lucide_react_1.Sliders, { className: "w-3.5 h-3.5" })))));
};
exports.AtmosphericAudioPlayer = AtmosphericAudioPlayer;

};

// --- components/ui/OrbitalCursor.tsx ---
__modules["components/ui/OrbitalCursor.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrbitalCursor = void 0;
const react_1 = __importStar(require("react"));
const PALETTE_COLORS = [
    'rgba(232, 215, 166, ', // #E8D7A6 Crema / dorado claro (oro faraónico)
    'rgba(0, 179, 164, ', // #00B3A4 Turquesa (lapislázuli / fayenza egipcia)
    'rgba(42, 14, 52, ', // #2A0E34 Violeta profundo (misterio sacerdotal)
    'rgba(122, 122, 122, ', // #7A7A7A Gris piedra (basalto / papiro)
    'rgba(13, 27, 42, ', // #0D1B2A Azul noche (firmamento de Nut)
];
/**
 * EgyptianOrbitalCursor
 *
 * An artistic Egyptian symbolic cursor fusing sacred geometry from ancient dynasties:
 * - Center Point: The All-Seeing Eye of Horus (Udyat) / Solar Disk of Ra in Cream Gold & Turquoise.
 * - Inertial Reticle: An Egyptian cartouche / winged solar disk astrolabe with sacred cardinal hieroglyphs,
 *   ouroboros / sundial markings, and feather of Ma'at orientation.
 * - Stardust Trail: Sacred incense dust (Kyphi) & gold leaf embers drifting organically behind cursor movement.
 */
const OrbitalCursor = () => {
    const [pos, setPos] = (0, react_1.useState)({ x: -100, y: -100 });
    const [trail, setTrail] = (0, react_1.useState)({ x: -100, y: -100 });
    const [isPointer, setIsPointer] = (0, react_1.useState)(false);
    const [isMouseDown, setIsMouseDown] = (0, react_1.useState)(false);
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const canvasRef = (0, react_1.useRef)(null);
    const particlesRef = (0, react_1.useRef)([]);
    const lastPosRef = (0, react_1.useRef)({ x: -100, y: -100 });
    const isPointerRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        isPointerRef.current = isPointer;
    }, [isPointer]);
    (0, react_1.useEffect)(() => {
        // Only enable on desktop pointer devices
        const media = window.matchMedia('(pointer: fine)');
        if (!media.matches)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let animationFrameId;
        let isWindowActive = true;
        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
        const spawnParticles = (currentX, currentY, interactive) => {
            const dx = currentX - lastPosRef.current.x;
            const dy = currentY - lastPosRef.current.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 4)
                return;
            const count = interactive ? (Math.random() < 0.65 ? 2 : 1) : (Math.random() < 0.4 ? 1 : 0);
            if (count === 0 && Math.random() > 0.3)
                return;
            for (let i = 0; i < Math.max(1, count); i++) {
                const angle = Math.random() * Math.PI * 2;
                const dispersionRadius = Math.random() * (interactive ? 22 : 14);
                const px = currentX + Math.cos(angle) * dispersionRadius;
                const py = currentY + Math.sin(angle) * dispersionRadius;
                const colorBase = interactive
                    ? (Math.random() < 0.5 ? PALETTE_COLORS[0] : Math.random() < 0.8 ? PALETTE_COLORS[1] : PALETTE_COLORS[2])
                    : PALETTE_COLORS[Math.floor(Math.random() * PALETTE_COLORS.length)];
                particlesRef.current.push({
                    x: px,
                    y: py,
                    vx: (Math.random() - 0.5) * 0.55 - dx * 0.04,
                    vy: (Math.random() - 0.5) * 0.55 - dy * 0.04 - 0.16, // incense smoke drift
                    size: Math.random() * (interactive ? 1.9 : 1.3) + 0.6,
                    alpha: Math.random() * 0.5 + 0.35,
                    decay: Math.random() * 0.016 + 0.012,
                    color: colorBase,
                    isGlint: Math.random() < 0.18,
                });
            }
            if (particlesRef.current.length > 60) {
                particlesRef.current.splice(0, particlesRef.current.length - 60);
            }
            lastPosRef.current = { x: currentX, y: currentY };
        };
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            setPos({ x, y });
            setIsVisible(true);
            const target = e.target;
            if (target) {
                const interactive = Boolean(target.tagName === 'BUTTON' ||
                    target.tagName === 'A' ||
                    target.tagName === 'INPUT' ||
                    target.tagName === 'SELECT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.closest('button') ||
                    target.closest('a') ||
                    target.closest('[role="button"]') ||
                    target.closest('[role="tab"]') ||
                    target.closest('[data-cursor-interactive="true"]') ||
                    target.classList.contains('cursor-pointer') ||
                    window.getComputedStyle(target).cursor === 'pointer');
                setIsPointer(interactive);
                spawnParticles(x, y, interactive);
            }
            else {
                spawnParticles(x, y, false);
            }
        };
        const handleMouseDown = () => setIsMouseDown(true);
        const handleMouseUp = () => setIsMouseDown(false);
        const handleMouseLeave = () => {
            isWindowActive = false;
            setIsVisible(false);
        };
        const handleMouseEnter = () => {
            isWindowActive = true;
            setIsVisible(true);
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        const renderLoop = () => {
            if (!isWindowActive) {
                animationFrameId = requestAnimationFrame(renderLoop);
                return;
            }
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                if (p.alpha <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }
                ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                // Delicate glint cross (hieroglyphic star motif)
                if (p.isGlint && p.alpha > 0.25) {
                    ctx.strokeStyle = `rgba(232, 215, 166, ${p.alpha * 0.8})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x - p.size * 2.2, p.y);
                    ctx.lineTo(p.x + p.size * 2.2, p.y);
                    ctx.moveTo(p.x, p.y - p.size * 2.2);
                    ctx.lineTo(p.x, p.y + p.size * 2.2);
                    ctx.stroke();
                }
            }
            // Smooth inertia for trailing Egyptian talisman ring
            setTrail((prev) => ({
                x: prev.x + (pos.x - prev.x) * 0.18,
                y: prev.y + (pos.y - prev.y) * 0.18,
            }));
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        animationFrameId = requestAnimationFrame(renderLoop);
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            cancelAnimationFrame(animationFrameId);
        };
    }, [pos.x, pos.y]);
    if (!isVisible)
        return null;
    return (react_1.default.createElement("div", { className: "pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block" },
        react_1.default.createElement("canvas", { ref: canvasRef, className: "pointer-events-none absolute inset-0 z-0" }),
        react_1.default.createElement("div", { className: `fixed transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-10 flex items-center justify-center ${isMouseDown
                ? 'w-10 h-10 scale-90'
                : isPointer
                    ? 'w-14 h-14 scale-110'
                    : 'w-9 h-9'}`, style: {
                left: `${trail.x}px`,
                top: `${trail.y}px`,
            } },
            react_1.default.createElement("svg", { viewBox: "0 0 60 60", className: `w-full h-full transition-transform duration-700 ${isPointer ? 'rotate-45' : 'rotate-0'}`, fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                react_1.default.createElement("circle", { cx: "30", cy: "30", r: "26", stroke: isPointer ? '#00B3A4' : '#E8D7A6', strokeWidth: "0.8", strokeDasharray: isPointer ? '2 3' : '3 4', opacity: isPointer ? 0.9 : 0.45, className: "animate-[spin_40s_linear_infinite]" }),
                react_1.default.createElement("circle", { cx: "30", cy: "30", r: "19", stroke: "#7A7A7A", strokeWidth: "0.6", opacity: 0.35 }),
                react_1.default.createElement("line", { x1: "30", y1: "2", x2: "30", y2: "9", stroke: "#E8D7A6", strokeWidth: "0.9", opacity: 0.8 }),
                react_1.default.createElement("line", { x1: "30", y1: "51", x2: "30", y2: "58", stroke: "#E8D7A6", strokeWidth: "0.9", opacity: 0.8 }),
                react_1.default.createElement("line", { x1: "2", y1: "30", x2: "9", y2: "30", stroke: "#E8D7A6", strokeWidth: "0.9", opacity: 0.8 }),
                react_1.default.createElement("line", { x1: "51", y1: "30", x2: "58", y2: "30", stroke: "#E8D7A6", strokeWidth: "0.9", opacity: 0.8 }),
                isPointer && (react_1.default.createElement("g", { opacity: "0.85" },
                    react_1.default.createElement("circle", { cx: "30", cy: "5", r: "1.5", fill: "#00B3A4" }),
                    react_1.default.createElement("circle", { cx: "30", cy: "55", r: "1.5", fill: "#00B3A4" }),
                    react_1.default.createElement("circle", { cx: "5", cy: "30", r: "1.5", fill: "#00B3A4" }),
                    react_1.default.createElement("circle", { cx: "55", cy: "30", r: "1.5", fill: "#00B3A4" }),
                    react_1.default.createElement("polygon", { points: "30,12 48,30 30,48 12,30", stroke: "#00B3A4", strokeWidth: "0.7", fill: "#2A0E34", fillOpacity: "0.25" }))))),
        react_1.default.createElement("div", { className: "fixed transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-transform duration-200", style: {
                left: `${pos.x}px`,
                top: `${pos.y}px`,
            } },
            react_1.default.createElement("svg", { width: isPointer ? '26' : '20', height: isPointer ? '26' : '20', viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "transition-all duration-200 drop-shadow-[0_0_6px_rgba(0,179,164,0.6)]" },
                react_1.default.createElement("path", { d: "M 3 9 C 7 5, 17 5, 21 9", stroke: isPointer ? '#00B3A4' : '#E8D7A6', strokeWidth: "1.2", strokeLinecap: "round" }),
                react_1.default.createElement("path", { d: "M 4 10 C 8 6, 16 6, 20 10 C 16 14, 8 14, 4 10 Z", stroke: isPointer ? '#00B3A4' : '#E8D7A6', strokeWidth: "1", fill: isPointer ? '#2A0E34' : 'transparent' }),
                react_1.default.createElement("circle", { cx: "12", cy: "10", r: isMouseDown ? '2' : isPointer ? '2.5' : '1.8', fill: isPointer ? '#00B3A4' : '#E8D7A6' }),
                react_1.default.createElement("path", { d: "M 12 14 L 12 19", stroke: isPointer ? '#00B3A4' : '#E8D7A6', strokeWidth: "1", strokeLinecap: "round" }),
                react_1.default.createElement("path", { d: "M 15 13 C 17 15, 17 17, 15 18 C 13.5 19, 13 18, 14 17", stroke: isPointer ? '#00B3A4' : '#7A7A7A', strokeWidth: "0.8", strokeLinecap: "round" })))));
};
exports.OrbitalCursor = OrbitalCursor;

};

// --- components/ui/MagneticButton.tsx ---
__modules["components/ui/MagneticButton.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagneticButton = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("motion/react");
/**
 * MagneticButton
 *
 * Implements a subtle physical magnetic attraction pull towards the user's cursor
 * when hovered or when the pointer enters its immediate orbital proximity.
 * Uses Framer Motion springs for physical inertia, dampening, and smooth release.
 */
const MagneticButton = ({ children, onClick, className = '', type = 'button', disabled = false, strength = 0.28, radius = 65, ariaLabel, }) => {
    const ref = (0, react_1.useRef)(null);
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    // Physics-based spring values for smooth magnetic pull and elastic release
    const springConfig = { damping: 18, stiffness: 180, mass: 0.4 };
    const x = (0, react_2.useSpring)(0, springConfig);
    const y = (0, react_2.useSpring)(0, springConfig);
    const handleMouseMove = (e) => {
        if (disabled || !ref.current)
            return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        x.set(deltaX);
        y.set(deltaY);
    };
    const handleMouseEnter = () => {
        if (disabled)
            return;
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };
    return (react_1.default.createElement(react_2.motion.button, { ref: ref, type: type, disabled: disabled, onClick: onClick, onMouseMove: handleMouseMove, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, style: { x, y }, "aria-label": ariaLabel, className: `relative inline-flex items-center justify-center transition-shadow duration-300 ${className} ${isHovered ? 'md:cursor-none' : ''}` },
        react_1.default.createElement("span", { className: "relative z-10 flex items-center justify-center w-full gap-2" }, children)));
};
exports.MagneticButton = MagneticButton;

};

// --- services/supabase.ts ---
__modules["services/supabase.ts"] = function(exports, require, module) {
"use strict";
/**
 * Capa de integración ligera con Supabase (Storage & Database REST API)
 *
 * - No requiere modificar credenciales existentes ni rompe la aplicación si las
 *   variables de entorno aún no están configuradas.
 * - Cuando VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY están presentes en el entorno,
 *   habilita la carga de fotografías/videos desde Supabase Storage y la sincronización
 *   de datos y reservas con Supabase Database sin duplicar estructuras existentes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoAsset = exports.getSupabaseStorageUrl = exports.isSupabaseConfigured = exports.SUPABASE_ANON_KEY = exports.SUPABASE_URL = void 0;
exports.fetchSupabaseTable = fetchSupabaseTable;
exports.insertSupabaseRecord = insertSupabaseRecord;
const getEnvVar = (key) => {
    try {
        const env = ({ env: window.__NARMER_ENV__ || {} }).env;
        return env?.[key]?.trim() || '';
    }
    catch {
        return '';
    }
};
exports.SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
exports.SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');
const isSupabaseConfigured = () => {
    return Boolean(exports.SUPABASE_URL &&
        exports.SUPABASE_ANON_KEY &&
        exports.SUPABASE_URL.startsWith('http') &&
        !exports.SUPABASE_URL.includes('YOUR_') &&
        !exports.SUPABASE_ANON_KEY.includes('YOUR_'));
};
exports.isSupabaseConfigured = isSupabaseConfigured;
/**
 * Construye la URL pública de un archivo (fotografía o video) alojado en Supabase Storage.
 * Si `pathOrUrl` ya es una URL completa (http/https), la devuelve directamente.
 */
const getSupabaseStorageUrl = (bucket, pathOrUrl) => {
    if (!pathOrUrl)
        return null;
    const trimmed = pathOrUrl.trim();
    if (!trimmed)
        return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
        return trimmed;
    }
    if (!exports.SUPABASE_URL || !exports.SUPABASE_URL.startsWith('http')) {
        return null;
    }
    const baseUrl = exports.SUPABASE_URL.replace(/\/+$/, '');
    const cleanBucket = bucket.replace(/^\/+|\/+$/g, '');
    const cleanPath = trimmed.replace(/^\/+/, '');
    return `${baseUrl}/storage/v1/object/public/${cleanBucket}/${cleanPath}`;
};
exports.getSupabaseStorageUrl = getSupabaseStorageUrl;
/**
 * Detecta si una URL o nombre de archivo corresponde a un recurso de video.
 */
const isVideoAsset = (urlOrPath) => {
    if (!urlOrPath)
        return false;
    const clean = urlOrPath.split('?')[0].toLowerCase();
    return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.endsWith('.ogg');
};
exports.isVideoAsset = isVideoAsset;
/**
 * Consulta registros de una tabla en Supabase Database mediante PostgREST.
 * Devuelve `null` de forma silenciosa si Supabase no está configurado o si ocurre un error,
 * permitiendo que los componentes conserven sus datos editoriales originales sin duplicarlos.
 */
async function fetchSupabaseTable(table, queryParams = 'select=*') {
    if (!(0, exports.isSupabaseConfigured)())
        return null;
    try {
        const baseUrl = exports.SUPABASE_URL.replace(/\/+$/, '');
        const response = await fetch(`${baseUrl}/rest/v1/${table}?${queryParams}`, {
            method: 'GET',
            headers: {
                apikey: exports.SUPABASE_ANON_KEY,
                Authorization: `Bearer ${exports.SUPABASE_ANON_KEY}`,
                Accept: 'application/json',
            },
        });
        if (!response.ok)
            return null;
        const data = await response.json();
        return Array.isArray(data) && data.length > 0 ? data : null;
    }
    catch {
        return null;
    }
}
/**
 * Inserta un registro en una tabla de Supabase Database (ej. reservas de sesiones o consultas).
 * Operación segura y no bloqueante.
 */
async function insertSupabaseRecord(table, payload) {
    if (!(0, exports.isSupabaseConfigured)()) {
        return { ok: false, error: 'Supabase no configurado aún' };
    }
    try {
        const baseUrl = exports.SUPABASE_URL.replace(/\/+$/, '');
        const response = await fetch(`${baseUrl}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
                apikey: exports.SUPABASE_ANON_KEY,
                Authorization: `Bearer ${exports.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                Prefer: 'return=minimal',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            return { ok: false, error: `HTTP ${response.status}` };
        }
        return { ok: true };
    }
    catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Error de red' };
    }
}

};

// --- components/ui/NarmerLogo.tsx ---
__modules["components/ui/NarmerLogo.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarmerLogo = exports.NarmerEmblemSvg = void 0;
const react_1 = __importStar(require("react"));
const supabase_ts_1 = require("services/supabase.ts");
const LOCAL_STORAGE_LOGO_KEY = 'narmer_brand_logo_img';
/**
 * NarmerEmblemSvg - High fidelity vector recreation of the Celestial Emblem:
 * - Upper crescent moon with golden bead drop
 * - Radiant 8-point celestial star of Ishtar / Sirius
 * - Radiant sun disk with 16 rays & golden sphere
 * - Double infinity / sacred loop in Turquoise (#00B3A4) and Gold (#E8D7A6)
 * - Flanking crescent moons with turquoise stars
 * - Central golden diamond star
 * - Lower dark sphere with golden crescent rim
 * - "NARMER" classical serif logotype
 * - "TAROT Y PSICOASTROLOGÍA" subtitle with turquoise center star
 */
const NarmerEmblemSvg = ({ className = '', showText = true, }) => {
    return (react_1.default.createElement("svg", { viewBox: showText ? '0 0 500 520' : '0 0 500 400', className: className, fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid meet" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("linearGradient", { id: "goldGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
                react_1.default.createElement("stop", { offset: "0%", stopColor: "#F9F1DC" }),
                react_1.default.createElement("stop", { offset: "50%", stopColor: "#D4AF37" }),
                react_1.default.createElement("stop", { offset: "100%", stopColor: "#AA7C11" })),
            react_1.default.createElement("linearGradient", { id: "turqGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
                react_1.default.createElement("stop", { offset: "0%", stopColor: "#00E5D0" }),
                react_1.default.createElement("stop", { offset: "60%", stopColor: "#00B3A4" }),
                react_1.default.createElement("stop", { offset: "100%", stopColor: "#006660" })),
            react_1.default.createElement("radialGradient", { id: "sunGrad", cx: "40%", cy: "40%", r: "60%" },
                react_1.default.createElement("stop", { offset: "0%", stopColor: "#FFF2D6" }),
                react_1.default.createElement("stop", { offset: "50%", stopColor: "#E2BD5A" }),
                react_1.default.createElement("stop", { offset: "100%", stopColor: "#9E761C" }))),
        react_1.default.createElement("g", { transform: "translate(250, 45)" },
            react_1.default.createElement("path", { d: "M -30,-22 C -18,12 18,12 30,-22 C 20,-5 -20,-5 -30,-22 Z", fill: "url(#goldGrad)", stroke: "#AA7C11", strokeWidth: "0.8" }),
            react_1.default.createElement("line", { x1: "0", y1: "6", x2: "0", y2: "16", stroke: "url(#goldGrad)", strokeWidth: "1.5" }),
            react_1.default.createElement("circle", { cx: "0", cy: "18", r: "4.5", fill: "url(#goldGrad)" })),
        react_1.default.createElement("g", { transform: "translate(250, 95)", fill: "url(#goldGrad)" },
            react_1.default.createElement("polygon", { points: "250,75 254,95 250,115 246,95", transform: "translate(-250, -95)" }),
            react_1.default.createElement("polygon", { points: "230,95 250,91 270,95 250,99", transform: "translate(-250, -95)" }),
            react_1.default.createElement("polygon", { points: "236,81 250,93 264,109 250,97", transform: "translate(-250, -95)", opacity: "0.85" }),
            react_1.default.createElement("polygon", { points: "264,81 250,93 236,109 250,97", transform: "translate(-250, -95)", opacity: "0.85" }),
            react_1.default.createElement("circle", { cx: "0", cy: "0", r: "2.5", fill: "#FFF2D6" })),
        react_1.default.createElement("circle", { cx: "250", cy: "210", r: "115", stroke: "url(#goldGrad)", strokeWidth: "1", strokeDasharray: "2 6", opacity: "0.65" }),
        react_1.default.createElement("g", { transform: "translate(135, 210)" },
            react_1.default.createElement("circle", { cx: "-16", cy: "0", r: "3", fill: "url(#goldGrad)" }),
            react_1.default.createElement("circle", { cx: "-10", cy: "0", r: "2", fill: "url(#goldGrad)" }),
            react_1.default.createElement("path", { d: "M 12,-16 C -3,-10 -3,10 12,16 C 4,10 4,-10 12,-16 Z", fill: "url(#goldGrad)", stroke: "#AA7C11", strokeWidth: "0.8" }),
            react_1.default.createElement("g", { transform: "translate(28, 0)", fill: "url(#turqGrad)" },
                react_1.default.createElement("polygon", { points: "0,-9 2.5,0 0,9 -2.5,0" }),
                react_1.default.createElement("polygon", { points: "-7,0 0,2 7,0 0,-2" }))),
        react_1.default.createElement("g", { transform: "translate(365, 210)" },
            react_1.default.createElement("path", { d: "M -12,-16 C 3,-10 3,10 -12,16 C -4,10 -4,-10 -12,-16 Z", fill: "url(#goldGrad)", stroke: "#AA7C11", strokeWidth: "0.8" }),
            react_1.default.createElement("circle", { cx: "10", cy: "0", r: "2", fill: "url(#goldGrad)" }),
            react_1.default.createElement("circle", { cx: "16", cy: "0", r: "3", fill: "url(#goldGrad)" }),
            react_1.default.createElement("g", { transform: "translate(-28, 0)", fill: "url(#turqGrad)" },
                react_1.default.createElement("polygon", { points: "0,-9 2.5,0 0,9 -2.5,0" }),
                react_1.default.createElement("polygon", { points: "-7,0 0,2 7,0 0,-2" }))),
        react_1.default.createElement("g", { transform: "translate(250, 160)" },
            react_1.default.createElement("g", { stroke: "url(#goldGrad)", strokeWidth: "1.2" }, Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                const isLong = i % 2 === 0;
                const r1 = 22;
                const r2 = isLong ? 38 : 30;
                const rad = (angle * Math.PI) / 180;
                return (react_1.default.createElement("line", { key: i, x1: Math.cos(rad) * r1, y1: Math.sin(rad) * r1, x2: Math.cos(rad) * r2, y2: Math.sin(rad) * r2 }));
            })),
            react_1.default.createElement("circle", { cx: "0", cy: "0", r: "18", fill: "url(#sunGrad)", stroke: "#AA7C11", strokeWidth: "0.8" })),
        react_1.default.createElement("path", { d: "M 160,140 C 130,200 130,260 160,310 C 180,340 220,360 250,360 C 220,360 180,340 160,310", stroke: "url(#goldGrad)", strokeWidth: "2.5", fill: "none" }),
        react_1.default.createElement("path", { d: "M 340,140 C 370,200 370,260 340,310 C 320,340 280,360 250,360 C 280,360 320,340 340,310", stroke: "url(#goldGrad)", strokeWidth: "2.5", fill: "none" }),
        react_1.default.createElement("path", { d: "M 195,120 \n           C 170,160 185,210 225,230 \n           C 275,255 315,290 310,340 \n           C 305,360 285,370 260,370 \n           C 290,370 325,350 325,315 \n           C 325,270 280,240 240,218 \n           C 195,195 180,155 205,120 Z", fill: "url(#turqGrad)", stroke: "#006660", strokeWidth: "1" }),
        react_1.default.createElement("path", { d: "M 305,120 \n           C 330,160 315,210 275,230 \n           C 225,255 185,290 190,340 \n           C 195,360 215,370 240,370 \n           C 210,370 175,350 175,315 \n           C 175,270 220,240 260,218 \n           C 305,195 320,155 295,120 Z", fill: "url(#turqGrad)", stroke: "#006660", strokeWidth: "1" }),
        react_1.default.createElement("path", { d: "M 195,120 C 170,160 185,210 225,230 C 275,255 315,290 310,340", stroke: "url(#goldGrad)", strokeWidth: "2.5", fill: "none" }),
        react_1.default.createElement("path", { d: "M 305,120 C 330,160 315,210 275,230 C 225,255 185,290 190,340", stroke: "url(#goldGrad)", strokeWidth: "2.5", fill: "none" }),
        react_1.default.createElement("g", { transform: "translate(250, 275)" },
            react_1.default.createElement("polygon", { points: "0,-22 18,0 0,22 -18,0", fill: "url(#goldGrad)", stroke: "#AA7C11", strokeWidth: "0.8" }),
            react_1.default.createElement("polygon", { points: "0,-16 12,0 0,16 -12,0", fill: "#FFF2D6", opacity: "0.6" }),
            react_1.default.createElement("line", { x1: "0", y1: "22", x2: "0", y2: "35", stroke: "url(#goldGrad)", strokeWidth: "1.5" }),
            react_1.default.createElement("circle", { cx: "0", cy: "38", r: "4.5", fill: "url(#goldGrad)" }),
            react_1.default.createElement("circle", { cx: "0", cy: "50", r: "3.5", fill: "url(#goldGrad)" }),
            react_1.default.createElement("circle", { cx: "0", cy: "68", r: "16", fill: "#0C1B2B", stroke: "url(#goldGrad)", strokeWidth: "2.5" }),
            react_1.default.createElement("path", { d: "M -12,68 A 12,12 0 0,0 8,80 A 14,14 0 0,1 -12,68 Z", fill: "url(#goldGrad)" })),
        showText && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("g", { transform: "translate(250, 440)" },
                react_1.default.createElement("text", { x: "0", y: "0", fill: "url(#goldGrad)", fontSize: "68", fontFamily: "'Cinzel', 'Times New Roman', serif", fontWeight: "600", letterSpacing: "14", textAnchor: "middle" }, "NARMER")),
            react_1.default.createElement("g", { transform: "translate(250, 470)" },
                react_1.default.createElement("line", { x1: "-155", y1: "0", x2: "-25", y2: "0", stroke: "url(#goldGrad)", strokeWidth: "1.8" }),
                react_1.default.createElement("circle", { cx: "-160", cy: "0", r: "2", fill: "url(#goldGrad)" }),
                react_1.default.createElement("circle", { cx: "-15", cy: "0", r: "3.5", fill: "url(#turqGrad)", stroke: "#AA7C11", strokeWidth: "0.8" }),
                react_1.default.createElement("g", { fill: "url(#turqGrad)" },
                    react_1.default.createElement("polygon", { points: "0,-12 4,0 0,12 -4,0" }),
                    react_1.default.createElement("polygon", { points: "-10,0 0,3 10,0 0,-3" })),
                react_1.default.createElement("circle", { cx: "15", cy: "0", r: "3.5", fill: "url(#turqGrad)", stroke: "#AA7C11", strokeWidth: "0.8" }),
                react_1.default.createElement("line", { x1: "25", y1: "0", x2: "155", y2: "0", stroke: "url(#goldGrad)", strokeWidth: "1.8" }),
                react_1.default.createElement("circle", { cx: "160", cy: "0", r: "2", fill: "url(#goldGrad)" })),
            react_1.default.createElement("g", { transform: "translate(250, 505)" },
                react_1.default.createElement("text", { x: "0", y: "0", fill: "url(#goldGrad)", fontSize: "16.5", fontFamily: "'Cinzel', 'Times New Roman', sans-serif", fontWeight: "500", letterSpacing: "8", textAnchor: "middle" }, "TAROT Y PSICOASTROLOG\u00CDA"))))));
};
exports.NarmerEmblemSvg = NarmerEmblemSvg;
const NarmerLogo = ({ className = '', size = 'md', showSubtitle = true, storagePath = 'narmer_logo.png', }) => {
    const candidateSources = react_1.default.useMemo(() => {
        const list = [];
        try {
            const localCustom = localStorage.getItem(LOCAL_STORAGE_LOGO_KEY);
            if (localCustom)
                list.push(localCustom);
        }
        catch {
            // Ignore storage access errors
        }
        const supaLogo = (0, supabase_ts_1.getSupabaseStorageUrl)('brand', storagePath);
        if (supaLogo)
            list.push(supaLogo);
        list.push('/cards/narmer_logo.png');
        return list;
    }, [storagePath]);
    const [srcIndex, setSrcIndex] = (0, react_1.useState)(0);
    const [hasError, setHasError] = (0, react_1.useState)(false);
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16 sm:w-20 sm:h-20',
        lg: 'w-32 h-32 sm:w-40 sm:h-40',
        xl: 'w-48 h-48 sm:w-64 sm:h-64',
    }[size];
    const activeSrc = !hasError ? candidateSources[srcIndex] : null;
    const handleImgError = () => {
        if (srcIndex + 1 < candidateSources.length) {
            setSrcIndex((prev) => prev + 1);
        }
        else {
            setHasError(true);
        }
    };
    return (react_1.default.createElement("div", { className: `relative inline-flex items-center justify-center shrink-0 ${className}` }, activeSrc && !hasError ? (react_1.default.createElement("img", { src: activeSrc, alt: "Emblema Celestial NARMER en Oro y Turquesa", referrerPolicy: "no-referrer", onError: handleImgError, className: `${sizeClasses} object-contain select-none filter drop-shadow-[0_4px_16px_rgba(0,179,164,0.35)]` })) : (react_1.default.createElement(exports.NarmerEmblemSvg, { showText: showSubtitle, className: `${sizeClasses} filter drop-shadow-[0_4px_16px_rgba(0,179,164,0.35)]` }))));
};
exports.NarmerLogo = NarmerLogo;

};

// --- components/layout/NavbarEditorial.tsx ---
__modules["components/layout/NavbarEditorial.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavbarEditorial = void 0;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const AmbientAudioContext_tsx_1 = require("context/AmbientAudioContext.tsx");
const MagneticButton_tsx_1 = require("components/ui/MagneticButton.tsx");
const NarmerLogo_tsx_1 = require("components/ui/NarmerLogo.tsx");
const NavbarEditorial = ({ onOpenBooking }) => {
    const [isScrolled, setIsScrolled] = (0, react_1.useState)(false);
    const [mobileMenuOpen, setMobileMenuOpen] = (0, react_1.useState)(false);
    const { isPlaying, togglePlay, togglePanel } = (0, AmbientAudioContext_tsx_1.useAmbientAudio)();
    (0, react_1.useEffect)(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("header", { className: `fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled
                ? 'bg-[#0D1B2A]/92 backdrop-blur-md border-b border-[#E8D7A6]/15 py-3.5'
                : 'bg-transparent py-6'}` },
            react_1.default.createElement("div", { className: "max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between" },
                react_1.default.createElement("a", { href: "#", className: "flex items-center gap-3 group" },
                    react_1.default.createElement(NarmerLogo_tsx_1.NarmerLogo, { size: "sm", showSubtitle: false, className: "group-hover:scale-105 transition-transform" }),
                    react_1.default.createElement("div", { className: "flex flex-col" },
                        react_1.default.createElement("span", { className: "font-editorial text-lg sm:text-xl tracking-[0.22em] text-[#E8D7A6] group-hover:text-[#00B3A4] transition-colors font-medium leading-none" }, "NARMER"),
                        react_1.default.createElement("span", { className: "font-mono text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-[#00B3A4] opacity-90 mt-1" }, "Tarot y Psicoastrolog\u00EDa"))),
                react_1.default.createElement("nav", { className: "hidden lg:flex items-center gap-6 xl:gap-9 text-[11px] xl:text-xs font-clean font-light tracking-[0.18em] xl:tracking-[0.2em] uppercase text-[#E8D7A6]/75" },
                    react_1.default.createElement("a", { href: "#tarot", className: "hover:text-[#00B3A4] transition-colors whitespace-nowrap" }, "Tarot"),
                    react_1.default.createElement("a", { href: "#oraculo", className: "hover:text-[#00B3A4] transition-colors whitespace-nowrap" }, "Or\u00E1culo"),
                    react_1.default.createElement("a", { href: "#psicoastrologia", className: "hover:text-[#00B3A4] transition-colors whitespace-nowrap" }, "Psicoastrolog\u00EDa"),
                    react_1.default.createElement("a", { href: "#sesiones", className: "hover:text-[#00B3A4] transition-colors whitespace-nowrap" }, "Sesiones"),
                    react_1.default.createElement("a", { href: "#testimonios", className: "hover:text-[#00B3A4] transition-colors whitespace-nowrap" }, "Resonancias"),
                    react_1.default.createElement("a", { href: "#espacio", className: "hover:text-[#00B3A4] transition-colors whitespace-nowrap" }, "El espacio"),
                    react_1.default.createElement("a", { href: "#cuaderno", className: "hover:text-[#00B3A4] transition-colors whitespace-nowrap" }, "Cuaderno")),
                react_1.default.createElement("div", { className: "flex items-center gap-3 sm:gap-5" },
                    react_1.default.createElement("div", { className: "flex items-center gap-1" },
                        react_1.default.createElement("button", { onClick: togglePlay, className: `p-2 rounded-full border transition-all text-[11px] font-mono flex items-center gap-1.5 ${isPlaying
                                ? 'border-[#00B3A4] text-[#E8D7A6] bg-[#2A0E34]/80 shadow-[0_0_12px_rgba(0,179,164,0.3)]'
                                : 'border-[#E8D7A6]/25 text-[#E8D7A6]/60 hover:text-[#00B3A4] hover:border-[#00B3A4]'}`, title: isPlaying ? 'Pausar atmósfera sonoro' : 'Activar atmósfera sonoro (Viento & Campanas)', "aria-label": "Alternar sonido ambiental" }, isPlaying ? (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(lucide_react_1.Volume2, { className: "w-3.5 h-3.5 text-[#00B3A4]" }),
                            react_1.default.createElement("span", { className: "hidden lg:inline text-[9px] tracking-widest uppercase" }, "Atm\u00F3sfera ON"))) : (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(lucide_react_1.VolumeX, { className: "w-3.5 h-3.5" }),
                            react_1.default.createElement("span", { className: "hidden lg:inline text-[9px] tracking-widest uppercase" }, "Atm\u00F3sfera")))),
                        react_1.default.createElement("button", { onClick: togglePanel, className: "hidden sm:inline-flex p-1.5 text-[#E8D7A6]/50 hover:text-[#00B3A4] transition-colors", title: "Ajustes de sonido (Viento / Campanas / Volumen)", "aria-label": "Abrir panel de sonido" },
                            react_1.default.createElement(lucide_react_1.Sliders, { className: "w-3 h-3" }))),
                    react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { onClick: onOpenBooking, strength: 0.25, className: "px-4 py-2 border border-[#00B3A4]/60 bg-[#2A0E34]/30 hover:bg-[#2A0E34] hover:border-[#00B3A4] text-[#E8D7A6] font-clean text-[11px] tracking-[0.22em] uppercase transition-all duration-300" }, "Reservar"),
                    react_1.default.createElement("button", { onClick: () => setMobileMenuOpen(true), className: "lg:hidden p-2 text-[#E8D7A6] hover:text-[#00B3A4] transition-colors", "aria-label": "Abrir men\u00FA" },
                        react_1.default.createElement(lucide_react_1.Menu, { className: "w-5 h-5" }))))),
        mobileMenuOpen && (react_1.default.createElement("div", { className: "fixed inset-0 z-50 bg-[#0D1B2A] flex flex-col justify-between p-6 sm:p-8 text-left animate-fadeIn overflow-y-auto" },
            react_1.default.createElement("div", { className: "flex items-center justify-between pb-5 border-b border-[#E8D7A6]/20" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "font-editorial text-2xl tracking-[0.25em] text-[#E8D7A6]" }, "NARMER"),
                    react_1.default.createElement("span", { className: "block font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4]" }, "Gabinete Simb\u00F3lico")),
                react_1.default.createElement("button", { onClick: () => setMobileMenuOpen(false), className: "p-2 text-[#E8D7A6]/70 hover:text-[#E8D7A6]", "aria-label": "Cerrar men\u00FA" },
                    react_1.default.createElement(lucide_react_1.X, { className: "w-6 h-6" }))),
            react_1.default.createElement("nav", { className: "flex flex-col gap-4 sm:gap-5 py-6 font-editorial text-2xl sm:text-3xl text-[#E8D7A6]" },
                react_1.default.createElement("a", { href: "#tarot", onClick: () => setMobileMenuOpen(false), className: "hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4" },
                    react_1.default.createElement("span", null, "01. Tarot"),
                    react_1.default.createElement("span", { className: "font-mono text-xs text-[#00B3A4]" }, "78 arcanos")),
                react_1.default.createElement("a", { href: "#oraculo", onClick: () => setMobileMenuOpen(false), className: "hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4" },
                    react_1.default.createElement("span", null, "02. Or\u00E1culo"),
                    react_1.default.createElement("span", { className: "font-mono text-xs text-[#00B3A4]" }, "una pregunta")),
                react_1.default.createElement("a", { href: "#psicoastrologia", onClick: () => setMobileMenuOpen(false), className: "hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4" },
                    react_1.default.createElement("span", null, "03. Psicoastrolog\u00EDa"),
                    react_1.default.createElement("span", { className: "font-mono text-xs text-[#00B3A4]" }, "mapa interior")),
                react_1.default.createElement("a", { href: "#sesiones", onClick: () => setMobileMenuOpen(false), className: "hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4" },
                    react_1.default.createElement("span", null, "04. Sesiones"),
                    react_1.default.createElement("span", { className: "font-mono text-xs text-[#00B3A4]" }, "consultas")),
                react_1.default.createElement("a", { href: "#testimonios", onClick: () => setMobileMenuOpen(false), className: "hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4" },
                    react_1.default.createElement("span", null, "05. Resonancias"),
                    react_1.default.createElement("span", { className: "font-mono text-xs text-[#00B3A4]" }, "testimonios")),
                react_1.default.createElement("a", { href: "#espacio", onClick: () => setMobileMenuOpen(false), className: "hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4" },
                    react_1.default.createElement("span", null, "06. El espacio"),
                    react_1.default.createElement("span", { className: "font-mono text-xs text-[#00B3A4]" }, "filosof\u00EDa")),
                react_1.default.createElement("a", { href: "#cuaderno", onClick: () => setMobileMenuOpen(false), className: "hover:italic hover:text-[#00B3A4] transition-all flex items-baseline justify-between gap-4" },
                    react_1.default.createElement("span", null, "07. Cuaderno"),
                    react_1.default.createElement("span", { className: "font-mono text-xs text-[#00B3A4]" }, "ensayos"))),
            react_1.default.createElement("div", { className: "pt-6 border-t border-[#E8D7A6]/20 flex flex-col gap-4" },
                react_1.default.createElement("button", { onClick: () => {
                        setMobileMenuOpen(false);
                        onOpenBooking();
                    }, className: "w-full py-4 border border-[#00B3A4] bg-[#2A0E34] text-[#E8D7A6] font-clean text-xs font-semibold tracking-[0.25em] uppercase hover:bg-[#1E0926]" }, "Agendar Consulta"),
                react_1.default.createElement("div", { className: "flex items-center justify-between text-xs text-[#E8D7A6]/60 font-mono" },
                    react_1.default.createElement("button", { onClick: togglePlay, className: "flex items-center gap-2" },
                        isPlaying ? react_1.default.createElement(lucide_react_1.Volume2, { className: "w-4 h-4 text-[#00B3A4]" }) : react_1.default.createElement(lucide_react_1.VolumeX, { className: "w-4 h-4" }),
                        react_1.default.createElement("span", null,
                            "Sonido ",
                            isPlaying ? 'ON' : 'OFF')),
                    react_1.default.createElement("span", { className: "text-[#7A7A7A]" }, "LAT 31\u00B012' N")))))));
};
exports.NavbarEditorial = NavbarEditorial;

};

// --- components/ui/SupabaseMedia.tsx ---
__modules["components/ui/SupabaseMedia.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseMedia = void 0;
const react_1 = __importStar(require("react"));
const supabase_ts_1 = require("services/supabase.ts");
/**
 * SupabaseMedia
 *
 * Componente preparado para recibir fotografías y videos desde Supabase Storage
 * con degradación elegante (fallback encadenado: Supabase Storage -> LocalStorage -> Archivo local -> SVG artesanal).
 */
const SupabaseMedia = ({ bucket = 'space', storagePath, localFallbackSrc, localStorageKey, mediaType = 'auto', poster, alt, className = '', mediaClassName = 'w-full h-full object-cover select-none', fallbackContent, }) => {
    const candidateSources = react_1.default.useMemo(() => {
        const sources = [];
        if (localStorageKey) {
            try {
                const stored = localStorage.getItem(localStorageKey);
                if (stored)
                    sources.push(stored);
            }
            catch {
                // Ignorar errores de acceso a localStorage
            }
        }
        if (storagePath) {
            const supaUrl = (0, supabase_ts_1.getSupabaseStorageUrl)(bucket, storagePath);
            if (supaUrl)
                sources.push(supaUrl);
        }
        if (localFallbackSrc) {
            sources.push(localFallbackSrc);
        }
        return sources;
    }, [bucket, storagePath, localFallbackSrc, localStorageKey]);
    const [sourceIndex, setSourceIndex] = (0, react_1.useState)(0);
    const [exhausted, setExhausted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setSourceIndex(0);
        setExhausted(candidateSources.length === 0);
    }, [candidateSources]);
    const activeSrc = !exhausted ? candidateSources[sourceIndex] : null;
    const shouldRenderVideo = activeSrc && (mediaType === 'video' || (mediaType === 'auto' && (0, supabase_ts_1.isVideoAsset)(activeSrc)));
    const handleMediaError = () => {
        if (sourceIndex + 1 < candidateSources.length) {
            setSourceIndex((prev) => prev + 1);
        }
        else {
            setExhausted(true);
        }
    };
    return (react_1.default.createElement("div", { className: `relative w-full h-full ${className}` }, activeSrc && !exhausted ? (shouldRenderVideo ? (react_1.default.createElement("video", { key: activeSrc, src: activeSrc, poster: poster, autoPlay: true, muted: true, loop: true, playsInline: true, preload: "metadata", onError: handleMediaError, "aria-label": alt, className: mediaClassName })) : (react_1.default.createElement("img", { key: activeSrc, src: activeSrc, alt: alt, loading: "lazy", referrerPolicy: "no-referrer", onError: handleMediaError, className: mediaClassName }))) : fallbackContent ? (react_1.default.createElement("div", { className: "w-full h-full flex items-center justify-center" }, fallbackContent)) : null));
};
exports.SupabaseMedia = SupabaseMedia;

};

// --- components/cards/CardImage.tsx ---
__modules["components/cards/CardImage.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardImage = void 0;
const react_1 = __importDefault(require("react"));
const SupabaseMedia_tsx_1 = require("components/ui/SupabaseMedia.tsx");
const CARD_FILENAME_MAP = {
    sacerdotisa: '2.jpeg',
    ermitano: '9.jpeg',
    torre: '16.jpeg',
    colgado: '12.jpeg',
    luna: '18.jpeg',
    mago: '1.jpeg',
    estrella: '17.jpeg',
    emperador: '4.jpeg',
};
const LOCAL_STORAGE_KEY_PREFIX = 'narmer_card_img_';
const CardImage = ({ cardId, storagePath, mediaType = 'auto', className = '', alt, fallbackSvg, }) => {
    const fileName = CARD_FILENAME_MAP[cardId] || 'card.jpeg';
    return (react_1.default.createElement(SupabaseMedia_tsx_1.SupabaseMedia, { bucket: "cards", storagePath: storagePath || fileName, localFallbackSrc: `/cards/${fileName}`, localStorageKey: LOCAL_STORAGE_KEY_PREFIX + cardId, mediaType: mediaType, alt: alt, className: className, mediaClassName: "w-full h-full object-contain rounded-xl select-none", fallbackContent: fallbackSvg ? (react_1.default.createElement("div", { className: "w-full h-full flex items-center justify-center" }, fallbackSvg)) : (react_1.default.createElement("div", { className: "w-full h-full flex flex-col items-center justify-center bg-[#08121D] p-4 text-center border border-[#00B3A4]/30 rounded-xl" },
            react_1.default.createElement("span", { className: "font-mono text-[9px] uppercase tracking-widest text-[#00B3A4] mb-2" },
                "Arcano \u00B7 ",
                fileName),
            react_1.default.createElement("span", { className: "font-editorial text-sm text-[#E8D7A6]" }, alt))) }));
};
exports.CardImage = CardImage;

};

// --- components/cards/LaSacerdotisaEgyptianCard.tsx ---
__modules["components/cards/LaSacerdotisaEgyptianCard.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaSacerdotisaEgyptianCard = void 0;
const react_1 = __importDefault(require("react"));
/**
 * LaSacerdotisaEgyptianCard
 *
 * Exact high-fidelity vector reproduction of the user's uploaded Egyptian Tarot Card:
 * Arcano II · LA SACERDOTISA (2.jpeg).
 *
 * Visual Breakdown of the original artwork:
 * - Rounded outer border with turquoise frame and dark indigo margin.
 * - Upper register: Midnight starry sky with constellations (Ursa Major / Sirius symbols),
 *   a sacred white Ibis (Thoth) perched on the upper turquoise lintel beam, and astrological glyphs.
 * - Center sanctuary:
 *   - The High Priestess seated in left profile on a carved stone throne with high curved back.
 *   - Headdress: Horns of Hathor cradling the full lunar disk, with tall turquoise plumage / crown.
 *   - Traditional Egyptian braided Nemes wig with striped violet/gold headband.
 *   - Violet ceremonial mantle draped over right shoulder and arm.
 *   - Teal/turquoise pleated gown.
 *   - Right hand holding a golden Ankh (Key of Life) over her heart / breast.
 *   - Left hand resting on papyrus scroll on her lap.
 *   - Flanked by two grand Egyptian lotus/papyrus columns with stone capitals, lotus petal bands,
 *     and diamond/chevron tessellation in turquoise (#00B3A4), violet (#2A0E34), and gold (#E8D7A6).
 * - Lower register:
 *   - Arched subterranean crypt vault with concentric violet/teal radiating lines.
 *   - Two Djed pillars (gray stone and turquoise).
 *   - Number '2' in bottom right corner.
 * - Bottom label bar:
 *   - Dark violet banner reading "LA SACERDOTISA" in cream capital letters.
 *   - Crescent moon symbol on the left, Hebrew letter Beth (ב) and number '2' on the right.
 */
const LaSacerdotisaEgyptianCard = ({ className = '', }) => {
    return (react_1.default.createElement("svg", { viewBox: "0 0 450 780", className: `w-full h-full ${className}`, fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid meet" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("filter", { id: "softGlow", x: "-10%", y: "-10%", width: "120%", height: "120%" },
                react_1.default.createElement("feDropShadow", { dx: "0", dy: "2", stdDeviation: "3", floodColor: "#00B3A4", floodOpacity: "0.3" })),
            react_1.default.createElement("pattern", { id: "stoneTexture", width: "20", height: "20", patternUnits: "userSpaceOnUse" },
                react_1.default.createElement("rect", { width: "20", height: "20", fill: "#7A7A7A", fillOpacity: "0.35" }),
                react_1.default.createElement("circle", { cx: "4", cy: "5", r: "0.8", fill: "#555", opacity: "0.6" }),
                react_1.default.createElement("circle", { cx: "14", cy: "12", r: "0.7", fill: "#888", opacity: "0.7" }),
                react_1.default.createElement("circle", { cx: "8", cy: "17", r: "0.9", fill: "#333", opacity: "0.5" }),
                react_1.default.createElement("circle", { cx: "16", cy: "4", r: "0.6", fill: "#666", opacity: "0.6" })),
            react_1.default.createElement("clipPath", { id: "cardInnerClip" },
                react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "16" }))),
        react_1.default.createElement("rect", { x: "5", y: "5", width: "440", height: "770", rx: "28", fill: "#00B3A4" }),
        react_1.default.createElement("rect", { x: "18", y: "18", width: "414", height: "744", rx: "20", fill: "#0E1724", stroke: "#E8D7A6", strokeWidth: "2.5" }),
        react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "14", fill: "#0D1B2A" }),
        react_1.default.createElement("g", { clipPath: "url(#cardInnerClip)" },
            react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "150", fill: "#07101B" }),
            react_1.default.createElement("g", { fill: "#FFFFFF", opacity: "0.9" },
                react_1.default.createElement("circle", { cx: "65", cy: "55", r: "1.5" }),
                react_1.default.createElement("line", { x1: "65", y1: "50", x2: "65", y2: "60", stroke: "#FFFFFF", strokeWidth: "0.8" }),
                react_1.default.createElement("line", { x1: "60", y1: "55", x2: "70", y2: "55", stroke: "#FFFFFF", strokeWidth: "0.8" }),
                react_1.default.createElement("circle", { cx: "120", cy: "48", r: "1.2" }),
                react_1.default.createElement("circle", { cx: "100", cy: "85", r: "1" }),
                react_1.default.createElement("circle", { cx: "140", cy: "98", r: "1.3" }),
                react_1.default.createElement("circle", { cx: "280", cy: "52", r: "1.2" }),
                react_1.default.createElement("circle", { cx: "340", cy: "50", r: "1.5" }),
                react_1.default.createElement("line", { x1: "340", y1: "46", x2: "340", y2: "54", stroke: "#FFFFFF", strokeWidth: "0.6" }),
                react_1.default.createElement("line", { x1: "336", y1: "50", x2: "344", y2: "50", stroke: "#FFFFFF", strokeWidth: "0.6" }),
                react_1.default.createElement("circle", { cx: "380", cy: "70", r: "1.2" }),
                react_1.default.createElement("circle", { cx: "395", cy: "95", r: "1.4" }),
                react_1.default.createElement("circle", { cx: "370", cy: "110", r: "1" })),
            react_1.default.createElement("g", { stroke: "#E8D7A6", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" },
                react_1.default.createElement("circle", { cx: "240", cy: "46", r: "3", fill: "#E8D7A6" }),
                react_1.default.createElement("circle", { cx: "245", cy: "56", r: "3", fill: "#E8D7A6" }),
                react_1.default.createElement("path", { d: "M 240,46 L 200,68 L 220,78 L 190,92" })),
            react_1.default.createElement("g", { stroke: "#E8D7A6", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" },
                react_1.default.createElement("path", { d: "M 330,68 Q 345,60 350,72 Q 355,84 340,88 L 360,88 M 350,72 L 350,92" })),
            react_1.default.createElement("g", { transform: "translate(80, 70)" },
                react_1.default.createElement("line", { x1: "16", y1: "28", x2: "16", y2: "40", stroke: "#000000", strokeWidth: "1.2" }),
                react_1.default.createElement("line", { x1: "22", y1: "28", x2: "22", y2: "40", stroke: "#000000", strokeWidth: "1.2" }),
                react_1.default.createElement("line", { x1: "13", y1: "40", x2: "18", y2: "40", stroke: "#000000", strokeWidth: "1.2" }),
                react_1.default.createElement("line", { x1: "19", y1: "40", x2: "24", y2: "40", stroke: "#000000", strokeWidth: "1.2" }),
                react_1.default.createElement("ellipse", { cx: "20", cy: "22", rx: "14", ry: "8", fill: "#F4EDE0", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 6,22 L 0,26 L 6,26 Z", fill: "#0E1724" }),
                react_1.default.createElement("path", { d: "M 28,20 Q 32,14 30,8", stroke: "#F4EDE0", strokeWidth: "3.5", strokeLinecap: "round", fill: "none" }),
                react_1.default.createElement("circle", { cx: "30", cy: "7", r: "3", fill: "#0E1724" }),
                react_1.default.createElement("path", { d: "M 32,7 Q 40,9 44,16", stroke: "#0E1724", strokeWidth: "1.4", fill: "none" })),
            react_1.default.createElement("rect", { x: "25", y: "110", width: "400", height: "18", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "2" }),
            react_1.default.createElement("line", { x1: "25", y1: "113", x2: "425", y2: "113", stroke: "#E8D7A6", strokeWidth: "1", opacity: "0.6" }),
            react_1.default.createElement("rect", { x: "25", y: "128", width: "400", height: "390", fill: "#250B30" }),
            react_1.default.createElement("g", { transform: "translate(38, 128)" },
                react_1.default.createElement("rect", { x: "20", y: "0", width: "60", height: "26", fill: "url(#stoneTexture)", stroke: "#0E1724", strokeWidth: "1.8" }),
                react_1.default.createElement("rect", { x: "18", y: "26", width: "64", height: "6", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.4" }),
                react_1.default.createElement("path", { d: "M 20,32 L 20,70 Q 50,78 80,70 L 80,32 Q 50,38 20,32 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("path", { d: "M 24,34 Q 30,58 35,68 Q 30,48 24,34 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 37,34 Q 50,60 50,72 Q 50,60 63,34 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 76,34 Q 70,58 65,68 Q 70,48 76,34 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("circle", { cx: "35", cy: "40", r: "2.5", fill: "#E8D7A6" }),
                react_1.default.createElement("circle", { cx: "50", cy: "40", r: "2.5", fill: "#E8D7A6" }),
                react_1.default.createElement("circle", { cx: "65", cy: "40", r: "2.5", fill: "#E8D7A6" }),
                react_1.default.createElement("rect", { x: "25", y: "72", width: "50", height: "8", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("rect", { x: "25", y: "80", width: "50", height: "12", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("line", { x1: "35", y1: "80", x2: "35", y2: "92", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "45", y1: "80", x2: "45", y2: "92", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "55", y1: "80", x2: "55", y2: "92", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "65", y1: "80", x2: "65", y2: "92", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "25", y: "92", width: "50", height: "8", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("rect", { x: "25", y: "100", width: "50", height: "120", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("polygon", { points: "50,102 30,122 50,142 70,122", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "50,110 38,122 50,134 62,122", fill: "#2A0E34", stroke: "#E8D7A6", strokeWidth: "0.8" }),
                react_1.default.createElement("polygon", { points: "25,122 30,122 25,127", fill: "#E8D7A6" }),
                react_1.default.createElement("polygon", { points: "75,122 70,122 75,127", fill: "#E8D7A6" }),
                react_1.default.createElement("rect", { x: "25", y: "142", width: "50", height: "8", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "25,150 50,175 75,150", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "25,165 50,190 75,165", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "25,180 50,205 75,180", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "25,195 50,220 75,195", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 25,220 L 25,260 L 75,260 L 75,220 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 28,260 Q 38,230 45,220 Q 35,240 28,260 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 45,260 Q 50,225 55,260 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 72,260 Q 62,230 55,220 Q 65,240 72,260 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "20", y: "260", width: "60", height: "14", fill: "url(#stoneTexture)", stroke: "#0E1724", strokeWidth: "1.5" })),
            react_1.default.createElement("g", { transform: "translate(308, 128)" },
                react_1.default.createElement("rect", { x: "20", y: "0", width: "60", height: "26", fill: "url(#stoneTexture)", stroke: "#0E1724", strokeWidth: "1.8" }),
                react_1.default.createElement("rect", { x: "18", y: "26", width: "64", height: "6", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.4" }),
                react_1.default.createElement("path", { d: "M 20,32 L 20,70 Q 50,78 80,70 L 80,32 Q 50,38 20,32 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("path", { d: "M 24,34 Q 30,58 35,68 Q 30,48 24,34 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 37,34 Q 50,60 50,72 Q 50,60 63,34 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 76,34 Q 70,58 65,68 Q 70,48 76,34 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("circle", { cx: "35", cy: "40", r: "2.5", fill: "#E8D7A6" }),
                react_1.default.createElement("circle", { cx: "50", cy: "40", r: "2.5", fill: "#E8D7A6" }),
                react_1.default.createElement("circle", { cx: "65", cy: "40", r: "2.5", fill: "#E8D7A6" }),
                react_1.default.createElement("rect", { x: "25", y: "72", width: "50", height: "8", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("rect", { x: "25", y: "80", width: "50", height: "12", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("line", { x1: "35", y1: "80", x2: "35", y2: "92", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "45", y1: "80", x2: "45", y2: "92", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "55", y1: "80", x2: "55", y2: "92", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "65", y1: "80", x2: "65", y2: "92", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "25", y: "92", width: "50", height: "8", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("rect", { x: "25", y: "100", width: "50", height: "120", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("polygon", { points: "50,102 30,122 50,142 70,122", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "50,110 38,122 50,134 62,122", fill: "#2A0E34", stroke: "#E8D7A6", strokeWidth: "0.8" }),
                react_1.default.createElement("polygon", { points: "25,122 30,122 25,127", fill: "#E8D7A6" }),
                react_1.default.createElement("polygon", { points: "75,122 70,122 75,127", fill: "#E8D7A6" }),
                react_1.default.createElement("rect", { x: "25", y: "142", width: "50", height: "8", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "25,150 50,175 75,150", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "25,165 50,190 75,165", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "25,180 50,205 75,180", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "25,195 50,220 75,195", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 25,220 L 25,260 L 75,260 L 75,220 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 28,260 Q 38,230 45,220 Q 35,240 28,260 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 45,260 Q 50,225 55,260 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 72,260 Q 62,230 55,220 Q 65,240 72,260 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "20", y: "260", width: "60", height: "14", fill: "url(#stoneTexture)", stroke: "#0E1724", strokeWidth: "1.5" })),
            react_1.default.createElement("g", { id: "throne" },
                react_1.default.createElement("path", { d: "M 280,240 C 290,260 300,290 285,350 L 280,410 C 275,420 268,430 258,430 L 245,430", stroke: "#9E9E9E", strokeWidth: "14", strokeLinecap: "round", fill: "none" }),
                react_1.default.createElement("path", { d: "M 280,240 C 290,260 300,290 285,350 L 280,410 C 275,420 268,430 258,430 L 245,430", stroke: "#0E1724", strokeWidth: "1.5", strokeLinecap: "round", fill: "none" }),
                react_1.default.createElement("path", { d: "M 270,410 L 290,415 L 285,435 L 265,430 Z", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "180", y: "420", width: "95", height: "15", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("rect", { x: "185", y: "435", width: "85", height: "55", fill: "#1A0D22", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("path", { d: "M 195,435 L 195,470 Q 185,490 190,520 Q 200,530 205,535 L 180,535 Q 182,510 185,490 L 185,435 Z", fill: "#7A7A7A", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 265,435 L 265,470 Q 255,490 260,520 Q 270,530 275,535 L 250,535 Q 252,510 255,490 L 255,435 Z", fill: "#7A7A7A", stroke: "#0E1724", strokeWidth: "1.2" })),
            react_1.default.createElement("g", { id: "priestess" },
                react_1.default.createElement("polygon", { points: "212,190 220,110 290,140 255,190", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("path", { d: "M 160,95 C 195,170 285,170 300,95 C 285,145 205,145 160,95 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("circle", { cx: "230", cy: "138", r: "28", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.8" }),
                react_1.default.createElement("path", { d: "M 235,165 Q 275,175 295,135 Q 255,145 235,165 Z", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 210,195 Q 275,200 280,270 L 230,370 Q 220,300 215,250 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("g", { stroke: "#0E1724", strokeWidth: "1" },
                    react_1.default.createElement("path", { d: "M 225,230 L 265,230 L 265,240 L 225,240 Z", fill: "#00B3A4" }),
                    react_1.default.createElement("path", { d: "M 225,240 L 265,240 L 265,250 L 225,250 Z", fill: "#E8D7A6" }),
                    react_1.default.createElement("path", { d: "M 225,250 L 265,250 L 265,260 L 225,260 Z", fill: "#00B3A4" }),
                    react_1.default.createElement("path", { d: "M 225,260 L 265,260 L 265,270 L 225,270 Z", fill: "#E8D7A6" }),
                    react_1.default.createElement("path", { d: "M 227,270 L 273,270 L 270,285 L 227,285 Z", fill: "#00B3A4" }),
                    react_1.default.createElement("path", { d: "M 228,285 L 270,285 L 266,300 L 228,300 Z", fill: "#2A0E34" }),
                    react_1.default.createElement("path", { d: "M 229,300 L 266,300 L 260,320 L 229,320 Z", fill: "#E8D7A6" }),
                    react_1.default.createElement("path", { d: "M 230,320 L 260,320 L 250,350 L 230,350 Z", fill: "#00B3A4" })),
                react_1.default.createElement("path", { d: "M 210,248 Q 200,245 204,235 Q 212,238 210,248 Z", fill: "#2A0E34", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("polygon", { points: "190,290 215,260 215,290", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "195", y1: "285", x2: "215", y2: "265", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("line", { x1: "202", y1: "288", x2: "215", y2: "272", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 215,250 \n               L 205,275 \n               L 212,282 \n               L 202,298 \n               Q 214,298 210,305 \n               L 205,310 \n               Q 216,310 212,316 \n               Q 222,328 220,340 \n               L 235,340 \n               L 235,270 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.4" }),
                react_1.default.createElement("path", { d: "M 210,280 C 215,276 225,276 228,280 C 225,284 215,284 210,280 Z", fill: "#FFFFFF", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("circle", { cx: "218", cy: "280", r: "2.5", fill: "#0E1724" }),
                react_1.default.createElement("line", { x1: "228", y1: "280", x2: "236", y2: "280", stroke: "#0E1724", strokeWidth: "1.4" }),
                react_1.default.createElement("path", { d: "M 209,275 Q 222,272 233,275", stroke: "#0E1724", strokeWidth: "1.6", fill: "none" }),
                react_1.default.createElement("ellipse", { cx: "230", cy: "295", rx: "3.5", ry: "5.5", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("circle", { cx: "230", cy: "301", r: "2", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "0.8" }),
                react_1.default.createElement("path", { d: "M 215,335 C 235,340 250,340 260,335 L 260,355 C 245,362 230,362 215,355 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("line", { x1: "230", y1: "337", x2: "230", y2: "359", stroke: "#E8D7A6", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "245", y1: "337", x2: "245", y2: "359", stroke: "#E8D7A6", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 215,355 C 205,370 205,390 220,405 C 240,415 255,410 265,395 C 265,370 260,355 260,355 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 175,355 Q 165,385 150,420 L 175,440 L 210,385 Q 200,365 175,355 Z", fill: "#522368", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("path", { d: "M 150,420 \n               Q 135,460 115,505 \n               L 135,530 \n               L 175,470 \n               L 185,420 Z", fill: "#522368", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("line", { x1: "120", y1: "490", x2: "150", y2: "450", stroke: "#2A0E34", strokeWidth: "1.2" }),
                react_1.default.createElement("line", { x1: "130", y1: "510", x2: "160", y2: "470", stroke: "#2A0E34", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 210,385 L 230,378 L 235,390 L 215,395 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 225,380 Q 235,382 232,392", stroke: "#0E1724", strokeWidth: "1", fill: "none" }),
                react_1.default.createElement("g", { transform: "translate(232, 388)" },
                    react_1.default.createElement("ellipse", { cx: "0", cy: "-10", rx: "6", ry: "8", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.4" }),
                    react_1.default.createElement("ellipse", { cx: "0", cy: "-10", rx: "3", ry: "5", fill: "#0D1B2A", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("line", { x1: "-8", y1: "-2", x2: "8", y2: "-2", stroke: "#E8D7A6", strokeWidth: "3" }),
                    react_1.default.createElement("line", { x1: "-8", y1: "-2", x2: "8", y2: "-2", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("line", { x1: "0", y1: "-2", x2: "0", y2: "18", stroke: "#E8D7A6", strokeWidth: "3.2", strokeLinecap: "round" }),
                    react_1.default.createElement("line", { x1: "0", y1: "-2", x2: "0", y2: "18", stroke: "#0E1724", strokeWidth: "1.2", strokeLinecap: "round" })),
                react_1.default.createElement("path", { d: "M 260,375 Q 268,410 250,440 L 210,480 L 195,470 L 235,430 Q 248,405 245,375 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("rect", { x: "250", y: "395", width: "14", height: "6", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "250", y1: "398", x2: "264", y2: "398", stroke: "#E8D7A6", strokeWidth: "1" }),
                react_1.default.createElement("path", { d: "M 195,470 Q 185,480 180,488 Q 192,492 205,480 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("g", { transform: "translate(170, 455) rotate(-15)" },
                    react_1.default.createElement("rect", { x: "0", y: "0", width: "60", height: "22", rx: "3", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.4" }),
                    react_1.default.createElement("line", { x1: "8", y1: "6", x2: "52", y2: "6", stroke: "#7A7A7A", strokeWidth: "1", strokeDasharray: "3 2" }),
                    react_1.default.createElement("line", { x1: "8", y1: "11", x2: "48", y2: "11", stroke: "#7A7A7A", strokeWidth: "1", strokeDasharray: "4 2" }),
                    react_1.default.createElement("line", { x1: "8", y1: "16", x2: "38", y2: "16", stroke: "#7A7A7A", strokeWidth: "1", strokeDasharray: "3 3" })),
                react_1.default.createElement("path", { d: "M 215,405 \n               Q 180,420 155,470 \n               L 135,530 \n               L 165,585 \n               L 190,580 \n               L 185,500 \n               Q 230,470 245,430 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.5" }),
                react_1.default.createElement("g", { stroke: "#0E1724", strokeWidth: "1", opacity: "0.6" },
                    react_1.default.createElement("line", { x1: "160", y1: "480", x2: "140", y2: "540" }),
                    react_1.default.createElement("line", { x1: "170", y1: "490", x2: "150", y2: "555" }),
                    react_1.default.createElement("line", { x1: "180", y1: "500", x2: "162", y2: "570" }),
                    react_1.default.createElement("line", { x1: "190", y1: "510", x2: "175", y2: "580" })),
                react_1.default.createElement("path", { d: "M 135,530 \n               L 130,600 \n               L 110,615 \n               L 95,620 \n               L 95,612 \n               L 115,605 \n               L 125,560 \n               Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.4" }),
                react_1.default.createElement("path", { d: "M 140,560 \n               L 140,605 \n               L 125,620 \n               L 108,620 \n               L 120,610 \n               L 132,560 Z", fill: "#E5D6BD", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "97", y1: "616", x2: "104", y2: "616", stroke: "#0E1724", strokeWidth: "0.8" }),
                react_1.default.createElement("line", { x1: "98", y1: "618", x2: "105", y2: "618", stroke: "#0E1724", strokeWidth: "0.8" })),
            react_1.default.createElement("rect", { x: "25", y: "600", width: "400", height: "24", fill: "url(#stoneTexture)", stroke: "#0E1724", strokeWidth: "2" }),
            react_1.default.createElement("line", { x1: "25", y1: "600", x2: "425", y2: "600", stroke: "#E8D7A6", strokeWidth: "1.2" }),
            react_1.default.createElement("rect", { x: "25", y: "624", width: "400", height: "96", fill: "#12061A" }),
            react_1.default.createElement("path", { d: "M 40,720 C 40,630 410,630 410,720", stroke: "#00B3A4", strokeWidth: "3", fill: "#250B30" }),
            react_1.default.createElement("path", { d: "M 70,720 C 70,645 380,645 380,720", stroke: "#522368", strokeWidth: "4", fill: "#1A0D24" }),
            react_1.default.createElement("path", { d: "M 100,720 C 100,660 350,660 350,720", stroke: "#00B3A4", strokeWidth: "1.8", fill: "#0D1B2A" }),
            react_1.default.createElement("g", { stroke: "#2A0E34", strokeWidth: "1", opacity: "0.8" },
                react_1.default.createElement("line", { x1: "70", y1: "680", x2: "120", y2: "650" }),
                react_1.default.createElement("line", { x1: "90", y1: "695", x2: "150", y2: "655" }),
                react_1.default.createElement("line", { x1: "110", y1: "710", x2: "180", y2: "660" }),
                react_1.default.createElement("line", { x1: "380", y1: "680", x2: "330", y2: "650" }),
                react_1.default.createElement("line", { x1: "360", y1: "695", x2: "300", y2: "655" }),
                react_1.default.createElement("line", { x1: "340", y1: "710", x2: "270", y2: "660" })),
            react_1.default.createElement("g", { transform: "translate(180, 642)" },
                react_1.default.createElement("rect", { x: "5", y: "62", width: "20", height: "8", fill: "#7A7A7A", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "9", y: "24", width: "12", height: "42", fill: "#7A7A7A", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "2", y: "18", width: "26", height: "5", fill: "#7A7A7A", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "3", y: "12", width: "24", height: "5", fill: "#7A7A7A", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "4", y: "6", width: "22", height: "5", fill: "#7A7A7A", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "5", y: "0", width: "20", height: "5", fill: "#7A7A7A", stroke: "#0E1724", strokeWidth: "1" })),
            react_1.default.createElement("g", { transform: "translate(230, 642)" },
                react_1.default.createElement("rect", { x: "5", y: "62", width: "20", height: "8", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "9", y: "24", width: "12", height: "42", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "2", y: "18", width: "26", height: "5", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "3", y: "12", width: "24", height: "5", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "4", y: "6", width: "22", height: "5", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                react_1.default.createElement("rect", { x: "5", y: "0", width: "20", height: "5", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" })),
            react_1.default.createElement("text", { x: "392", y: "705", fill: "#E8D7A6", fontSize: "36", fontFamily: "serif", fontWeight: "bold", textAnchor: "middle" }, "2"),
            react_1.default.createElement("path", { d: "M 38,650 L 38,715 L 412,715 L 412,650", stroke: "#00B3A4", strokeWidth: "2", fill: "none" }),
            react_1.default.createElement("rect", { x: "25", y: "715", width: "400", height: "40", fill: "#250B30", stroke: "#E8D7A6", strokeWidth: "2" }),
            react_1.default.createElement("g", { transform: "translate(45, 735)" },
                react_1.default.createElement("path", { d: "M 12,-12 A 12,12 0 1,0 12,12 A 10,10 0 1,1 12,-12 Z", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "0.8" })),
            react_1.default.createElement("text", { x: "220", y: "742", fill: "#E8D7A6", fontSize: "24", fontFamily: "'Cinzel', 'Times New Roman', serif", fontWeight: "700", letterSpacing: "3", textAnchor: "middle" }, "LA SACERDOTISA"),
            react_1.default.createElement("g", { transform: "translate(372, 735)" },
                react_1.default.createElement("path", { d: "M 2,-10 L 16,-10 L 16,8 L -2,8 L -2,5 L 12,5 L 12,-7 L 2,-7 Z", fill: "#E8D7A6" }),
                react_1.default.createElement("text", { x: "28", y: "7", fill: "#E8D7A6", fontSize: "24", fontFamily: "serif", fontWeight: "bold" }, "2")))));
};
exports.LaSacerdotisaEgyptianCard = LaSacerdotisaEgyptianCard;

};

// --- components/cards/ElEremitaEgyptianCard.tsx ---
__modules["components/cards/ElEremitaEgyptianCard.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElEremitaEgyptianCard = void 0;
const react_1 = __importDefault(require("react"));
/**
 * ElEremitaEgyptianCard
 *
 * Exact high-fidelity vector reproduction of the user's uploaded Egyptian Tarot Card:
 * Arcano IX · EL EREMITA (9.jpeg).
 *
 * Visual Breakdown of the original artwork:
 * - Rounded outer border with turquoise frame and dark indigo inner margin.
 * - Upper register (Deep Violet Night Sky #250B30):
 *   - Golden solar/celestial disk radiating 3 rays of arrows downwards.
 *   - Labyrinthine linear glyph / celestial sigil across the top center.
 *   - Astrological Scorpio/Virgo composite glyph with twin dots on the upper right in gold.
 *   - Crescent / horizontal hoop symbol on the upper left.
 *   - Ornate calligraphic corner flourishes in the upper corners.
 * - Center desert landscape (Midnight Blue starry sky #07101B):
 *   - An ancient Egyptian date palm tree with textured gray trunk and detailed turquoise fronds.
 *   - The Hermit (El Eremita) walking forward towards the right:
 *     - Ancient Egyptian beard and braided nemes-style wig with striped band.
 *     - Broad beaded necklace collar (Wesekh) in deep purple/indigo.
 *     - Flowing turquoise / teal robes with natural fabric folds.
 *     - Deep purple ceremonial cloak hanging from his extended arm.
 *     - Holding a tall turquoise pilgrim staff (was-sceptre hook at top).
 *     - Holding an oil lamp bowl with a tall golden/amber flame in his left hand.
 *     - Bare feet walking upon the boundary line.
 * - Lower register:
 *   - Subterranean crypt niche with horizontal purple and turquoise striped striations.
 *   - Large golden sphere / subterranean moon disk nestled in the center.
 * - Bottom label bar:
 *   - Dark violet banner reading "EL EREMITA" in bold cream serif capitals.
 *   - Mars (♂) and Aries (♈) astrological symbols on the bottom left.
 *   - Hebrew letter Teth (ט) and number '9' on the bottom right.
 */
const ElEremitaEgyptianCard = ({ className = '', }) => {
    return (react_1.default.createElement("svg", { viewBox: "0 0 450 780", className: `w-full h-full ${className}`, fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid meet" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("pattern", { id: "palmTrunkPattern", width: "10", height: "8", patternUnits: "userSpaceOnUse" },
                react_1.default.createElement("rect", { width: "10", height: "8", fill: "#4A4A4A" }),
                react_1.default.createElement("polygon", { points: "0,4 5,0 10,4 5,8", fill: "#7A7A7A" }),
                react_1.default.createElement("polygon", { points: "5,4 10,0 10,8", fill: "#2E2E2E" })),
            react_1.default.createElement("clipPath", { id: "eremitaClip" },
                react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "16" }))),
        react_1.default.createElement("rect", { x: "5", y: "5", width: "440", height: "770", rx: "28", fill: "#00B3A4" }),
        react_1.default.createElement("rect", { x: "18", y: "18", width: "414", height: "744", rx: "20", fill: "#0E1724", stroke: "#E8D7A6", strokeWidth: "2.5" }),
        react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "14", fill: "#0D1B2A" }),
        react_1.default.createElement("g", { clipPath: "url(#eremitaClip)" },
            react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "175", fill: "#250B30" }),
            react_1.default.createElement("path", { d: "M 45,50 Q 60,32 75,46 Q 80,60 65,65 Q 55,55 62,42", stroke: "#E8D7A6", strokeWidth: "1.8", strokeLinecap: "round", fill: "none" }),
            react_1.default.createElement("circle", { cx: "58", cy: "68", r: "1.5", fill: "#E8D7A6" }),
            react_1.default.createElement("path", { d: "M 405,50 Q 390,32 375,46 Q 370,60 385,65 Q 395,55 388,42", stroke: "#E8D7A6", strokeWidth: "1.8", strokeLinecap: "round", fill: "none" }),
            react_1.default.createElement("circle", { cx: "392", cy: "68", r: "1.5", fill: "#E8D7A6" }),
            react_1.default.createElement("g", { transform: "translate(0, -18)", stroke: "#E8D7A6", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "miter", fill: "none" },
                react_1.default.createElement("path", { d: "M 155,75 L 155,95 L 305,95 L 305,80" }),
                react_1.default.createElement("path", { d: "M 170,80 L 170,110 L 255,110 L 255,80" }),
                react_1.default.createElement("path", { d: "M 190,80 L 190,125 L 285,125 L 285,100" }),
                react_1.default.createElement("path", { d: "M 225,125 L 225,55" }),
                react_1.default.createElement("polygon", { points: "225,50 220,60 230,60", fill: "#E8D7A6", stroke: "#E8D7A6", strokeWidth: "1" }),
                react_1.default.createElement("line", { x1: "240", y1: "80", x2: "240", y2: "105" }),
                react_1.default.createElement("line", { x1: "270", y1: "80", x2: "270", y2: "105" }),
                react_1.default.createElement("line", { x1: "290", y1: "80", x2: "300", y2: "80" })),
            react_1.default.createElement("path", { d: "M 80,165 C 80,155 130,155 130,165 C 130,175 80,175 80,165 Z", stroke: "#E8D7A6", strokeWidth: "2", fill: "none" }),
            react_1.default.createElement("g", { transform: "translate(0, -30)", stroke: "#E8D7A6", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" },
                react_1.default.createElement("path", { d: "M 320,155 L 320,200 M 320,165 Q 330,150 340,165 L 340,200 M 340,165 Q 350,150 360,165 L 360,210 Q 360,225 345,220 Q 335,215 345,205 Q 355,200 365,215" }),
                react_1.default.createElement("circle", { cx: "370", cy: "175", r: "3", fill: "#E8D7A6" }),
                react_1.default.createElement("circle", { cx: "382", cy: "175", r: "3", fill: "#E8D7A6" })),
            react_1.default.createElement("g", { transform: "translate(225, 165)" },
                react_1.default.createElement("circle", { cx: "0", cy: "0", r: "36", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "2" }),
                react_1.default.createElement("line", { x1: "-18", y1: "36", x2: "-32", y2: "100", stroke: "#E8D7A6", strokeWidth: "2" }),
                react_1.default.createElement("polygon", { points: "-22,58 -18,48 -14,58", fill: "#E8D7A6" }),
                react_1.default.createElement("polygon", { points: "-27,80 -23,70 -19,80", fill: "#E8D7A6" }),
                react_1.default.createElement("polygon", { points: "-32,100 -28,90 -24,100", fill: "#E8D7A6" }),
                react_1.default.createElement("line", { x1: "0", y1: "36", x2: "0", y2: "100", stroke: "#E8D7A6", strokeWidth: "2" }),
                react_1.default.createElement("polygon", { points: "-4,58 0,48 4,58", fill: "#E8D7A6" }),
                react_1.default.createElement("polygon", { points: "-4,80 0,70 4,80", fill: "#E8D7A6" }),
                react_1.default.createElement("polygon", { points: "-4,100 0,90 4,100", fill: "#E8D7A6" }),
                react_1.default.createElement("line", { x1: "18", y1: "36", x2: "32", y2: "100", stroke: "#E8D7A6", strokeWidth: "2" }),
                react_1.default.createElement("polygon", { points: "14,58 18,48 22,58", fill: "#E8D7A6" }),
                react_1.default.createElement("polygon", { points: "19,80 23,70 27,80", fill: "#E8D7A6" }),
                react_1.default.createElement("polygon", { points: "24,100 28,90 32,100", fill: "#E8D7A6" })),
            react_1.default.createElement("rect", { x: "25", y: "198", width: "400", height: "4", fill: "#0E1724" }),
            react_1.default.createElement("rect", { x: "25", y: "202", width: "400", height: "422", fill: "#07121E" }),
            react_1.default.createElement("g", { transform: "translate(0, -125)" },
                react_1.default.createElement("g", { fill: "#FFFFFF", opacity: "0.85" },
                    react_1.default.createElement("circle", { cx: "50", cy: "265", r: "1.2" }),
                    react_1.default.createElement("circle", { cx: "85", cy: "285", r: "1.4" }),
                    react_1.default.createElement("circle", { cx: "52", cy: "455", r: "1.6" }),
                    react_1.default.createElement("line", { x1: "52", y1: "450", x2: "52", y2: "460", stroke: "#FFFFFF", strokeWidth: "0.6" }),
                    react_1.default.createElement("line", { x1: "47", y1: "455", x2: "57", y2: "455", stroke: "#FFFFFF", strokeWidth: "0.6" }),
                    react_1.default.createElement("circle", { cx: "105", cy: "420", r: "1.2" }),
                    react_1.default.createElement("circle", { cx: "130", cy: "510", r: "1" }),
                    react_1.default.createElement("circle", { cx: "70", cy: "540", r: "1.3" }),
                    react_1.default.createElement("circle", { cx: "95", cy: "595", r: "1.2" }),
                    react_1.default.createElement("circle", { cx: "365", cy: "275", r: "1.3" }),
                    react_1.default.createElement("circle", { cx: "395", cy: "315", r: "1.5" }),
                    react_1.default.createElement("circle", { cx: "340", cy: "390", r: "1.1" }),
                    react_1.default.createElement("circle", { cx: "385", cy: "440", r: "1.4" }),
                    react_1.default.createElement("circle", { cx: "360", cy: "530", r: "1.2" }),
                    react_1.default.createElement("circle", { cx: "380", cy: "585", r: "1.3" }),
                    react_1.default.createElement("circle", { cx: "210", cy: "300", r: "1.2" }),
                    react_1.default.createElement("circle", { cx: "280", cy: "340", r: "1.5" })),
                react_1.default.createElement("g", { id: "palmTree", transform: "translate(60, 400)" },
                    react_1.default.createElement("rect", { x: "68", y: "145", width: "16", height: "205", fill: "url(#palmTrunkPattern)", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("line", { x1: "68", y1: "145", x2: "68", y2: "350", stroke: "#00B3A4", strokeWidth: "0.8", opacity: "0.6" }),
                    react_1.default.createElement("line", { x1: "84", y1: "145", x2: "84", y2: "350", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("g", { fill: "#A67C52", stroke: "#0E1724", strokeWidth: "0.8" },
                        react_1.default.createElement("circle", { cx: "65", cy: "150", r: "3" }),
                        react_1.default.createElement("circle", { cx: "69", cy: "154", r: "3" }),
                        react_1.default.createElement("circle", { cx: "64", cy: "158", r: "3" }),
                        react_1.default.createElement("circle", { cx: "85", cy: "150", r: "3" }),
                        react_1.default.createElement("circle", { cx: "89", cy: "154", r: "3" }),
                        react_1.default.createElement("circle", { cx: "85", cy: "158", r: "3" })),
                    react_1.default.createElement("path", { d: "M 76,145 Q 35,130 0,160 Q 30,150 76,145 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("path", { d: "M 76,145 Q 40,90 10,110 Q 45,115 76,145 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("path", { d: "M 76,145 Q 60,60 50,45 Q 65,75 76,145 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("path", { d: "M 76,145 Q 76,30 76,10 Q 80,45 76,145 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("path", { d: "M 76,145 Q 92,60 102,45 Q 87,75 76,145 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("path", { d: "M 76,145 Q 112,90 142,110 Q 107,115 76,145 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("path", { d: "M 76,145 Q 117,130 152,160 Q 122,150 76,145 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("g", { stroke: "#0E1724", strokeWidth: "0.8", opacity: "0.7" },
                        react_1.default.createElement("line", { x1: "76", y1: "145", x2: "5", y2: "155" }),
                        react_1.default.createElement("line", { x1: "76", y1: "145", x2: "15", y2: "112" }),
                        react_1.default.createElement("line", { x1: "76", y1: "145", x2: "76", y2: "15" }),
                        react_1.default.createElement("line", { x1: "76", y1: "145", x2: "137", y2: "112" }),
                        react_1.default.createElement("line", { x1: "76", y1: "145", x2: "147", y2: "155" }))),
                react_1.default.createElement("g", { id: "eremitaFigure" },
                    react_1.default.createElement("path", { d: "M 285,420 \n               L 330,425 \n               L 358,630 \n               L 315,630 \n               L 285,480 Z", fill: "#341344", stroke: "#0E1724", strokeWidth: "1.5" }),
                    react_1.default.createElement("path", { d: "M 325,425 L 340,630 L 325,630 Z", fill: "#200A2C" }),
                    react_1.default.createElement("line", { x1: "330", y1: "425", x2: "345", y2: "630", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("path", { d: "M 235,395 \n               C 210,405 200,430 215,480 \n               C 220,500 215,530 205,560 \n               C 195,590 185,630 180,665 \n               L 255,650 \n               C 275,640 280,600 282,530 \n               C 285,470 290,430 285,405 \n               Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.8" }),
                    react_1.default.createElement("g", { stroke: "#0E1724", strokeWidth: "1.2" },
                        react_1.default.createElement("path", { d: "M 220,440 Q 235,470 250,510", fill: "none" }),
                        react_1.default.createElement("path", { d: "M 215,490 Q 235,530 255,570", fill: "none" }),
                        react_1.default.createElement("path", { d: "M 210,540 Q 230,590 245,630", fill: "none" }),
                        react_1.default.createElement("path", { d: "M 255,440 Q 265,510 270,580", fill: "none" })),
                    react_1.default.createElement("path", { d: "M 220,385 C 235,375 265,375 275,385 L 280,410 C 265,420 230,420 215,410 Z", fill: "#341344", stroke: "#0E1724", strokeWidth: "1.4" }),
                    react_1.default.createElement("path", { d: "M 220,395 C 235,387 265,387 275,395", stroke: "#E8D7A6", strokeWidth: "1.2", fill: "none" }),
                    react_1.default.createElement("path", { d: "M 222,403 C 235,397 265,397 273,403", stroke: "#00B3A4", strokeWidth: "1.2", fill: "none" }),
                    react_1.default.createElement("path", { d: "M 225,335 C 215,355 210,385 220,405 L 245,405 C 240,385 240,360 245,340 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("g", { stroke: "#0E1724", strokeWidth: "1.2", fill: "#F4E8D1" },
                        react_1.default.createElement("rect", { x: "220", y: "340", width: "26", height: "8", fill: "#F4E8D1" }),
                        react_1.default.createElement("rect", { x: "218", y: "348", width: "28", height: "8", fill: "#F4E8D1" }),
                        react_1.default.createElement("rect", { x: "216", y: "356", width: "30", height: "8", fill: "#F4E8D1" }),
                        react_1.default.createElement("rect", { x: "214", y: "364", width: "32", height: "8", fill: "#F4E8D1" }),
                        react_1.default.createElement("rect", { x: "215", y: "372", width: "30", height: "8", fill: "#F4E8D1" }),
                        react_1.default.createElement("rect", { x: "217", y: "380", width: "28", height: "8", fill: "#F4E8D1" }),
                        react_1.default.createElement("rect", { x: "219", y: "388", width: "26", height: "8", fill: "#F4E8D1" })),
                    react_1.default.createElement("path", { d: "M 240,335 \n               Q 255,330 265,338 \n               L 268,355 \n               L 272,358 \n               L 267,366 \n               Q 272,367 270,372 \n               L 265,375 \n               Q 268,382 265,390 \n               L 252,390 \n               L 248,375 \n               Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.4" }),
                    react_1.default.createElement("path", { d: "M 252,375 L 265,375 L 267,395 L 255,395 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("line", { x1: "255", y1: "380", x2: "265", y2: "380", stroke: "#0E1724", strokeWidth: "0.8" }),
                    react_1.default.createElement("line", { x1: "256", y1: "385", x2: "266", y2: "385", stroke: "#0E1724", strokeWidth: "0.8" }),
                    react_1.default.createElement("line", { x1: "257", y1: "390", x2: "266", y2: "390", stroke: "#0E1724", strokeWidth: "0.8" }),
                    react_1.default.createElement("path", { d: "M 254,354 C 258,350 265,350 268,354 C 265,357 258,357 254,354 Z", fill: "#FFFFFF", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("circle", { cx: "261", cy: "354", r: "2", fill: "#0E1724" }),
                    react_1.default.createElement("line", { x1: "268", y1: "354", x2: "274", y2: "354", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("path", { d: "M 253,348 Q 262,346 270,348", stroke: "#0E1724", strokeWidth: "1.4", fill: "none" }),
                    react_1.default.createElement("path", { d: "M 268,405 Q 295,415 305,435 L 290,448 Q 280,430 260,420 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("path", { d: "M 305,435 L 295,465 L 280,460 L 290,435 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("ellipse", { cx: "295", cy: "450", rx: "9", ry: "7", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("line", { x1: "290", y1: "447", x2: "300", y2: "447", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("line", { x1: "290", y1: "452", x2: "300", y2: "452", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("path", { d: "M 285,395 C 280,365 305,360 300,380 L 295,395 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.4" }),
                    react_1.default.createElement("line", { x1: "298", y1: "390", x2: "340", y2: "750", stroke: "#00B3A4", strokeWidth: "3.5" }),
                    react_1.default.createElement("line", { x1: "298", y1: "390", x2: "340", y2: "750", stroke: "#0E1724", strokeWidth: "1" }),
                    react_1.default.createElement("path", { d: "M 285,420 L 330,410 L 332,425 L 290,435 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("path", { d: "M 330,410 L 340,412 L 340,430 L 328,428 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("line", { x1: "334", y1: "416", x2: "340", y2: "416", stroke: "#0E1724", strokeWidth: "0.8" }),
                    react_1.default.createElement("line", { x1: "334", y1: "421", x2: "340", y2: "421", stroke: "#0E1724", strokeWidth: "0.8" }),
                    react_1.default.createElement("line", { x1: "334", y1: "426", x2: "340", y2: "426", stroke: "#0E1724", strokeWidth: "0.8" }),
                    react_1.default.createElement("g", { id: "hermitLamp", transform: "translate(305, 395)" },
                        react_1.default.createElement("path", { d: "M 0,15 Q 18,12 35,15 L 30,22 Q 18,22 5,20 Z", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
                        react_1.default.createElement("path", { d: "M 12,12 \n                 C 10, -5 18, -30 22, -65 \n                 C 25, -45 28, -35 25, -20 \n                 C 28, -15 25, 0 16, 12 Z", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
                        react_1.default.createElement("path", { d: "M 14,10 \n                 C 13, -2 18, -20 20, -45 \n                 C 22, -30 23, -20 21, -10 \n                 C 22, -5 20, 2 16, 10 Z", fill: "#FFFFFF", opacity: "0.9" })),
                    react_1.default.createElement("path", { d: "M 280,600 L 285,670 L 282,725 L 275,738 L 315,745 L 318,735 L 295,730 L 295,670 L 290,600 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.4" }),
                    react_1.default.createElement("path", { d: "M 275,738 L 315,745 L 318,735 L 295,730 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" }),
                    react_1.default.createElement("line", { x1: "310", y1: "740", x2: "315", y2: "740", stroke: "#0E1724", strokeWidth: "0.8" }),
                    react_1.default.createElement("line", { x1: "311", y1: "743", x2: "316", y2: "743", stroke: "#0E1724", strokeWidth: "0.8" }),
                    react_1.default.createElement("path", { d: "M 195,650 L 175,720 L 165,740 L 195,742 L 185,730 L 188,710 L 205,650 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.4" }),
                    react_1.default.createElement("path", { d: "M 165,740 L 195,742 L 185,730 Z", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.2" })),
                react_1.default.createElement("line", { x1: "25", y1: "748", x2: "425", y2: "748", stroke: "#E8D7A6", strokeWidth: "2" }),
                react_1.default.createElement("rect", { x: "25", y: "750", width: "400", height: "120", fill: "#250B30" }),
                react_1.default.createElement("g", { strokeWidth: "2.5" },
                    react_1.default.createElement("line", { x1: "30", y1: "755", x2: "420", y2: "755", stroke: "#00B3A4" }),
                    react_1.default.createElement("line", { x1: "30", y1: "762", x2: "420", y2: "762", stroke: "#522368" }),
                    react_1.default.createElement("line", { x1: "30", y1: "769", x2: "420", y2: "769", stroke: "#00B3A4" }),
                    react_1.default.createElement("line", { x1: "30", y1: "776", x2: "420", y2: "776", stroke: "#522368" }),
                    react_1.default.createElement("line", { x1: "30", y1: "783", x2: "420", y2: "783", stroke: "#00B3A4" }),
                    react_1.default.createElement("line", { x1: "30", y1: "790", x2: "420", y2: "790", stroke: "#522368" }),
                    react_1.default.createElement("line", { x1: "30", y1: "797", x2: "420", y2: "797", stroke: "#00B3A4" }),
                    react_1.default.createElement("line", { x1: "30", y1: "804", x2: "420", y2: "804", stroke: "#522368" }),
                    react_1.default.createElement("line", { x1: "30", y1: "811", x2: "420", y2: "811", stroke: "#00B3A4" }),
                    react_1.default.createElement("line", { x1: "30", y1: "818", x2: "420", y2: "818", stroke: "#522368" }),
                    react_1.default.createElement("line", { x1: "30", y1: "825", x2: "420", y2: "825", stroke: "#00B3A4" }),
                    react_1.default.createElement("line", { x1: "30", y1: "832", x2: "420", y2: "832", stroke: "#522368" })),
                react_1.default.createElement("circle", { cx: "225", cy: "795", r: "48", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "2.5" }),
                react_1.default.createElement("path", { d: "M 38,700 L 38,840 L 412,840 L 412,700", stroke: "#00B3A4", strokeWidth: "2.5", fill: "none" }),
                react_1.default.createElement("rect", { x: "25", y: "840", width: "400", height: "42", fill: "#250B30", stroke: "#E8D7A6", strokeWidth: "2" }),
                react_1.default.createElement("g", { transform: "translate(48, 862)", stroke: "#E8D7A6", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" },
                    react_1.default.createElement("circle", { cx: "10", cy: "5", r: "7" }),
                    react_1.default.createElement("line", { x1: "15", y1: "0", x2: "24", y2: "-9" }),
                    react_1.default.createElement("line", { x1: "17", y1: "-9", x2: "24", y2: "-9" }),
                    react_1.default.createElement("line", { x1: "24", y1: "-9", x2: "24", y2: "-2" }),
                    react_1.default.createElement("path", { d: "M 36,9 L 36,-4 Q 31,-12 25,-4 M 36,-4 Q 41,-12 47,-4" })),
                react_1.default.createElement("text", { x: "225", y: "868", fill: "#E8D7A6", fontSize: "23", fontFamily: "'Cinzel', 'Times New Roman', serif", fontWeight: "700", letterSpacing: "3", textAnchor: "middle" }, "EL EREMITA"),
                react_1.default.createElement("g", { transform: "translate(365, 863)" },
                    react_1.default.createElement("path", { d: "M 5,5 Q 5,-10 15,-10 L 15,0 Q 15,5 10,5 Q 7,5 7,0 L 7,-5 M 15,-10 Q 23,-10 23,5 L 5,5", stroke: "#E8D7A6", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }),
                    react_1.default.createElement("text", { x: "32", y: "6", fill: "#E8D7A6", fontSize: "26", fontFamily: "serif", fontWeight: "bold" }, "9"))))));
};
exports.ElEremitaEgyptianCard = ElEremitaEgyptianCard;

};

// --- components/cards/PhysicalTarotCard.tsx ---
__modules["components/cards/PhysicalTarotCard.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicalTarotCard = void 0;
const react_1 = __importDefault(require("react"));
const CardImage_tsx_1 = require("components/cards/CardImage.tsx");
const LaSacerdotisaEgyptianCard_tsx_1 = require("components/cards/LaSacerdotisaEgyptianCard.tsx");
const ElEremitaEgyptianCard_tsx_1 = require("components/cards/ElEremitaEgyptianCard.tsx");
const PhysicalTarotCard = ({ cardName = 'EL EREMITA', romanNumeral = 'IX', themePhrase = 'Hay respuestas que necesitan silencio.', rotation = 1.2, scale = 1, className = '', }) => {
    const isHermit = romanNumeral === 'IX' || cardName.toUpperCase().includes('EREMITA') || cardName.toUpperCase().includes('ERMITAÑO');
    return (react_1.default.createElement("div", { className: `relative select-none ${className}`, style: {
            transform: `rotate(${rotation}deg) scale(${scale})`,
            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        } },
        react_1.default.createElement("div", { className: "relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[440px] md:h-[500px] rounded-2xl p-1.5 sm:p-2 overflow-hidden border border-[#00B3A4]/60", style: {
                background: 'linear-gradient(155deg, #00B3A4 0%, #2A0E34 40%, #0D1B2A 100%)',
                boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 179, 164, 0.35)',
            } },
            react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-35 pointer-events-none z-10" }),
            react_1.default.createElement("div", { className: "absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent card-light-sweep pointer-events-none z-10" }),
            react_1.default.createElement("div", { className: "relative w-full h-full rounded-xl overflow-hidden shadow-inner flex items-center justify-center bg-[#07101B]" }, isHermit ? (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "ermitano", alt: "Arcano IX El Eremita", fallbackSvg: react_1.default.createElement(ElEremitaEgyptianCard_tsx_1.ElEremitaEgyptianCard, { className: "w-full h-full object-contain" }) })) : (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "sacerdotisa", alt: "Arcano II La Sacerdotisa", fallbackSvg: react_1.default.createElement(LaSacerdotisaEgyptianCard_tsx_1.LaSacerdotisaEgyptianCard, { className: "w-full h-full object-contain" }) }))))));
};
exports.PhysicalTarotCard = PhysicalTarotCard;

};

// --- components/ui/EditorialBlurredHeading.tsx ---
__modules["components/ui/EditorialBlurredHeading.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorialBlurredHeading = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("motion/react");
/**
 * EditorialBlurredHeading
 *
 * Implements a gradual optical print reveal for serif headings.
 * Simulates high-end editorial gravure printing / analog optical lens focusing
 * as the element crosses the viewport:
 * - Starts at blur(12px), opacity 0, and slight vertical offset (+16px)
 * - Gradually sharpens to blur(0px), opacity 1, and natural baseline (0px)
 * - Triggered with once: true and generous margin for seamless viewing
 */
const EditorialBlurredHeading = ({ children, as: Component = 'h2', className = '', delay = 0.08, duration = 1.15, blurAmount = 12, yOffset = 16, }) => {
    const ref = (0, react_1.useRef)(null);
    const isInView = (0, react_2.useInView)(ref, {
        once: true,
        margin: '-10% 0px -10% 0px',
    });
    const MotionComponent = react_2.motion[Component];
    return (react_1.default.createElement("div", { ref: ref, className: "inline-block w-full" },
        react_1.default.createElement(MotionComponent, { initial: {
                opacity: 0,
                filter: `blur(${blurAmount}px)`,
                y: yOffset,
            }, animate: isInView
                ? {
                    opacity: 1,
                    filter: 'blur(0px)',
                    y: 0,
                }
                : {
                    opacity: 0,
                    filter: `blur(${blurAmount}px)`,
                    y: yOffset,
                }, transition: {
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1], // Smooth editorial cubic bezier
            }, className: className }, children)));
};
exports.EditorialBlurredHeading = EditorialBlurredHeading;

};

// --- components/sections/HeroArtistic.tsx ---
__modules["components/sections/HeroArtistic.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroArtistic = void 0;
const react_1 = __importStar(require("react"));
const PhysicalTarotCard_tsx_1 = require("components/cards/PhysicalTarotCard.tsx");
const lucide_react_1 = require("lucide-react");
const MagneticButton_tsx_1 = require("components/ui/MagneticButton.tsx");
const EditorialBlurredHeading_tsx_1 = require("components/ui/EditorialBlurredHeading.tsx");
const NarmerLogo_tsx_1 = require("components/ui/NarmerLogo.tsx");
const HeroArtistic = ({ onEnterOracle, onExploreChart, onBookSession, }) => {
    const [cardTilted, setCardTilted] = (0, react_1.useState)(false);
    return (react_1.default.createElement("section", { className: "relative min-h-[96vh] flex flex-col justify-between px-6 sm:px-12 md:px-20 pt-28 sm:pt-32 pb-16 sm:pb-20 bg-[#0D1B2A] overflow-hidden" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-40 pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#2A0E34]/40 rounded-full blur-[170px] pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute top-1/3 right-1/4 w-[420px] h-[420px] bg-[#00B3A4]/15 rounded-full blur-[140px] pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute inset-0 pointer-events-none select-none opacity-30" },
            react_1.default.createElement("svg", { className: "w-full h-full", xmlns: "http://www.w3.org/2000/svg" },
                react_1.default.createElement("line", { x1: "0", y1: "48%", x2: "100%", y2: "48%", stroke: "#E8D7A6", strokeWidth: "0.5", strokeDasharray: "3 9" }),
                react_1.default.createElement("line", { x1: "38%", y1: "0", x2: "38%", y2: "100%", stroke: "#E8D7A6", strokeWidth: "0.5", strokeDasharray: "3 9" }),
                react_1.default.createElement("circle", { cx: "70%", cy: "50%", r: "380", stroke: "#00B3A4", strokeWidth: "0.5", fill: "none", opacity: "0.4" }),
                react_1.default.createElement("circle", { cx: "70%", cy: "50%", r: "480", stroke: "#E8D7A6", strokeWidth: "0.5", strokeDasharray: "2 6", fill: "none", opacity: "0.3" })),
            react_1.default.createElement("span", { className: "hidden lg:block absolute top-24 right-12 xl:right-20 font-mono text-[9px] tracking-[0.25em] text-[#7A7A7A]" }, "LAT 31\u00B012'18\" N \u00B7 OBSERVATORIO NARMER \u00B7 GABINETE SIMB\u00D3LICO"),
            react_1.default.createElement("span", { className: "hidden lg:block absolute bottom-24 right-12 xl:right-20 font-mono text-[9px] tracking-[0.25em] text-[#7A7A7A]" }, "RA 14h 29m \u00B7 DEC -62\u00B040' \u00B7 ARCHIVO VII \u00B7 EGIPTO SAGRADO"),
            react_1.default.createElement("span", { className: "hidden xl:block absolute top-32 right-24 font-handwritten text-base text-[#E8D7A6]/50 transform -rotate-6" }, "el ojo que mira hacia el origen")),
        react_1.default.createElement("div", { className: "relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto py-4" },
            react_1.default.createElement("div", { className: "lg:col-span-7 space-y-8 text-left" },
                react_1.default.createElement("div", { className: "flex items-center gap-4" },
                    react_1.default.createElement(NarmerLogo_tsx_1.NarmerLogo, { size: "md", showSubtitle: false, className: "hover:scale-105 transition-transform" }),
                    react_1.default.createElement("div", { className: "flex flex-col" },
                        react_1.default.createElement("div", { className: "flex items-center gap-2" },
                            react_1.default.createElement("span", { className: "w-5 h-[1.5px] bg-[#00B3A4]" }),
                            react_1.default.createElement("span", { className: "font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#00B3A4]" }, "Gabinete de Exploraci\u00F3n Simb\u00F3lica")),
                        react_1.default.createElement("span", { className: "font-editorial text-xs sm:text-sm tracking-[0.2em] uppercase text-[#E8D7A6]/80 mt-0.5" }, "NARMER \u00B7 Tarot y Psicoastrolog\u00EDa"))),
                react_1.default.createElement("div", { className: "space-y-1" },
                    react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h1", delay: 0.1, duration: 1.2, blurAmount: 14, className: "font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] text-[#E8D7A6] tracking-[-0.01em]" }, "Leer los s\u00EDmbolos."),
                    react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h1", delay: 0.28, duration: 1.25, blurAmount: 14, className: "font-editorial italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] text-[#FFFFFF] tracking-[-0.01em]" }, "Escucharte a ti.")),
                react_1.default.createElement("p", { className: "max-w-xl text-base sm:text-lg md:text-xl text-[#E8D7A6]/85 font-editorial font-light leading-relaxed" }, "Tarot y psicoastrolog\u00EDa para mirar hacia adentro. El s\u00EDmbolo no te dice qu\u00E9 va a pasar: te ayuda a contemplar aquello que todav\u00EDa no est\u00E1s viendo."),
                react_1.default.createElement("div", { className: "flex items-center gap-4 text-xs font-handwritten text-[#00B3A4] text-base pt-1" },
                    react_1.default.createElement("span", null, "\u00ABel inconsciente habla en figuras, no en sentencias\u00BB")),
                react_1.default.createElement("div", { className: "pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6" },
                    react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { onClick: onEnterOracle, strength: 0.32, className: "px-7 py-3.5 rounded-none border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,179,164,0.22)] group" },
                        react_1.default.createElement("span", null, "Entrar al or\u00E1culo"),
                        react_1.default.createElement(lucide_react_1.ArrowDownRight, { className: "w-3.5 h-3.5 text-[#00B3A4] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" })),
                    react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { onClick: onExploreChart, strength: 0.25, className: "px-7 py-3.5 rounded-none border border-[#7A7A7A]/40 hover:border-[#00B3A4] text-[#E8D7A6]/80 hover:text-[#00B3A4] font-clean text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300" },
                        react_1.default.createElement(lucide_react_1.Compass, { className: "w-3.5 h-3.5 text-[#00B3A4]" }),
                        react_1.default.createElement("span", null, "Explorar mi carta")))),
            react_1.default.createElement("div", { className: "lg:col-span-5 flex flex-col items-center justify-center relative" },
                react_1.default.createElement("div", { className: "absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full border border-[#00B3A4]/30 border-dashed pointer-events-none animate-[spin_120s_linear_infinite]" }),
                react_1.default.createElement("div", { className: "absolute w-[440px] h-[440px] rounded-full border border-[#E8D7A6]/15 pointer-events-none hidden sm:block" }),
                react_1.default.createElement("div", { className: "relative cursor-pointer animate-breathing-float flex flex-col items-center", onMouseEnter: () => setCardTilted(true), onMouseLeave: () => setCardTilted(false), onClick: onEnterOracle, title: "Haz clic para consultar el or\u00E1culo" },
                    react_1.default.createElement(PhysicalTarotCard_tsx_1.PhysicalTarotCard, { cardName: "LA SACERDOTISA", romanNumeral: "II", themePhrase: "Lo que sabes antes de poder explicarlo.", rotation: cardTilted ? -2.5 : 1.4, scale: 1 }),
                    react_1.default.createElement("div", { className: "mt-5 sm:mt-0 sm:absolute sm:-bottom-8 sm:right-0 font-handwritten text-sm sm:text-base text-[#00B3A4] opacity-90 sm:transform sm:rotate-3 select-none pointer-events-none text-center" }, "arcano de la intuici\u00F3n silenciosa \u2192")))),
        react_1.default.createElement("div", { className: "relative z-10 mt-12 sm:mt-20 pt-6 border-t border-[#7A7A7A]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] sm:text-[11px] font-clean tracking-[0.22em] sm:tracking-[0.25em] text-[#7A7A7A] uppercase max-w-7xl mx-auto w-full" },
            react_1.default.createElement("div", { className: "flex items-center gap-2" },
                react_1.default.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-[#00B3A4]" }),
                react_1.default.createElement("span", null, "Observatorio de Arquetipos")),
            react_1.default.createElement("div", { className: "flex items-center gap-6" },
                react_1.default.createElement("span", { className: "text-[#E8D7A6]/70" }, "01 / 07 \u00B7 Desciende para explorar")))));
};
exports.HeroArtistic = HeroArtistic;

};

// --- components/cards/LaTorreEgyptianCard.tsx ---
__modules["components/cards/LaTorreEgyptianCard.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaTorreEgyptianCard = void 0;
const react_1 = __importDefault(require("react"));
const LaTorreEgyptianCard = ({ className = '' }) => {
    return (react_1.default.createElement("svg", { viewBox: "0 0 450 780", className: `w-full h-full ${className}`, fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid meet" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("clipPath", { id: "torreClip" },
                react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "16" }))),
        react_1.default.createElement("rect", { x: "5", y: "5", width: "440", height: "770", rx: "28", fill: "#00B3A4" }),
        react_1.default.createElement("rect", { x: "18", y: "18", width: "414", height: "744", rx: "20", fill: "#0E1724", stroke: "#E8D7A6", strokeWidth: "2.5" }),
        react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "14", fill: "#0D1B2A" }),
        react_1.default.createElement("g", { clipPath: "url(#torreClip)" },
            react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "200", fill: "#250B30" }),
            react_1.default.createElement("g", { fill: "#FFFFFF", opacity: "0.8" },
                react_1.default.createElement("circle", { cx: "80", cy: "65", r: "1.5" }),
                react_1.default.createElement("circle", { cx: "120", cy: "90", r: "1.2" }),
                react_1.default.createElement("circle", { cx: "340", cy: "70", r: "1.5" }),
                react_1.default.createElement("circle", { cx: "370", cy: "110", r: "1.2" })),
            react_1.default.createElement("circle", { cx: "225", cy: "80", r: "30", stroke: "#E8D7A6", strokeWidth: "1.8", fill: "#E8D7A6", fillOpacity: "0.2" }),
            react_1.default.createElement("rect", { x: "25", y: "225", width: "400", height: "4", fill: "#0E1724" }),
            react_1.default.createElement("rect", { x: "25", y: "229", width: "400", height: "520", fill: "#07121E" }),
            react_1.default.createElement("g", { id: "egyptianTower", transform: "translate(145, 270)" },
                react_1.default.createElement("path", { d: "M 80, -35 L 70, 20 L 95, 15 L 75, 75 L 105, 70 L 60, 160", stroke: "#00B3A4", strokeWidth: "4", fill: "none", strokeLinecap: "round" }),
                react_1.default.createElement("path", { d: "M 80, -35 L 70, 20 L 95, 15 L 75, 75 L 105, 70 L 60, 160", stroke: "#FFFFFF", strokeWidth: "1.8", fill: "none" }),
                react_1.default.createElement("g", { fill: "#E8D7A6" },
                    react_1.default.createElement("ellipse", { cx: "20", cy: "120", rx: "3", ry: "6", transform: "rotate(-20 20 120)" }),
                    react_1.default.createElement("ellipse", { cx: "40", cy: "90", rx: "3", ry: "6", transform: "rotate(15 40 90)" }),
                    react_1.default.createElement("ellipse", { cx: "120", cy: "110", rx: "3", ry: "6", transform: "rotate(30 120 110)" }),
                    react_1.default.createElement("ellipse", { cx: "140", cy: "140", rx: "3", ry: "6", transform: "rotate(-15 140 140)" }),
                    react_1.default.createElement("ellipse", { cx: "10", cy: "170", rx: "3", ry: "6", transform: "rotate(40 10 170)" }),
                    react_1.default.createElement("ellipse", { cx: "150", cy: "190", rx: "3", ry: "6", transform: "rotate(-30 150 190)" })),
                react_1.default.createElement("polygon", { points: "50,45 110,45 125,15 95,28 80,10 65,28 35,15", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "2", transform: "rotate(12 80 30)" }),
                react_1.default.createElement("polygon", { points: "50,60 110,60 125,360 35,360", fill: "#250B30", stroke: "#00B3A4", strokeWidth: "2" }),
                react_1.default.createElement("line", { x1: "48", y1: "110", x2: "112", y2: "110", stroke: "#E8D7A6", strokeWidth: "1", opacity: "0.6" }),
                react_1.default.createElement("line", { x1: "46", y1: "160", x2: "114", y2: "160", stroke: "#E8D7A6", strokeWidth: "1", opacity: "0.6" }),
                react_1.default.createElement("line", { x1: "44", y1: "210", x2: "116", y2: "210", stroke: "#E8D7A6", strokeWidth: "1", opacity: "0.6" }),
                react_1.default.createElement("line", { x1: "41", y1: "260", x2: "119", y2: "260", stroke: "#E8D7A6", strokeWidth: "1", opacity: "0.6" }),
                react_1.default.createElement("line", { x1: "38", y1: "310", x2: "122", y2: "310", stroke: "#E8D7A6", strokeWidth: "1", opacity: "0.6" }),
                react_1.default.createElement("path", { d: "M 70,125 A 10,10 0 0,1 90,125 L 90,150 L 70,150 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 68,225 A 12,12 0 0,1 92,225 L 92,255 L 68,255 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 65,300 A 15,15 0 0,1 95,300 L 95,360 L 65,360 Z", fill: "#0E1724", stroke: "#E8D7A6", strokeWidth: "1.5" })),
            react_1.default.createElement("line", { x1: "25", y1: "630", x2: "425", y2: "630", stroke: "#E8D7A6", strokeWidth: "2" }),
            react_1.default.createElement("rect", { x: "25", y: "632", width: "400", height: "88", fill: "#1A0D22" }),
            react_1.default.createElement("path", { d: "M 40,720 C 40,640 410,640 410,720", stroke: "#00B3A4", strokeWidth: "2.5", fill: "none" }),
            react_1.default.createElement("text", { x: "390", y: "695", fill: "#E8D7A6", fontSize: "32", fontFamily: "serif", fontWeight: "bold", textAnchor: "middle" }, "16"),
            react_1.default.createElement("rect", { x: "25", y: "720", width: "400", height: "42", fill: "#250B30", stroke: "#E8D7A6", strokeWidth: "2" }),
            react_1.default.createElement("text", { x: "225", y: "748", fill: "#E8D7A6", fontSize: "23", fontFamily: "'Cinzel', serif", fontWeight: "700", letterSpacing: "3", textAnchor: "middle" }, "LA TORRE"),
            react_1.default.createElement("text", { x: "380", y: "748", fill: "#E8D7A6", fontSize: "22", fontFamily: "serif", fontWeight: "bold" }, "16"))));
};
exports.LaTorreEgyptianCard = LaTorreEgyptianCard;

};

// --- components/cards/ElColgadoEgyptianCard.tsx ---
__modules["components/cards/ElColgadoEgyptianCard.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElColgadoEgyptianCard = void 0;
const react_1 = __importDefault(require("react"));
const ElColgadoEgyptianCard = ({ className = '' }) => {
    return (react_1.default.createElement("svg", { viewBox: "0 0 450 780", className: `w-full h-full ${className}`, fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid meet" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("clipPath", { id: "colgadoClip" },
                react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "16" }))),
        react_1.default.createElement("rect", { x: "5", y: "5", width: "440", height: "770", rx: "28", fill: "#00B3A4" }),
        react_1.default.createElement("rect", { x: "18", y: "18", width: "414", height: "744", rx: "20", fill: "#0E1724", stroke: "#E8D7A6", strokeWidth: "2.5" }),
        react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "14", fill: "#0D1B2A" }),
        react_1.default.createElement("g", { clipPath: "url(#colgadoClip)" },
            react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "200", fill: "#250B30" }),
            react_1.default.createElement("g", { fill: "#FFFFFF", opacity: "0.8" },
                react_1.default.createElement("circle", { cx: "80", cy: "65", r: "1.5" }),
                react_1.default.createElement("circle", { cx: "370", cy: "70", r: "1.5" })),
            react_1.default.createElement("circle", { cx: "225", cy: "80", r: "28", stroke: "#00B3A4", strokeWidth: "2", fill: "#E8D7A6", fillOpacity: "0.25" }),
            react_1.default.createElement("rect", { x: "25", y: "225", width: "400", height: "4", fill: "#0E1724" }),
            react_1.default.createElement("rect", { x: "25", y: "229", width: "400", height: "520", fill: "#07121E" }),
            react_1.default.createElement("g", { stroke: "#7A7A7A", strokeWidth: "12", strokeLinecap: "round" },
                react_1.default.createElement("line", { x1: "110", y1: "260", x2: "110", y2: "640" }),
                react_1.default.createElement("line", { x1: "340", y1: "260", x2: "340", y2: "640" }),
                react_1.default.createElement("line", { x1: "90", y1: "260", x2: "360", y2: "260" })),
            react_1.default.createElement("g", { stroke: "#00B3A4", strokeWidth: "2", fill: "none" },
                react_1.default.createElement("path", { d: "M 110,320 Q 95,310 90,325" }),
                react_1.default.createElement("path", { d: "M 110,420 Q 85,410 90,430" }),
                react_1.default.createElement("path", { d: "M 340,320 Q 355,310 360,325" }),
                react_1.default.createElement("path", { d: "M 340,420 Q 365,410 360,430" })),
            react_1.default.createElement("g", { id: "suspendedFigure" },
                react_1.default.createElement("line", { x1: "225", y1: "260", x2: "225", y2: "340", stroke: "#00B3A4", strokeWidth: "4" }),
                react_1.default.createElement("circle", { cx: "225", cy: "565", r: "32", fill: "#E8D7A6", opacity: "0.9" }),
                react_1.default.createElement("circle", { cx: "225", cy: "565", r: "40", stroke: "#00B3A4", strokeWidth: "1.5", strokeDasharray: "3 3" }),
                react_1.default.createElement("circle", { cx: "225", cy: "565", r: "20", fill: "#F4E8D1", stroke: "#0E1724", strokeWidth: "1.4" }),
                react_1.default.createElement("path", { d: "M 210,575 Q 225,615 240,575", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
                react_1.default.createElement("path", { d: "M 200,430 L 250,430 L 245,540 L 205,540 Z", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.6" }),
                react_1.default.createElement("path", { d: "M 205,460 L 175,490 L 205,520", stroke: "#F4E8D1", strokeWidth: "8", strokeLinecap: "round", strokeLinejoin: "round" }),
                react_1.default.createElement("path", { d: "M 245,460 L 275,490 L 245,520", stroke: "#F4E8D1", strokeWidth: "8", strokeLinecap: "round", strokeLinejoin: "round" }),
                react_1.default.createElement("line", { x1: "225", y1: "340", x2: "225", y2: "430", stroke: "#F4E8D1", strokeWidth: "12", strokeLinecap: "round" }),
                react_1.default.createElement("path", { d: "M 225,385 L 280,385 L 225,430", stroke: "#522368", strokeWidth: "10", strokeLinecap: "round", strokeLinejoin: "round" })),
            react_1.default.createElement("line", { x1: "25", y1: "640", x2: "425", y2: "640", stroke: "#E8D7A6", strokeWidth: "2" }),
            react_1.default.createElement("rect", { x: "25", y: "642", width: "400", height: "78", fill: "#1A0D22" }),
            react_1.default.createElement("text", { x: "390", y: "695", fill: "#E8D7A6", fontSize: "32", fontFamily: "serif", fontWeight: "bold", textAnchor: "middle" }, "12"),
            react_1.default.createElement("rect", { x: "25", y: "720", width: "400", height: "42", fill: "#250B30", stroke: "#E8D7A6", strokeWidth: "2" }),
            react_1.default.createElement("text", { x: "225", y: "748", fill: "#E8D7A6", fontSize: "23", fontFamily: "'Cinzel', serif", fontWeight: "700", letterSpacing: "3", textAnchor: "middle" }, "EL COLGADO"),
            react_1.default.createElement("text", { x: "380", y: "748", fill: "#E8D7A6", fontSize: "22", fontFamily: "serif", fontWeight: "bold" }, "12"))));
};
exports.ElColgadoEgyptianCard = ElColgadoEgyptianCard;

};

// --- components/cards/LaLunaEgyptianCard.tsx ---
__modules["components/cards/LaLunaEgyptianCard.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaLunaEgyptianCard = void 0;
const react_1 = __importDefault(require("react"));
const LaLunaEgyptianCard = ({ className = '' }) => {
    return (react_1.default.createElement("svg", { viewBox: "0 0 450 780", className: `w-full h-full ${className}`, fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid meet" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("clipPath", { id: "lunaClip" },
                react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "16" }))),
        react_1.default.createElement("rect", { x: "5", y: "5", width: "440", height: "770", rx: "28", fill: "#00B3A4" }),
        react_1.default.createElement("rect", { x: "18", y: "18", width: "414", height: "744", rx: "20", fill: "#0E1724", stroke: "#E8D7A6", strokeWidth: "2.5" }),
        react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "14", fill: "#0D1B2A" }),
        react_1.default.createElement("g", { clipPath: "url(#lunaClip)" },
            react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "200", fill: "#250B30" }),
            react_1.default.createElement("g", { fill: "#FFFFFF", opacity: "0.8" },
                react_1.default.createElement("circle", { cx: "70", cy: "55", r: "1.5" }),
                react_1.default.createElement("circle", { cx: "110", cy: "80", r: "1.2" }),
                react_1.default.createElement("circle", { cx: "340", cy: "60", r: "1.5" }),
                react_1.default.createElement("circle", { cx: "380", cy: "90", r: "1.2" })),
            react_1.default.createElement("rect", { x: "25", y: "225", width: "400", height: "4", fill: "#0E1724" }),
            react_1.default.createElement("rect", { x: "25", y: "229", width: "400", height: "520", fill: "#07121E" }),
            react_1.default.createElement("g", { id: "lunarEclipse", transform: "translate(225, 275)" },
                react_1.default.createElement("circle", { cx: "0", cy: "0", r: "70", stroke: "#00B3A4", strokeWidth: "1", strokeDasharray: "3 3" }),
                react_1.default.createElement("g", { fill: "#E8D7A6" },
                    react_1.default.createElement("ellipse", { cx: "-55", cy: "-35", rx: "3", ry: "5", transform: "rotate(-30 -55 -35)" }),
                    react_1.default.createElement("ellipse", { cx: "55", cy: "-35", rx: "3", ry: "5", transform: "rotate(30 55 -35)" }),
                    react_1.default.createElement("ellipse", { cx: "-65", cy: "15", rx: "3", ry: "5", transform: "rotate(-15 -65 15)" }),
                    react_1.default.createElement("ellipse", { cx: "65", cy: "15", rx: "3", ry: "5", transform: "rotate(15 65 15)" }),
                    react_1.default.createElement("ellipse", { cx: "-45", cy: "60", rx: "3", ry: "5", transform: "rotate(20 -45 60)" }),
                    react_1.default.createElement("ellipse", { cx: "45", cy: "60", rx: "3", ry: "5", transform: "rotate(-20 45 60)" })),
                react_1.default.createElement("circle", { cx: "0", cy: "0", r: "50", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "2" }),
                react_1.default.createElement("path", { d: "M 5, -45 \n               C 35, -25 35, 25 5, 45 \n               C 18, 25 18, -25 5, -45 Z", fill: "#250B30", stroke: "#00B3A4", strokeWidth: "1.2" })),
            react_1.default.createElement("polygon", { points: "65,390 115,390 125,560 55,560", fill: "#250B30", stroke: "#7A7A7A", strokeWidth: "2" }),
            react_1.default.createElement("rect", { x: "60", y: "380", width: "60", height: "10", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
            react_1.default.createElement("path", { d: "M 80,440 A 8,8 0 0,1 100,440 L 100,470 L 80,470 Z", fill: "#00B3A4" }),
            react_1.default.createElement("polygon", { points: "335,390 385,390 395,560 325,560", fill: "#250B30", stroke: "#7A7A7A", strokeWidth: "2" }),
            react_1.default.createElement("rect", { x: "330", y: "380", width: "60", height: "10", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
            react_1.default.createElement("path", { d: "M 350,440 A 8,8 0 0,1 370,440 L 370,470 L 350,470 Z", fill: "#00B3A4" }),
            react_1.default.createElement("g", { transform: "translate(140, 480)", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1.2" },
                react_1.default.createElement("path", { d: "M 10,70 L 15,35 L 28,15 L 35,5 L 32,18 L 38,20 L 32,32 L 35,70 Z" })),
            react_1.default.createElement("g", { transform: "translate(270, 480) scale(-1, 1)", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" },
                react_1.default.createElement("path", { d: "M 10,70 L 15,35 L 28,15 L 35,5 L 32,18 L 38,20 L 32,32 L 35,70 Z" })),
            react_1.default.createElement("path", { d: "M 25,560 Q 225,530 425,560 L 425,650 L 25,650 Z", fill: "#0A1C2A", stroke: "#00B3A4", strokeWidth: "1.8" }),
            react_1.default.createElement("line", { x1: "80", y1: "580", x2: "370", y2: "580", stroke: "#00B3A4", strokeWidth: "1", strokeDasharray: "6 8", opacity: "0.7" }),
            react_1.default.createElement("line", { x1: "120", y1: "605", x2: "330", y2: "605", stroke: "#00B3A4", strokeWidth: "1", strokeDasharray: "5 7", opacity: "0.7" }),
            react_1.default.createElement("ellipse", { cx: "225", cy: "590", rx: "16", ry: "12", fill: "#E8D7A6", stroke: "#0E1724", strokeWidth: "1.2" }),
            react_1.default.createElement("circle", { cx: "225", cy: "580", r: "7", fill: "#00B3A4", stroke: "#0E1724", strokeWidth: "1" }),
            react_1.default.createElement("rect", { x: "25", y: "720", width: "400", height: "42", fill: "#250B30", stroke: "#E8D7A6", strokeWidth: "2" }),
            react_1.default.createElement("text", { x: "225", y: "748", fill: "#E8D7A6", fontSize: "23", fontFamily: "'Cinzel', serif", fontWeight: "700", letterSpacing: "3", textAnchor: "middle" }, "LA LUNA"),
            react_1.default.createElement("text", { x: "380", y: "748", fill: "#E8D7A6", fontSize: "22", fontFamily: "serif", fontWeight: "bold" }, "18"))));
};
exports.LaLunaEgyptianCard = LaLunaEgyptianCard;

};

// --- components/sections/TarotGalleryArtistic.tsx ---
__modules["components/sections/TarotGalleryArtistic.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarotGalleryArtistic = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("motion/react");
const EditorialBlurredHeading_tsx_1 = require("components/ui/EditorialBlurredHeading.tsx");
const CardImage_tsx_1 = require("components/cards/CardImage.tsx");
const LaSacerdotisaEgyptianCard_tsx_1 = require("components/cards/LaSacerdotisaEgyptianCard.tsx");
const ElEremitaEgyptianCard_tsx_1 = require("components/cards/ElEremitaEgyptianCard.tsx");
const LaTorreEgyptianCard_tsx_1 = require("components/cards/LaTorreEgyptianCard.tsx");
const ElColgadoEgyptianCard_tsx_1 = require("components/cards/ElColgadoEgyptianCard.tsx");
const LaLunaEgyptianCard_tsx_1 = require("components/cards/LaLunaEgyptianCard.tsx");
const ARCANA_LIST = [
    {
        id: 'sacerdotisa',
        numeral: 'II',
        name: 'La Sacerdotisa',
        reflection: 'Lo que sabes antes de poder explicarlo.',
        archetype: 'El inconsciente y la intuición que aguarda en silencio.',
        tilt: -2.2,
        offsetY: 0,
        symbolColor: '#00B3A4',
        svgGraphic: 'priestess',
    },
    {
        id: 'ermitano',
        numeral: 'IX',
        name: 'El Ermitaño',
        reflection: 'Hay respuestas que necesitan silencio.',
        archetype: 'La lámpara interior; retirarse del ruido para escuchar lo esencial.',
        tilt: 1.8,
        offsetY: 28,
        symbolColor: '#E8D7A6',
        svgGraphic: 'hermit',
    },
    {
        id: 'torre',
        numeral: 'XVI',
        name: 'La Torre',
        reflection: 'Lo que cae también libera.',
        archetype: 'El colapso de la coraza ilusoria; el relámpago que despierta.',
        tilt: -1.2,
        offsetY: -16,
        symbolColor: '#2A0E34',
        svgGraphic: 'tower',
    },
    {
        id: 'colgado',
        numeral: 'XII',
        name: 'El Colgado',
        reflection: 'Cambiar de perspectiva cuando nada se mueve.',
        archetype: 'La pausa voluntaria; ver el mundo invertido para entender su peso.',
        tilt: 2.5,
        offsetY: 20,
        symbolColor: '#00B3A4',
        svgGraphic: 'hanged',
    },
    {
        id: 'luna',
        numeral: 'XVIII',
        name: 'La Luna',
        reflection: 'Las verdades que sólo se ven a oscuras.',
        archetype: 'El territorio de los sueños, la sombra fértil y el agua primordial.',
        tilt: -2.8,
        offsetY: 6,
        symbolColor: '#E8D7A6',
        svgGraphic: 'moon',
    },
];
const TarotGalleryArtistic = () => {
    const [activeCardId, setActiveCardId] = (0, react_1.useState)('sacerdotisa');
    const activeCard = ARCANA_LIST.find((c) => c.id === activeCardId) || ARCANA_LIST[0];
    return (react_1.default.createElement("section", { id: "tarot", className: "py-28 px-6 sm:px-12 md:px-20 bg-[#070F18] relative overflow-hidden border-t border-[#7A7A7A]/25" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-40 pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute right-10 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#00B3A4]/15 pointer-events-none" }),
        react_1.default.createElement("div", { className: "max-w-7xl mx-auto relative z-10" },
            react_1.default.createElement("div", { className: "flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6" },
                react_1.default.createElement("div", { className: "max-w-xl" },
                    react_1.default.createElement("div", { className: "flex items-center gap-3 mb-3" },
                        react_1.default.createElement("span", { className: "w-6 h-[1.5px] bg-[#00B3A4]" }),
                        react_1.default.createElement("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]" }, "Cap\u00EDtulo I \u00B7 El Alfabeto del Alma")),
                    react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h2", delay: 0.12, duration: 1.2, blurAmount: 12, className: "font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]" }, "78 maneras de mirarte."),
                    react_1.default.createElement("p", { className: "mt-4 font-editorial text-base sm:text-lg text-[#E8D7A6]/80 font-light leading-relaxed" }, "Cada arcano no es un pron\u00F3stico del ma\u00F1ana: es un espejo que nombra un estado de tu mundo interno. Pasa el cursor o selecciona cada carta para contemplar su resonancia.")),
                react_1.default.createElement("div", { className: "p-6 border border-[#00B3A4]/35 bg-[#1A0B22] max-w-sm rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.6)]" },
                    react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block mb-1" },
                        "Arcano ",
                        activeCard.numeral,
                        " \u00B7 ",
                        activeCard.name),
                    react_1.default.createElement("p", { className: "font-editorial italic text-lg sm:text-xl text-[#E8D7A6] leading-snug" },
                        "\u00AB",
                        activeCard.reflection,
                        "\u00BB"),
                    react_1.default.createElement("p", { className: "mt-2 text-xs font-clean text-[#E8D7A6]/75 leading-relaxed font-light" }, activeCard.archetype))),
            react_1.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-8 lg:gap-5 items-center pt-4 pb-8", style: { perspective: 1200 } }, ARCANA_LIST.map((card) => {
                const isActive = activeCardId === card.id;
                const desktopOffsetClass = card.offsetY > 20
                    ? 'lg:mt-10'
                    : card.offsetY > 10
                        ? 'lg:mt-7'
                        : card.offsetY > 0
                            ? 'lg:mt-3'
                            : card.offsetY < 0
                                ? 'lg:-mt-6'
                                : '';
                return (react_1.default.createElement(react_2.motion.div, { key: card.id, onMouseEnter: () => setActiveCardId(card.id), onClick: () => setActiveCardId(card.id), className: `cursor-pointer group flex flex-col items-center ${desktopOffsetClass}`, initial: {
                        y: 0,
                        rotateZ: card.tilt,
                        rotateX: 0,
                        rotateY: 0,
                        scale: 1,
                    }, whileHover: {
                        y: -14,
                        rotateZ: card.tilt * 0.35,
                        rotateX: -8,
                        rotateY: card.tilt > 0 ? 9 : -9,
                        scale: 1.055,
                        transition: {
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                        },
                    }, style: {
                        transformStyle: 'preserve-3d',
                    } },
                    react_1.default.createElement("div", { className: `w-full max-w-[220px] aspect-[450/780] rounded-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${isActive
                            ? 'border border-[#00B3A4] shadow-[0_24px_50px_rgba(0,0,0,0.95),0_0_20px_rgba(0,179,164,0.3)]'
                            : 'border border-[#7A7A7A]/30 opacity-80 hover:opacity-100 hover:border-[#00B3A4]/60 shadow-[0_12px_30px_rgba(0,0,0,0.7)]'}`, style: {
                            transformStyle: 'preserve-3d',
                        } },
                        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-30 pointer-events-none z-10" }),
                        react_1.default.createElement("div", { className: "absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -rotate-12 z-10" }),
                        react_1.default.createElement("div", { className: "w-full h-full bg-[#07101B] flex items-center justify-center p-0.5" },
                            card.id === 'sacerdotisa' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "sacerdotisa", alt: "Arcano II La Sacerdotisa", fallbackSvg: react_1.default.createElement(LaSacerdotisaEgyptianCard_tsx_1.LaSacerdotisaEgyptianCard, { className: "w-full h-full object-contain" }) })),
                            card.id === 'ermitano' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "ermitano", alt: "Arcano IX El Eremita", fallbackSvg: react_1.default.createElement(ElEremitaEgyptianCard_tsx_1.ElEremitaEgyptianCard, { className: "w-full h-full object-contain" }) })),
                            card.id === 'torre' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "torre", alt: "Arcano XVI La Torre", fallbackSvg: react_1.default.createElement(LaTorreEgyptianCard_tsx_1.LaTorreEgyptianCard, { className: "w-full h-full object-contain" }) })),
                            card.id === 'colgado' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "colgado", alt: "Arcano XII El Colgado", fallbackSvg: react_1.default.createElement(ElColgadoEgyptianCard_tsx_1.ElColgadoEgyptianCard, { className: "w-full h-full object-contain" }) })),
                            card.id === 'luna' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "luna", alt: "Arcano XVIII La Luna", fallbackSvg: react_1.default.createElement(LaLunaEgyptianCard_tsx_1.LaLunaEgyptianCard, { className: "w-full h-full object-contain" }) })))),
                    react_1.default.createElement("div", { className: `mt-3 w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-[#00B3A4] scale-125' : 'bg-[#7A7A7A]/30'}` })));
            })))));
};
exports.TarotGalleryArtistic = TarotGalleryArtistic;

};

// --- components/oracle/TarotRitualExperience.tsx ---
__modules["components/oracle/TarotRitualExperience.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TarotRitualExperience = void 0;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const MagneticButton_tsx_1 = require("components/ui/MagneticButton.tsx");
const EditorialBlurredHeading_tsx_1 = require("components/ui/EditorialBlurredHeading.tsx");
const CardImage_tsx_1 = require("components/cards/CardImage.tsx");
const LaSacerdotisaEgyptianCard_tsx_1 = require("components/cards/LaSacerdotisaEgyptianCard.tsx");
const ElEremitaEgyptianCard_tsx_1 = require("components/cards/ElEremitaEgyptianCard.tsx");
const LaTorreEgyptianCard_tsx_1 = require("components/cards/LaTorreEgyptianCard.tsx");
const ElColgadoEgyptianCard_tsx_1 = require("components/cards/ElColgadoEgyptianCard.tsx");
const LaLunaEgyptianCard_tsx_1 = require("components/cards/LaLunaEgyptianCard.tsx");
const supabase_ts_1 = require("services/supabase.ts");
const SymbolicEgyptianArcanaSvg = ({ numeral, title, }) => (react_1.default.createElement("svg", { viewBox: "0 0 450 780", className: "w-full h-full object-contain", fill: "none", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid meet" },
    react_1.default.createElement("rect", { x: "5", y: "5", width: "440", height: "770", rx: "28", fill: "#00B3A4" }),
    react_1.default.createElement("rect", { x: "18", y: "18", width: "414", height: "744", rx: "20", fill: "#0E1724", stroke: "#E8D7A6", strokeWidth: "2.5" }),
    react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "730", rx: "14", fill: "#0D1B2A" }),
    react_1.default.createElement("rect", { x: "25", y: "25", width: "400", height: "190", fill: "#250B30" }),
    react_1.default.createElement("circle", { cx: "225", cy: "115", r: "42", stroke: "#E8D7A6", strokeWidth: "2", fill: "#E8D7A6", fillOpacity: "0.18" }),
    react_1.default.createElement("circle", { cx: "225", cy: "115", r: "56", stroke: "#00B3A4", strokeWidth: "1.2", strokeDasharray: "4 6" }),
    react_1.default.createElement("rect", { x: "25", y: "215", width: "400", height: "4", fill: "#0E1724" }),
    react_1.default.createElement("rect", { x: "25", y: "219", width: "400", height: "420", fill: "#07121E" }),
    react_1.default.createElement("polygon", { points: "225,270 125,560 325,560", stroke: "#00B3A4", strokeWidth: "2", fill: "#250B30", fillOpacity: "0.65" }),
    react_1.default.createElement("polygon", { points: "225,310 155,540 295,540", stroke: "#E8D7A6", strokeWidth: "1.2", fill: "none", strokeDasharray: "4 4" }),
    react_1.default.createElement("circle", { cx: "225", cy: "450", r: "36", fill: "#0D1B2A", stroke: "#E8D7A6", strokeWidth: "2" }),
    react_1.default.createElement("text", { x: "225", y: "462", fill: "#00B3A4", fontSize: "34", fontFamily: "'Cinzel', serif", fontWeight: "700", textAnchor: "middle" }, numeral),
    react_1.default.createElement("line", { x1: "25", y1: "640", x2: "425", y2: "640", stroke: "#E8D7A6", strokeWidth: "2" }),
    react_1.default.createElement("rect", { x: "25", y: "642", width: "400", height: "78", fill: "#1A0D22" }),
    react_1.default.createElement("path", { d: "M 45,720 C 45,650 405,650 405,720", stroke: "#00B3A4", strokeWidth: "2", fill: "none" }),
    react_1.default.createElement("rect", { x: "25", y: "720", width: "400", height: "35", fill: "#250B30", stroke: "#E8D7A6", strokeWidth: "2" }),
    react_1.default.createElement("text", { x: "225", y: "744", fill: "#E8D7A6", fontSize: "21", fontFamily: "'Cinzel', serif", fontWeight: "700", letterSpacing: "3", textAnchor: "middle" }, title.toUpperCase())));
const DECK = [
    {
        numeral: 'II',
        name: 'La Sacerdotisa',
        reflection: 'Lo que sabes antes de poder explicarlo.',
        pastInsight: 'Un período de gestación silenciosa o una verdad que tuviste que guardar para ti.',
        presentInsight: 'Estás ante una situación que requiere confiar en tu percepción intuitiva más que en opiniones ajenas.',
        unseenInsight: 'Aquello que callas por temor al juicio ajeno; tu sabiduría primordial pide salir a la luz.',
        archetypeDetail: 'Arquetipo del Inconsciente y el Umbral de los Misterios.',
    },
    {
        numeral: 'IX',
        name: 'El Ermitaño',
        reflection: 'Hay respuestas que necesitan silencio.',
        pastInsight: 'Un aislamiento necesario donde aprendiste a sostenerte sin aplausos exteriores.',
        presentInsight: 'Es momento de bajar la velocidad. La respuesta no está en el afuera, sino en tu propia lámpara.',
        unseenInsight: 'El miedo a caminar solo te lleva a buscar consejos donde en realidad ya tienes la respuesta.',
        archetypeDetail: 'Arquetipo del Anciano Sabio y la Retirada Sagrada.',
    },
    {
        numeral: 'XVI',
        name: 'La Torre',
        reflection: 'Lo que cae también libera.',
        pastInsight: 'Una ruptura inesperada que desmanteló una estructura rígida en tu vida.',
        presentInsight: 'Una verdad incómoda está resquebrajando una ilusión protectora para devolverte autenticidad.',
        unseenInsight: 'La resistencia a soltar lo que ya no tiene cimientos; la demolición es el inicio de la claridad.',
        archetypeDetail: 'Arquetipo de la Metanoia y la Disolución de la Máscara.',
    },
    {
        numeral: 'XII',
        name: 'El Colgado',
        reflection: 'Cambiar de perspectiva cuando nada se mueve.',
        pastInsight: 'Una renuncia consciente o un sacrificio que te obligó a mirar la realidad al revés.',
        presentInsight: 'Estás en una pausa fecunda. No fuerces la acción; la transformación ocurre en el cambio de mirada.',
        unseenInsight: 'La obsesión con el control; rendirse a los ritmos naturales no es debilidad, es sabiduría.',
        archetypeDetail: 'Arquetipo de la Iniciación y la Suspensión Voluntaria.',
    },
    {
        numeral: 'I',
        name: 'El Mago',
        reflection: 'Tienes todas las herramientas sobre la mesa.',
        pastInsight: 'El descubrimiento inicial de tu propia potencia creadora y recursos innatos.',
        presentInsight: 'La capacidad de articular palabra, deseo y acción en un solo gesto coherente.',
        unseenInsight: 'El síndrome del impostor que te hace esperar una autorización exterior que nunca llegará.',
        archetypeDetail: 'Arquetipo del Creador y la Voluntad Alquímica.',
    },
    {
        numeral: 'XVIII',
        name: 'La Luna',
        reflection: 'Las verdades que sólo se ven a oscuras.',
        pastInsight: 'Emociones reprimidas o temores ancestrales que moldearon tus formas de apego.',
        presentInsight: 'Navegas en aguas brumosas. No tomes decisiones drásticas; observa los sueños y las señales sutiles.',
        unseenInsight: 'Una herida de rechazo que proyectas sobre tu entorno actual sin darte cuenta.',
        archetypeDetail: 'Arquetipo del Océano Psíquico y la Sombra Fértil.',
    },
    {
        numeral: 'XVII',
        name: 'La Estrella',
        reflection: 'La fe después de la tormenta.',
        pastInsight: 'Un instante de sanación profunda tras una época de pérdida o sequía interior.',
        presentInsight: 'Tu energía se renueva. Estás derramando tu agua en el cauce correcto con generosidad.',
        unseenInsight: 'La dificultad para recibir y descansar en la gracia; permítete ser sostenido.',
        archetypeDetail: 'Arquetipo de la Guía Trascendente y la Esperanza Serena.',
    },
    {
        numeral: 'IV',
        name: 'El Emperador',
        reflection: 'La autoridad interior que no necesita gritar.',
        pastInsight: 'La necesidad de imponer límites estrictos o lidiar con figuras paternas de peso.',
        presentInsight: 'La construcción de orden, territorio y estabilidad material con madurez.',
        unseenInsight: 'La rigidez defensiva que te impide ser vulnerable con quienes amas.',
        archetypeDetail: 'Arquetipo del Orden Estructural y el Liderazgo Justo.',
    },
];
const TarotRitualExperience = () => {
    const [question, setQuestion] = (0, react_1.useState)('');
    const [step, setStep] = (0, react_1.useState)('input');
    const [revealedCards, setRevealedCards] = (0, react_1.useState)([]);
    const [activeRevealedCard, setActiveRevealedCard] = (0, react_1.useState)(0);
    const handleStartShuffle = (e) => {
        e.preventDefault();
        if (!question.trim())
            return;
        setStep('shuffling');
        // Simulate ceremonial shuffle animation
        setTimeout(() => {
            // Pick 3 unique cards
            const shuffled = [...DECK].sort(() => 0.5 - Math.random());
            const selected = [
                {
                    slot: 'PASADO',
                    subtitle: 'La raíz oculta que te trajo hasta aquí',
                    numeral: shuffled[0].numeral,
                    name: shuffled[0].name,
                    reflection: shuffled[0].reflection,
                    insight: shuffled[0].pastInsight,
                    archetypeDetail: shuffled[0].archetypeDetail,
                },
                {
                    slot: 'PRESENTE',
                    subtitle: 'El espejo del momento presente',
                    numeral: shuffled[1].numeral,
                    name: shuffled[1].name,
                    reflection: shuffled[1].reflection,
                    insight: shuffled[1].presentInsight,
                    archetypeDetail: shuffled[1].archetypeDetail,
                },
                {
                    slot: 'LO QUE PIDE SER MIRADO',
                    subtitle: 'La invitación del inconsciente para tu integración',
                    numeral: shuffled[2].numeral,
                    name: shuffled[2].name,
                    reflection: shuffled[2].reflection,
                    insight: shuffled[2].unseenInsight,
                    archetypeDetail: shuffled[2].archetypeDetail,
                },
            ];
            setRevealedCards(selected);
            setActiveRevealedCard(0);
            setStep('revealed');
            // Registro opcional y no bloqueante en Supabase Database si está configurado
            void (0, supabase_ts_1.insertSupabaseRecord)('oracle_consultations', {
                question: question.trim(),
                past_card: `${selected[0].numeral} - ${selected[0].name}`,
                present_card: `${selected[1].numeral} - ${selected[1].name}`,
                unseen_card: `${selected[2].numeral} - ${selected[2].name}`,
                created_at: new Date().toISOString(),
            });
        }, 2800);
    };
    const handleReset = () => {
        setQuestion('');
        setStep('input');
        setRevealedCards([]);
        setActiveRevealedCard(0);
    };
    return (react_1.default.createElement("section", { id: "oraculo", className: "py-28 px-6 sm:px-12 md:px-20 bg-[#0D1B2A] relative overflow-hidden border-t border-[#7A7A7A]/25" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-35 pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2A0E34]/35 rounded-full blur-[180px] pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-[#00B3A4]/10 rounded-full blur-[140px] pointer-events-none" }),
        react_1.default.createElement("div", { className: "max-w-4xl mx-auto relative z-10 text-center" },
            react_1.default.createElement("div", { className: "flex items-center justify-center gap-2 mb-4" },
                react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4]" }, "Ritual Digital \u00B7 Gabinete de Consulta")),
            react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h2", delay: 0.1, duration: 1.2, blurAmount: 12, className: "font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]" }, "Una pregunta."),
            react_1.default.createElement("p", { className: "mt-4 font-editorial text-base sm:text-lg text-[#E8D7A6]/80 font-light max-w-xl mx-auto leading-relaxed" }, "\u00ABEl Tarot no resuelve la incertidumbre: te invita a habitarla con lucidez y honestidad interior.\u00BB"),
            step === 'input' && (react_1.default.createElement("div", { className: "mt-14 max-w-xl mx-auto" },
                react_1.default.createElement("form", { onSubmit: handleStartShuffle, className: "space-y-8" },
                    react_1.default.createElement("div", { className: "p-8 border border-[#00B3A4]/35 bg-[#160B20]/90 relative rounded-none shadow-[0_15px_35px_rgba(0,0,0,0.6)]" },
                        react_1.default.createElement("div", { className: "absolute -top-3 left-6 px-3 bg-[#0D1B2A] font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase border border-[#00B3A4]/30" }, "Punto de partida"),
                        react_1.default.createElement("label", { className: "block font-editorial text-xl text-[#E8D7A6] text-left mb-2" }, "Piensa en una pregunta."),
                        react_1.default.createElement("p", { className: "text-xs font-clean text-[#E8D7A6]/60 text-left font-light mb-6" },
                            "Evita preguntas de \u00ABs\u00ED o no\u00BB. Formula algo que despierte tu propia responsabilidad (ej. ",
                            react_1.default.createElement("em", null, "\u00AB\u00BFQu\u00E9 aspecto de mi sombra estoy ignorando en este v\u00EDnculo?\u00BB"),
                            " o ",
                            react_1.default.createElement("em", null, "\u00AB\u00BFQu\u00E9 necesita madurar en mi vocaci\u00F3n?\u00BB"),
                            ")."),
                        react_1.default.createElement("textarea", { rows: 3, required: true, value: question, onChange: (e) => setQuestion(e.target.value), placeholder: "Escr\u00EDbela aqu\u00ED con calma...", className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-4 text-base font-editorial text-[#E8D7A6] placeholder:text-[#E8D7A6]/30 focus:outline-none transition-colors resize-none" })),
                    react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { type: "submit", disabled: !question.trim(), strength: 0.28, className: "w-full py-4 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,179,164,0.2)]" },
                        react_1.default.createElement(lucide_react_1.Feather, { className: "w-3.5 h-3.5 text-[#00B3A4]" }),
                        react_1.default.createElement("span", null, "Barajar las cartas"))))),
            step === 'shuffling' && (react_1.default.createElement("div", { className: "mt-16 py-16 flex flex-col items-center justify-center space-y-8" },
                react_1.default.createElement("div", { className: "relative w-40 h-56 flex items-center justify-center" },
                    react_1.default.createElement("div", { className: "absolute w-32 h-48 border border-[#00B3A4]/40 bg-[#160B20] rounded transform -rotate-12 translate-x-4 animate-pulse" }),
                    react_1.default.createElement("div", { className: "absolute w-32 h-48 border border-[#E8D7A6]/50 bg-[#0A1420] rounded transform rotate-6 -translate-x-3 transition-transform" }),
                    react_1.default.createElement("div", { className: "relative w-32 h-48 border border-[#00B3A4] bg-[#2A0E34] rounded flex flex-col items-center justify-center p-3 shadow-2xl" },
                        react_1.default.createElement("div", { className: "w-12 h-12 rounded-full border border-[#00B3A4]/50 flex items-center justify-center text-[#00B3A4]" },
                            react_1.default.createElement(lucide_react_1.Sparkles, { className: "w-5 h-5 animate-spin" })),
                        react_1.default.createElement("span", { className: "font-mono text-[8px] tracking-[0.3em] uppercase text-[#00B3A4] mt-3" }, "Sincron\u00EDa"))),
                react_1.default.createElement("div", { className: "space-y-2" },
                    react_1.default.createElement("span", { className: "font-editorial italic text-2xl text-[#E8D7A6] block" }, "\u00ABDisolviendo la certeza... convocando el s\u00EDmbolo\u00BB"),
                    react_1.default.createElement("p", { className: "font-mono text-[10px] tracking-[0.25em] uppercase text-[#7A7A7A]" }, "Las cartas se ordenan para tu pregunta")))),
            step === 'revealed' && revealedCards.length === 3 && (react_1.default.createElement("div", { className: "mt-12 space-y-12 animate-fadeIn text-left" },
                react_1.default.createElement("div", { className: "p-4 border-b border-[#7A7A7A]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block" }, "Tu Pregunta Reflexiva"),
                        react_1.default.createElement("p", { className: "font-editorial text-lg text-[#E8D7A6] italic mt-0.5" },
                            "\u00AB",
                            question,
                            "\u00BB")),
                    react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { onClick: handleReset, strength: 0.25, className: "px-4 py-2 border border-[#7A7A7A]/40 text-xs font-clean uppercase tracking-[0.2em] text-[#E8D7A6]/80 hover:text-[#00B3A4] hover:border-[#00B3A4] transition-colors flex items-center gap-2" },
                        react_1.default.createElement(lucide_react_1.RefreshCw, { className: "w-3 h-3 text-[#00B3A4]" }),
                        react_1.default.createElement("span", null, "Formular otra pregunta"))),
                react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, revealedCards.map((c, idx) => {
                    const isSelected = activeRevealedCard === idx;
                    return (react_1.default.createElement("div", { key: idx, onClick: () => setActiveRevealedCard(idx), className: `p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${isSelected
                            ? 'border-[#00B3A4] bg-[#2A0E34] shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(0,179,164,0.25)]'
                            : 'border-[#7A7A7A]/30 bg-[#0A1420] opacity-80 hover:opacity-100 hover:border-[#00B3A4]/50'}` },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("div", { className: "flex items-center justify-between pb-3 border-b border-[#E8D7A6]/15 mb-4" },
                                react_1.default.createElement("span", { className: "font-mono text-[10px] tracking-[0.25em] text-[#00B3A4] uppercase font-bold" }, c.slot),
                                react_1.default.createElement("span", { className: "font-mono text-[10px] text-[#E8D7A6]" },
                                    "ARC.",
                                    c.numeral)),
                            react_1.default.createElement("span", { className: "font-clean text-[10px] text-[#E8D7A6]/60 block mb-3 font-light" }, c.subtitle),
                            react_1.default.createElement("h4", { className: "font-editorial text-2xl text-[#E8D7A6] font-normal leading-tight" }, c.name),
                            react_1.default.createElement("div", { className: "my-4 w-full max-w-[180px] aspect-[450/780] rounded-xl overflow-hidden border border-[#00B3A4]/70 shadow-[0_8px_24px_rgba(0,179,164,0.35)] bg-[#07101B] mx-auto" },
                                c.numeral === 'II' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "sacerdotisa", alt: "Arcano II La Sacerdotisa", fallbackSvg: react_1.default.createElement(LaSacerdotisaEgyptianCard_tsx_1.LaSacerdotisaEgyptianCard, { className: "w-full h-full object-contain" }) })),
                                c.numeral === 'IX' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "ermitano", alt: "Arcano IX El Eremita", fallbackSvg: react_1.default.createElement(ElEremitaEgyptianCard_tsx_1.ElEremitaEgyptianCard, { className: "w-full h-full object-contain" }) })),
                                c.numeral === 'XVI' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "torre", alt: "Arcano XVI La Torre", fallbackSvg: react_1.default.createElement(LaTorreEgyptianCard_tsx_1.LaTorreEgyptianCard, { className: "w-full h-full object-contain" }) })),
                                c.numeral === 'XII' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "colgado", alt: "Arcano XII El Colgado", fallbackSvg: react_1.default.createElement(ElColgadoEgyptianCard_tsx_1.ElColgadoEgyptianCard, { className: "w-full h-full object-contain" }) })),
                                c.numeral === 'XVIII' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "luna", alt: "Arcano XVIII La Luna", fallbackSvg: react_1.default.createElement(LaLunaEgyptianCard_tsx_1.LaLunaEgyptianCard, { className: "w-full h-full object-contain" }) })),
                                c.numeral === 'I' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "mago", alt: "Arcano I El Mago", fallbackSvg: react_1.default.createElement(SymbolicEgyptianArcanaSvg, { numeral: "I", title: "El Mago" }) })),
                                c.numeral === 'XVII' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "estrella", alt: "Arcano XVII La Estrella", fallbackSvg: react_1.default.createElement(SymbolicEgyptianArcanaSvg, { numeral: "XVII", title: "La Estrella" }) })),
                                c.numeral === 'IV' && (react_1.default.createElement(CardImage_tsx_1.CardImage, { cardId: "emperador", alt: "Arcano IV El Emperador", fallbackSvg: react_1.default.createElement(SymbolicEgyptianArcanaSvg, { numeral: "IV", title: "El Emperador" }) }))),
                            react_1.default.createElement("p", { className: "font-handwritten text-base text-[#00B3A4] mt-1 mb-4" },
                                "\u00AB",
                                c.reflection,
                                "\u00BB"),
                            react_1.default.createElement("p", { className: "font-clean text-xs text-[#E8D7A6]/85 font-light leading-relaxed" }, c.insight)),
                        react_1.default.createElement("div", { className: "pt-4 border-t border-[#E8D7A6]/15 mt-6 text-[10px] font-mono text-[#7A7A7A] flex items-center justify-between" },
                            react_1.default.createElement("span", null, c.archetypeDetail.split('y')[0]),
                            react_1.default.createElement("span", { className: "text-[#00B3A4]" }, "\u2726"))));
                })),
                react_1.default.createElement("div", { className: "p-8 border border-[#00B3A4]/35 bg-[#160B20] relative" },
                    react_1.default.createElement("div", { className: "flex items-center gap-2 mb-2" },
                        react_1.default.createElement("span", { className: "w-4 h-[1.5px] bg-[#00B3A4]" }),
                        react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase" },
                            "Interpretaci\u00F3n Profunda \u00B7 ",
                            revealedCards[activeRevealedCard].slot)),
                    react_1.default.createElement("h3", { className: "font-editorial text-2xl sm:text-3xl text-[#E8D7A6] font-normal" },
                        revealedCards[activeRevealedCard].name,
                        " en tu camino"),
                    react_1.default.createElement("p", { className: "mt-4 font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light" }, revealedCards[activeRevealedCard].insight),
                    react_1.default.createElement("div", { className: "mt-6 pt-6 border-t border-[#E8D7A6]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-clean text-[#E8D7A6]/70" },
                        react_1.default.createElement("span", null, "Esta lectura no sella tu futuro: te devuelve el mapa para navegarlo."),
                        react_1.default.createElement("a", { href: "#sesiones", className: "font-clean text-xs uppercase tracking-[0.2em] text-[#00B3A4] hover:underline flex items-center gap-1.5 font-medium" },
                            react_1.default.createElement("span", null, "Profundizar en una sesi\u00F3n 1 a 1"),
                            react_1.default.createElement(lucide_react_1.ArrowRight, { className: "w-3.5 h-3.5" })))))))));
};
exports.TarotRitualExperience = TarotRitualExperience;

};

// --- components/sections/PsicoastrologiaMap.tsx ---
__modules["components/sections/PsicoastrologiaMap.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsicoastrologiaMap = void 0;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const EditorialBlurredHeading_tsx_1 = require("components/ui/EditorialBlurredHeading.tsx");
const PsicoastrologiaMap = () => {
    const [formData, setFormData] = (0, react_1.useState)({
        date: '1994-06-18',
        time: '14:30',
        city: 'Buenos Aires, Argentina',
    });
    const [profileGenerated, setProfileGenerated] = (0, react_1.useState)(false);
    const [activeTab, setActiveTab] = (0, react_1.useState)('sun');
    const handleGenerate = (e) => {
        e.preventDefault();
        setProfileGenerated(true);
    };
    const sampleProfile = {
        sun: {
            sign: 'Géminis en Casa IX',
            archetype: 'El Escriba Viajero & El Hacedor de Preguntas',
            reflection: 'Tu energía vital se enciende cuando conectas ideas aparentemente inconexas. El desafío es no quedarte en la dispersión intelectual y permitir que el conocimiento eche raíces en el cuerpo.',
        },
        moon: {
            sign: 'Escorpio en Casa II',
            archetype: 'Las Aguas Subterráneas & El Apego Feroz',
            reflection: 'Necesidad de intensidad y seguridad psíquica absoluta. Tu sabiduría emocional proviene de no temerle a las crisis; allí donde otros ven caos, tú encuentras tu poder regenerador.',
        },
        ascendant: {
            sign: 'Libra a 14°',
            archetype: 'El Espejo de la Armonía & La Búsqueda Ética',
            reflection: 'Tu forma de entrar al mundo es a través de la belleza, la escucha y el puente vincular. Tu aprendizaje consiste en no anular tu propio deseo con tal de complacer la mirada ajena.',
        },
        chiron: {
            sign: 'Virgo en Casa XII',
            archetype: 'La Herida de la Insuficiencia & El Sanador Compasivo',
            reflection: 'La sensación inconsciente de «no ser lo suficientemente impecable». Cuando dejas de exigir perfección a ti y a la vida, te conviertes en un bálsamo reconfortante para otros.',
        },
    };
    return (react_1.default.createElement("section", { id: "psicoastrologia", className: "py-28 px-6 sm:px-12 md:px-20 bg-[#0D1B2A] relative overflow-hidden border-t border-[#7A7A7A]/25" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-35 pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute top-1/4 right-10 w-[600px] h-[600px] bg-[#2A0E34]/35 rounded-full blur-[180px] pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#00B3A4]/10 rounded-full blur-[150px] pointer-events-none" }),
        react_1.default.createElement("div", { className: "max-w-7xl mx-auto relative z-10" },
            react_1.default.createElement("div", { className: "max-w-3xl mb-16 text-left" },
                react_1.default.createElement("div", { className: "flex items-center gap-3 mb-3" },
                    react_1.default.createElement("span", { className: "w-6 h-[1.5px] bg-[#00B3A4]" }),
                    react_1.default.createElement("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]" }, "Cap\u00EDtulo II \u00B7 El Observatorio Interior")),
                react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h2", delay: 0.12, duration: 1.2, blurAmount: 12, className: "font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]" }, "El cielo tambi\u00E9n deja huellas."),
                react_1.default.createElement("p", { className: "mt-4 font-editorial text-lg sm:text-xl text-[#E8D7A6]/85 font-light leading-relaxed max-w-2xl" }, "La carta natal no determina qui\u00E9n eres. Es un mapa simb\u00F3lico desde el cual podemos observar tus tendencias, tensiones, deseos y formas de vincularte."),
                react_1.default.createElement("span", { className: "font-handwritten text-lg text-[#00B3A4] block mt-3" }, "\u00ABno estamos condicionados por los astros; compartimos su misma geometr\u00EDa\u00BB")),
            react_1.default.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" },
                react_1.default.createElement("div", { className: "lg:col-span-7 p-6 sm:p-10 border border-[#00B3A4]/35 bg-[#08121D] relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)]" },
                    react_1.default.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 pb-4 mb-2 border-b border-[#7A7A7A]/20 font-mono text-[9px] tracking-widest" },
                        react_1.default.createElement("span", { className: "text-[#7A7A7A]" }, "GRID: INTERIORIS \u00B7 12 DOMUS"),
                        react_1.default.createElement("span", { className: "text-[#00B3A4]" }, "EPHEMERA \u00B7 NARMER")),
                    react_1.default.createElement("div", { className: "relative py-6 flex flex-col items-center justify-center" },
                        react_1.default.createElement("svg", { viewBox: "0 0 400 360", className: "w-full max-w-[420px] h-auto overflow-visible select-none", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                            react_1.default.createElement("circle", { cx: "200", cy: "180", r: "150", stroke: "#E8D7A6", strokeWidth: "0.6", strokeDasharray: "3 5", opacity: "0.4" }),
                            react_1.default.createElement("circle", { cx: "200", cy: "180", r: "162", stroke: "#00B3A4", strokeWidth: "0.5", opacity: "0.45" }),
                            react_1.default.createElement("line", { x1: "30", y1: "180", x2: "370", y2: "180", stroke: "#E8D7A6", strokeWidth: "1.2", opacity: "0.7" }),
                            react_1.default.createElement("text", { x: "24", y: "184", fill: "#00B3A4", fontSize: "9", fontFamily: "serif", fontWeight: "bold" }, "ASC"),
                            react_1.default.createElement("text", { x: "376", y: "184", fill: "#E8D7A6", fontSize: "9", fontFamily: "serif" }, "DSC"),
                            react_1.default.createElement("line", { x1: "200", y1: "20", x2: "200", y2: "340", stroke: "#E8D7A6", strokeWidth: "1.2", opacity: "0.7" }),
                            react_1.default.createElement("text", { x: "200", y: "14", fill: "#00B3A4", fontSize: "9", fontFamily: "serif", textAnchor: "middle", fontWeight: "bold" }, "MC"),
                            react_1.default.createElement("text", { x: "200", y: "354", fill: "#E8D7A6", fontSize: "9", fontFamily: "serif", textAnchor: "middle" }, "IC"),
                            react_1.default.createElement("polygon", { points: "120,70 300,120 180,310", stroke: "#00B3A4", strokeWidth: "0.8", fill: "#2A0E34", fillOpacity: "0.4" }),
                            react_1.default.createElement("polygon", { points: "70,180 200,60 330,180", stroke: "#E8D7A6", strokeWidth: "0.6", strokeDasharray: "2 3", opacity: "0.5" }),
                            react_1.default.createElement("g", { transform: "translate(120, 70)" },
                                react_1.default.createElement("circle", { cx: "0", cy: "0", r: "8", fill: "#2A0E34", stroke: "#E8D7A6", strokeWidth: "1" }),
                                react_1.default.createElement("circle", { cx: "0", cy: "0", r: "2.2", fill: "#00B3A4" }),
                                react_1.default.createElement("text", { x: "12", y: "4", fill: "#E8D7A6", fontSize: "10", fontFamily: "serif" }, "\u2609 Sol")),
                            react_1.default.createElement("g", { transform: "translate(300, 120)" },
                                react_1.default.createElement("circle", { cx: "0", cy: "0", r: "8", fill: "#2A0E34", stroke: "#00B3A4", strokeWidth: "1" }),
                                react_1.default.createElement("path", { d: "M -4,-4 A 5,5 0 0,0 2,4 A 4,4 0 0,1 -4,-4 Z", fill: "#E8D7A6" }),
                                react_1.default.createElement("text", { x: "12", y: "4", fill: "#00B3A4", fontSize: "10", fontFamily: "serif" }, "\u263D Luna")),
                            react_1.default.createElement("g", { transform: "translate(180, 310)" },
                                react_1.default.createElement("circle", { cx: "0", cy: "0", r: "8", fill: "#0D1B2A", stroke: "#00B3A4", strokeWidth: "1" }),
                                react_1.default.createElement("text", { x: "-4", y: "4", fill: "#00B3A4", fontSize: "10", fontFamily: "serif" }, "\u26B7"),
                                react_1.default.createElement("text", { x: "12", y: "4", fill: "#E8D7A6", fontSize: "9", fontFamily: "serif" }, "Quir\u00F3n")),
                            react_1.default.createElement("g", { transform: "translate(260, 240)" },
                                react_1.default.createElement("circle", { cx: "0", cy: "0", r: "6", fill: "#0D1B2A", stroke: "#7A7A7A", strokeWidth: "0.8", opacity: "0.8" }),
                                react_1.default.createElement("text", { x: "-3", y: "3", fill: "#7A7A7A", fontSize: "8", fontFamily: "serif" }, "\u2644")),
                            react_1.default.createElement("circle", { cx: "200", cy: "180", r: "24", fill: "#2A0E34", stroke: "#00B3A4", strokeWidth: "1.2" }),
                            react_1.default.createElement("circle", { cx: "200", cy: "180", r: "4", fill: "#E8D7A6" }),
                            react_1.default.createElement("text", { x: "200", y: "184", fill: "#E8D7A6", fontSize: "7", fontFamily: "monospace", textAnchor: "middle" }, "ANIMA")),
                        react_1.default.createElement("div", { className: "mt-4 text-center" },
                            react_1.default.createElement("span", { className: "font-handwritten text-base text-[#00B3A4]" }, "\u00ABlas tensiones de tu mapa son los motores de tu desarrollo\u00BB"))),
                    react_1.default.createElement("div", { className: "pt-4 border-t border-[#7A7A7A]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-[#7A7A7A] uppercase" },
                        react_1.default.createElement("span", null, "C\u00E1lculo Sideral & Tropical Integrado"),
                        react_1.default.createElement("span", { className: "text-[#00B3A4]" }, "Psicoastrolog\u00EDa Narmer"))),
                react_1.default.createElement("div", { className: "lg:col-span-5 space-y-6 text-left" },
                    react_1.default.createElement("div", { className: "p-6 sm:p-7 border border-[#7A7A7A]/30 bg-[#08121D]" },
                        react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block mb-1" }, "Exploraci\u00F3n Natal"),
                        react_1.default.createElement("h3", { className: "font-editorial text-2xl text-[#E8D7A6] font-normal mb-6" }, "Ingresa tus coordenadas de origen"),
                        react_1.default.createElement("form", { onSubmit: handleGenerate, className: "space-y-4" },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("label", { className: "text-[11px] font-clean text-[#E8D7A6]/70 block mb-1" }, "Fecha de Nacimiento"),
                                react_1.default.createElement("div", { className: "relative" },
                                    react_1.default.createElement(lucide_react_1.Calendar, { className: "w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" }),
                                    react_1.default.createElement("input", { type: "date", required: true, value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none" }))),
                            react_1.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" },
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement("label", { className: "text-[11px] font-clean text-[#E8D7A6]/70 block mb-1" }, "Hora (aprox. o exacta)"),
                                    react_1.default.createElement("div", { className: "relative" },
                                        react_1.default.createElement(lucide_react_1.Clock, { className: "w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" }),
                                        react_1.default.createElement("input", { type: "time", required: true, value: formData.time, onChange: (e) => setFormData({ ...formData, time: e.target.value }), className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none" }))),
                                react_1.default.createElement("div", null,
                                    react_1.default.createElement("label", { className: "text-[11px] font-clean text-[#E8D7A6]/70 block mb-1" }, "Ciudad y Pa\u00EDs"),
                                    react_1.default.createElement("div", { className: "relative" },
                                        react_1.default.createElement(lucide_react_1.MapPin, { className: "w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" }),
                                        react_1.default.createElement("input", { type: "text", required: true, value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }), placeholder: "Ej. Madrid, Espa\u00F1a", className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none" })))),
                            react_1.default.createElement("button", { type: "submit", className: "w-full mt-2 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,179,164,0.2)]" },
                                react_1.default.createElement(lucide_react_1.Compass, { className: "w-3.5 h-3.5 text-[#00B3A4]" }),
                                react_1.default.createElement("span", null, "Explorar mi mapa natal")))),
                    react_1.default.createElement("div", { className: "p-6 sm:p-7 border border-[#00B3A4]/35 bg-[#160B20]" },
                        react_1.default.createElement("div", { className: "flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8D7A6]/15 mb-4" },
                            react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase font-bold" }, "Cuatro Pilares Arquet\u00EDpicos"),
                            react_1.default.createElement("span", { className: "text-[10px] font-mono text-[#E8D7A6] flex items-center gap-1.5" },
                                profileGenerated && react_1.default.createElement(lucide_react_1.Check, { className: "w-3 h-3 text-[#00B3A4]" }),
                                react_1.default.createElement("span", null, formData.city.split(',')[0]))),
                        react_1.default.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-[#0D1B2A] border border-[#7A7A7A]/30 mb-5" }, [
                            { id: 'sun', label: 'Sol ☉' },
                            { id: 'moon', label: 'Luna ☽' },
                            { id: 'asc', label: 'Ascendente' },
                            { id: 'chiron', label: 'Quirón ⚷' },
                        ].map((tab) => (react_1.default.createElement("button", { key: tab.id, onClick: () => setActiveTab(tab.id), className: `py-1.5 text-[10px] font-clean tracking-wider uppercase transition-all ${activeTab === tab.id
                                ? 'bg-[#2A0E34] text-[#E8D7A6] border border-[#00B3A4] font-semibold'
                                : 'text-[#7A7A7A] hover:text-[#E8D7A6]'}` }, tab.label)))),
                        activeTab === 'sun' && (react_1.default.createElement("div", { className: "space-y-3 animate-fadeIn" },
                            react_1.default.createElement("span", { className: "text-[11px] font-mono text-[#00B3A4] uppercase block" }, sampleProfile.sun.sign),
                            react_1.default.createElement("h4", { className: "font-editorial text-xl text-[#E8D7A6]" }, sampleProfile.sun.archetype),
                            react_1.default.createElement("p", { className: "text-xs font-clean text-[#E8D7A6]/80 font-light leading-relaxed" }, sampleProfile.sun.reflection))),
                        activeTab === 'moon' && (react_1.default.createElement("div", { className: "space-y-3 animate-fadeIn" },
                            react_1.default.createElement("span", { className: "text-[11px] font-mono text-[#00B3A4] uppercase block" }, sampleProfile.moon.sign),
                            react_1.default.createElement("h4", { className: "font-editorial text-xl text-[#E8D7A6]" }, sampleProfile.moon.archetype),
                            react_1.default.createElement("p", { className: "text-xs font-clean text-[#E8D7A6]/80 font-light leading-relaxed" }, sampleProfile.moon.reflection))),
                        activeTab === 'asc' && (react_1.default.createElement("div", { className: "space-y-3 animate-fadeIn" },
                            react_1.default.createElement("span", { className: "text-[11px] font-mono text-[#00B3A4] uppercase block" }, sampleProfile.ascendant.sign),
                            react_1.default.createElement("h4", { className: "font-editorial text-xl text-[#E8D7A6]" }, sampleProfile.ascendant.archetype),
                            react_1.default.createElement("p", { className: "text-xs font-clean text-[#E8D7A6]/80 font-light leading-relaxed" }, sampleProfile.ascendant.reflection))),
                        activeTab === 'chiron' && (react_1.default.createElement("div", { className: "space-y-3 animate-fadeIn" },
                            react_1.default.createElement("span", { className: "text-[11px] font-mono text-[#00B3A4] uppercase block" }, sampleProfile.chiron.sign),
                            react_1.default.createElement("h4", { className: "font-editorial text-xl text-[#E8D7A6]" }, sampleProfile.chiron.archetype),
                            react_1.default.createElement("p", { className: "text-xs font-clean text-[#E8D7A6]/80 font-light leading-relaxed" }, sampleProfile.chiron.reflection))),
                        react_1.default.createElement("div", { className: "pt-4 mt-6 border-t border-[#E8D7A6]/15 flex items-center justify-between text-xs" },
                            react_1.default.createElement("span", { className: "text-[11px] text-[#7A7A7A]" }, "An\u00E1lisis completo en consulta 1 a 1"),
                            react_1.default.createElement("a", { href: "#sesiones", className: "font-clean text-[11px] uppercase tracking-widest text-[#00B3A4] hover:underline flex items-center gap-1 font-medium" },
                                react_1.default.createElement("span", null, "Ver sesiones"),
                                react_1.default.createElement(lucide_react_1.ArrowRight, { className: "w-3 h-3" })))))))));
};
exports.PsicoastrologiaMap = PsicoastrologiaMap;

};

// --- components/sections/SessionsCatalog.tsx ---
__modules["components/sections/SessionsCatalog.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsCatalog = void 0;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const MagneticButton_tsx_1 = require("components/ui/MagneticButton.tsx");
const EditorialBlurredHeading_tsx_1 = require("components/ui/EditorialBlurredHeading.tsx");
const SupabaseMedia_tsx_1 = require("components/ui/SupabaseMedia.tsx");
const supabase_ts_1 = require("services/supabase.ts");
const DEFAULT_SESSIONS = [
    {
        index: '01',
        title: 'TAROT',
        subtitle: 'Una conversación con los símbolos.',
        duration: '60 min',
        format: 'Online en vivo (Zoom / Meet) · Grabación completa',
        investment: '$55 USD / $50.000 ARS',
        description: 'Una lectura íntima y dialógica. No buscamos adivinar tu porvenir: desplegamos los arcanos mayores y menores como un espejo de tus nudos actuales, tus puntos ciegos y la energía que pide ser encarnada en el presente.',
        deliverables: [
            'Tirada evolutiva focalizada en tus preguntas clave',
            'Audio íntegro en alta fidelidad para escuchar cuando lo necesites',
            'Fotografía en alta resolución de la mesa de arcanos',
        ],
        quote: '«El arcano te nombra antes de que tú puedas defenderte.»',
    },
    {
        index: '02',
        title: 'PSICOASTROLOGÍA',
        subtitle: 'Leer el cielo para comprender tus propios patrones.',
        duration: '75 min',
        format: 'Online en vivo · Incluye Carta Gráfica & Audio HD',
        investment: '$70 USD / $65.000 ARS',
        description: 'Análisis profundo de tu mapa natal a través de la psicología arquetípica de Carl Jung. Desentrañamos la arquitectura de tu sol, tu paisaje lunar inconsciente, tus tensiones planetarias y la herida de Quirón como portal de maestría.',
        deliverables: [
            'Interpretación del mandala natal y sus ejes evolutivos',
            'Dossier gráfico con tus aspectos planetarios y nodos',
            'Grabación completa de la sesión para revisión periódica',
        ],
        quote: '«La carta natal es el pentagrama sobre el cual compones tu propia melodía.»',
    },
    {
        index: '03',
        title: 'TAROT + CARTA NATAL',
        subtitle: 'Una lectura que une el símbolo terrestre con el mapa celeste.',
        duration: '90 min',
        format: 'Consulta integral en vivo · Dos planos articulados',
        investment: '$90 USD / $85.000 ARS',
        description: 'La experiencia cumbre del Gabinete Narmer. Cruzamos la partitura astronómica de tu nacimiento con la tirada viva de los 78 arcanos en tiempo real. Lo intemporal de los astros dialoga con la coyuntura viva de tu momento presente.',
        deliverables: [
            'Cruce simultáneo de tránsitos celestes con tirada de tarot',
            'Informe sintético con coordenadas clave del año',
            'Audio HD y registro fotográfico de la sesión',
        ],
        quote: '«Como es arriba, es abajo; como es adentro, es afuera.»',
    },
];
const SessionsCatalog = ({ onBookSession }) => {
    const [sessions, setSessions] = (0, react_1.useState)(DEFAULT_SESSIONS);
    (0, react_1.useEffect)(() => {
        let active = true;
        (0, supabase_ts_1.fetchSupabaseTable)('sessions', 'select=*&order=index.asc').then((remoteRows) => {
            if (!active || !remoteRows || remoteRows.length === 0)
                return;
            const byIndex = new Map();
            DEFAULT_SESSIONS.forEach((s) => byIndex.set(s.index, s));
            remoteRows.forEach((row) => {
                if (row.index && row.title && Array.isArray(row.deliverables)) {
                    byIndex.set(row.index, { ...byIndex.get(row.index), ...row });
                }
            });
            setSessions(Array.from(byIndex.values()));
        });
        return () => {
            active = false;
        };
    }, []);
    return (react_1.default.createElement("section", { id: "sesiones", className: "py-28 px-6 sm:px-12 md:px-20 bg-[#0D1B2A] relative overflow-hidden border-t border-[#7A7A7A]/25" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-35 pointer-events-none" }),
        react_1.default.createElement("div", { className: "max-w-6xl mx-auto relative z-10" },
            react_1.default.createElement("div", { className: "max-w-3xl mb-20 text-left" },
                react_1.default.createElement("div", { className: "flex items-center gap-3 mb-3" },
                    react_1.default.createElement("span", { className: "w-6 h-[1.5px] bg-[#00B3A4]" }),
                    react_1.default.createElement("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]" }, "Cap\u00EDtulo III \u00B7 Cat\u00E1logo de Consultas")),
                react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h2", delay: 0.12, duration: 1.2, blurAmount: 12, className: "font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]" }, "Sesiones de interpretaci\u00F3n."),
                react_1.default.createElement("p", { className: "mt-4 font-editorial text-lg sm:text-xl text-[#E8D7A6]/85 font-light leading-relaxed" }, "Cada consulta es un espacio confidencial, pausado y riguroso. Sin f\u00F3rmulas prefabricadas ni juicios morales.")),
            react_1.default.createElement("div", { className: "space-y-16" },
                sessions.map((session) => (react_1.default.createElement("div", { key: session.index, className: "border-t border-[#7A7A7A]/30 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group" },
                    react_1.default.createElement("div", { className: "lg:col-span-4 space-y-3" },
                        react_1.default.createElement("span", { className: "font-mono text-xs sm:text-sm tracking-[0.3em] text-[#00B3A4] block font-bold" }, session.index),
                        react_1.default.createElement("h3", { className: "font-editorial text-3xl sm:text-4xl md:text-5xl text-[#E8D7A6] font-normal tracking-wide" }, session.title),
                        react_1.default.createElement("p", { className: "font-editorial italic text-base sm:text-lg text-[#00B3A4]" },
                            "\u00AB",
                            session.subtitle,
                            "\u00BB"),
                        react_1.default.createElement("div", { className: "pt-2 flex items-center gap-4 text-xs font-mono text-[#E8D7A6]/70" },
                            react_1.default.createElement("span", { className: "flex items-center gap-1.5" },
                                react_1.default.createElement(lucide_react_1.Clock, { className: "w-3.5 h-3.5 text-[#00B3A4]" }),
                                " ",
                                session.duration),
                            react_1.default.createElement("span", { className: "text-[#7A7A7A]" }, "\u00B7"),
                            react_1.default.createElement("span", { className: "text-[#E8D7A6] font-semibold" }, session.investment))),
                    react_1.default.createElement("div", { className: "lg:col-span-8 space-y-6" },
                        session.mediaUrl && (react_1.default.createElement("div", { className: "aspect-[16/9] w-full max-w-xl overflow-hidden border border-[#00B3A4]/30 bg-[#08121D]" },
                            react_1.default.createElement(SupabaseMedia_tsx_1.SupabaseMedia, { bucket: "sessions", storagePath: session.mediaUrl, mediaType: session.mediaType || 'auto', alt: `Sesión ${session.title}`, mediaClassName: "w-full h-full object-cover" }))),
                        react_1.default.createElement("p", { className: "font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light" }, session.description),
                        react_1.default.createElement("div", { className: "space-y-2 py-2" }, session.deliverables.map((item, idx) => (react_1.default.createElement("div", { key: idx, className: "flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light" },
                            react_1.default.createElement("span", { className: "text-[#00B3A4] font-mono text-[10px]" }, "\u2726"),
                            react_1.default.createElement("span", null, item))))),
                        react_1.default.createElement("div", { className: "border-l border-[#00B3A4]/40 pl-4 py-1" },
                            react_1.default.createElement("span", { className: "font-handwritten text-base sm:text-lg text-[#E8D7A6]/75" }, session.quote)),
                        react_1.default.createElement("div", { className: "pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4" },
                            react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { onClick: () => onBookSession(session.title), strength: 0.28, className: "px-6 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,179,164,0.18)]" },
                                react_1.default.createElement("span", null, "Reservar sesi\u00F3n"),
                                react_1.default.createElement(lucide_react_1.ArrowRight, { className: "w-3.5 h-3.5 text-[#00B3A4]" })),
                            react_1.default.createElement("span", { className: "text-[11px] font-mono text-[#7A7A7A] tracking-wider" }, session.format)))))),
                react_1.default.createElement("div", { className: "border-t border-[#00B3A4]/40 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative bg-[#130A1A]/40 p-6 sm:p-8 rounded-2xl border border-dashed border-[#00B3A4]/35 shadow-[0_0_30px_rgba(0,179,164,0.08)]" },
                    react_1.default.createElement("div", { className: "lg:col-span-4 space-y-3" },
                        react_1.default.createElement("div", { className: "flex items-center gap-2" },
                            react_1.default.createElement("span", { className: "font-mono text-xs sm:text-sm tracking-[0.3em] text-[#00B3A4] font-bold" }, "04"),
                            react_1.default.createElement("span", { className: "px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-[0.2em] bg-[#00B3A4]/15 text-[#00B3A4] border border-[#00B3A4]/40 flex items-center gap-1" },
                                react_1.default.createElement(lucide_react_1.Sparkles, { className: "w-2.5 h-2.5" }),
                                " Pr\u00F3ximamente disponible")),
                        react_1.default.createElement("h3", { className: "font-editorial text-3xl sm:text-4xl md:text-5xl text-[#E8D7A6] font-normal tracking-wide flex items-center gap-2" },
                            react_1.default.createElement("span", null, "BIODECODIFICACI\u00D3N")),
                        react_1.default.createElement("p", { className: "font-editorial italic text-base sm:text-lg text-[#00B3A4]" }, "\u00ABEl cuerpo expresa lo que el alma calla.\u00BB"),
                        react_1.default.createElement("div", { className: "pt-2 flex items-center gap-4 text-xs font-mono text-[#E8D7A6]/70" },
                            react_1.default.createElement("span", { className: "flex items-center gap-1.5 text-[#00B3A4]" },
                                react_1.default.createElement(lucide_react_1.Dna, { className: "w-3.5 h-3.5" }),
                                " Nueva disciplina terap\u00E9utica"),
                            react_1.default.createElement("span", { className: "text-[#7A7A7A]" }, "\u00B7"),
                            react_1.default.createElement("span", { className: "text-[#E8D7A6]/80 font-semibold" }, "En preparaci\u00F3n"))),
                    react_1.default.createElement("div", { className: "lg:col-span-8 space-y-6" },
                        react_1.default.createElement("p", { className: "font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light" }, "Un abordaje terap\u00E9utico integral que explora el origen emocional, psicosom\u00E1tico y transgeneracional de los s\u00EDntomas f\u00EDsicos y los bloqueos recurrentes. A trav\u00E9s de la decodificaci\u00F3n biol\u00F3gica de las dolencias y su resonancia con la memoria celular, abrimos un puente hacia la toma de consciencia y la sanaci\u00F3n de ra\u00EDz."),
                        react_1.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 py-2" },
                            react_1.default.createElement("div", { className: "flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light p-2.5 rounded-lg bg-black/30 border border-[#E8D7A6]/10" },
                                react_1.default.createElement("span", { className: "text-[#00B3A4] font-mono text-[10px]" }, "\u2726"),
                                react_1.default.createElement("span", null, "Comprensi\u00F3n del sentido biol\u00F3gico de s\u00EDntomas y patrones")),
                            react_1.default.createElement("div", { className: "flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light p-2.5 rounded-lg bg-black/30 border border-[#E8D7A6]/10" },
                                react_1.default.createElement("span", { className: "text-[#00B3A4] font-mono text-[10px]" }, "\u2726"),
                                react_1.default.createElement("span", null, "Articulaci\u00F3n con el mapa psicoastrol\u00F3gico y simb\u00F3lico")),
                            react_1.default.createElement("div", { className: "flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light p-2.5 rounded-lg bg-black/30 border border-[#E8D7A6]/10" },
                                react_1.default.createElement("span", { className: "text-[#00B3A4] font-mono text-[10px]" }, "\u2726"),
                                react_1.default.createElement("span", null, "Liberaci\u00F3n de lealtades y mandatos del \u00E1rbol geneal\u00F3gico")),
                            react_1.default.createElement("div", { className: "flex items-baseline gap-2.5 text-xs font-clean text-[#E8D7A6]/75 font-light p-2.5 rounded-lg bg-black/30 border border-[#E8D7A6]/10" },
                                react_1.default.createElement("span", { className: "text-[#00B3A4] font-mono text-[10px]" }, "\u2726"),
                                react_1.default.createElement("span", null, "Espacio confidencial 1 a 1 en vivo con seguimiento"))),
                        react_1.default.createElement("div", { className: "border-l border-[#00B3A4]/40 pl-4 py-1" },
                            react_1.default.createElement("span", { className: "font-handwritten text-base sm:text-lg text-[#00B3A4]/90" }, "\u00ABLa enfermedad no es un error biol\u00F3gico, sino un programa especial con sentido de supervivencia.\u00BB")),
                        react_1.default.createElement("div", { className: "pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4" },
                            react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { onClick: () => onBookSession('Consulta sobre Biodecodificación (Próximo lanzamiento)'), strength: 0.28, className: "px-6 py-3 border border-[#00B3A4] bg-gradient-to-r from-[#2A0E34] to-[#120819] hover:from-[#3B1449] hover:to-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,179,164,0.25)] flex items-center gap-2" },
                                react_1.default.createElement(lucide_react_1.Bell, { className: "w-3.5 h-3.5 text-[#00B3A4]" }),
                                react_1.default.createElement("span", null, "Avisarme del lanzamiento")),
                            react_1.default.createElement("span", { className: "text-[11px] font-mono text-[#00B3A4] tracking-wider" }, "\u2726 Cupos anticipados y lista de espera abierta"))))))));
};
exports.SessionsCatalog = SessionsCatalog;

};

// --- components/sections/AboutSpace.tsx ---
__modules["components/sections/AboutSpace.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutSpace = void 0;
const react_1 = __importStar(require("react"));
const EditorialBlurredHeading_tsx_1 = require("components/ui/EditorialBlurredHeading.tsx");
const SupabaseMedia_tsx_1 = require("components/ui/SupabaseMedia.tsx");
const supabase_ts_1 = require("services/supabase.ts");
const AboutSpace = () => {
    const [spaceMedia, setSpaceMedia] = (0, react_1.useState)({
        storage_path: 'gabinete-narmer.jpg',
        media_type: 'auto',
    });
    (0, react_1.useEffect)(() => {
        let active = true;
        (0, supabase_ts_1.fetchSupabaseTable)('space_media', 'select=*&limit=1').then((rows) => {
            if (active && rows && rows[0]?.storage_path) {
                setSpaceMedia(rows[0]);
            }
        });
        return () => {
            active = false;
        };
    }, []);
    return (react_1.default.createElement("section", { id: "espacio", className: "py-28 px-6 sm:px-12 md:px-20 bg-[#08121D] relative overflow-hidden border-t border-[#7A7A7A]/25" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-35 pointer-events-none" }),
        react_1.default.createElement("div", { className: "max-w-6xl mx-auto relative z-10" },
            react_1.default.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center" },
                react_1.default.createElement("div", { className: "lg:col-span-5 relative" },
                    react_1.default.createElement("div", { className: "relative p-3 border border-[#00B3A4]/35 bg-[#170B24] transform lg:-rotate-1 shadow-2xl" },
                        react_1.default.createElement("div", { className: "relative aspect-[3/4] w-full bg-[#0D1B2A] overflow-hidden flex flex-col justify-end p-6 border border-[#E8D7A6]/15" },
                            react_1.default.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/40 to-transparent z-10 pointer-events-none" }),
                            react_1.default.createElement("div", { className: "absolute inset-0 z-0" },
                                react_1.default.createElement(SupabaseMedia_tsx_1.SupabaseMedia, { bucket: "space", storagePath: spaceMedia.storage_path, localStorageKey: "narmer_space_media", mediaType: spaceMedia.media_type || 'auto', alt: "Gabinete Narmer \u00B7 Espacio de escucha y silencio", mediaClassName: "w-full h-full object-cover select-none opacity-85", fallbackContent: react_1.default.createElement("svg", { viewBox: "0 0 300 400", className: "w-full h-full object-cover opacity-60 mix-blend-screen select-none pointer-events-none", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                                        react_1.default.createElement("circle", { cx: "150", cy: "140", r: "90", stroke: "#00B3A4", strokeWidth: "0.8", strokeDasharray: "3 4", opacity: "0.4" }),
                                        react_1.default.createElement("path", { d: "M 150,110 Q 155,100 150,90 Q 145,100 150,110 Z", fill: "#E8D7A6" }),
                                        react_1.default.createElement("circle", { cx: "150", cy: "100", r: "16", fill: "#00B3A4", fillOpacity: "0.15" }),
                                        react_1.default.createElement("line", { x1: "60", y1: "280", x2: "240", y2: "280", stroke: "#E8D7A6", strokeWidth: "1" }),
                                        react_1.default.createElement("polygon", { points: "100,240 140,250 130,278 90,268", stroke: "#7A7A7A", strokeWidth: "1", fill: "#170B24" }),
                                        react_1.default.createElement("polygon", { points: "160,245 200,240 205,270 165,275", stroke: "#00B3A4", strokeWidth: "1", fill: "#2A0E34" })) })),
                            react_1.default.createElement("div", { className: "relative z-20 text-left" },
                                react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block" }, "Gabinete Narmer \u00B7 Buenos Aires & Online"),
                                react_1.default.createElement("span", { className: "font-editorial text-lg text-[#E8D7A6] font-normal block mt-1" }, "Archivo de Cartas & Cartograf\u00EDas Celestes"))),
                        react_1.default.createElement("div", { className: "absolute -top-3 left-10 px-3 py-0.5 bg-[#2A0E34] border border-[#00B3A4] text-[#E8D7A6] font-mono text-[8px] tracking-[0.3em] uppercase" }, "EST. 2014")),
                    react_1.default.createElement("div", { className: "mt-4 text-left font-mono text-[9px] text-[#7A7A7A] tracking-widest" }, "FIG. 04 \u00B7 EL ESPACIO DE ESCUCHA Y SILENCIO")),
                react_1.default.createElement("div", { className: "lg:col-span-7 space-y-8 text-left" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "flex items-center gap-3 mb-3" },
                            react_1.default.createElement("span", { className: "w-6 h-[1.5px] bg-[#00B3A4]" }),
                            react_1.default.createElement("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]" }, "Cap\u00EDtulo IV \u00B7 Manifiesto Humano")),
                        react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h2", delay: 0.12, duration: 1.2, blurAmount: 12, className: "font-editorial text-4xl sm:text-5xl text-[#E8D7A6] font-normal leading-[1.15]" }, "Detr\u00E1s de los s\u00EDmbolos, hay una persona.")),
                    react_1.default.createElement("div", { className: "space-y-5 font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light" },
                        react_1.default.createElement("p", null, "Este espacio naci\u00F3 de una incomodidad: el agotamiento frente a un esoterismo de respuestas r\u00E1pidas, promesas m\u00E1gicas y sentencias deterministas que le quitan a la persona su propia soberan\u00EDa."),
                        react_1.default.createElement("p", null, "Ni el Tarot ni la Astrolog\u00EDa son bolas de cristal. Son lenguajes arquet\u00EDpicos nacidos de milenios de observaci\u00F3n de la psique humana. Cuando abrimos una mesa de cartas o calculamos una carta natal, no estamos buscando el futuro: estamos construyendo una pausa sagrada para mirar lo que pasa adentro."),
                        react_1.default.createElement("p", null, "Aqu\u00ED no hay recetas. Hay una escucha atenta, una mirada est\u00E9tica y un compromiso riguroso con la verdad de cada consultante.")),
                    react_1.default.createElement("div", { className: "pt-6 border-t border-[#7A7A7A]/25 flex items-center justify-between" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", { className: "font-handwritten text-3xl sm:text-4xl text-[#00B3A4] block transform -rotate-2" }, "Narmer"),
                            react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] text-[#7A7A7A] uppercase mt-1 block" }, "Int\u00E9rprete Simb\u00F3lico & Psicoastr\u00F3logo")),
                        react_1.default.createElement("div", { className: "w-12 h-12 rounded-full border border-[#00B3A4]/50 flex items-center justify-center font-mono text-[9px] text-[#00B3A4] opacity-90" }, "\u2726 SIGIL")))))));
};
exports.AboutSpace = AboutSpace;

};

// --- components/sections/ManifestoPhrases.tsx ---
__modules["components/sections/ManifestoPhrases.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestoPhrases = void 0;
const react_1 = __importStar(require("react"));
const ManifestoPhrases = () => {
    const [activePhraseIndex, setActivePhraseIndex] = (0, react_1.useState)(0);
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
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => {
            setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [phrases.length]);
    return (react_1.default.createElement("section", { className: "py-24 sm:py-32 md:py-36 px-6 sm:px-12 md:px-20 bg-[#08121D] relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[55vh] border-t border-[#7A7A7A]/25" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-25 pointer-events-none" }),
        react_1.default.createElement("div", { className: "max-w-4xl mx-auto relative z-10 space-y-8 sm:space-y-10" },
            react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.35em] uppercase text-[#00B3A4] block font-bold" },
                phrases[activePhraseIndex].author,
                " \u00B7 PAUSA CONTEMPLATIVA"),
            react_1.default.createElement("div", { className: "min-h-[140px] flex flex-col items-center justify-center" },
                react_1.default.createElement("blockquote", { className: "space-y-2" },
                    react_1.default.createElement("span", { className: "font-editorial text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#E8D7A6] font-normal leading-tight block" },
                        "\u00AB",
                        phrases[activePhraseIndex].line1),
                    react_1.default.createElement("span", { className: "font-editorial italic text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFFFFF] font-normal leading-tight block" },
                        phrases[activePhraseIndex].line2,
                        "\u00BB"))),
            react_1.default.createElement("div", { className: "flex items-center justify-center gap-3 pt-6" }, phrases.map((_, i) => (react_1.default.createElement("button", { key: i, onClick: () => setActivePhraseIndex(i), className: `transition-all duration-500 ${activePhraseIndex === i
                    ? 'w-8 h-[1.5px] bg-[#00B3A4]'
                    : 'w-2 h-[1px] bg-[#7A7A7A]/40 hover:bg-[#E8D7A6]/60'}`, "aria-label": `Ver aforismo ${i + 1}` })))))));
};
exports.ManifestoPhrases = ManifestoPhrases;

};

// --- components/sections/TestimonialsSection.tsx ---
__modules["components/sections/TestimonialsSection.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialsSection = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("motion/react");
const lucide_react_1 = require("lucide-react");
const EditorialBlurredHeading_tsx_1 = require("components/ui/EditorialBlurredHeading.tsx");
const supabase_ts_1 = require("services/supabase.ts");
const TESTIMONIALS = [
    {
        id: 't1',
        quote: 'Tenía reservas respecto a la astrología por prejuicios del horóscopo comercial. La sesión en Narmer fue de una precisión terapéutica quirúrgica. Me ayudó a nombrar dinámicas inconscientes que llevaba años trabajando en supervisión clínica.',
        author: 'Dra. Mariana Albarracín',
        role: 'Psicóloga Clínica & Terapeuta Gestalt',
        location: 'Córdoba, Argentina',
        sessionType: 'Carta Natal Psicoastrológica',
        archetype: 'El Espejo de la Sombra',
        year: '2025',
    },
    {
        id: 't2',
        quote: 'Agendé la consulta en un momento de bloqueo vocacional crítico, dudando si cerrar un estudio de ocho años. El análisis de tránsitos y los arcanos me dieron una claridad milimétrica sobre los ciclos que se agotaban. Seis meses después refundé mi proyecto con paz mental.',
        author: 'Lic. Sebastián Rosales',
        role: 'Director Creativo & Estratega',
        location: 'Ciudad de México',
        sessionType: 'Revolución Solar & Ciclos',
        archetype: 'El Colapso de la Torre',
        year: '2025',
    },
    {
        id: 't3',
        quote: 'Llegamos a la consulta en medio de tensiones recurrentes de convivencia. Entender la diferencia en nuestros mapas de apego y el contrato kármico mutuo cambió para siempre cómo nos comunicamos. Dejamos de culparnos y empezamos a colaborar.',
        author: 'Camila Valenzuela & Tomás Herrera',
        role: 'Arquitectos & Docentes',
        location: 'Santiago, Chile',
        sessionType: 'Sinastría & Dinámica Vincular',
        archetype: 'La Tercera Entidad',
        year: '2026',
    },
    {
        id: 't4',
        quote: 'No fue una predicción: fue una revelación de lo que mi intuición ya sabía pero mi mente racional se negaba a escuchar. La lectura del Tarot Egipcio me devolvió el timón en un momento de bifurcación vital definitiva.',
        author: 'Lucía Benítez',
        role: 'Investigadora en Bioética',
        location: 'Barcelona, España',
        sessionType: 'Tarot Egipcio Evolutivo',
        archetype: 'El Umbral de la Sacerdotisa',
        year: '2026',
    },
    {
        id: 't5',
        quote: 'Un espacio íntimo, solemne y despojado de dogma. En Narmer los símbolos operan como una partitura viva. Salí con herramientas concretas y una sensación de reconciliación profunda con mi propia historia.',
        author: 'Martín Echeverría',
        role: 'Músico & Compositor',
        location: 'Montevideo, Uruguay',
        sessionType: 'Tarot + Carta Natal',
        archetype: 'El Sendero del Eremita',
        year: '2025',
    },
];
const TestimonialsSection = () => {
    const [items, setItems] = (0, react_1.useState)(TESTIMONIALS);
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [isPaused, setIsPaused] = (0, react_1.useState)(false);
    const timerRef = (0, react_1.useRef)(null);
    const SLIDE_DURATION = 8000; // 8 seconds slow contemplative cycle
    (0, react_1.useEffect)(() => {
        let active = true;
        (0, supabase_ts_1.fetchSupabaseTable)('testimonials', 'select=*').then((remoteRows) => {
            if (!active || !remoteRows || remoteRows.length === 0)
                return;
            const byId = new Map();
            TESTIMONIALS.forEach((t) => byId.set(t.id, t));
            remoteRows.forEach((row) => {
                if (row.id && row.quote && row.author) {
                    byId.set(row.id, { ...byId.get(row.id), ...row });
                }
            });
            setItems(Array.from(byId.values()));
        });
        return () => {
            active = false;
        };
    }, []);
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };
    const goToSlide = (idx) => {
        setCurrentIndex(idx);
    };
    (0, react_1.useEffect)(() => {
        if (isPaused)
            return;
        timerRef.current = setInterval(() => {
            handleNext();
        }, SLIDE_DURATION);
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
        };
    }, [currentIndex, isPaused, items.length]);
    const active = items[currentIndex] || items[0];
    return (react_1.default.createElement("section", { id: "testimonios", className: "py-28 px-6 sm:px-12 md:px-20 bg-[#070F18] relative overflow-hidden border-t border-[#7A7A7A]/25", onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false), "aria-label": "Resonancias y testimonios de consultantes" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-35 pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2A0E34]/25 rounded-full blur-[160px] pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute bottom-10 right-10 w-96 h-96 bg-[#00B3A4]/10 rounded-full blur-[140px] pointer-events-none" }),
        react_1.default.createElement("div", { className: "absolute inset-0 pointer-events-none select-none opacity-20" },
            react_1.default.createElement("svg", { className: "w-full h-full", xmlns: "http://www.w3.org/2000/svg" },
                react_1.default.createElement("line", { x1: "0", y1: "35%", x2: "100%", y2: "35%", stroke: "#E8D7A6", strokeWidth: "0.5", strokeDasharray: "2 8" }),
                react_1.default.createElement("line", { x1: "0", y1: "85%", x2: "100%", y2: "85%", stroke: "#E8D7A6", strokeWidth: "0.5", strokeDasharray: "2 8" }),
                react_1.default.createElement("circle", { cx: "85%", cy: "50%", r: "220", stroke: "#00B3A4", strokeWidth: "0.5", strokeDasharray: "3 7", fill: "none" }))),
        react_1.default.createElement("div", { className: "max-w-5xl mx-auto relative z-10" },
            react_1.default.createElement("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#E8D7A6]/15" },
                react_1.default.createElement("div", { className: "space-y-3" },
                    react_1.default.createElement("div", { className: "flex items-center gap-3" },
                        react_1.default.createElement("span", { className: "w-6 h-[1.5px] bg-[#00B3A4]" }),
                        react_1.default.createElement("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]" }, "Cap\u00EDtulo IV \u00B7 Resonancias & Huellas")),
                    react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h2", delay: 0.12, duration: 1.2, blurAmount: 12, className: "font-editorial text-3xl sm:text-4xl md:text-5xl text-[#E8D7A6] font-normal leading-[1.15]" }, "Lo que el s\u00EDmbolo despierta."),
                    react_1.default.createElement("p", { className: "font-editorial text-sm sm:text-base text-[#E8D7A6]/75 font-light max-w-xl" }, "Palabras de consultantes que cruzaron el umbral y tradujeron los arcanos y planetas en claridad existencial.")),
                react_1.default.createElement("div", { className: "flex items-center gap-3 self-start md:self-end" },
                    react_1.default.createElement("button", { onClick: () => setIsPaused((prev) => !prev), className: "p-2 text-[#E8D7A6]/60 hover:text-[#00B3A4] transition-colors border border-[#E8D7A6]/20 rounded-full", title: isPaused ? 'Reanudar transición automática' : 'Pausar transición', "aria-label": isPaused ? 'Reanudar pase automático' : 'Pausar pase automático' }, isPaused ? react_1.default.createElement(lucide_react_1.Play, { className: "w-3.5 h-3.5" }) : react_1.default.createElement(lucide_react_1.Pause, { className: "w-3.5 h-3.5" })),
                    react_1.default.createElement("div", { className: "flex items-center gap-1.5 border border-[#E8D7A6]/20 rounded-full p-1 bg-[#0D1B2A]/70 backdrop-blur-sm" },
                        react_1.default.createElement("button", { onClick: handlePrev, className: "p-2 text-[#E8D7A6]/80 hover:text-[#00B3A4] hover:bg-[#2A0E34]/80 rounded-full transition-all", "aria-label": "Testimonio anterior" },
                            react_1.default.createElement(lucide_react_1.ChevronLeft, { className: "w-4 h-4" })),
                        react_1.default.createElement("span", { className: "font-mono text-[11px] tracking-widest text-[#E8D7A6]/70 px-2 select-none" },
                            String(currentIndex + 1).padStart(2, '0'),
                            " / ",
                            String(items.length).padStart(2, '0')),
                        react_1.default.createElement("button", { onClick: handleNext, className: "p-2 text-[#E8D7A6]/80 hover:text-[#00B3A4] hover:bg-[#2A0E34]/80 rounded-full transition-all", "aria-label": "Siguiente testimonio" },
                            react_1.default.createElement(lucide_react_1.ChevronRight, { className: "w-4 h-4" }))))),
            react_1.default.createElement("div", { className: "relative min-h-[280px] flex flex-col justify-between" },
                react_1.default.createElement(react_2.AnimatePresence, { mode: "wait" },
                    react_1.default.createElement(react_2.motion.div, { key: active.id, initial: { opacity: 0, y: 14, filter: 'blur(8px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -14, filter: 'blur(8px)' }, transition: {
                            duration: 0.9,
                            ease: [0.22, 1, 0.36, 1],
                        }, className: "flex flex-col justify-between h-full" },
                        react_1.default.createElement("div", { className: "flex flex-wrap items-center gap-3 mb-6" },
                            react_1.default.createElement("span", { className: "font-mono text-[10px] tracking-[0.25em] uppercase text-[#00B3A4] flex items-center gap-1.5" },
                                react_1.default.createElement(lucide_react_1.Sparkles, { className: "w-3 h-3 text-[#00B3A4]" }),
                                active.sessionType),
                            react_1.default.createElement("span", { className: "text-[#7A7A7A]/50" }, "\u00B7"),
                            react_1.default.createElement("span", { className: "font-handwritten text-sm text-[#E8D7A6]/70" },
                                "\u00AB",
                                active.archetype,
                                "\u00BB"),
                            react_1.default.createElement("span", { className: "text-[#7A7A7A]/50" }, "\u00B7"),
                            react_1.default.createElement("span", { className: "font-mono text-[10px] text-[#7A7A7A]" },
                                "Registro ",
                                active.year)),
                        react_1.default.createElement("blockquote", { className: "font-editorial italic font-normal text-xl sm:text-2xl md:text-3xl text-[#E8D7A6] leading-relaxed md:leading-[1.45] tracking-[-0.01em] max-w-4xl" },
                            "\u00AB",
                            active.quote,
                            "\u00BB"),
                        react_1.default.createElement("div", { className: "mt-10 pt-6 border-t border-[#E8D7A6]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4" },
                            react_1.default.createElement("div", { className: "space-y-1" },
                                react_1.default.createElement("cite", { className: "not-italic font-editorial text-lg sm:text-xl text-[#E8D7A6] font-medium block" }, active.author),
                                react_1.default.createElement("p", { className: "font-clean text-xs text-[#E8D7A6]/70 tracking-wide font-light" },
                                    active.role,
                                    " \u00B7 ",
                                    react_1.default.createElement("span", { className: "text-[#00B3A4]" }, active.location))),
                            react_1.default.createElement("div", { className: "flex items-center gap-2" },
                                react_1.default.createElement("span", { className: "w-2 h-2 rounded-full bg-[#00B3A4]/80 shadow-[0_0_8px_rgba(0,179,164,0.6)]" }),
                                react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.25em] uppercase text-[#E8D7A6]/60" }, "Consulta individual en vivo")))))),
            react_1.default.createElement("div", { className: "mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#7A7A7A]/20" },
                react_1.default.createElement("div", { className: "flex items-center gap-2.5" }, items.map((t, idx) => {
                    const isActive = idx === currentIndex;
                    return (react_1.default.createElement("button", { key: t.id, onClick: () => goToSlide(idx), className: "group py-2 focus:outline-none", "aria-label": `Ir al testimonio de ${t.author}`, title: t.author },
                        react_1.default.createElement("div", { className: "relative h-[2px] transition-all duration-700 overflow-hidden bg-[#E8D7A6]/20 rounded-full w-8 sm:w-12" }, isActive ? (react_1.default.createElement(react_2.motion.div, { className: "absolute inset-0 bg-[#00B3A4]", initial: { width: 0 }, animate: { width: '100%' }, transition: {
                                duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                                ease: 'linear',
                            } })) : (react_1.default.createElement("div", { className: "w-0 group-hover:w-full h-full bg-[#E8D7A6]/40 transition-all duration-300" })))));
                })),
                react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-[#7A7A7A]" }, "GABINETE NARMER \u00B7 ARCHIVO DE TESTIMONIOS")))));
};
exports.TestimonialsSection = TestimonialsSection;

};

// --- components/sections/CuadernoSimbolos.tsx ---
__modules["components/sections/CuadernoSimbolos.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuadernoSimbolos = void 0;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const EditorialBlurredHeading_tsx_1 = require("components/ui/EditorialBlurredHeading.tsx");
const SupabaseMedia_tsx_1 = require("components/ui/SupabaseMedia.tsx");
const supabase_ts_1 = require("services/supabase.ts");
const ESSAYS = [
    {
        id: 'sombra-tarot',
        category: 'Tarot',
        number: 'N° 01',
        title: 'La belleza incómoda de las cartas difíciles',
        subtitle: 'Por qué La Torre, El Diablo y La Muerte son los aliados más compasivos del mazo.',
        readTime: '6 min',
        date: 'Otoño 2026',
        excerpt: 'La mente occidental teme al colapso. Sin embargo, en el lenguaje de los símbolos, nada que caiga con verdad puede quitarnos lo que es verdaderamente nuestro.',
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
        excerpt: 'En la mitología, Quirón es el centauro inmortal herido por una flecha envenenada. Al no poder sanarse a sí mismo, aprende el secreto de todas las hierbas del monte.',
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
        excerpt: 'El Sol es lo que queremos ser a la luz del día; la Luna es lo que necesitamos cuando apagamos la luz de la habitación y nadie nos está mirando.',
        fullEssay: [
            'Tu signo lunar describe el mecanismo automático que aprendiste para sentirte a salvo cuando eras un niño asustado. Una Luna en Capricornio aprendió que ser autosuficiente era el único modo de ser querida; una Luna en Piscis aprendió a disolverse en el dolor de los otros.',
            'Cuando somos adultos y experimentamos estrés o desamor, regresamos sin darnos cuenta a ese búnker infantil.',
            'Hacer consciente tu Luna es aprender a maternar tu propia fragilidad sin exigirle a tu pareja o a tus amigos que sean el salvavidas perpetuo de tu biografía.',
        ],
    },
];
const CuadernoSimbolos = () => {
    const [articles, setArticles] = (0, react_1.useState)(ESSAYS);
    const [selectedArticle, setSelectedArticle] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let active = true;
        (0, supabase_ts_1.fetchSupabaseTable)('essays', 'select=*&order=number.asc').then((remoteRows) => {
            if (!active || !remoteRows || remoteRows.length === 0)
                return;
            // Combinar sin duplicar información por `id` manteniendo la estructura original
            const byId = new Map();
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
    return (react_1.default.createElement("section", { id: "cuaderno", className: "py-28 px-6 sm:px-12 md:px-20 bg-[#0D1B2A] relative overflow-hidden border-t border-[#7A7A7A]/25" },
        react_1.default.createElement("div", { className: "absolute inset-0 paper-grain opacity-35 pointer-events-none" }),
        react_1.default.createElement("div", { className: "max-w-6xl mx-auto relative z-10" },
            react_1.default.createElement("div", { className: "flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left" },
                react_1.default.createElement("div", { className: "max-w-xl" },
                    react_1.default.createElement("div", { className: "flex items-center gap-3 mb-3" },
                        react_1.default.createElement("span", { className: "w-6 h-[1.5px] bg-[#00B3A4]" }),
                        react_1.default.createElement("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]" }, "Cap\u00EDtulo V \u00B7 Ensayos & Apuntes")),
                    react_1.default.createElement(EditorialBlurredHeading_tsx_1.EditorialBlurredHeading, { as: "h2", delay: 0.12, duration: 1.2, blurAmount: 12, className: "font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]" }, "Cuaderno de s\u00EDmbolos."),
                    react_1.default.createElement("p", { className: "mt-4 font-editorial text-base sm:text-lg text-[#E8D7A6]/80 font-light leading-relaxed" }, "P\u00E1ginas de reflexi\u00F3n sobre mitolog\u00EDa, arquetipos lunares y la psicolog\u00EDa de la mirada interior.")),
                react_1.default.createElement("div", { className: "font-mono text-xs text-[#00B3A4] tracking-widest uppercase" }, "REVISTA EDITORIAL \u00B7 NARMER")),
            react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, articles.map((article) => (react_1.default.createElement("article", { key: article.id, onClick: () => setSelectedArticle(article), className: "p-6 sm:p-8 border border-[#7A7A7A]/30 bg-[#08121D] hover:border-[#00B3A4] hover:bg-[#160B20] transition-all duration-300 cursor-pointer flex flex-col justify-between group text-left shadow-[0_10px_25px_rgba(0,0,0,0.5)]" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "flex items-center justify-between text-[10px] font-mono text-[#E8D7A6]/75 pb-3 border-b border-[#E8D7A6]/15 mb-6" },
                        react_1.default.createElement("span", { className: "text-[#00B3A4] font-semibold" }, article.category),
                        react_1.default.createElement("span", { className: "text-[#7A7A7A]" }, article.number)),
                    article.mediaUrl && (react_1.default.createElement("div", { className: "mb-5 aspect-[16/10] w-full overflow-hidden border border-[#E8D7A6]/15 bg-[#070F18]" },
                        react_1.default.createElement(SupabaseMedia_tsx_1.SupabaseMedia, { bucket: "essays", storagePath: article.mediaUrl, mediaType: article.mediaType || 'auto', alt: article.title, mediaClassName: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }))),
                    react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-widest uppercase text-[#7A7A7A] block mb-2" },
                        article.date,
                        " \u00B7 ",
                        article.readTime),
                    react_1.default.createElement("h3", { className: "font-editorial text-2xl sm:text-3xl text-[#E8D7A6] font-normal leading-snug group-hover:text-[#00B3A4] transition-colors mb-3" }, article.title),
                    react_1.default.createElement("p", { className: "font-editorial italic text-sm text-[#E8D7A6]/80 mb-4" },
                        "\u00AB",
                        article.subtitle,
                        "\u00BB"),
                    react_1.default.createElement("p", { className: "font-clean text-xs text-[#E8D7A6]/70 font-light leading-relaxed" }, article.excerpt)),
                react_1.default.createElement("div", { className: "pt-6 border-t border-[#E8D7A6]/15 mt-8 flex items-center justify-between text-xs font-clean tracking-widest uppercase text-[#00B3A4] group-hover:text-[#E8D7A6]" },
                    react_1.default.createElement("span", null, "Leer ensayo"),
                    react_1.default.createElement(lucide_react_1.ArrowUpRight, { className: "w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" }))))))),
        selectedArticle && (react_1.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto" },
            react_1.default.createElement("div", { className: "relative w-full max-w-2xl bg-[#0D1B2A] border border-[#00B3A4]/40 p-8 sm:p-12 text-left my-auto max-h-[90vh] overflow-y-auto shadow-2xl" },
                react_1.default.createElement("button", { onClick: () => setSelectedArticle(null), className: "absolute top-6 right-6 p-2 text-[#E8D7A6]/70 hover:text-[#00B3A4]", "aria-label": "Cerrar art\u00EDculo" },
                    react_1.default.createElement(lucide_react_1.X, { className: "w-5 h-5" })),
                react_1.default.createElement("div", { className: "flex items-center gap-3 text-xs font-mono text-[#00B3A4] tracking-widest uppercase mb-4" },
                    react_1.default.createElement("span", null, selectedArticle.category),
                    react_1.default.createElement("span", null, "\u00B7"),
                    react_1.default.createElement("span", null, selectedArticle.number),
                    react_1.default.createElement("span", null, "\u00B7"),
                    react_1.default.createElement("span", null,
                        selectedArticle.readTime,
                        " de lectura")),
                react_1.default.createElement("h3", { className: "font-editorial text-3xl sm:text-4xl text-[#E8D7A6] font-normal leading-tight" }, selectedArticle.title),
                react_1.default.createElement("p", { className: "font-editorial italic text-lg text-[#00B3A4] mt-2 mb-8" }, selectedArticle.subtitle),
                react_1.default.createElement("div", { className: "space-y-6 font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light border-t border-[#7A7A7A]/25 pt-8" }, selectedArticle.fullEssay.map((para, i) => (react_1.default.createElement("p", { key: i }, para)))),
                react_1.default.createElement("div", { className: "mt-12 pt-6 border-t border-[#7A7A7A]/25 flex items-center justify-between text-xs font-mono text-[#7A7A7A]" },
                    react_1.default.createElement("span", null, "Publicado en el Cuaderno de S\u00EDmbolos"),
                    react_1.default.createElement("button", { onClick: () => setSelectedArticle(null), className: "text-[#00B3A4] hover:underline uppercase tracking-wider font-semibold" }, "Cerrar lectura")))))));
};
exports.CuadernoSimbolos = CuadernoSimbolos;

};

// --- components/layout/FooterEditorial.tsx ---
__modules["components/layout/FooterEditorial.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterEditorial = void 0;
const react_1 = __importDefault(require("react"));
const lucide_react_1 = require("lucide-react");
const MagneticButton_tsx_1 = require("components/ui/MagneticButton.tsx");
const NarmerLogo_tsx_1 = require("components/ui/NarmerLogo.tsx");
const FooterEditorial = ({ onOpenBooking }) => {
    return (react_1.default.createElement("footer", { className: "bg-[#070F18] border-t border-[#7A7A7A]/25 pt-20 pb-24 sm:pb-16 px-6 sm:px-12 md:px-20 text-[#E8D7A6]/80 text-left" },
        react_1.default.createElement("div", { className: "max-w-7xl mx-auto" },
            react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#7A7A7A]/20" },
                react_1.default.createElement("div", { className: "md:col-span-6 space-y-6" },
                    react_1.default.createElement("div", { className: "flex items-center gap-4" },
                        react_1.default.createElement(NarmerLogo_tsx_1.NarmerLogo, { size: "md", showSubtitle: false }),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", { className: "font-editorial text-2xl sm:text-3xl tracking-[0.25em] text-[#E8D7A6] font-normal block leading-tight" }, "NARMER"),
                            react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block mt-1" }, "Gabinete de Interpretaci\u00F3n Simb\u00F3lica & Psicoastrolog\u00EDa"))),
                    react_1.default.createElement("p", { className: "font-editorial italic text-xl sm:text-2xl text-[#E8D7A6] max-w-md leading-relaxed" }, "\u00ABNos encontramos entre lo que sabemos y lo que todav\u00EDa estamos aprendiendo a mirar.\u00BB"),
                    react_1.default.createElement("div", { className: "pt-2 flex flex-wrap items-center gap-3" },
                        react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { onClick: onOpenBooking, strength: 0.3, className: "px-6 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(0,179,164,0.18)]" },
                            react_1.default.createElement("span", null, "Agendar una consulta"),
                            react_1.default.createElement(lucide_react_1.ArrowUpRight, { className: "w-3.5 h-3.5 text-[#00B3A4]" })))),
                react_1.default.createElement("div", { className: "md:col-span-3 space-y-4" },
                    react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block font-bold" }, "Exploraci\u00F3n"),
                    react_1.default.createElement("ul", { className: "space-y-3 font-clean text-xs uppercase tracking-widest text-[#E8D7A6]/75" },
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { href: "#tarot", className: "hover:text-[#00B3A4] transition-colors" }, "El Tarot (78 arcanos)")),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { href: "#oraculo", className: "hover:text-[#00B3A4] transition-colors" }, "Una Pregunta (Ritual)")),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { href: "#psicoastrologia", className: "hover:text-[#00B3A4] transition-colors" }, "Psicoastrolog\u00EDa")),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { href: "#sesiones", className: "hover:text-[#00B3A4] transition-colors" }, "Sesiones & Cat\u00E1logo")),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { href: "#testimonios", className: "hover:text-[#00B3A4] transition-colors" }, "Resonancias (Testimonios)")),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { href: "#espacio", className: "hover:text-[#00B3A4] transition-colors" }, "El Espacio")),
                        react_1.default.createElement("li", null,
                            react_1.default.createElement("a", { href: "#cuaderno", className: "hover:text-[#00B3A4] transition-colors" }, "Cuaderno de S\u00EDmbolos")))),
                react_1.default.createElement("div", { className: "md:col-span-3 space-y-4" },
                    react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block font-bold" }, "Correspondencia"),
                    react_1.default.createElement("div", { className: "space-y-3 font-clean text-xs text-[#E8D7A6]/75 font-light leading-relaxed" },
                        react_1.default.createElement("p", null, "Consultas individuales y a distancia para Espa\u00F1a, Latinoam\u00E9rica y Estados Unidos."),
                        react_1.default.createElement("div", { className: "pt-2 flex flex-col gap-2 font-mono text-[11px] text-[#E8D7A6]" },
                            react_1.default.createElement("a", { href: "https://wa.me/5493516429757", target: "_blank", rel: "noopener noreferrer", className: "hover:text-[#00B3A4] flex items-center gap-1.5 transition-colors" },
                                react_1.default.createElement(lucide_react_1.Send, { className: "w-3 h-3 text-[#00B3A4]" }),
                                " WhatsApp: 3516429757"),
                            react_1.default.createElement("a", { href: "https://instagram.com", target: "_blank", rel: "noopener noreferrer", className: "hover:text-[#00B3A4] transition-colors" }, "@narmer.simbolos"),
                            react_1.default.createElement("span", { className: "text-[#7A7A7A]" }, "contacto@narmer.art"))))),
            react_1.default.createElement("div", { className: "pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[10px] font-clean text-[#7A7A7A] leading-relaxed" },
                react_1.default.createElement("p", { className: "max-w-2xl" },
                    react_1.default.createElement("strong", null, "Nota \u00E9tica:"),
                    " El Tarot y la psicoastrolog\u00EDa se presentan como herramientas simb\u00F3licas de reflexi\u00F3n y autoconocimiento. No sustituyen asesoramiento m\u00E9dico, psicol\u00F3gico, legal o financiero."),
                react_1.default.createElement("div", { className: "font-mono tracking-widest text-[#00B3A4] shrink-0" },
                    "\u00A9 ",
                    new Date().getFullYear(),
                    " NARMER \u00B7 GABINETE SIMB\u00D3LICO")))));
};
exports.FooterEditorial = FooterEditorial;

};

// --- components/booking/BookingEditorialModal.tsx ---
__modules["components/booking/BookingEditorialModal.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingEditorialModal = void 0;
const react_1 = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const MagneticButton_tsx_1 = require("components/ui/MagneticButton.tsx");
const supabase_ts_1 = require("services/supabase.ts");
const SESSION_OPTIONS = [
    { id: '01 · TAROT', title: '01 · TAROT (60 min)', cost: '$55 USD / $50.000 ARS' },
    { id: '02 · PSICOASTROLOGÍA', title: '02 · PSICOASTROLOGÍA (75 min)', cost: '$70 USD / $65.000 ARS' },
    { id: '03 · TAROT + CARTA NATAL', title: '03 · TAROT + CARTA NATAL (90 min)', cost: '$90 USD / $85.000 ARS' },
    { id: '04 · BIODECODIFICACIÓN', title: '04 · BIODECODIFICACIÓN (Próximamente · Lista de Espera)', cost: 'Próximamente disponible' },
];
const BookingEditorialModal = ({ isOpen, onClose, initialSession = '01 · TAROT (60 min)', }) => {
    const [session, setSession] = (0, react_1.useState)(initialSession);
    const [formData, setFormData] = (0, react_1.useState)({
        name: '',
        email: '',
        date: '',
        time: '18:00',
        message: '',
    });
    const [submitted, setSubmitted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!initialSession)
            return;
        const upper = initialSession.toUpperCase();
        const matched = SESSION_OPTIONS.find((opt) => opt.title.toUpperCase() === upper ||
            (upper.includes('BIODECODIFICA') && opt.id.includes('BIODECODIFICACIÓN')) ||
            (upper.includes('CARTA NATAL') && upper.includes('TAROT') && opt.id.includes('TAROT + CARTA NATAL')) ||
            (upper.includes('PSICOASTROLOG') && opt.id.includes('PSICOASTROLOGÍA')) ||
            (upper === 'TAROT' && opt.id === '01 · TAROT'));
        setSession(matched ? matched.title : initialSession);
    }, [initialSession, isOpen]);
    if (!isOpen)
        return null;
    const sessionOptions = SESSION_OPTIONS;
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Registro opcional y no bloqueante en Supabase Database si está configurado
        void (0, supabase_ts_1.insertSupabaseRecord)('bookings', {
            session_type: session,
            client_name: formData.name.trim(),
            client_email: formData.email.trim(),
            preferred_date: formData.date || null,
            preferred_time: formData.time,
            notes: formData.message.trim() || null,
            created_at: new Date().toISOString(),
        });
    };
    const whatsappText = encodeURIComponent(`Hola Narmer, quisiera coordinar la sesión de *${session}* a nombre de ${formData.name}. Fecha tentativa: ${formData.date} a las ${formData.time}. Nota: ${formData.message || 'Sin notas adicionales'}.`);
    return (react_1.default.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto" },
        react_1.default.createElement("div", { className: "relative w-full max-w-xl bg-[#0D1B2A] border border-[#00B3A4]/40 p-8 sm:p-10 text-left my-auto max-h-[92vh] overflow-y-auto shadow-2xl" },
            react_1.default.createElement("button", { onClick: onClose, className: "absolute top-6 right-6 p-2 text-[#E8D7A6]/70 hover:text-[#00B3A4] transition-colors", "aria-label": "Cerrar ventana" },
                react_1.default.createElement(lucide_react_1.X, { className: "w-5 h-5" })),
            submitted ? (react_1.default.createElement("div", { className: "py-8 text-center space-y-6" },
                react_1.default.createElement("div", { className: "w-14 h-14 mx-auto rounded-full border border-[#00B3A4] flex items-center justify-center text-[#00B3A4] bg-[#2A0E34]/50 shadow-[0_0_20px_rgba(0,179,164,0.25)]" },
                    react_1.default.createElement(lucide_react_1.CheckCircle2, { className: "w-7 h-7" })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block mb-2 font-bold" }, "Solicitud Recibida"),
                    react_1.default.createElement("h3", { className: "font-editorial text-3xl text-[#E8D7A6] font-normal" }, "Tu cita est\u00E1 en preparaci\u00F3n."),
                    react_1.default.createElement("p", { className: "mt-3 font-editorial text-base text-[#E8D7A6]/80 max-w-md mx-auto leading-relaxed" },
                        "Gracias, ",
                        react_1.default.createElement("strong", { className: "text-[#FFFFFF]" }, formData.name),
                        ". Nos pondremos en contacto a la brevedad con los datos de acceso para tu sesi\u00F3n de ",
                        react_1.default.createElement("strong", { className: "text-[#00B3A4]" }, session),
                        ".")),
                react_1.default.createElement("div", { className: "p-4 border border-[#7A7A7A]/30 bg-[#08121D] text-xs font-mono text-[#E8D7A6]/80 text-left space-y-1.5 max-w-md mx-auto" },
                    react_1.default.createElement("div", null,
                        "Consultante: ",
                        react_1.default.createElement("span", { className: "text-[#E8D7A6] font-semibold" }, formData.name)),
                    react_1.default.createElement("div", null,
                        "Correo: ",
                        react_1.default.createElement("span", { className: "text-[#E8D7A6] font-semibold" }, formData.email)),
                    react_1.default.createElement("div", null,
                        "Fecha tentativa: ",
                        react_1.default.createElement("span", { className: "text-[#00B3A4]" },
                            formData.date || 'A coordinar',
                            " \u00B7 ",
                            formData.time))),
                react_1.default.createElement("div", { className: "pt-2 flex flex-col sm:flex-row items-center justify-center gap-3" },
                    react_1.default.createElement("a", { href: `https://wa.me/5493516429757?text=${whatsappText}`, target: "_blank", rel: "noopener noreferrer", className: "w-full sm:w-auto px-6 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,179,164,0.2)]" },
                        react_1.default.createElement(lucide_react_1.Send, { className: "w-3.5 h-3.5 text-[#00B3A4]" }),
                        react_1.default.createElement("span", null, "Confirmar por WhatsApp")),
                    react_1.default.createElement("button", { onClick: () => {
                            setSubmitted(false);
                            onClose();
                        }, className: "w-full sm:w-auto px-6 py-3 border border-[#7A7A7A]/40 text-xs font-clean uppercase tracking-[0.2em] text-[#E8D7A6]/80 hover:text-[#00B3A4]" }, "Cerrar")))) : (react_1.default.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4] block mb-1 font-bold" }, "Gabinete Narmer \u00B7 Reserva"),
                    react_1.default.createElement("h3", { className: "font-editorial text-3xl text-[#E8D7A6] font-normal" }, "Abrir un espacio de consulta."),
                    react_1.default.createElement("p", { className: "font-editorial text-sm text-[#E8D7A6]/75 mt-1 font-light" }, "Sesi\u00F3n individual y confidencial en vivo por videoconferencia HD.")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "text-[11px] font-mono tracking-widest uppercase text-[#00B3A4] block mb-2 font-bold" }, "1. Selecci\u00F3n de Consulta"),
                    react_1.default.createElement("div", { className: "space-y-2" }, sessionOptions.map((opt) => (react_1.default.createElement("button", { key: opt.id, type: "button", onClick: () => setSession(opt.title), className: `w-full p-3 border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 transition-all ${session.includes(opt.id)
                            ? 'border-[#00B3A4] bg-[#2A0E34] text-[#E8D7A6] shadow-[0_0_15px_rgba(0,179,164,0.2)]'
                            : 'border-[#7A7A7A]/30 bg-[#08121D] text-[#E8D7A6]/70 hover:border-[#00B3A4]/50'}` },
                        react_1.default.createElement("span", { className: "font-editorial text-base leading-snug" }, opt.title),
                        react_1.default.createElement("span", { className: "font-mono text-[11px] text-[#00B3A4] font-semibold shrink-0" }, opt.cost)))))),
                react_1.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "text-[11px] font-clean text-[#E8D7A6]/70 block mb-1" }, "Nombre Completo *"),
                        react_1.default.createElement("input", { type: "text", required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "Tu nombre", className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none" })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "text-[11px] font-clean text-[#E8D7A6]/70 block mb-1" }, "Email de Contacto *"),
                        react_1.default.createElement("input", { type: "email", required: true, value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "tu@correo.com", className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none" }))),
                react_1.default.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "text-[11px] font-clean text-[#E8D7A6]/70 block mb-1" }, "Fecha Tentativa Deseada"),
                        react_1.default.createElement("div", { className: "relative" },
                            react_1.default.createElement(lucide_react_1.Calendar, { className: "w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" }),
                            react_1.default.createElement("input", { type: "date", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none" }))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "text-[11px] font-clean text-[#E8D7A6]/70 block mb-1" }, "Franja Horaria Preferida"),
                        react_1.default.createElement("div", { className: "relative" },
                            react_1.default.createElement(lucide_react_1.Clock, { className: "w-3.5 h-3.5 absolute left-3 top-3 text-[#00B3A4]" }),
                            react_1.default.createElement("select", { value: formData.time, onChange: (e) => setFormData({ ...formData, time: e.target.value }), className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] pl-9 pr-3 py-2 text-xs font-clean text-[#E8D7A6] focus:outline-none" },
                                react_1.default.createElement("option", { value: "11:00" }, "Ma\u00F1ana (11:00 hs)"),
                                react_1.default.createElement("option", { value: "15:00" }, "Tarde (15:00 hs)"),
                                react_1.default.createElement("option", { value: "18:00" }, "Vespertino (18:00 hs)"),
                                react_1.default.createElement("option", { value: "20:00" }, "Noche (20:00 hs)"))))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "text-[11px] font-clean text-[#E8D7A6]/70 block mb-1" }, "\u00BFQu\u00E9 tema o pregunta te gustar\u00EDa explorar? (Opcional)"),
                    react_1.default.createElement("textarea", { rows: 2, value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }), placeholder: "Breve apunte o inquietud...", className: "w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-2.5 text-xs font-clean text-[#E8D7A6] focus:outline-none resize-none" })),
                react_1.default.createElement("div", { className: "pt-2 flex items-center justify-end gap-4" },
                    react_1.default.createElement("button", { type: "button", onClick: onClose, className: "px-4 py-2.5 text-xs font-clean uppercase tracking-wider text-[#7A7A7A] hover:text-[#E8D7A6]" }, "Cancelar"),
                    react_1.default.createElement(MagneticButton_tsx_1.MagneticButton, { type: "submit", strength: 0.28, className: "px-6 py-3 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.2em] uppercase transition-colors shadow-[0_0_15px_rgba(0,179,164,0.2)]" },
                        react_1.default.createElement(lucide_react_1.Feather, { className: "w-3.5 h-3.5 text-[#00B3A4]" }),
                        react_1.default.createElement("span", null, "Solicitar Reserva"))))))));
};
exports.BookingEditorialModal = BookingEditorialModal;

};

// --- components/ui/EditorialSectionReveal.tsx ---
__modules["components/ui/EditorialSectionReveal.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorialSectionReveal = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("motion/react");
/**
 * EditorialSectionReveal
 *
 * Provides a fluid scroll-driven entrance (fade-in + subtle vertical translation)
 * using framer-motion's useScroll and useTransform linked to the target element's viewport intersection.
 * Connects sections as a continuous unfolding editorial volume rather than disconnected blocks.
 */
const EditorialSectionReveal = ({ children, className = '', id, showConduit = true, conduitLabel, }) => {
    const containerRef = (0, react_1.useRef)(null);
    // Track scroll progress of this specific section relative to viewport:
    // "start end" = top of element enters bottom of viewport
    // "start center" / "start 30%" = top of element reaches upper-middle of viewport
    const { scrollYProgress } = (0, react_2.useScroll)({
        target: containerRef,
        offset: ['start end', 'start 25%'],
    });
    // Smooth fade-in: starts transparent and gradually blooms to full opacity
    const opacity = (0, react_2.useTransform)(scrollYProgress, [0, 0.45, 1], [0.15, 0.65, 1]);
    // Editorial vertical lift: subtle 38px translation easing into natural position (0px)
    const y = (0, react_2.useTransform)(scrollYProgress, [0, 1], [38, 0]);
    // Very slight scale breathe (0.988 -> 1) to feel organic and grounded
    const scale = (0, react_2.useTransform)(scrollYProgress, [0, 1], [0.988, 1]);
    // Conduit line growth for visual continuity between chapters
    const conduitHeight = (0, react_2.useTransform)(scrollYProgress, [0, 0.6], ['0%', '100%']);
    const conduitGlow = (0, react_2.useTransform)(scrollYProgress, [0, 0.6, 1], [0.2, 0.8, 0.4]);
    return (react_1.default.createElement("div", { id: id, ref: containerRef, className: `relative ${className}` },
        showConduit && (react_1.default.createElement("div", { "aria-hidden": "true", className: "pointer-events-none absolute left-1/2 -top-7 -translate-x-1/2 z-20 flex flex-col items-center select-none" },
            react_1.default.createElement("div", { className: "relative w-[1px] h-5 bg-[#7A7A7A]/25 overflow-hidden" },
                react_1.default.createElement(react_2.motion.div, { style: { height: conduitHeight, opacity: conduitGlow }, className: "w-full bg-gradient-to-b from-[#00B3A4]/0 via-[#00B3A4] to-[#E8D7A6]" })),
            conduitLabel && (react_1.default.createElement("span", { className: "px-3 py-0.5 bg-[#0D1B2A]/95 border border-[#7A7A7A]/25 font-mono text-[8px] tracking-[0.28em] uppercase text-[#E8D7A6]/75 shadow-sm whitespace-nowrap" }, conduitLabel)))),
        react_1.default.createElement(react_2.motion.div, { style: {
                opacity,
                y,
                scale,
            }, className: "w-full will-change-transform" }, children)));
};
exports.EditorialSectionReveal = EditorialSectionReveal;

};

// --- components/ui/EditorialScrollTimeline.tsx ---
__modules["components/ui/EditorialScrollTimeline.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorialScrollTimeline = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("motion/react");
/**
 * EditorialScrollTimeline
 *
 * A refined, minimalist timeline progress bar positioned at the extreme top of the viewport.
 * Uses Framer Motion's useScroll with physics-based spring damping for an organic, paper-weight scroll sensation.
 * Rendered with the official brand palette:
 * - Base track: Faint Egyptian stone grey (#7A7A7A / 15%)
 * - Active progress line: Gradient spanning Night Blue (#0D1B2A), Deep Violet (#2A0E34), Turquoise (#00B3A4), and Cream/Gold (#E8D7A6)
 * - Leading celestial cursor: Microscopic radiant point with a subtle turquoise halo marking the exact reading coordinate
 */
const EditorialScrollTimeline = () => {
    const { scrollYProgress } = (0, react_2.useScroll)();
    // Smooth out rapid scrolling gestures with editorial inertia
    const scaleX = (0, react_2.useSpring)(scrollYProgress, {
        stiffness: 120,
        damping: 24,
        restDelta: 0.001,
    });
    // Calculate percentage for subtle Roman chapter indicator or glow intensity
    const glowOpacity = (0, react_2.useTransform)(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.8, 0.8, 1]);
    return (react_1.default.createElement("div", { "aria-hidden": "true", className: "fixed top-0 left-0 right-0 z-50 pointer-events-none select-none h-[2px]" },
        react_1.default.createElement("div", { className: "absolute inset-0 bg-[#7A7A7A]/15 backdrop-blur-[1px]" }),
        react_1.default.createElement(react_2.motion.div, { style: { scaleX }, className: "h-full origin-left bg-gradient-to-r from-[#2A0E34] via-[#00B3A4] to-[#E8D7A6] relative" },
            react_1.default.createElement(react_2.motion.div, { style: { opacity: glowOpacity }, className: "absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E8D7A6] -mr-1 shadow-[0_0_8px_#00B3A4,0_0_14px_rgba(232,215,166,0.8)]" }))));
};
exports.EditorialScrollTimeline = EditorialScrollTimeline;

};

// --- components/ui/AnalogFilmGrainOverlay.tsx ---
__modules["components/ui/AnalogFilmGrainOverlay.tsx"] = function(exports, require, module) {
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalogFilmGrainOverlay = void 0;
const react_1 = __importStar(require("react"));
/**
 * AnalogFilmGrainOverlay
 *
 * Renders an authentic, dynamic 35mm film grain / paper noise overlay using an HTML5 Canvas.
 * Generates an organic temporal grain pattern updated at cinematic frame intervals (~18-24fps)
 * with extremely low alpha (3-5%) and mix-blend mode.
 * Completely pointer-events-none, hardware accelerated, and optimized for battery/CPU performance
 * through pattern buffer cycling and frame-skipping.
 */
const AnalogFilmGrainOverlay = () => {
    const canvasRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx)
            return;
        // Pattern dimensions: 256x256 pattern repeated seamlessly across screen for ultra-low GPU overhead
        const patternSize = 256;
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = patternSize;
        patternCanvas.height = patternSize;
        const patternCtx = patternCanvas.getContext('2d');
        if (!patternCtx)
            return;
        // Pre-generate 4 subtle noise frames to cycle through at analog 18fps cadence
        const framesCount = 4;
        const patternDataList = [];
        for (let f = 0; f < framesCount; f++) {
            const imgData = patternCtx.createImageData(patternSize, patternSize);
            const data = imgData.data;
            const len = data.length;
            for (let i = 0; i < len; i += 4) {
                // Subtle Gaussian-skewed analog grain with slight silver halide tone variation
                const val = Math.floor(Math.random() * 255);
                // Slightly warm tint toward ivory/pergamino (#E8D7A6) & night dust
                data[i] = val; // R
                data[i + 1] = val; // G
                data[i + 2] = val; // B
                // Ultra-delicate opacity (around 12-22 out of 255 -> ~5-8% max peak)
                data[i + 3] = Math.random() < 0.65 ? Math.floor(Math.random() * 16) + 4 : 0;
            }
            patternDataList.push(imgData);
        }
        let animationFrameId;
        let currentFrame = 0;
        let lastTime = 0;
        const fpsInterval = 1000 / 18; // 18 frames per second (vintage cinematic cadence)
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });
        const render = (time) => {
            animationFrameId = requestAnimationFrame(render);
            const elapsed = time - lastTime;
            if (elapsed < fpsInterval)
                return;
            lastTime = time - (elapsed % fpsInterval);
            // Cycle noise frame
            currentFrame = (currentFrame + 1) % framesCount;
            patternCtx.putImageData(patternDataList[currentFrame], 0, 0);
            const pattern = ctx.createPattern(patternCanvas, 'repeat');
            if (pattern) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        };
        animationFrameId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);
    return (react_1.default.createElement("canvas", { ref: canvasRef, "aria-hidden": "true", className: "fixed inset-0 w-full h-full pointer-events-none select-none z-30 opacity-45 mix-blend-screen", style: {
            imageRendering: 'pixelated',
        } }));
};
exports.AnalogFilmGrainOverlay = AnalogFilmGrainOverlay;

};

// --- App.tsx ---
__modules["App.tsx"] = function(exports, require, module) {
"use strict";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = __importStar(require("react"));
const AmbientAudioContext_tsx_1 = require("context/AmbientAudioContext.tsx");
const AtmosphericAudioPlayer_tsx_1 = require("components/audio/AtmosphericAudioPlayer.tsx");
const OrbitalCursor_tsx_1 = require("components/ui/OrbitalCursor.tsx");
const NavbarEditorial_tsx_1 = require("components/layout/NavbarEditorial.tsx");
const HeroArtistic_tsx_1 = require("components/sections/HeroArtistic.tsx");
const TarotGalleryArtistic_tsx_1 = require("components/sections/TarotGalleryArtistic.tsx");
const TarotRitualExperience_tsx_1 = require("components/oracle/TarotRitualExperience.tsx");
const PsicoastrologiaMap_tsx_1 = require("components/sections/PsicoastrologiaMap.tsx");
const SessionsCatalog_tsx_1 = require("components/sections/SessionsCatalog.tsx");
const AboutSpace_tsx_1 = require("components/sections/AboutSpace.tsx");
const ManifestoPhrases_tsx_1 = require("components/sections/ManifestoPhrases.tsx");
const TestimonialsSection_tsx_1 = require("components/sections/TestimonialsSection.tsx");
const CuadernoSimbolos_tsx_1 = require("components/sections/CuadernoSimbolos.tsx");
const FooterEditorial_tsx_1 = require("components/layout/FooterEditorial.tsx");
const BookingEditorialModal_tsx_1 = require("components/booking/BookingEditorialModal.tsx");
const EditorialSectionReveal_tsx_1 = require("components/ui/EditorialSectionReveal.tsx");
const EditorialScrollTimeline_tsx_1 = require("components/ui/EditorialScrollTimeline.tsx");
const AnalogFilmGrainOverlay_tsx_1 = require("components/ui/AnalogFilmGrainOverlay.tsx");
function App() {
    const [bookingModalOpen, setBookingModalOpen] = (0, react_1.useState)(false);
    const [selectedSession, setSelectedSession] = (0, react_1.useState)('01 · TAROT (60 min)');
    const handleOpenBooking = (sessionTitle) => {
        if (sessionTitle) {
            setSelectedSession(sessionTitle);
        }
        setBookingModalOpen(true);
    };
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (react_1.default.createElement(AmbientAudioContext_tsx_1.AmbientAudioProvider, null,
        react_1.default.createElement("div", { className: "min-h-screen bg-[#0D1B2A] text-[#E8D7A6] relative selection:bg-[#2A0E34] selection:text-[#E8D7A6] custom-cursor-active overflow-x-hidden" },
            react_1.default.createElement(AnalogFilmGrainOverlay_tsx_1.AnalogFilmGrainOverlay, null),
            react_1.default.createElement(EditorialScrollTimeline_tsx_1.EditorialScrollTimeline, null),
            react_1.default.createElement(OrbitalCursor_tsx_1.OrbitalCursor, null),
            react_1.default.createElement(NavbarEditorial_tsx_1.NavbarEditorial, { onOpenBooking: () => handleOpenBooking() }),
            react_1.default.createElement("main", { className: "relative" },
                react_1.default.createElement(HeroArtistic_tsx_1.HeroArtistic, { onEnterOracle: () => scrollToSection('oraculo'), onExploreChart: () => scrollToSection('psicoastrologia'), onBookSession: () => handleOpenBooking() }),
                react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { conduitLabel: "CAP. I \u00B7 ARCANOS" },
                    react_1.default.createElement(TarotGalleryArtistic_tsx_1.TarotGalleryArtistic, null)),
                react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { conduitLabel: "RITUAL \u00B7 OR\u00C1CULO" },
                    react_1.default.createElement(TarotRitualExperience_tsx_1.TarotRitualExperience, null)),
                react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { conduitLabel: "CAP. II \u00B7 ASTROS" },
                    react_1.default.createElement(PsicoastrologiaMap_tsx_1.PsicoastrologiaMap, null)),
                react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { conduitLabel: "CAP. III \u00B7 CONSULTAS" },
                    react_1.default.createElement(SessionsCatalog_tsx_1.SessionsCatalog, { onBookSession: (title) => handleOpenBooking(title) })),
                react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { conduitLabel: "VOCES \u00B7 RESONANCIAS" },
                    react_1.default.createElement(TestimonialsSection_tsx_1.TestimonialsSection, null)),
                react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { conduitLabel: "PAUSA \u00B7 AFORISMOS" },
                    react_1.default.createElement(ManifestoPhrases_tsx_1.ManifestoPhrases, null)),
                react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { conduitLabel: "CAP. IV \u00B7 GABINETE" },
                    react_1.default.createElement(AboutSpace_tsx_1.AboutSpace, null)),
                react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { conduitLabel: "CAP. V \u00B7 ENSAYOS" },
                    react_1.default.createElement(CuadernoSimbolos_tsx_1.CuadernoSimbolos, null))),
            react_1.default.createElement(AtmosphericAudioPlayer_tsx_1.AtmosphericAudioPlayer, null),
            react_1.default.createElement(EditorialSectionReveal_tsx_1.EditorialSectionReveal, { showConduit: false },
                react_1.default.createElement(FooterEditorial_tsx_1.FooterEditorial, { onOpenBooking: () => handleOpenBooking() })),
            react_1.default.createElement(BookingEditorialModal_tsx_1.BookingEditorialModal, { isOpen: bookingModalOpen, onClose: () => setBookingModalOpen(false), initialSession: selectedSession }))));
}

};

// --- main.tsx ---
__modules["main.tsx"] = function(exports, require, module) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("react-dom/client");
const App_tsx_1 = __importDefault(require("App.tsx"));
;
(0, client_1.createRoot)(document.getElementById('root')).render(React.createElement(App_tsx_1.default, null));

};

__require("main.tsx");
