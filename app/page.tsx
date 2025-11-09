'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import Message from '@/components/Message/Message';
import Header from '@/components/Header/Header';
import Input from '@/components/Input/Input';

const initialMessages: UIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    parts: [
      {
        text: `Hi! I'm your journal assistant. 
          You can add entries like "Remind me to buy eggs next time I'm at the supermarket" or "Alice says 'I should check out Kritunga for their awesome biryani'" 
          or "What is my shopping list" or "I'm at the supermarket. What should I buy?"`,
        type: "text"
      }
    ],
  },
];

export default function JournalPage() {
  const {
    messages,
    sendMessage,
    status,
  } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onError: (error) => {
      typeof window !== undefined && window.alert('Error:: ' + error?.message);
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (input: string) => {
    sendMessage({
      text: input
    });
  };

  const clearChat = () => {
    if (typeof window !== undefined && window.confirm('Clear all messages and journal entries?')) {
      // reset chat
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <Header status={status} clearChat={clearChat} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message: UIMessage) => (<Message key={message.id} message={message} />))}
          {/* Loading */}
          {status !== 'ready' && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-md border border-gray-200 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Input status={status} handleSubmit={handleSubmit} />
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>💡 Try: "Remind me to buy eggs"</span>
            <span>•</span>
            <span>"What's on my shopping list?"</span>
            <span>•</span>
            <span>"Alice says check out Kritunga"</span>
          </div>
        </div>
      </div>
    </div>
  );
}