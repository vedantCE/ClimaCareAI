import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import { Activity } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage?: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-full mb-6 shadow-2xl">
              <Activity className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Welcome to Healthify AI
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6 px-4">
              Your intelligent health assistant is here to help. Ask me anything
              about symptoms, conditions, medications, or general health advice.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full px-4">
              {[
                'What are common cold symptoms?',
                'How to manage stress?',
                'Tips for better sleep',
                'Healthy eating habits',
              ].map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => onSendMessage?.(suggestion)}
                  className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;