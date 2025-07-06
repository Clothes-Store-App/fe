import { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { useSendMessageMutation } from '../services/chatbot.service';
import toast from 'react-hot-toast';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Xin chào! Tôi là trợ lý ảo của Mẹ Xíu. Tôi có thể giúp gì cho bạn? 😊',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastBotMessageId, setLastBotMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // API hooks
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      // Gửi tin nhắn qua API
      const response = await sendMessage({ message: currentMessage }).unwrap();
      if (response && response.data && response.data.reply) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setLastBotMessageId(botMessage.id);
      } else {
        // Fallback nếu API không trả về đúng format
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline 0906532932 để được hỗ trợ trực tiếp.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setLastBotMessageId(botMessage.id);
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      
      // Fallback response khi API lỗi
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể liên hệ trực tiếp qua hotline 0906532932 để được hỗ trợ nhé! 📞',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setLastBotMessageId(botMessage.id);
      
      toast.error('Có lỗi xảy ra khi gửi tin nhắn');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed lg:bottom-6 bottom-24 right-6 z-999 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
        aria-label="Chat với trợ lý ảo"
      >
        {isOpen ? <FaTimes size={24} /> : <FaComments size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[999] w-80 h-96 bg-white rounded-2xl shadow-2xl border border-pink-100 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <img src="/vite.svg" alt="Mẹ Xíu Logo" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Mẹ Xíu Assistant</h3>
                  <p className="text-xs text-pink-100">Trực tuyến</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-pink-100 transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-pink-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <img src="/vite.svg" alt="Bot Icon" className="w-4 h-4 text-pink-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      {message.type === 'bot' ? (
                        <p
                          className="text-sm whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />
                      ) : (
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-pink-100' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <FaUser size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                      <img src="/vite.svg" alt="Bot Icon" className="w-4 h-4 text-pink-500" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows="1"
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                  disabled={isSending}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSending}
                className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <IoMdSend size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 