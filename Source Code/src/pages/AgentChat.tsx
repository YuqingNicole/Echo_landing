import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Mic, MicOff, Image, Phone, Upload } from 'lucide-react';
import { useConversation } from '../hooks/useConversation';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface AgentChatProps {
  userInfo: {
    encrypted_yw_id: string;
    display_name?: string;
    photo_url?: string;
  } | null;
}

const AgentChat: React.FC<AgentChatProps> = ({ userInfo }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversationHistory,
    sendMessage,
    resetConversation,
    isLoading
  } = useConversation('agent_chat');

  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    resetTranscript
  } = useSpeechToText();

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // 当语音识别有结果时，更新输入框
  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !uploadedImage) return;

    try {
      let messageContent = inputMessage.trim();
      
      // 如果有上传的图片，添加到消息中
      if (uploadedImage) {
        messageContent += '\n[包含图片]';
      }

      await sendMessage(messageContent, {
        userName: userInfo?.display_name || '用户',
        userType: '社区成员',
        context: '日常对话',
        hasImage: !!uploadedImage
      });

      setInputMessage('');
      setUploadedImage(null);
      resetTranscript();
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      alert('发送消息失败，请重试');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleVoiceCall = () => {
    // 这里可以集成语音通话功能
    alert('语音通话功能即将推出！');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  AI
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Echo AI Assistant</h1>
                  <p className="text-sm text-gray-600">您的专属AI伙伴</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleVoiceCall}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="语音通话"
              >
                <Phone className="h-6 w-6" />
              </button>
              <button
                onClick={resetConversation}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                新对话
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {conversationHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                AI
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                您好{userInfo?.display_name ? `，${userInfo.display_name}` : ''}！
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                我是您的Echo AI助手，可以通过文字、图片和语音与您交流。
                有什么我可以帮助您的吗？
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => {
                    setInputMessage('帮我分析一下我的性格特征');
                    setTimeout(handleSendMessage, 100);
                  }}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900 mb-1">性格分析</div>
                  <div className="text-sm text-gray-600">了解自己的性格特征</div>
                </button>
                <button
                  onClick={() => {
                    setInputMessage('我想找到志同道合的朋友');
                    setTimeout(handleSendMessage, 100);
                  }}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900 mb-1">寻找匹配</div>
                  <div className="text-sm text-gray-600">寻找志同道合的朋友</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {conversationHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs lg:max-w-md ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                      {message.role === 'user' ? (
                        userInfo?.photo_url ? (
                          <img 
                            src={userInfo.photo_url} 
                            alt={userInfo.display_name || 'User'} 
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {userInfo?.display_name?.[0] || 'U'}
                          </div>
                        )
                      ) : (
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          AI
                        </div>
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      AI
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Image Preview */}
          {uploadedImage && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="h-16 w-16 object-cover rounded-lg mr-3"
                  />
                  <span className="text-sm text-gray-600">已选择图片</span>
                </div>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  移除
                </button>
              </div>
            </div>
          )}

          {/* Voice Recognition Status */}
          {isListening && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-sm text-blue-700">正在听取语音输入...</span>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息... (Enter发送，Shift+Enter换行)"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={inputMessage.split('\n').length}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Image Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="上传图片"
              >
                <Image className="h-5 w-5" />
              </button>
              
              {/* Voice Input */}
              <button
                onClick={handleVoiceToggle}
                className={`p-3 rounded-full transition-colors ${
                  isListening 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={isListening ? '停止录音' : '语音输入'}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !uploadedImage) || isLoading}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="发送消息"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default AgentChat;