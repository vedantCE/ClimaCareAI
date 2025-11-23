import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  // Handle send message
  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end space-x-2 sm:space-x-3">
          {/* Input Field */}
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your health question..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 pr-4 rounded-2xl border border-gray-300 dark:border-gray-600 
                       bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed
                       resize-none placeholder-gray-400 dark:placeholder-gray-500
                       transition-all duration-200"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`flex-shrink-0 p-3 sm:p-3.5 rounded-2xl transition-all duration-200 shadow-md
              ${
                !inputValue.trim() || isLoading
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-blue-500 hover:from-primary-dark hover:to-blue-600 cursor-pointer'
              }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* Character hint or disclaimer */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          AI-powered medical information. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;