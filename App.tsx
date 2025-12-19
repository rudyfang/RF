
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Message, VoiceConfig, AppStatus } from './types';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import VoiceController from './components/VoiceController';
import { 
  getPastorResponse, 
  getPastorAudio, 
  decodeBase64, 
  decodeAudioData 
} from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    enabled: true,
    voiceName: 'Kore'
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000
      });
    }
  };

  const stopSpeaking = () => {
    if (currentAudioSource.current) {
      currentAudioSource.current.stop();
      currentAudioSource.current = null;
    }
    setStatus(AppStatus.IDLE);
  };

  const handleSendMessage = useCallback(async (content: string) => {
    stopSpeaking();
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setStatus(AppStatus.THINKING);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await getPastorResponse(content, history);

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText || "I'm sorry, I encountered an issue reflecting on that question.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
      setStatus(AppStatus.IDLE);

      if (voiceConfig.enabled && responseText) {
        handleSpeak(responseText);
      }
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  }, [messages, voiceConfig.enabled, voiceConfig.voiceName]);

  const handleSpeak = async (text: string) => {
    initAudioContext();
    setStatus(AppStatus.SPEAKING);

    // Limit text for TTS to first sections or reasonable length
    const speakingText = text.split('\n').filter(l => !l.startsWith('3.') && !l.startsWith('4.')).join('\n').substring(0, 1500);

    const base64Audio = await getPastorAudio(speakingText, voiceConfig.voiceName);
    if (!base64Audio || !audioContextRef.current) {
      setStatus(AppStatus.IDLE);
      return;
    }

    const audioBytes = decodeBase64(base64Audio);
    const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      setStatus(AppStatus.IDLE);
      currentAudioSource.current = null;
    };

    currentAudioSource.current = source;
    source.start(0);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <Header />
      
      <main className="flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full bg-white md:border-x border-stone-100 shadow-xl shadow-stone-200/50">
        <div className="px-4 pt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {status === AppStatus.THINKING && (
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></div>
              </div>
            )}
            <span className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">
              {status === AppStatus.THINKING ? 'Reflecting' : status === AppStatus.SPEAKING ? 'Speaking' : 'Sanctuary'}
            </span>
          </div>
          <VoiceController 
            config={voiceConfig} 
            onToggle={() => {
              if (voiceConfig.enabled) stopSpeaking();
              setVoiceConfig(v => ({ ...v, enabled: !v.enabled }));
            }}
            onVoiceChange={(voiceName) => setVoiceConfig(v => ({ ...v, voiceName }))}
          />
        </div>

        <MessageList messages={messages} isThinking={status === AppStatus.THINKING} />
        
        <InputArea onSendMessage={handleSendMessage} disabled={status === AppStatus.THINKING} />
      </main>

      {status === AppStatus.ERROR && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Connectivity interrupted. Please try again.
        </div>
      )}
    </div>
  );
};

export default App;
