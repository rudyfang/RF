
import React from 'react';
import { VoiceConfig } from '../types';

interface VoiceControllerProps {
  config: VoiceConfig;
  onToggle: () => void;
  onVoiceChange: (voice: VoiceConfig['voiceName']) => void;
}

const VoiceController: React.FC<VoiceControllerProps> = ({ config, onToggle, onVoiceChange }) => {
  return (
    <div className="flex items-center space-x-4 bg-stone-50 p-2 rounded-lg border border-stone-200">
      <button 
        onClick={onToggle}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${config.enabled ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
        <span className="text-xs font-semibold">{config.enabled ? 'Voice On' : 'Voice Off'}</span>
      </button>

      {config.enabled && (
        <select 
          value={config.voiceName}
          onChange={(e) => onVoiceChange(e.target.value as VoiceConfig['voiceName'])}
          className="text-xs bg-transparent border-none focus:ring-0 text-stone-600 cursor-pointer"
        >
          <option value="Kore">Warm (Kore)</option>
          <option value="Zephyr">Helpful (Zephyr)</option>
          <option value="Puck">Friendly (Puck)</option>
          <option value="Charon">Deep (Charon)</option>
          <option value="Fenrir">Classic (Fenrir)</option>
        </select>
      )}
    </div>
  );
};

export default VoiceController;
