
import React, { useState } from 'react';
import { SUGGESTED_TOPICS } from '../constants';

interface InputAreaProps {
  onSendMessage: (msg: string) => void;
  disabled: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-white border-t border-stone-200">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(topic)}
              disabled={disabled}
              className="text-[11px] font-medium bg-stone-100 hover:bg-amber-50 hover:text-amber-700 text-stone-500 px-3 py-1.5 rounded-full border border-stone-200 transition-colors disabled:opacity-50"
            >
              {topic}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about scripture, theology, or history..."
            disabled={disabled}
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm disabled:bg-stone-50 disabled:text-stone-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="bg-stone-800 text-white p-3 rounded-xl hover:bg-stone-900 transition-colors disabled:bg-stone-200 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-center text-stone-400 italic">
          This AI provides theological perspectives and historical context. It is not a replacement for personal spiritual counseling.
        </p>
      </div>
    </div>
  );
};

export default InputArea;
