import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  Bot, 
  User, 
  Phone, 
  MoreVertical,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Flag,
  Trash2,
  Menu,
  X
} from 'lucide-react';

const LibraryChatPage = () => {
  const [activeChat, setActiveChat] = useState('librarian'); // 'librarian' or 'bot'
  const [messages, setMessages] = useState({
    librarian: [
      {
        id: 1,
        sender: 'librarian',
        content: 'Hello! I\'m Sarah, your librarian. How can I help you today?',
        timestamp: new Date(Date.now() - 300000),
        status: 'read'
      }
    ],
    bot: [
      {
        id: 1,
        sender: 'bot',
        content: 'Hi! I\'m Libby, your virtual assistant. I can help you with book searches, library hours, and more!',
        timestamp: new Date(Date.now() - 600000),
        status: 'read'
      }
    ]
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [librarianStatus, setLibrarianStatus] = useState('online'); // 'online', 'away', 'offline'
  const [showSidebar, setShowSidebar] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // OrgSettings color palette
  const colors = {
    primary: '#3b82f6',      // Blue
    primaryDark: '#2563eb',  // Darker blue
    secondary: '#10b981',    // Green
    accent: '#8b5cf6',       // Purple
    background: '#f8fafc',   // Light gray
    surface: '#ffffff',      // White
    surfaceHover: '#f1f5f9', // Light blue-gray
    text: '#1e293b',         // Dark gray
    textSecondary: '#64748b', // Medium gray
    textLight: '#94a3b8',    // Light gray
    border: '#e2e8f0',       // Border gray
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Orange
    error: '#ef4444',        // Red
    librarianBg: '#f0f9ff',  // Light blue
    botBg: '#f0fdf4',        // Light green
    userBg: '#f3f4f6'        // Gray
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...prev[activeChat], newMessage]
    }));

    setInputMessage('');
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      setIsTyping(false);
      const response = {
        id: Date.now() + 1,
        sender: activeChat,
        content: activeChat === 'librarian' 
          ? 'Thanks for your message! Let me help you with that.'
          : 'I understand you need help. Let me provide some options for you.',
        timestamp: new Date(),
        status: 'delivered'
      };
      
      setMessages(prev => ({
        ...prev,
        [activeChat]: [...prev[activeChat], response]
      }));
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { label: 'Reserve a book', icon: '📚' },
    { label: 'Find a title', icon: '🔍' },
    { label: 'Opening hours', icon: '🕒' },
    { label: 'Renewal policy', icon: '🔄' }
  ];

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const isBot = message.sender === 'bot';
    
    return (
      <div key={message.id} className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0 mr-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: isBot ? colors.secondary : colors.primary,
                color: 'white'
              }}
            >
              {isBot ? <Bot size={16} /> : <User size={16} />}
            </div>
          </div>
        )}
        
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isUser 
            ? 'rounded-br-md'
            : 'rounded-bl-md'
        }`}
        style={{
          backgroundColor: isUser 
            ? colors.primary
            : isBot 
              ? colors.botBg
              : colors.librarianBg,
          color: isUser ? 'white' : colors.text,
          border: !isUser ? `1px solid ${colors.border}` : 'none'
        }}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div className={`text-xs mt-1 flex items-center justify-between ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            {isUser && (
              <div className="flex space-x-1">
                <div className="w-3 h-3 border border-current rounded-full opacity-60"></div>
              </div>
            )}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0 ml-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.accent, color: 'white' }}
            >
              <User size={16} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.background }}>
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:relative z-50 w-80 h-full border-r flex flex-col`}
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border
      }}>
        {/* Sidebar Header */}
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
              Conversations
            </h2>
            <button 
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Options */}
        <div className="flex-1 overflow-y-auto">
          {/* Librarian Chat */}
          <div 
            className={`p-4 cursor-pointer border-b transition-colors ${
              activeChat === 'librarian' ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            style={{ borderColor: colors.border }}
            onClick={() => {
              setActiveChat('librarian');
              setShowQuickActions(false);
              setShowSidebar(false);
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  <User size={20} />
                </div>
                <div 
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    librarianStatus === 'online' ? 'bg-green-500' :
                    librarianStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium" style={{ color: colors.text }}>
                  Sarah (Librarian)
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {librarianStatus === 'online' ? 'Online' :
                   librarianStatus === 'away' ? 'Away' : 'Offline'}
                </p>
              </div>
              {messages.librarian.some(m => !m.read) && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </div>
          </div>

          {/* Bot Chat */}
          <div 
            className={`p-4 cursor-pointer transition-colors ${
              activeChat === 'bot' ? 'bg-green-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              setActiveChat('bot');
              setShowQuickActions(true);
              setShowSidebar(false);
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.secondary, color: 'white' }}
                >
                  <Bot size={20} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium" style={{ color: colors.text }}>
                  Libby (Assistant Bot)
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Always available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between" 
             style={{ 
               backgroundColor: colors.surface,
               borderColor: colors.border
             }}>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: activeChat === 'bot' ? colors.secondary : colors.primary,
                    color: 'white'
                  }}
                >
                  {activeChat === 'bot' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div 
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    activeChat === 'bot' || librarianStatus === 'online' ? 'bg-green-500' :
                    librarianStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}
                />
              </div>
              
              <div>
                <h2 className="font-semibold" style={{ color: colors.text }}>
                  {activeChat === 'bot' ? 'Libby (Assistant Bot)' : 'Sarah (Librarian)'}
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {isTyping ? 'Typing...' : 
                   activeChat === 'bot' ? 'Always available' :
                   librarianStatus === 'online' ? 'Online' :
                   librarianStatus === 'away' ? 'Away' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Phone size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages[activeChat].length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <MessageCircle size={48} style={{ color: colors.textLight }} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.text }}>
                Start a conversation
              </h3>
              <p style={{ color: colors.textSecondary }}>
                {activeChat === 'bot' 
                  ? 'Ask me anything about the library!'
                  : 'Send a message to get help from our librarian.'
                }
              </p>
            </div>
          ) : (
            messages[activeChat].map(renderMessage)
          )}

          {/* Quick Actions for Bot */}
          {activeChat === 'bot' && showQuickActions && messages[activeChat].length <= 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                How can I help you today?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="p-3 text-left rounded-lg border hover:shadow-sm transition-all"
                    style={{ 
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text
                    }}
                    onClick={() => {
                      setInputMessage(action.label);
                      setShowQuickActions(false);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{action.icon}</span>
                      <span className="text-sm">{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: activeChat === 'bot' ? colors.secondary : colors.primary,
                  color: 'white'
                }}
              >
                {activeChat === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="flex space-x-1 p-3 rounded-2xl rounded-bl-md" 
                   style={{ backgroundColor: colors.surfaceHover }}>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t" style={{ 
          backgroundColor: colors.surface,
          borderColor: colors.border
        }}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="flex items-end space-x-2 p-3 rounded-2xl border"
                   style={{ 
                     backgroundColor: colors.background,
                     borderColor: colors.border
                   }}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 resize-none bg-transparent outline-none text-sm"
                  style={{ color: colors.text }}
                  rows={1}
                />
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Paperclip size={16} style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Smile size={16} style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Mic size={16} style={{ color: colors.textSecondary }} />
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: inputMessage.trim() ? colors.primary : colors.border,
                color: 'white'
              }}
            >
              <Send size={18} />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
        </div>
      </div>
    </div>
  );
};

export default LibraryChatPage;