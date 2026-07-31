import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export const AudioToggle: React.FC = () => {
  const [muted, setMuted] = useState<boolean>(audioEngine.getMuted());

  const toggle = () => {
    const isMuted = audioEngine.toggleMute();
    setMuted(isMuted);
    if (!isMuted) {
      audioEngine.playClick(800);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
        muted
          ? 'bg-slate-900 text-slate-500 border border-slate-800'
          : 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/40 shadow-lg shadow-orange-500/10'
      }`}
      title={muted ? 'Enable Synthesizer Sound' : 'Mute Synthesizer Sound'}
    >
      {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-orange-400 animate-pulse" />}
      <span>{muted ? 'Audio Off' : 'Audio Synth'}</span>
    </button>
  );
};
