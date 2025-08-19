import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.message_type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-2xl max-w-xs lg:max-w-md break-words ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 border border-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
      {isUser && (
        <div className="flex-shrink-0 ml-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
