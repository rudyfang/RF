
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isThinking: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isThinking }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const renderContent = (content: string) => {
    // Basic markdown parsing for the pastor's structured response
    return content.split('\n').map((line, i) => {
      if (line.match(/^\d\./)) {
        return <h3 key={i} className="text-amber-800 font-bold mt-4 mb-2 text-lg border-b border-amber-100 pb-1">{line}</h3>;
      }
      if (line.startsWith('>')) {
        return <blockquote key={i} className="border-l-4 border-stone-300 pl-4 py-2 my-2 italic text-stone-600 bg-stone-50 rounded-r-md">{line.substring(1)}</blockquote>;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      
      // Handle scripture citations in bold/italics (manual simple check)
      const formattedLine = line.replace(/\(([^)]+\d+:\d+[^)]*)\)/g, '<span class="italic font-serif text-amber-700">($1)</span>');
      
      return <p key={i} className="mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-stone-400 py-20">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="max-w-xs text-sm">Welcome. How can I assist your understanding of scripture or Christian tradition today?</p>
        </div>
      )}

      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
            msg.role === 'user' 
              ? 'bg-amber-600 text-white' 
              : 'bg-white border border-stone-200 text-stone-800'
          }`}>
            <div className="text-sm font-serif">
              {msg.role === 'model' ? renderContent(msg.content) : <p>{msg.content}</p>}
            </div>
            <div className={`text-[10px] mt-2 uppercase tracking-tighter opacity-60 ${msg.role === 'user' ? 'text-white' : 'text-stone-400'}`}>
              {msg.role === 'user' ? 'Your Query' : 'Pastoral Guidance'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex justify-start">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm text-stone-400 italic text-sm flex items-center space-x-2">
            <span className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce delay-150"></span>
            </span>
            <span>Reflecting on scripture...</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
