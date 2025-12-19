
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  audioData?: string; // base64
}

export interface VoiceConfig {
  enabled: boolean;
  voiceName: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
}

export enum AppStatus {
  IDLE = 'idle',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  ERROR = 'error'
}
