import React, { createContext, useContext, useEffect, useState } from 'react';
import { atmosphericAudio, SoundscapeType } from '../utils/ambientAudio';

interface AmbientAudioContextType {
  isPlaying: boolean;
  volume: number;
  mode: SoundscapeType;
  isPanelOpen: boolean;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  setMode: (mode: SoundscapeType) => void;
  triggerChime: () => void;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
}

const AmbientAudioContext = createContext<AmbientAudioContextType | undefined>(undefined);

export const AmbientAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [mode, setModeState] = useState<SoundscapeType>('nocturno');
  const [isPanelOpen, setPanelOpen] = useState<boolean>(false);

  useEffect(() => {
    // Listen to changes from the procedural synthesizer
    const unsubscribe = atmosphericAudio.subscribe((playing, vol, currentMode) => {
      setIsPlaying(playing);
      setVolumeState(vol);
      setModeState(currentMode);
    });

    // Keyboard shortcut: Press 'm' or 'M' to toggle mute/play when not in an input field
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'm' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        atmosphericAudio.toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const togglePlay = () => {
    atmosphericAudio.toggle();
  };

  const handleSetVolume = (val: number) => {
    atmosphericAudio.setVolume(val);
  };

  const handleSetMode = (newMode: SoundscapeType) => {
    atmosphericAudio.setMode(newMode);
  };

  const triggerChime = () => {
    if (isPlaying) {
      atmosphericAudio.triggerDistantChime(1.1);
    } else {
      // If paused, striking the bell will produce a single ephemeral chime without starting continuous playback
      atmosphericAudio.triggerDistantChime(1.0);
    }
  };

  const togglePanel = () => {
    setPanelOpen((prev) => !prev);
  };

  return (
    <AmbientAudioContext.Provider
      value={{
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
      }}
    >
      {children}
    </AmbientAudioContext.Provider>
  );
};

export const useAmbientAudio = (): AmbientAudioContextType => {
  const context = useContext(AmbientAudioContext);
  if (!context) {
    throw new Error('useAmbientAudio must be used within an AmbientAudioProvider');
  }
  return context;
};
